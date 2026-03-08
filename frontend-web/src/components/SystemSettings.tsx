import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { getMinisteres, addMinistere, deleteMinistere, getDepartements, addDepartement, deleteDepartement, addAuditLog } from '../utils/storage';
import { AuditLog } from '../types';
import { toast } from 'sonner@2.0.3';
import { Plus, Trash2, Building2, MapPin } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

export const SystemSettings = () => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  
  const [ministeres, setMinisteres] = useState<string[]>([]);
  const [departements, setDepartements] = useState<string[]>([]);
  
  const [newMinistere, setNewMinistere] = useState('');
  const [newDepartement, setNewDepartement] = useState('');
  
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'ministere' | 'departement';
    item: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMinisteres(getMinisteres());
    setDepartements(getDepartements());
  };

  const handleAddMinistere = () => {
    if (!newMinistere.trim()) {
      toast.error(language === 'fr' ? 'Veuillez saisir un nom de ministère' : 'Tanpri antre non ministè a');
      return;
    }

    const success = addMinistere(newMinistere.trim());
    if (success) {
      toast.success(language === 'fr' ? 'Ministère ajouté avec succès' : 'Ministè ajoute avèk siksè');
      
      // Create audit log
      if (currentUser) {
        const auditLog: AuditLog = {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'CREATE',
          performedBy: currentUser.username,
          performedByRole: currentUser.role,
          targetUser: 'SYSTEM',
          targetUserId: 'system',
          details: `Ajout du ministère: ${newMinistere.trim()}`,
          ipAddress: '192.168.1.1',
        };
        addAuditLog(auditLog);
      }
      
      setNewMinistere('');
      loadData();
    } else {
      toast.error(language === 'fr' ? 'Ce ministère existe déjà' : 'Ministè sa deja egziste');
    }
  };

  const handleDeleteMinistere = (ministere: string) => {
    setDeleteConfirm({ type: 'ministere', item: ministere });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'ministere') {
      const success = deleteMinistere(deleteConfirm.item);
      if (success) {
        toast.success(language === 'fr' ? 'Ministère supprimé' : 'Ministè efase');
        
        // Create audit log
        if (currentUser) {
          const auditLog: AuditLog = {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'DELETE',
            performedBy: currentUser.username,
            performedByRole: currentUser.role,
            targetUser: 'SYSTEM',
            targetUserId: 'system',
            details: `Suppression du ministère: ${deleteConfirm.item}`,
            ipAddress: '192.168.1.1',
          };
          addAuditLog(auditLog);
        }
        
        loadData();
      }
    } else {
      const success = deleteDepartement(deleteConfirm.item);
      if (success) {
        toast.success(language === 'fr' ? 'Département supprimé' : 'Depatman efase');
        
        // Create audit log
        if (currentUser) {
          const auditLog: AuditLog = {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'DELETE',
            performedBy: currentUser.username,
            performedByRole: currentUser.role,
            targetUser: 'SYSTEM',
            targetUserId: 'system',
            details: `Suppression du département: ${deleteConfirm.item}`,
            ipAddress: '192.168.1.1',
          };
          addAuditLog(auditLog);
        }
        
        loadData();
      }
    }

    setDeleteConfirm(null);
  };

  const handleAddDepartement = () => {
    if (!newDepartement.trim()) {
      toast.error(language === 'fr' ? 'Veuillez saisir un nom de département' : 'Tanpri antre non depatman an');
      return;
    }

    const success = addDepartement(newDepartement.trim());
    if (success) {
      toast.success(language === 'fr' ? 'Département ajouté avec succès' : 'Depatman ajoute avèk siksè');
      
      // Create audit log
      if (currentUser) {
        const auditLog: AuditLog = {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'CREATE',
          performedBy: currentUser.username,
          performedByRole: currentUser.role,
          targetUser: 'SYSTEM',
          targetUserId: 'system',
          details: `Ajout du département: ${newDepartement.trim()}`,
          ipAddress: '192.168.1.1',
        };
        addAuditLog(auditLog);
      }
      
      setNewDepartement('');
      loadData();
    } else {
      toast.error(language === 'fr' ? 'Ce département existe déjà' : 'Depatman sa deja egziste');
    }
  };

  const handleDeleteDepartement = (departement: string) => {
    setDeleteConfirm({ type: 'departement', item: departement });
  };

  return (
    <div className="space-y-6">
      {/* Ministères */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>
                {language === 'fr' ? 'Gestion des Ministères' : 'Jesyon Ministè yo'}
              </CardTitle>
              <CardDescription>
                {language === 'fr' 
                  ? 'Ajouter ou supprimer des ministères du système'
                  : 'Ajoute oswa efase ministè nan sistèm nan'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Form */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder={language === 'fr' ? "Nom du ministère (ex: Ministère de la Culture)" : "Non ministè a (ex: Ministè Kilti)"}
                value={newMinistere}
                onChange={(e) => setNewMinistere(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddMinistere()}
              />
            </div>
            <Button onClick={handleAddMinistere}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'Ajouter' : 'Ajoute'}
            </Button>
          </div>

          {/* List */}
          <div className="space-y-2">
            <Label>
              {language === 'fr' ? 'Ministères enregistrés' : 'Ministè anrejistre'} ({ministeres.length})
            </Label>
            <div className="grid gap-2 max-h-96 overflow-y-auto border rounded-lg p-3">
              {ministeres.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {language === 'fr' ? 'Aucun ministère enregistré' : 'Pa gen ministè anrejistre'}
                </p>
              ) : (
                ministeres.map((min, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{min}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMinistere(min)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Départements */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>
                {language === 'fr' ? 'Gestion des Départements' : 'Jesyon Depatman yo'}
              </CardTitle>
              <CardDescription>
                {language === 'fr' 
                  ? 'Ajouter ou supprimer des départements géographiques'
                  : 'Ajoute oswa efase depatman jewografik yo'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Form */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder={language === 'fr' ? "Nom du département (ex: Nippes)" : "Non depatman an (ex: Nip)"}
                value={newDepartement}
                onChange={(e) => setNewDepartement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddDepartement()}
              />
            </div>
            <Button onClick={handleAddDepartement}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'Ajouter' : 'Ajoute'}
            </Button>
          </div>

          {/* List */}
          <div className="space-y-2">
            <Label>
              {language === 'fr' ? 'Départements enregistrés' : 'Depatman anrejistre'} ({departements.length})
            </Label>
            <div className="grid gap-2 max-h-96 overflow-y-auto border rounded-lg p-3">
              {departements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {language === 'fr' ? 'Aucun département enregistré' : 'Pa gen depatman anrejistre'}
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {departements.map((dep, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{dep}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDepartement(dep)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'fr' ? 'Confirmer la suppression' : 'Konfime sipresyon an'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'fr'
                ? `Êtes-vous sûr de vouloir supprimer "${deleteConfirm?.item}" ? Cette action est irréversible.`
                : `Èske w sèten w vle efase "${deleteConfirm?.item}" ? Aksyon sa a pa ka defèt.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'fr' ? 'Annuler' : 'Anile'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {language === 'fr' ? 'Supprimer' : 'Efase'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
