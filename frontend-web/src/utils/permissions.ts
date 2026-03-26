import { UserRole, User } from '../types';

export const canCreateRole = (currentUserRole: UserRole, targetRole: UserRole): boolean => {
  if (currentUserRole === 'ADMIN') {
    return targetRole === 'RH';
  }

  if (currentUserRole === 'RH') {
    return targetRole === 'GRAND_COMMIS' || targetRole === 'FONCTIONNAIRE';
  }

  return false;
};

export const getRolesForUser = (currentUserRole: UserRole): UserRole[] => {
  if (currentUserRole === 'ADMIN') {
    return ['RH'];
  }

  if (currentUserRole === 'RH') {
    return ['GRAND_COMMIS', 'FONCTIONNAIRE'];
  }

  return [];
};

export const canEditUser = (currentUserRole: UserRole, targetUserRole: UserRole): boolean => {
  if (currentUserRole === 'ADMIN') {
    return true;
  }
  
  if (currentUserRole === 'RH') {
    return targetUserRole === 'FONCTIONNAIRE';
  }
  
  return false;
};

export const canDeleteUser = (currentUserRole: UserRole, targetUserRole: UserRole): boolean => {
  return canEditUser(currentUserRole, targetUserRole);
};

export const canViewAuditTrail = (currentUserRole: UserRole): boolean => {
  return currentUserRole === 'ADMIN';
};

/**
 * Filtre les utilisateurs selon les permissions de l'utilisateur connecté
 * - ADMIN: voit tous les utilisateurs
 * - RH: voit uniquement les fonctionnaires qu'il a créés (createdBy === RH.id)
 * - Autres: voient uniquement eux-mêmes
 */
export const filterUsersByPermissions = (users: User[], currentUser: User | null): User[] => {
  if (!currentUser) return [];
  
  // ADMIN voit tout
  if (currentUser.role === 'ADMIN') {
    return users;
  }
  
  // RH voit uniquement les fonctionnaires qu'il a créés
  if (currentUser.role === 'RH') {
    return users.filter(user => 
      user.role === 'FONCTIONNAIRE' && user.createdBy === currentUser.id
    );
  }
  
  // Les autres rôles ne voient que leur propre profil
  return users.filter(user => user.id === currentUser.id);
};