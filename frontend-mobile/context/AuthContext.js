import { createContext, useState, useEffect } from "react";
import { saveToken, getToken, removeToken } from "../lib/storage";
import api from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [ministereId, setMinistereId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await getToken();
      if (token) {
        try {
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
      console.log(parseJwt(data.token));
      setUser(parseJwt(data.token).unique_name);
      setRole(parseJwt(data.token).role);
      setMinistereId(parseJwt(data.token).MinistereId);
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
    setRole(null);
    setMinistereId(null);
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
        role,
        ministereId,
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
