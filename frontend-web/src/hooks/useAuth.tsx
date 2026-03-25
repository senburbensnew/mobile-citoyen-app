import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";
import {
  authenticate,
  getCurrentUser,
  getToken,
  initializeStorage,
  logout as logoutStorage,
} from "../utils/storage";

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    initializeStorage();

    const user = getCurrentUser();

    const storedToken = getToken();

    if (user && storedToken) {
      setCurrentUser(user);
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    const result = await authenticate(username, password);

    if (!result) return false;

    setCurrentUser(result.user);
    setToken(result.token);
    setIsAuthenticated(true);

    return true;
  };

  const logout = () => {
    logoutStorage();

    setCurrentUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
