import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../hooks/useLanguage';
import { Users, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { UserRole } from '../types';
import api from '../lib/api';

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

export const Dashboard = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    byRole: { ADMIN: 0, RH: 0, GRAND_COMMIS: 0, FONCTIONNAIRE: 0 } as Record<string, number>,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/User');
        const list: any[] = Array.isArray(data) ? data : [];
        const byRole: Record<string, number> = { ADMIN: 0, RH: 0, GRAND_COMMIS: 0, FONCTIONNAIRE: 0 };
        list.forEach((u) => {
          const role = normalizeRole(u.roles?.[0] ?? '');
          if (role in byRole) byRole[role]++;
        });
        setStats({ total: list.length, byRole });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      ADMIN: 'bg-red-100 text-red-800 border-red-300',
      RH: 'bg-blue-100 text-blue-800 border-blue-300',
      GRAND_COMMIS: 'bg-purple-100 text-purple-800 border-purple-300',
      FONCTIONNAIRE: 'bg-green-100 text-green-800 border-green-300',
      LAMBDA: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[role];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">{t('dashboard')}</h2>
        <p className="text-muted-foreground">Vue d'ensemble du système d'administration</p>
      </div>

      {/* Total Users */}
      <div className="max-w-sm">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t('totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">Tous les utilisateurs du système</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par rôle</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
