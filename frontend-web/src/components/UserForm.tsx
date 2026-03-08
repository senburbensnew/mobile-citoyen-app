import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { User, UserRole, UserStatus, AuditLog } from '../types';
import { addUser, updateUser, getUserByUsername, getUserByEmail, addAuditLog, getMinisteres, getDepartements } from '../utils/storage';
import { validateUsername, validateEmail, validatePassword, generateSecurePassword } from '../utils/validation';
import { getRolesForUser } from '../utils/permissions';
import { toast } from 'sonner@2.0.3';
import { Save, X, RefreshCw, Upload } from 'lucide-react';
import { Badge } from './ui/badge';
import { ShareCredentials } from './ShareCredentials';

interface UserFormProps {
  editingUser?: User | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm = ({ editingUser, onSuccess, onCancel }: UserFormProps) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState<Partial<User>>({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'FONCTIONNAIRE',
    ministere: '',
    departement: '',
    status: 'ACTIVE',
    avatar: '',
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [shareCredentials, setShareCredentials] = useState<{
    username: string;
    password: string;
    fullName: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        fullName: editingUser.fullName,
        username: editingUser.username,
        email: editingUser.email,
        password: '', // Don't pre-fill password
        role: editingUser.role,
        ministere: editingUser.ministere || '',
        departement: editingUser.departement || '',
        status: editingUser.status,
        avatar: editingUser.avatar || '',
      });
    }
  }, [editingUser]);

  const availableRoles = getRolesForUser(currentUser?.role || 'LAMBDA');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Nom complet requis';
    }

    if (!formData.username?.trim()) {
      newErrors.username = 'Nom d\'utilisateur requis';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = t('invalidUsername');
    } else if (!editingUser) {
      // Check uniqueness only for new users
      const existingUser = getUserByUsername(formData.username);
      if (existingUser) {
        newErrors.username = t('usernameTaken');
      }
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('invalidEmail');
    } else if (!editingUser || formData.email !== editingUser.email) {
      const existingEmail = getUserByEmail(formData.email);
      if (existingEmail) {
        newErrors.email = t('emailTaken');
      }
    }

    if (!editingUser) {
      // Password required for new users
      if (!formData.password) {
        newErrors.password = 'Mot de passe requis';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = t('invalidPassword');
      } else if (formData.password !== confirmPassword) {
        newErrors.confirmPassword = t('passwordMismatch');
      }
    } else if (formData.password) {
      // If updating password
      if (!validatePassword(formData.password)) {
        newErrors.password = t('invalidPassword');
      } else if (formData.password !== confirmPassword) {
        newErrors.confirmPassword = t('passwordMismatch');
      }
    }

    if (formData.role === 'GRAND_COMMIS' && !formData.ministere) {
      newErrors.ministere = t('ministereRequired');
    }

    if (formData.role === 'RH' && !formData.ministere) {
      newErrors.ministere = 'Le ministère est obligatoire pour un RH';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !currentUser) return;

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (editingUser) {
        // Update existing user
        const updates: Partial<User> = {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          ministere: formData.ministere,
          departement: formData.departement,
          status: formData.status,
          avatar: formData.avatar,
          updatedBy: currentUser.username,
        };

        if (formData.password) {
          updates.password = formData.password;
        }

        const oldData = { ...editingUser };
        const updatedUser = updateUser(editingUser.id, updates);

        if (updatedUser) {
          // Create audit log
          const changes: Record<string, { old: any; new: any }> = {};
          
          if (oldData.fullName !== updatedUser.fullName) {
            changes.fullName = { old: oldData.fullName, new: updatedUser.fullName };
          }
          if (oldData.email !== updatedUser.email) {
            changes.email = { old: oldData.email, new: updatedUser.email };
          }
          if (oldData.role !== updatedUser.role) {
            changes.role = { old: oldData.role, new: updatedUser.role };
          }
          if (oldData.status !== updatedUser.status) {
            changes.status = { old: oldData.status, new: updatedUser.status };
          }
          if (oldData.ministere !== updatedUser.ministere) {
            changes.ministere = { old: oldData.ministere, new: updatedUser.ministere };
          }
          if (oldData.departement !== updatedUser.departement) {
            changes.departement = { old: oldData.departement, new: updatedUser.departement };
          }

          const auditLog: AuditLog = {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: formData.password ? 'RESET_PASSWORD' : 'UPDATE',
            performedBy: currentUser.username,
            performedByRole: currentUser.role,
            targetUser: updatedUser.fullName,
            targetUserId: updatedUser.id,
            details: `Modification des informations de l'utilisateur`,
            changes: Object.keys(changes).length > 0 ? changes : undefined,
            ipAddress: '192.168.1.1',
          };

          addAuditLog(auditLog);
          toast.success(t('userUpdated'));
          onSuccess?.();
        }
      } else {
        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          fullName: formData.fullName!,
          username: formData.username!,
          email: formData.email!,
          password: formData.password!,
          role: formData.role as UserRole,
          // Auto-assign ministere si RH crée un fonctionnaire
          ministere: formData.role === 'FONCTIONNAIRE' && currentUser.role === 'RH' 
            ? currentUser.ministere 
            : formData.ministere,
          departement: formData.departement,
          status: formData.status as UserStatus,
          avatar: formData.avatar,
          createdAt: new Date().toISOString(),
          createdBy: currentUser.username,
        };

        addUser(newUser);

        // Create audit log
        const auditLog: AuditLog = {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'CREATE',
          performedBy: currentUser.username,
          performedByRole: currentUser.role,
          targetUser: newUser.fullName,
          targetUserId: newUser.id,
          details: `Création d'un nouveau ${t(newUser.role)}`,
          ipAddress: '192.168.1.1',
        };

        addAuditLog(auditLog);
        toast.success(t('userCreated'));
        
        // Reset form
        setFormData({
          fullName: '',
          username: '',
          email: '',
          password: '',
          role: 'FONCTIONNAIRE',
          ministere: '',
          departement: '',
          status: 'ACTIVE',
          avatar: '',
        });
        setConfirmPassword('');
        onSuccess?.();

        // Share credentials
        setShareCredentials({
          username: newUser.username,
          password: newUser.password,
          fullName: newUser.fullName,
          email: newUser.email,
        });
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const password = generateSecurePassword();
    setFormData({ ...formData, password });
    setConfirmPassword(password);
    toast.success('Mot de passe généré avec succès');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingUser ? `${t('edit')} ${t('users')}` : t('createUser')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                {t('fullName')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ex: Jean Pierre Dupont"
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">
                {t('username')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Ex: jdupont"
                disabled={isLoading || !!editingUser}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                {t('email')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ex: jean.dupont@gov.ht"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                {t('userType')} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {t(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                {t('password')} {!editingUser && <span className="text-red-500">*</span>}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? 'Laisser vide pour ne pas modifier' : '********'}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleGeneratePassword}
                  disabled={isLoading}
                  title={t('generatePassword')}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t('confirmPassword')} {!editingUser && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Ministere */}
            {(formData.role === 'GRAND_COMMIS' || formData.role === 'RH') && (
              <div className="space-y-2">
                <Label htmlFor="ministere">
                  {t('ministere')} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.ministere}
                  onValueChange={(value) => setFormData({ ...formData, ministere: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un ministère" />
                  </SelectTrigger>
                  <SelectContent>
                    {getMinisteres().map((min) => (
                      <SelectItem key={min} value={min}>
                        {min}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ministere && (
                  <p className="text-sm text-red-500">{errors.ministere}</p>
                )}
              </div>
            )}

            {/* Ministere auto-assigné pour Fonctionnaire si créé par RH */}
            {formData.role === 'FONCTIONNAIRE' && currentUser?.role === 'RH' && currentUser.ministere && (
              <div className="space-y-2">
                <Label htmlFor="ministere-readonly">
                  {t('ministere')}
                </Label>
                <Input
                  id="ministere-readonly"
                  value={currentUser.ministere}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Le fonctionnaire sera assigné à votre ministère: {currentUser.ministere}
                </p>
              </div>
            )}

            {/* Departement */}
            <div className="space-y-2">
              <Label htmlFor="departement">
                {t('departement')} ({t('optional')})
              </Label>
              <Select
                value={formData.departement}
                onValueChange={(value) => setFormData({ ...formData, departement: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {getDepartements().map((dep) => (
                    <SelectItem key={dep} value={dep}>
                      {dep}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">{t('status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">{t('ACTIVE')}</SelectItem>
                  <SelectItem value="INACTIVE">{t('INACTIVE')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                {t('cancel')}
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? t('loading') : editingUser ? t('update') : t('create')}
            </Button>
          </div>
        </form>
      </CardContent>

      {/* Share Credentials Dialog */}
      {shareCredentials && (
        <ShareCredentials
          isOpen={!!shareCredentials}
          onClose={() => setShareCredentials(null)}
          username={shareCredentials.username}
          password={shareCredentials.password}
          fullName={shareCredentials.fullName}
          email={shareCredentials.email}
        />
      )}
    </Card>
  );
};