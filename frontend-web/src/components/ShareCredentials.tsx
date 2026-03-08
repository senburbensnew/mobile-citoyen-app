import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Copy, Mail, Printer, CheckCheck } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../hooks/useLanguage';

interface ShareCredentialsProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  password: string;
  fullName: string;
  email: string;
}

export const ShareCredentials: React.FC<ShareCredentialsProps> = ({
  isOpen,
  onClose,
  username,
  password,
  fullName,
  email,
}) => {
  const { t, language } = useLanguage();
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(language === 'fr' ? 'Copié dans le presse-papier' : 'Kopye nan clipboard');
    
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleCopyAll = () => {
    const credentials = `Informations de connexion:\n\nNom complet: ${fullName}\nUsername: ${username}\nMot de passe: ${password}\nEmail: ${email}`;
    navigator.clipboard.writeText(credentials);
    toast.success(language === 'fr' ? 'Toutes les informations copiées' : 'Tout enfòmasyon kopye');
  };

  const handleEmailShare = () => {
    const subject = language === 'fr' 
      ? 'Vos informations de connexion' 
      : 'Enfòmasyon koneksyon ou';
    
    const body = language === 'fr'
      ? `Bonjour ${fullName},\n\nVoici vos informations de connexion pour le système:\n\nUsername: ${username}\nMot de passe: ${password}\n\nVeuillez changer votre mot de passe lors de votre première connexion.\n\nCordialement`
      : `Bonjou ${fullName},\n\nMen enfòmasyon koneksyon ou pou sistèm nan:\n\nUsername: ${username}\nMot de passe: ${password}\n\nTanpri chanje modpas ou lè w konekte premye fwa.\n\nRespè`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    toast.success(language === 'fr' ? 'Client email ouvert' : 'Kliyan email louvri');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${language === 'fr' ? 'Informations de connexion' : 'Enfòmasyon koneksyon'}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                max-width: 600px;
                margin: 0 auto;
              }
              h1 {
                color: #333;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
              }
              .info-group {
                margin: 20px 0;
                padding: 15px;
                background: #f5f5f5;
                border-radius: 5px;
              }
              .label {
                font-weight: bold;
                color: #666;
                display: block;
                margin-bottom: 5px;
              }
              .value {
                font-size: 18px;
                color: #000;
                font-family: monospace;
              }
              .warning {
                margin-top: 30px;
                padding: 15px;
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                color: #856404;
              }
              @media print {
                body { padding: 20px; }
              }
            </style>
          </head>
          <body>
            <h1>${language === 'fr' ? 'Informations de connexion' : 'Enfòmasyon koneksyon'}</h1>
            
            <div class="info-group">
              <span class="label">${language === 'fr' ? 'Nom complet' : 'Non konplè'}:</span>
              <span class="value">${fullName}</span>
            </div>
            
            <div class="info-group">
              <span class="label">Username:</span>
              <span class="value">${username}</span>
            </div>
            
            <div class="info-group">
              <span class="label">${language === 'fr' ? 'Mot de passe' : 'Modpas'}:</span>
              <span class="value">${password}</span>
            </div>
            
            <div class="info-group">
              <span class="label">Email:</span>
              <span class="value">${email}</span>
            </div>
            
            <div class="warning">
              <strong>${language === 'fr' ? '⚠️ Important' : '⚠️ Enpòtan'}:</strong><br/>
              ${language === 'fr' 
                ? 'Veuillez changer votre mot de passe lors de votre première connexion pour des raisons de sécurité.' 
                : 'Tanpri chanje modpas ou lè w konekte premye fwa pou sekirite.'}
            </div>
            
            <p style="margin-top: 40px; color: #999; font-size: 12px;">
              ${language === 'fr' ? 'Date d\'impression' : 'Dat enpresyon'}: ${new Date().toLocaleString('fr-FR')}
            </p>
          </body>
        </html>
      `;
      
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
      }, 250);
      
      toast.success(language === 'fr' ? 'Prêt pour l\'impression' : 'Pare pou enprime');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {language === 'fr' ? '✅ Utilisateur créé avec succès' : '✅ Itilizatè kreye avèk siksè'}
          </DialogTitle>
          <DialogDescription>
            {language === 'fr' 
              ? 'Partagez ces informations de connexion avec l\'utilisateur de manière sécurisée.'
              : 'Pataje enfòmasyon koneksyon sa yo ak itilizatè a nan yon fason sekirize.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label>{language === 'fr' ? 'Nom complet' : 'Non konplè'}</Label>
            <div className="flex gap-2">
              <Input value={fullName} readOnly className="bg-muted font-medium" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(fullName, 'fullName')}
                title={language === 'fr' ? 'Copier' : 'Kopye'}
              >
                {copiedField === 'fullName' ? (
                  <CheckCheck className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label>Username</Label>
            <div className="flex gap-2">
              <Input value={username} readOnly className="bg-muted font-mono" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(username, 'username')}
                title={language === 'fr' ? 'Copier' : 'Kopye'}
              >
                {copiedField === 'username' ? (
                  <CheckCheck className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>{language === 'fr' ? 'Mot de passe' : 'Modpas'}</Label>
            <div className="flex gap-2">
              <Input value={password} readOnly className="bg-muted font-mono" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(password, 'password')}
                title={language === 'fr' ? 'Copier' : 'Kopye'}
              >
                {copiedField === 'password' ? (
                  <CheckCheck className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="flex gap-2">
              <Input value={email} readOnly className="bg-muted" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(email, 'email')}
                title={language === 'fr' ? 'Copier' : 'Kopye'}
              >
                {copiedField === 'email' ? (
                  <CheckCheck className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-amber-800">
              <strong>⚠️ {language === 'fr' ? 'Important' : 'Enpòtan'}:</strong>{' '}
              {language === 'fr'
                ? 'Ces informations doivent être partagées de manière sécurisée. Demandez à l\'utilisateur de changer son mot de passe lors de sa première connexion.'
                : 'Enfòmasyon sa yo dwe pataje nan yon fason sekirize. Mande itilizatè a pou l chanje modpas li lè l konekte premye fwa.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCopyAll}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Tout copier' : 'Kopye tout'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleEmailShare}
            className="flex-1"
          >
            <Mail className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Envoyer par email' : 'Voye pa email'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex-1"
          >
            <Printer className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Imprimer' : 'Enprime'}
          </Button>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={onClose}>
            {language === 'fr' ? 'Fermer' : 'Fèmen'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
