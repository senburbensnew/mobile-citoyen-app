export type UserRole =
  | "ADMIN"
  | "RH"
  | "GRAND_COMMIS"
  | "FONCTIONNAIRE"
  | "LAMBDA";
export type UserStatus = "ACTIVE" | "INACTIVE";
export type Language = "fr" | "ht";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DEACTIVATE"
  | "ACTIVATE"
  | "ASSIGN"
  | "DELETE"
  | "RESET_PASSWORD";

export interface User {
  id?: string;
  username: string;
  email: string;
  prenom: string;
  nom: string;
  sexe: "M" | "F";
  roles: UserRole[];
  role?: UserRole;
  status?: UserStatus;
  fullName?: string;
  nif?: string;
  ninu?: string;
  phoneNumber?: string;
  password?: string;
  ministereId?: string;
  ministerId?: string;
  sectionId?: string;
  ministere?: string;
  departement?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: AuditAction;
  performedBy: string;
  performedByRole: UserRole;
  targetUser: string;
  targetUserId: string;
  details: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress?: string;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

export interface Translations {
  fr: Record<string, string>;
  ht: Record<string, string>;
}
