export type UserRole = 'ADMIN' | 'RH' | 'GRAND_COMMIS' | 'FONCTIONNAIRE';
export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type Language = 'fr' | 'ht';

export type AuditAction = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DEACTIVATE' 
  | 'ACTIVATE' 
  | 'ASSIGN' 
  | 'DELETE'
  | 'RESET_PASSWORD';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  ministere?: string;
  departement?: string;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  createdBy: string;
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