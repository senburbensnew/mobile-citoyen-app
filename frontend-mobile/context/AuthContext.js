import { createContext, useState, useEffect } from "react";
import { saveToken, getToken, removeToken } from "../lib/storage";
import api from "../lib/api";
import { store } from "../store";
import { clearSelectedMinistry } from "../store/selectedMinistrySlice";
import { setInitialDataLoaded } from "../store/initialDataLoaded";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState(null);
  const [ministereId, setMinistereId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [nom, setNom] = useState(null);
  const [prenom, setPrenom] = useState(null);
  const [email, setEmail] = useState(null);
  const [sexe, setSexe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Used on app restart: parse fields from stored JWT claims
  const applyPayload = (payload) => {
    const r = payload.role;
    setRoles(Array.isArray(r) ? r : r ? [r] : []);
    setMinistereId(payload.MinistereId ?? null);
    setSectionId(payload.SectionId ?? null);
    setPrenom(payload.given_name ?? null);
    setNom(payload.family_name ?? null);
    setEmail(payload.email ?? null);
    setSexe(payload.gender ?? null);
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = await getToken();
      if (token) {
        try {
          const payload = parseJwt(token);
          applyPayload(payload);
          const { data } = await api.get("/auth/me");
          setUser(data);
        } catch (err) {
          await removeToken();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await api.post("/Auth/login", { username, password });

      if (!data || !data.token) {
        throw new Error("Réponse invalide du serveur");
      }
      await saveToken(data.token);
      setUser(data.username);
      setRoles(data.roles ?? []);
      setPrenom(data.prenom ?? null);
      setNom(data.nom ?? null);
      setEmail(data.email ?? null);
      setSexe(data.sexe ?? null);
      setMinistereId(data.ministereId ?? null);
      setSectionId(data.sectionId ?? null);
      return true;
    } catch (err) {
      if (err.response) {
        throw new Error(
          err.response.data?.message || "Email ou mot de passe incorrect"
        );
      } else if (err.request) {
        throw new Error(
          "Impossible de joindre le serveur. Vérifiez votre connexion."
        );
      } else {
        throw new Error("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
    setRoles([]);
    setMinistereId(null);
    setSectionId(null);
    setNom(null);
    setPrenom(null);
    setEmail(null);
    setSexe(null);
    store.dispatch(clearSelectedMinistry());
    store.dispatch(setInitialDataLoaded(false));
  };

  const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        role: roles[0] ?? null,
        ministereId,
        sectionId,
        nom,
        prenom,
        email,
        sexe,
        loading,
        login,
        logout,
        parseJwt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
