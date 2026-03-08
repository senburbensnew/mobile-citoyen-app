import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { User, UserRole, UserStatus, AuditLog } from '../types';
import { getUsers, deleteUser, updateUser, addAuditLog } from '../utils/storage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { canEditUser, canDeleteUser, filterUsersByPermissions } from '../utils/permissions';
import { Search, Edit, Trash2, UserCheck, UserX, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { UserForm } from './UserForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

export const UsersList = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const loadUsers = () => {
    const allUsers = getUsers();
    // Filtrer les utilisateurs selon les permissions
    const visibleUsers = filterUsersByPermissions(allUsers, currentUser);
    setUsers(visibleUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.fullName.toLowerCase().includes(term) ||
          u.username.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    }

    // Role filter
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      ADMIN: 'bg-red-100 text-red-800 border-red-300',
      RH: 'bg-blue-100 text-blue-800 border-blue-300',
      GRAND_COMMIS: 'bg-purple-100 text-purple-800 border-purple-300',
      FONCTIONNAIRE: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[role];
  };

  const handleEdit = (user: User) => {
    if (!currentUser || !canEditUser(currentUser.role, user.role)) {
      toast.error(t('unauthorized'));
      return;
    }
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    if (!currentUser || !canDeleteUser(currentUser.role, user.role)) {
      toast.error(t('unauthorized'));
      return;
    }
    setDeletingUser(user);
  };

  const confirmDelete = async () => {
    if (!deletingUser || !currentUser) return;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = deleteUser(deletingUser.id);
    
    if (success) {
      const auditLog: AuditLog = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'DELETE',
        performedBy: currentUser.username,
        performedByRole: currentUser.role,
        targetUser: deletingUser.fullName,
        targetUserId: deletingUser.id,
        details: `Suppression de l'utilisateur`,
        ipAddress: '192.168.1.1',
      };

      addAuditLog(auditLog);
      toast.success(t('userDeleted'));
      loadUsers();
    }

    setDeletingUser(null);
  };

  const handleToggleStatus = async (user: User) => {
    if (!currentUser || !canEditUser(currentUser.role, user.role)) {
      toast.error(t('unauthorized'));
      return;
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newStatus: UserStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = updateUser(user.id, { status: newStatus, updatedBy: currentUser.username });

    if (updated) {
      const auditLog: AuditLog = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: newStatus === 'ACTIVE' ? 'ACTIVATE' : 'DEACTIVATE',
        performedBy: currentUser.username,
        performedByRole: currentUser.role,
        targetUser: user.fullName,
        targetUserId: user.id,
        details: `${newStatus === 'ACTIVE' ? 'Activation' : 'Désactivation'} du compte utilisateur`,
        changes: {
          status: { old: user.status, new: newStatus },
        },
        ipAddress: '192.168.1.1',
      };

      addAuditLog(auditLog);
      toast.success(newStatus === 'ACTIVE' ? t('userActivated') : t('userDeactivated'));
      loadUsers();
    }
  };

  const handleExportCSV = () => {
    const headers = ['Nom complet', 'Username', 'Email', 'Rôle', 'Ministère', 'Département', 'Statut', 'Date création'];
    const rows = filteredUsers.map(u => [
      u.fullName,
      u.username,
      u.email,
      t(u.role),
      u.ministere || '-',
      u.departement || '-',
      t(u.status),
      new Date(u.createdAt).toLocaleDateString('fr-FR'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Export CSV réussi');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">{t('users')}</h2>
        <p className="text-muted-foreground">Gestion des utilisateurs du système</p>
        
        {/* RH Info Message */}
        {currentUser?.role === 'RH' && currentUser.ministere && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Mode RH:</strong> Vous visualisez et gérez uniquement les fonctionnaires que vous avez créés pour le ministère: <strong>{currentUser.ministere}</strong>
            </p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Liste des utilisateurs ({filteredUsers.length})</CardTitle>
            <div className="flex gap-2">
              <Button onClick={loadUsers} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button onClick={handleExportCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('export')} CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`${t('search')}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('allRoles')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('allRoles')}</SelectItem>
                <SelectItem value="ADMIN">{t('ADMIN')}</SelectItem>
                <SelectItem value="RH">{t('RH')}</SelectItem>
                <SelectItem value="GRAND_COMMIS">{t('GRAND_COMMIS')}</SelectItem>
                <SelectItem value="FONCTIONNAIRE">{t('FONCTIONNAIRE')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('allStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('allStatus')}</SelectItem>
                <SelectItem value="ACTIVE">{t('ACTIVE')}</SelectItem>
                <SelectItem value="INACTIVE">{t('INACTIVE')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>{t('role')}</TableHead>
                  <TableHead>{t('ministere')}</TableHead>
                  <TableHead>{t('departement')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      {t('noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell className="font-mono text-sm">{user.username}</TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {t(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.ministere || '-'}</TableCell>
                      <TableCell className="text-sm">{user.departement || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {t(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user)}
                            disabled={!currentUser || !canEditUser(currentUser.role, user.role)}
                            title={user.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                          >
                            {user.status === 'ACTIVE' ? (
                              <UserX className="h-4 w-4 text-orange-600" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(user)}
                            disabled={!currentUser || !canEditUser(currentUser.role, user.role)}
                            title={t('edit')}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user)}
                            disabled={!currentUser || !canDeleteUser(currentUser.role, user.role)}
                            title={t('delete')}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          <UserForm
            editingUser={editingUser}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              setEditingUser(null);
              loadUsers();
            }}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingUser(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{deletingUser?.fullName}</strong> ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};