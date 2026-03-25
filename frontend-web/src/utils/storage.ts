import api from "../lib/api";
import { AuditLog, User } from "../types";
import { DEPARTEMENTS, MINISTERES, mockAuditLogs, mockUsers } from "./mockData";

const STORAGE_KEYS = {
  USERS: "admin_dashboard_users",
  AUDIT_LOGS: "admin_dashboard_audit_logs",
  CURRENT_USER: "admin_dashboard_current_user",
  TOKEN: "admin_dashboard_token",
  MINISTERES: "admin_dashboard_ministeres",
  DEPARTEMENTS: "admin_dashboard_departements",
};

// Initialize storage with mock data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(
      STORAGE_KEYS.AUDIT_LOGS,
      JSON.stringify(mockAuditLogs),
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.MINISTERES)) {
    localStorage.setItem(STORAGE_KEYS.MINISTERES, JSON.stringify(MINISTERES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEPARTEMENTS)) {
    localStorage.setItem(
      STORAGE_KEYS.DEPARTEMENTS,
      JSON.stringify(DEPARTEMENTS),
    );
  }
};

// Users
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const updateUser = (
  userId: string,
  updates: Partial<User>,
): User | null => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index !== -1) {
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveUsers(users);
    return users[index];
  }
  return null;
};

export const deleteUser = (userId: string): boolean => {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== userId);
  if (filtered.length !== users.length) {
    saveUsers(filtered);
    return true;
  }
  return false;
};

export const getUserById = (userId: string): User | null => {
  const users = getUsers();
  return users.find((u) => u.id === userId) || null;
};

export const getUserByUsername = (username: string): User | null => {
  const users = getUsers();
  return users.find((u) => u.username === username) || null;
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find((u) => u.email === email) || null;
};

// Audit Logs
export const getAuditLogs = (): AuditLog[] => {
  const logs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
  return logs ? JSON.parse(logs) : [];
};

export const saveAuditLogs = (logs: AuditLog[]): void => {
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
};

export const addAuditLog = (log: AuditLog): void => {
  const logs = getAuditLogs();
  logs.unshift(log); // Add to beginning for chronological order
  saveAuditLogs(logs);
};

// Current User (Session)
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Authentication
export const authenticate = async (
  username: string,
  password: string,
): Promise<{ user: User; token: string } | null> => {
  try {
    const { data } = await api.post("/auth/login", {
      username,
      password,
    });

    console.log(data);
    if (data) {
      const user: User = {
        username: data.username,
        email: data.email,
        prenom: data.prenom,
        nom: data.nom,
        sexe: data.sexe,
        roles: Array.isArray(data.roles) ? data.roles : [data.roles],
        ministereId: data.ministereId,
        sectionId: data.sectionId,
      };
      return { token: data.token, user };
    }

    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

export const extractUserInfosFromJwtToken = () => {};

export const logout = (): void => {
  clearCurrentUser();
  clearToken();
};

export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const setToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

export const clearToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// Ministeres
export const getMinisteres = (): string[] => {
  const ministeres = localStorage.getItem(STORAGE_KEYS.MINISTERES);
  return ministeres ? JSON.parse(ministeres) : MINISTERES;
};

export const saveMinisteres = (ministeres: string[]): void => {
  localStorage.setItem(STORAGE_KEYS.MINISTERES, JSON.stringify(ministeres));
};

export const addMinistere = (ministere: string): boolean => {
  const ministeres = getMinisteres();
  if (ministeres.includes(ministere)) {
    return false; // Already exists
  }
  ministeres.push(ministere);
  ministeres.sort();
  saveMinisteres(ministeres);
  return true;
};

export const deleteMinistere = (ministere: string): boolean => {
  const ministeres = getMinisteres();
  const filtered = ministeres.filter((m) => m !== ministere);
  if (filtered.length !== ministeres.length) {
    saveMinisteres(filtered);
    return true;
  }
  return false;
};

// Departements
export const getDepartements = (): string[] => {
  const departements = localStorage.getItem(STORAGE_KEYS.DEPARTEMENTS);
  return departements ? JSON.parse(departements) : DEPARTEMENTS;
};

export const saveDepartements = (departements: string[]): void => {
  localStorage.setItem(STORAGE_KEYS.DEPARTEMENTS, JSON.stringify(departements));
};

export const addDepartement = (departement: string): boolean => {
  const departements = getDepartements();
  if (departements.includes(departement)) {
    return false; // Already exists
  }
  departements.push(departement);
  departements.sort();
  saveDepartements(departements);
  return true;
};

export const deleteDepartement = (departement: string): boolean => {
  const departements = getDepartements();
  const filtered = departements.filter((d) => d !== departement);
  if (filtered.length !== departements.length) {
    saveDepartements(filtered);
    return true;
  }
  return false;
};
