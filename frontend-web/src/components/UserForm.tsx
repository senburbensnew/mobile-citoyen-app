import { RefreshCw, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";
import { AuditLog, User, UserRole } from "../types";
import { getRolesForUser } from "../utils/permissions";
import {
  addAuditLog,
  addUser,
  getUserByEmail,
  getUserByUsername,
  updateUser,
} from "../utils/storage";
import {
  generateSecurePassword,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/validation";
import { ShareCredentials } from "./ShareCredentials";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface UserFormProps {
  editingUser?: User | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm = ({
  editingUser,
  onSuccess,
  onCancel,
}: UserFormProps) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState<{
    prenom: string;
    nom: string;
    username: string;
    email: string;
    sexe: "M" | "F";
    nif: string;
    ninu: string;
    phoneNumber: string;
    role: UserRole;
    ministerId: string;
    sectionId: string;
    password: string;
  }>({
    prenom: "",
    nom: "",
    username: "",
    email: "",
    sexe: "M",
    nif: "",
    ninu: "",
    phoneNumber: "",
    role: "FONCTIONNAIRE",
    ministerId: "",
    sectionId: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
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
        prenom: editingUser.prenom,
        nom: editingUser.nom,
        username: editingUser.username,
        email: editingUser.email,
        sexe: editingUser.sexe,
        nif: editingUser.nif,
        ninu: editingUser.ninu,
        phoneNumber: editingUser.phoneNumber,
        role: editingUser.role,
        ministerId: editingUser.ministerId || "",
        sectionId: editingUser.sectionId || "",
        password: "",
      });
    }
  }, [editingUser]);

  const availableRoles = getRolesForUser(currentUser?.role || "LAMBDA");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.prenom?.trim()) {
      newErrors.prenom = "Prénom requis";
    }

    if (!formData.nom?.trim()) {
      newErrors.nom = "Nom requis";
    }

    if (!formData.nif?.trim()) {
      newErrors.nif = "NIF requis";
    }

    if (!formData.ninu?.trim()) {
      newErrors.ninu = "NINU requis";
    }

    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Téléphone requis";
    }

    if (!formData.username?.trim()) {
      newErrors.username = "Nom d'utilisateur requis";
    } else if (!validateUsername(formData.username)) {
      newErrors.username = t("invalidUsername");
    } else if (!editingUser) {
      // Check uniqueness only for new users
      const existingUser = getUserByUsername(formData.username);
      if (existingUser) {
        newErrors.username = t("usernameTaken");
      }
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("invalidEmail");
    } else if (!editingUser || formData.email !== editingUser.email) {
      const existingEmail = getUserByEmail(formData.email);
      if (existingEmail) {
        newErrors.email = t("emailTaken");
      }
    }

    if (!editingUser) {
      // Password required for new users
      if (!formData.password) {
        newErrors.password = "Mot de passe requis";
      } else if (!validatePassword(formData.password)) {
        newErrors.password = t("invalidPassword");
      } else if (formData.password !== confirmPassword) {
        newErrors.confirmPassword = t("passwordMismatch");
      }
    } else if (formData.password) {
      // If updating password
      if (!validatePassword(formData.password)) {
        newErrors.password = t("invalidPassword");
      } else if (formData.password !== confirmPassword) {
        newErrors.confirmPassword = t("passwordMismatch");
      }
    }

    if (!formData.ministerId) {
      newErrors.ministerId = "Minister ID requis";
    }

    if (!formData.sectionId) {
      newErrors.sectionId = "Section ID requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !currentUser) return;

    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      if (editingUser) {
        // Update existing user
        const updates: Partial<User> = {
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          sexe: formData.sexe as "M" | "F",
          nif: formData.nif,
          ninu: formData.ninu,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          ministerId: formData.ministerId,
          sectionId: formData.sectionId,
          updatedBy: currentUser.username,
        };

        if (formData.password) {
          updates.password = formData.password;
        }

        const oldData = { ...editingUser };

        if (!editingUser.id) {
          throw new Error("User ID is missing");
        }
        const updatedUser = updateUser(editingUser.id, updates);

        if (updatedUser) {
          // Create audit log
          const changes: Record<string, { old: any; new: any }> = {};

          if (
            oldData.prenom !== updatedUser.prenom ||
            oldData.nom !== updatedUser.nom
          ) {
            changes.fullName = {
              old: `${oldData.prenom} ${oldData.nom}`,
              new: `${updatedUser.prenom} ${updatedUser.nom}`,
            };
          }
          if (oldData.email !== updatedUser.email) {
            changes.email = { old: oldData.email, new: updatedUser.email };
          }
          if (oldData.role !== updatedUser.role) {
            changes.role = { old: oldData.role, new: updatedUser.role };
          }
          if (oldData.ministerId !== updatedUser.ministerId) {
            changes.ministerId = {
              old: oldData.ministerId,
              new: updatedUser.ministerId,
            };
          }

          if (oldData.sectionId !== updatedUser.sectionId) {
            changes.sectionId = {
              old: oldData.sectionId,
              new: updatedUser.sectionId,
            };
          }

          if (!updatedUser.id) {
            throw new Error("User ID is missing");
          }

          const auditLog: AuditLog = {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: formData.password ? "RESET_PASSWORD" : "UPDATE",
            performedBy: currentUser.username,
            performedByRole: currentUser.role,
            targetUser: updatedUser.prenom + " " + updatedUser.nom,
            targetUserId: updatedUser.id,
            details: `Modification des informations de l'utilisateur`,
            changes: Object.keys(changes).length > 0 ? changes : undefined,
            ipAddress: "192.168.1.1",
          };

          addAuditLog(auditLog);
          toast.success(t("userUpdated"));
          onSuccess?.();
        }
      } else {
        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          prenom: formData.prenom,
          nom: formData.nom,
          username: formData.username,
          email: formData.email,
          sexe: formData.sexe as "M" | "F",
          nif: formData.nif,
          ninu: formData.ninu,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          ministerId: formData.ministerId,
          sectionId: formData.sectionId,
          password: formData.password,
          createdAt: new Date().toISOString(),
          createdBy: currentUser.username,
        };

        addUser(newUser);

        if (!newUser.id) {
          throw new Error("User ID is missing");
        }

        // Create audit log
        const auditLog: AuditLog = {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "CREATE",
          performedBy: currentUser.username,
          performedByRole: currentUser.role,
          targetUser: newUser.prenom + " " + newUser.nom,
          targetUserId: newUser.id,
          details: `Création d'un nouveau ${t(newUser.role)}`,
          ipAddress: "192.168.1.1",
        };

        addAuditLog(auditLog);
        toast.success(t("userCreated"));

        // Reset form
        setFormData({
          prenom: "",
          nom: "",
          username: "",
          email: "",
          sexe: "M",
          nif: "",
          ninu: "",
          phoneNumber: "",
          role: "FONCTIONNAIRE",
          ministerId: "",
          sectionId: "",
          password: "",
        });
        setConfirmPassword("");
        onSuccess?.();

        if (!newUser.password) {
          throw new Error("Password is missing");
        }

        // Share credentials
        setShareCredentials({
          username: newUser.username,
          password: newUser.password,
          fullName: newUser.prenom + " " + newUser.nom,
          email: newUser.email,
        });
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const password = generateSecurePassword();
    setFormData({ ...formData, password });
    setConfirmPassword(password);
    toast.success("Mot de passe généré avec succès");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingUser ? `${t("edit")} ${t("users")}` : t("createUser")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* FirstName */}
            <div className="space-y-2">
              <Label htmlFor="prenom">
                {t("firstName")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
              />
              {errors.prenom && (
                <p className="text-sm text-red-500">{errors.prenom}</p>
              )}
            </div>

            {/* LastName */}
            <div className="space-y-2">
              <Label htmlFor="nom">
                {t("lastName")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
              />
              {errors.nom && (
                <p className="text-sm text-red-500">{errors.nom}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">
                {t("username")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
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
                {t("email")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                {t("userType")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData({ ...formData, role: value as UserRole })
                }
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

            {/* Sex */}
            <div className="space-y-2">
              <Label htmlFor="sexe">
                {t("select_sex")} <span className="text-red-500">*</span>
              </Label>

              <Select
                value={formData.sexe}
                onValueChange={(value: "M" | "F") =>
                  setFormData({ ...formData, sexe: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("select_sex")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="M">{t("male")}</SelectItem>
                  <SelectItem value="F">{t("female")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                {t("password")}{" "}
                {!editingUser && <span className="text-red-500">*</span>}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={
                    editingUser
                      ? "Laisser vide pour ne pas modifier"
                      : "********"
                  }
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleGeneratePassword}
                  disabled={isLoading}
                  title={t("generatePassword")}
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
                {t("confirmPassword")}{" "}
                {!editingUser && <span className="text-red-500">*</span>}
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

            <div className="space-y-2">
              <Label htmlFor="nif">
                NIF <span className="text-red-500">*</span>
              </Label>

              <Input
                id="nif"
                value={formData.nif}
                onChange={(e) =>
                  setFormData({ ...formData, nif: e.target.value })
                }
                placeholder="001-234-567-8"
              />

              {errors.nif && (
                <p className="text-sm text-red-500">{errors.nif}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ninu">
                NINU <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ninu"
                value={formData.ninu}
                onChange={(e) =>
                  setFormData({ ...formData, ninu: e.target.value })
                }
                placeholder="10 chiffres"
              />
              {errors.ninu && (
                <p className="text-sm text-red-500">{errors.ninu}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Téléphone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="34567890"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ministerId">
                Ministère <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ministerId"
                value={formData.ministerId}
                onChange={(e) =>
                  setFormData({ ...formData, ministerId: e.target.value })
                }
                placeholder="4 chiffres"
              />
              {errors.ministerId && (
                <p className="text-sm text-red-500">{errors.ministerId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sectionId">
                Section <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sectionId"
                value={formData.sectionId}
                onChange={(e) =>
                  setFormData({ ...formData, sectionId: e.target.value })
                }
                placeholder="7 chiffres"
              />
              {errors.sectionId && (
                <p className="text-sm text-red-500">{errors.sectionId}</p>
              )}
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
                {t("cancel")}
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading
                ? t("loading")
                : editingUser
                  ? t("update")
                  : t("create")}
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
