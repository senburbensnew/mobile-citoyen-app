import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { User, UserRole, AuditLog } from '../types';
import { deleteUser, addAuditLog } from '../utils/storage';
import api from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { canEditUser, canDeleteUser } from '../utils/permissions';
import { Search, Edit, Trash2, Download, RefreshCw, UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserForm } from './UserForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const normalizeRole = (role: string): UserRole => {
  const map: Record<string, UserRole> = {
    admin: 'ADMIN',
    rh: 'RH',
    grandcommis: 'GRAND_COMMIS',
    grand_commis: 'GRAND_COMMIS',
    fonctionnaire: 'FONCTIONNAIRE',
  };
  return map[role.toLowerCase()] ?? (role.toUpperCase() as UserRole);
};

const mapApiUser = (u: any): User => {
  const roles: UserRole[] = (u.roles ?? []).map(normalizeRole);
  return {
    id: u.id,
    username: u.userName ?? u.username ?? '',
    email: u.email,
    prenom: u.prenom,
    nom: u.nom,
    sexe: u.sexe,
    roles,
    role: roles[0],
    fullName: `${u.prenom} ${u.nom}`,
    ministereId: u.ministereId,
    sectionId: u.sectionId,
    phoneNumber: u.phoneNumber,
  };
};

export const UsersList = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const primaryRole = (currentUser?.roles?.[0]?.toUpperCase() ?? 'LAMBDA') as UserRole;

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/User');
      const list = Array.isArray(data) ? data : [];
      const mapped: User[] = list.map(mapApiUser);
      setUsers(mapped);
    } catch {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(term) ||
          u.username?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term),
      );
    }

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const getRoleBadgeColor = (role?: UserRole) => {
    const colors: Partial<Record<UserRole, string>> = {
      ADMIN: 'bg-red-100 text-red-800 border-red-300',
      RH: 'bg-blue-100 text-blue-800 border-blue-300',
      GRAND_COMMIS: 'bg-purple-100 text-purple-800 border-purple-300',
      FONCTIONNAIRE: 'bg-green-100 text-green-800 border-green-300',
    };
    return role ? (colors[role] ?? '') : '';
  };

  const handleEdit = (user: User) => {
    if (!currentUser || !canEditUser(primaryRole, user.role!)) {
      toast.error(t('unauthorized'));
      return;
    }
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    if (!currentUser || !canDeleteUser(primaryRole, user.role!)) {
      toast.error(t('unauthorized'));
      return;
    }
    setDeletingUser(user);
  };

  const confirmDelete = async () => {
    if (!deletingUser || !currentUser) return;

    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = deleteUser(deletingUser.id!);

    if (success) {
      const auditLog: AuditLog = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'DELETE',
        performedBy: currentUser.username,
        performedByRole: primaryRole,
        targetUser: deletingUser.fullName!,
        targetUserId: deletingUser.id!,
        details: `Suppression de l'utilisateur`,
        ipAddress: '192.168.1.1',
      };

      addAuditLog(auditLog);
      toast.success(t('userDeleted'));
      loadUsers();
    }

    setDeletingUser(null);
  };

  const handleExportCSV = () => {
    const headers = ['Nom complet', 'Email', 'Rôle', 'Ministère ID', 'Section ID', 'Téléphone'];
    const rows = filteredUsers.map((u) => [
      u.fullName ?? '',
      u.email,
      u.role ? t(u.role) : '',
      u.ministereId ?? '-',
      u.sectionId ?? '-',
      u.phoneNumber ?? '-',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
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

        {primaryRole === 'RH' && currentUser?.ministereId && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Mode RH:</strong> Vous visualisez les RH et Fonctionnaires de votre ministère (ID: <strong>{currentUser.ministereId}</strong>)
            </p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Liste des utilisateurs ({filteredUsers.length})</CardTitle>
            <div className="flex gap-2">
              <Button onClick={loadUsers} variant="outline" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Actualiser
              </Button>
              <Button onClick={handleExportCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('export')} CSV
              </Button>
              {(primaryRole === 'ADMIN' || primaryRole === 'RH') && (
                <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('createUser')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-2">
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
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>{t('role')}</TableHead>
                  <TableHead>{t('ministere')}</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {t('noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelf = user.id === currentUser?.id;
                    return (
                    <TableRow key={user.id} className={isSelf ? 'bg-blue-50' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {user.fullName}
                          {isSelf && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">Vous</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role ? t(user.role) : '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.ministereId ?? '-'}</TableCell>
                      <TableCell className="text-sm">{user.sectionId ?? '-'}</TableCell>
                      <TableCell className="text-sm">{user.phoneNumber ?? '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(user)}
                            disabled={isSelf || !canEditUser(primaryRole, user.role!)}
                            title={isSelf ? 'Impossible de modifier votre propre compte' : t('edit')}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user)}
                            disabled={isSelf || !canDeleteUser(primaryRole, user.role!)}
                            title={isSelf ? 'Impossible de supprimer votre propre compte' : t('delete')}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('createUser')}</DialogTitle>
          </DialogHeader>
          <UserForm
            onSuccess={() => {
              setIsCreateDialogOpen(false);
              loadUsers();
            }}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

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
