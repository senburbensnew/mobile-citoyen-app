import { ReactNode, useEffect, useState } from "react";
import { User } from "../types";
import {
  authenticate,
  getCurrentUser,
  getToken,
  initializeStorage,
  logout as logoutStorage,
  setCurrentUser as persistCurrentUser,
  setToken as persistToken,
} from "../utils/storage";
import { AuthContext } from "./useAuth";

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

    persistCurrentUser(result.user);
    persistToken(result.token);
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
