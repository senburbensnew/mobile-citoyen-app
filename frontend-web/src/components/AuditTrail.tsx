import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { AuditLog, AuditAction } from '../types';
import { getAuditLogs } from '../utils/storage';
import { canViewAuditTrail } from '../utils/permissions';
import { Search, FileText, Download } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

export const AuditTrail = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    if (currentUser && canViewAuditTrail(currentUser.role)) {
      const allLogs = getAuditLogs();
      setLogs(allLogs);
    }
  }, [currentUser]);

  useEffect(() => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.performedBy.toLowerCase().includes(term) ||
          log.targetUser.toLowerCase().includes(term) ||
          log.details.toLowerCase().includes(term)
      );
    }

    // Action filter
    if (actionFilter !== 'ALL') {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, actionFilter]);

  const getActionBadgeColor = (action: AuditAction) => {
    const colors: Record<AuditAction, string> = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      DEACTIVATE: 'bg-orange-100 text-orange-800',
      ACTIVATE: 'bg-emerald-100 text-emerald-800',
      ASSIGN: 'bg-purple-100 text-purple-800',
      RESET_PASSWORD: 'bg-yellow-100 text-yellow-800',
    };
    return colors[action];
  };

  const handleExportCSV = () => {
    const headers = ['Date/Heure', 'Action', 'Effectué par', 'Rôle', 'Utilisateur cible', 'Détails'];
    const rows = filteredLogs.map(log => [
      new Date(log.timestamp).toLocaleString('fr-FR'),
      t(log.action),
      log.performedBy,
      t(log.performedByRole),
      log.targetUser,
      log.details,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit_trail_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Export CSV réussi');
  };

  if (!currentUser || !canViewAuditTrail(currentUser.role)) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl tracking-tight">{t('auditTrail')}</h2>
          <p className="text-muted-foreground">Journal d'audit des actions système</p>
        </div>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              {t('unauthorized')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl tracking-tight">{t('auditTrail')}</h2>
        <p className="text-muted-foreground">Journal d'audit des actions système</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Historique des actions ({filteredLogs.length})</CardTitle>
            <Button onClick={handleExportCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t('export')} CSV
            </Button>
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
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Toutes les actions</SelectItem>
                <SelectItem value="CREATE">{t('CREATE')}</SelectItem>
                <SelectItem value="UPDATE">{t('UPDATE')}</SelectItem>
                <SelectItem value="DELETE">{t('DELETE')}</SelectItem>
                <SelectItem value="ACTIVATE">{t('ACTIVATE')}</SelectItem>
                <SelectItem value="DEACTIVATE">{t('DEACTIVATE')}</SelectItem>
                <SelectItem value="ASSIGN">{t('ASSIGN')}</SelectItem>
                <SelectItem value="RESET_PASSWORD">{t('RESET_PASSWORD')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('action')}</TableHead>
                  <TableHead>{t('performedBy')}</TableHead>
                  <TableHead>{t('role')}</TableHead>
                  <TableHead>Utilisateur cible</TableHead>
                  <TableHead>{t('details')}</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      {t('noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('fr-FR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(log.action)}>
                          {t(log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.performedBy}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{t(log.performedByRole)}</Badge>
                      </TableCell>
                      <TableCell>{log.targetUser}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm">
                        {log.details}
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {log.ipAddress || '-'}
                      </TableCell>
                      <TableCell>
                        {log.changes && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                            title="Voir les détails"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'action</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date et heure</p>
                    <p className="text-sm">
                      {new Date(selectedLog.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Action</p>
                    <Badge className={getActionBadgeColor(selectedLog.action)}>
                      {t(selectedLog.action)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Effectué par</p>
                    <p className="text-sm">{selectedLog.performedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                    <Badge variant="outline">{t(selectedLog.performedByRole)}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Utilisateur cible</p>
                    <p className="text-sm">{selectedLog.targetUser}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Adresse IP</p>
                    <p className="text-sm font-mono">{selectedLog.ipAddress || '-'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-sm bg-muted p-3 rounded">{selectedLog.details}</p>
                </div>

                {selectedLog.changes && Object.keys(selectedLog.changes).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Modifications apportées
                    </p>
                    <div className="space-y-2">
                      {Object.entries(selectedLog.changes).map(([field, change]) => (
                        <div
                          key={field}
                          className="p-3 rounded border bg-card space-y-1"
                        >
                          <p className="text-sm font-medium capitalize">{field}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-red-50 p-2 rounded">
                              <span className="text-xs text-muted-foreground">Ancien:</span>
                              <p className="mt-1">{String(change.old) || '-'}</p>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                              <span className="text-xs text-muted-foreground">Nouveau:</span>
                              <p className="mt-1">{String(change.new) || '-'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};