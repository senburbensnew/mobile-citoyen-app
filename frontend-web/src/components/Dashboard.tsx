import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { getUsers, getAuditLogs } from '../utils/storage';
import { filterUsersByPermissions } from '../utils/permissions';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { UserRole } from '../types';

export const Dashboard = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const allUsers = getUsers();
  const auditLogs = getAuditLogs();

  // Filtrer les utilisateurs selon les permissions
  const users = filterUsersByPermissions(allUsers, currentUser);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'ACTIVE').length,
    inactive: users.filter(u => u.status === 'INACTIVE').length,
    byRole: {
      ADMIN: users.filter(u => u.role === 'ADMIN').length,
      RH: users.filter(u => u.role === 'RH').length,
      GRAND_COMMIS: users.filter(u => u.role === 'GRAND_COMMIS').length,
      FONCTIONNAIRE: users.filter(u => u.role === 'FONCTIONNAIRE').length,
    },
  };

  const recentLogs = auditLogs.slice(0, 10);

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      ADMIN: 'bg-red-100 text-red-800 border-red-300',
      RH: 'bg-blue-100 text-blue-800 border-blue-300',
      GRAND_COMMIS: 'bg-purple-100 text-purple-800 border-purple-300',
      FONCTIONNAIRE: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[role];
  };

  const getActionBadgeColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      DEACTIVATE: 'bg-orange-100 text-orange-800',
      ACTIVATE: 'bg-emerald-100 text-emerald-800',
      ASSIGN: 'bg-purple-100 text-purple-800',
      RESET_PASSWORD: 'bg-yellow-100 text-yellow-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">{t('dashboard')}</h2>
        <p className="text-muted-foreground">Vue d'ensemble du système d'administration</p>
        
        {/* RH Info Message */}
        {currentUser?.role === 'RH' && currentUser.ministere && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Mode RH:</strong> Vous visualisez uniquement les fonctionnaires que vous avez créés pour le ministère: <strong>{currentUser.ministere}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t('totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tous les utilisateurs du système
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t('activeUsers')}</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.active / stats.total) * 100).toFixed(0)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t('inactiveUsers')}</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.inactive / stats.total) * 100).toFixed(0)}% du total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par rôle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.byRole).map(([role, count]) => (
              <div key={role} className="flex items-center gap-2">
                <Badge className={getRoleBadgeColor(role as UserRole)}>
                  {t(role)}
                </Badge>
                <span className="text-sm text-muted-foreground">({count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Activity className="h-5 w-5" />
          <CardTitle>{t('recentActivities')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {recentLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t('noData')}
                </p>
              ) : (
                recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Badge className={getActionBadgeColor(log.action)}>
                      {t(log.action)}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{log.performedBy}</span>
                        {' - '}
                        <span className="text-muted-foreground">{log.details}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Utilisateur cible: {log.targetUser}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};