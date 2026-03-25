import { Translations } from "../types";

export const translations: Translations = {
  fr: {
    // Menu & Navigation
    dashboard: "Tableau de bord",
    users: "Utilisateurs",
    createUser: "Créer un utilisateur",
    auditTrail: "Journal d'audit",
    settings: "Paramètres système",
    logout: "Déconnexion",

    // Dashboard Stats
    totalUsers: "Total utilisateurs",
    activeUsers: "Utilisateurs actifs",
    inactiveUsers: "Utilisateurs inactifs",
    recentActivities: "Activités récentes",

    // Roles
    ADMIN: "Administrateur",
    RH: "Ressources Humaines",
    GRAND_COMMIS: "Grand Commis",
    FONCTIONNAIRE: "Fonctionnaire",

    // User Form
    firstName: "Prénom",
    lastName: "Nom",
    male: "Masculin",
    female: "Féminin",
    select_sex: "Sexe",
    username: "Nom d'utilisateur",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    userType: "Type d'utilisateur",
    ministere: "Ministère",
    departement: "Département",
    status: "Statut",
    avatar: "Photo de profil",
    ACTIVE: "Actif",
    INACTIVE: "Inactif",

    // Actions
    create: "Créer",
    update: "Modifier",
    delete: "Supprimer",
    cancel: "Annuler",
    save: "Enregistrer",
    edit: "Éditer",
    view: "Voir",
    search: "Rechercher",
    filter: "Filtrer",
    export: "Exporter",
    reset: "Réinitialiser",
    generatePassword: "Générer un mot de passe",

    // Audit Actions
    CREATE: "Création",
    UPDATE: "Modification",
    DEACTIVATE: "Désactivation",
    ACTIVATE: "Activation",
    ASSIGN: "Assignation",
    DELETE: "Suppression",
    RESET_PASSWORD: "Réinitialisation mot de passe",

    // Messages
    userCreated: "Utilisateur créé avec succès",
    userUpdated: "Utilisateur mis à jour avec succès",
    userDeleted: "Utilisateur supprimé avec succès",
    userActivated: "Utilisateur activé avec succès",
    userDeactivated: "Utilisateur désactivé avec succès",
    passwordReset: "Mot de passe réinitialisé avec succès",

    // Errors
    invalidEmail: "Format email invalide",
    invalidUsername:
      "Nom d'utilisateur invalide (min 4 caractères, alphanumérique)",
    invalidPassword:
      "Mot de passe invalide (min 8 caractères, 1 majuscule, 1 chiffre)",
    passwordMismatch: "Les mots de passe ne correspondent pas",
    usernameTaken: "Ce nom d'utilisateur est déjà utilisé",
    emailTaken: "Cet email est déjà utilisé",
    ministereRequired: "Le ministère est obligatoire pour un Grand Commis",
    unauthorized: "Vous n'avez pas l'autorisation pour cette action",

    // Login
    login: "Connexion",
    loginTitle: "Connexion au Dashboard",
    loginSubtitle: "Entrez vos identifiants pour accéder",

    // Filters
    allRoles: "Tous les rôles",
    allStatus: "Tous les statuts",

    // Table Headers
    name: "Nom",
    role: "Rôle",
    actions: "Actions",
    date: "Date",
    action: "Action",
    performedBy: "Effectué par",
    details: "Détails",

    // Misc
    optional: "Optionnel",
    required: "Obligatoire",
    noData: "Aucune donnée disponible",
    loading: "Chargement...",
    confirm: "Confirmer",
    areYouSure: "Êtes-vous sûr ?",
  },
  ht: {
    // Menu & Navigation
    dashboard: "Tablo bò",
    users: "Itilizatè",
    createUser: "Kreye itilizatè",
    auditTrail: "Jounal aktivite",
    settings: "Paramèt sistèm",
    logout: "Dekonekte",

    // Dashboard Stats
    totalUsers: "Total itilizatè",
    activeUsers: "Itilizatè aktif",
    inactiveUsers: "Itilizatè inaktif",
    recentActivities: "Aktivite resan",

    // Roles
    ADMIN: "Administratè",
    RH: "Resous Imen",
    GRAND_COMMIS: "Gran Komi",
    FONCTIONNAIRE: "Fonksyonè",

    // User Form
    firstName: "Prenon",
    lastName: "Non",
    male: "Maskilen",
    female: "Feminen",
    select_sex: "Seks",
    username: "Non itilizatè",
    email: "Imel",
    password: "Modpas",
    confirmPassword: "Konfime modpas",
    userType: "Tip itilizatè",
    ministere: "Ministè",
    departement: "Depatman",
    status: "Estati",
    avatar: "Foto profil",
    ACTIVE: "Aktif",
    INACTIVE: "Inaktif",

    // Actions
    create: "Kreye",
    update: "Modifye",
    delete: "Efase",
    cancel: "Anile",
    save: "Anrejistre",
    edit: "Edite",
    view: "Gade",
    search: "Chèche",
    filter: "Filtre",
    export: "Ekspòte",
    reset: "Reyajiste",
    generatePassword: "Jenere modpas",

    // Audit Actions
    CREATE: "Kreyasyon",
    UPDATE: "Modifikasyon",
    DEACTIVATE: "Dezaktivасyon",
    ACTIVATE: "Aktivasyon",
    ASSIGN: "Asiyasyon",
    DELETE: "Efase",
    RESET_PASSWORD: "Reyajisteman modpas",

    // Messages
    userCreated: "Itilizatè kreye avèk siksè",
    userUpdated: "Itilizatè mizajou avèk siksè",
    userDeleted: "Itilizatè efase avèk siksè",
    userActivated: "Itilizatè aktive avèk siksè",
    userDeactivated: "Itilizatè dezaktive avèk siksè",
    passwordReset: "Modpas reyajiste avèk siksè",

    // Errors
    invalidEmail: "Fòma imel envalid",
    invalidUsername: "Non itilizatè envalid (min 4 karaktè, alfanimerik)",
    invalidPassword: "Modpas envalid (min 8 karaktè, 1 majiskil, 1 chif)",
    passwordMismatch: "Modpas yo pa koresponn",
    usernameTaken: "Non itilizatè sa a deja itilize",
    emailTaken: "Imel sa a deja itilize",
    ministereRequired: "Ministè obligatwa pou Gran Komi",
    unauthorized: "Ou pa gen otorizasyon pou aksyon sa a",

    // Login
    login: "Koneksyon",
    loginTitle: "Koneksyon nan Tablo bò",
    loginSubtitle: "Antre idantifyan w yo pou aksede",

    // Filters
    allRoles: "Tout wòl",
    allStatus: "Tout estati",

    // Table Headers
    name: "Non",
    role: "Wòl",
    actions: "Aksyon",
    date: "Dat",
    action: "Aksyon",
    performedBy: "Fèt pa",
    details: "Detay",

    // Misc
    optional: "Opsyonèl",
    required: "Obligatwa",
    noData: "Pa gen done disponib",
    loading: "Chajman...",
    confirm: "Konfime",
    areYouSure: "Èske w sèten?",
  },
};

export const getTranslation = (key: string, lang: "fr" | "ht"): string => {
  return translations[lang][key] || key;
};
