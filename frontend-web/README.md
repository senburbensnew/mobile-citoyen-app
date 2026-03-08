# 🏛️ Dashboard d'Administration - Gouvernement d'Haïti

> Système de gestion des utilisateurs avec contrôle d'accès hiérarchique et interface bilingue FR/HT

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table des Matières

- [Vue d'ensemble](#-vue-densemble)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Comptes de Démonstration](#-comptes-de-démonstration)
- [Architecture](#-architecture)
- [Système de Permissions](#-système-de-permissions)
- [Guide d'Utilisation](#-guide-dutilisation)
- [Documentation Complète](#-documentation-complète)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## 🎯 Vue d'ensemble

Application web de gestion administrative complète permettant la création et la gestion hiérarchique d'utilisateurs pour l'administration publique haïtienne. Le système implémente un contrôle d'accès basé sur les rôles (RBAC) avec quatre niveaux hiérarchiques et une interface bilingue Français/Créole Haïtien.

### 🎨 Caractéristiques Principales

- ✅ **Interface Bilingue** : Français (FR) / Créole Haïtien (HT) avec changement en temps réel
- ✅ **4 Rôles Hiérarchiques** : ADMIN, RH, GRAND_COMMIS, FONCTIONNAIRE
- ✅ **Gestion des Permissions** : Contrôle d'accès granulaire basé sur les rôles
- ✅ **Audit Trail Complet** : Journal détaillé de toutes les actions
- ✅ **Système de Filtrage** : RH voient uniquement les fonctionnaires qu'ils ont créés
- ✅ **Partage de Credentials** : Copier, imprimer, envoyer par email
- ✅ **Gestion Dynamique** : Ajout/suppression de ministères et départements
- ✅ **Validation Robuste** : Formulaires avec validation complète
- ✅ **Persistance Locale** : Données sauvegardées dans localStorage
- ✅ **Responsive Design** : Interface adaptée mobile/tablette/desktop

---

## ✨ Fonctionnalités

### 👤 Gestion des Utilisateurs

- **Création d'utilisateurs** avec rôles hiérarchiques
- **Édition de profils** avec suivi des modifications
- **Activation/Désactivation** de comptes
- **Suppression** avec confirmation de sécurité
- **Export CSV** des listes d'utilisateurs

### 🔐 Système de Permissions

#### ADMIN (Administrateur Principal)

- ✅ Accès total au système
- ✅ Création de : User, Grand Commis, RH
- ✅ Gestion des ministères et départements
- ✅ Accès au journal d'audit complet
- ✅ Visualisation de tous les utilisateurs

#### RH (Ressources Humaines)

- ✅ Création uniquement de Fonctionnaires
- ✅ Ministère automatiquement assigné aux créations
- ✅ Visualisation **uniquement** des fonctionnaires créés personnellement
- ✅ Gestion (édition, suppression) de leurs fonctionnaires
- ❌ Pas d'accès au journal d'audit
- ❌ Pas d'accès aux paramètres système

#### GRAND_COMMIS

- 📊 Accès en lecture seule
- 📊 Visualisation des données de leur ministère

#### FONCTIONNAIRE

- 📊 Accès limité aux données personnelles
- 📊 Consultation uniquement

### 📊 Dashboard Analytique

- **Statistiques en temps réel** : Total utilisateurs, actifs, inactifs
- **Graphiques** : Répartition par rôle et par ministère
- **Activités récentes** : 5 dernières actions du système
- **Filtrage automatique** : Données filtrées selon le rôle connecté

### 📝 Journal d'Audit

- **Traçabilité complète** de toutes les actions
- **Détails enrichis** : Qui, Quoi, Quand, Cible, Modifications
- **Filtrage** par action, utilisateur, date
- **Export CSV** pour archivage et analyse

### 🌐 Interface Bilingue

- **Français (FR)** : Langue par défaut
- **Créole Haïtien (HT)** : Traduction complète
- **Changement instantané** : Bouton de bascule en temps réel
- **Persistance** : Langue sauvegardée entre les sessions

### 🔧 Paramètres Système (ADMIN uniquement)

- **Gestion des Ministères** : Ajout, suppression, modification
- **Gestion des Départements** : Ajout, suppression, modification
- **Liste dynamique** : Tri automatique alphabétique
- **Audit** : Toutes les modifications enregistrées

---

## 🛠️ Technologies

### Frontend

- **React 18.3** - Bibliothèque UI
- **TypeScript 5.6** - Typage statique
- **Tailwind CSS 4.0** - Framework CSS utility-first
- **Shadcn/ui** - Composants UI réutilisables
- **Lucide React** - Icônes SVG
- **Recharts** - Graphiques et visualisations
- **Sonner** - Toast notifications

### État et Données

- **Context API** - Gestion d'état globale
- **localStorage** - Persistance des données
- **Custom Hooks** - Logic réutilisable (useAuth, useLanguage)

### Outils et Qualité

- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas
- **Date-fns** - Manipulation de dates

---

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm/yarn

### Étapes

1. **Cloner le repository**

```bash
git clone https://github.com/votre-repo/dashboard-admin-haiti.git
cd dashboard-admin-haiti
```

2. **Installer les dépendances**

```bash
npm install
# ou
yarn install
```

3. **Lancer l'application en développement**

```bash
npm run dev
# ou
yarn dev
```

4. **Ouvrir dans le navigateur**

```
http://localhost:5173
```

### Build de Production

```bash
npm run build
# ou
yarn build
```

Les fichiers de production seront générés dans le dossier `dist/`.

---

## 🔑 Comptes de Démonstration

### 👨‍💼 Administrateur Principal

```
Username: admin
Password: Admin2024!
```

**Accès :** Complet - Tous les modules et fonctionnalités

---

### 👥 RH - Ministère de l'Intérieur

```
Username: mdubois
Password: Password123!
```

**Accès :**

- Création de Fonctionnaires pour le Ministère de l'Intérieur
- Visualisation de 10 fonctionnaires créés personnellement
- Gestion (édition, suppression) de ces fonctionnaires

---

### 👥 RH - Ministère de la Santé Publique

```
Username: lgermain
Password: Password123!
```

**Accès :**

- Création de Fonctionnaires pour le Ministère de la Santé Publique
- Visualisation de 2 fonctionnaires créés personnellement
- Gestion (édition, suppression) de ces fonctionnaires

---

## 📁 Architecture

```
├── App.tsx                      # Point d'entrée principal
├── components/                  # Composants React
│   ├── AuditTrail.tsx          # Journal d'audit
│   ├── Dashboard.tsx           # Tableau de bord
│   ├── Login.tsx               # Page de connexion
│   ├── ShareCredentials.tsx    # Dialog de partage
│   ├── SystemSettings.tsx      # Paramètres système
│   ├── UserForm.tsx            # Formulaire de création
│   ├── UsersList.tsx           # Liste des utilisateurs
│   └── ui/                     # Composants UI Shadcn
├── hooks/                       # Custom Hooks
│   ├── useAuth.tsx             # Authentification
│   └── useLanguage.tsx         # Internationalisation
├── types/                       # Définitions TypeScript
│   └── index.ts                # Types principaux
├── utils/                       # Utilitaires
│   ├── mockData.ts             # Données de démonstration
│   ├── permissions.ts          # Logique de permissions
│   ├── storage.ts              # Gestion localStorage
│   ├── translations.ts         # Traductions FR/HT
│   └── validation.ts           # Validation de formulaires
└── styles/                      # Styles globaux
    └── globals.css             # Configuration Tailwind
```

---

## 🔒 Système de Permissions

### Matrice de Permissions

| Fonctionnalité            | ADMIN   | RH                    | GRAND_COMMIS | FONCTIONNAIRE |
| ------------------------- | ------- | --------------------- | ------------ | ------------- |
| **Dashboard complet**     | ✅      | ⚠️ Filtré             | ⚠️ Filtré    | ❌            |
| **Liste utilisateurs**    | ✅ Tous | ⚠️ Ses fonctionnaires | ❌           | ❌            |
| **Créer ADMIN**           | ✅      | ❌                    | ❌           | ❌            |
| **Créer RH**              | ✅      | ❌                    | ❌           | ❌            |
| **Créer GRAND_COMMIS**    | ✅      | ❌                    | ❌           | ❌            |
| **Créer FONCTIONNAIRE**   | ✅      | ✅                    | ❌           | ❌            |
| **Éditer utilisateur**    | ✅ Tous | ⚠️ Ses fonctionnaires | ❌           | ❌            |
| **Supprimer utilisateur** | ✅ Tous | ⚠️ Ses fonctionnaires | ❌           | ❌            |
| **Journal d'audit**       | ✅      | ❌                    | ❌           | ❌            |
| **Paramètres système**    | ✅      | ❌                    | ❌           | ❌            |
| **Export CSV**            | ✅      | ✅ Filtré             | ❌           | ❌            |

### Règles de Filtrage pour RH

Un utilisateur RH voit **uniquement** :

1. ✅ Les **Fonctionnaires** qu'il a **créés personnellement** (`createdBy === RH.id`)
2. ✅ Assignés à **son propre ministère** (auto-assignation)
3. ❌ **Pas son propre profil** (il ne l'a pas créé)
4. ❌ **Pas les autres RH** de son ministère
5. ❌ **Pas les fonctionnaires** créés par d'autres RH

**Exemple :**

- RH `mdubois` du Ministère de l'Intérieur
- Voit 10 fonctionnaires sur 21 utilisateurs totaux
- Tous ces 10 fonctionnaires ont `createdBy: "mdubois"`

---

## 📖 Guide d'Utilisation

### 1️⃣ Connexion

1. Ouvrir l'application
2. Entrer les identifiants (voir [Comptes de Démonstration](#-comptes-de-démonstration))
3. Cliquer sur "Connexion"

### 2️⃣ Créer un Utilisateur (RH)

1. Cliquer sur **"Créer un utilisateur"** dans le menu
2. Remplir le formulaire :
   - **Nom complet** (min 3 caractères)
   - **Username** (min 4 caractères, alphanumérique)
   - **Email** (format valide)
   - **Mot de passe** (min 8 caractères, 1 majuscule, 1 chiffre)
   - **Type** : FONCTIONNAIRE (seul choix pour RH)
   - **Département** : Sélectionner
   - **Ministère** : Automatiquement assigné (lecture seule)
3. Cliquer sur **"Créer"**
4. Dialog de partage des credentials s'affiche

### 3️⃣ Partager les Credentials

Options disponibles dans le dialog :

- **Copier chaque champ** : Clic sur l'icône de copie
- **Tout copier** : Copie le message formaté complet
- **Envoyer par email** : Ouvre le client email avec le message pré-rempli
- **Imprimer** : Génère un document imprimable

### 4️⃣ Gérer les Utilisateurs

#### Activer/Désactiver

1. Aller sur **"Utilisateurs"**
2. Cliquer sur l'icône de statut (✓ ou ✗)
3. Confirmer l'action

#### Éditer

1. Cliquer sur l'icône crayon
2. Modifier les champs autorisés
3. Sauvegarder

#### Supprimer

1. Cliquer sur l'icône poubelle
2. Confirmer la suppression (action irréversible)

### 5️⃣ Exporter les Données

1. Aller sur **"Utilisateurs"**
2. Cliquer sur **"Export CSV"**
3. Le fichier se télécharge automatiquement

### 6️⃣ Changer de Langue

1. Cliquer sur le bouton **🌐** en haut à droite
2. L'interface bascule entre FR et HT instantanément

---

## 📚 Documentation Complète

### Guides Détaillés

- **[GUIDE_UTILISATION.md](GUIDE_UTILISATION.md)** - Guide utilisateur complet avec captures d'écran
- **[TEST_SCENARIOS.md](TEST_SCENARIOS.md)** - 27 scénarios de test détaillés
- **[guidelines/Guidelines.md](guidelines/Guidelines.md)** - Guidelines de développement
- **[Attributions.md](Attributions.md)** - Crédits et remerciements

### Scénarios de Test Disponibles

✅ 27 tests couvrant :

- Connexion et authentification
- Création, édition, suppression d'utilisateurs
- Filtrage des données par rôle
- Permissions et sécurité
- Journal d'audit
- Gestion des ministères et départements
- Changement de langue
- Validation des formulaires
- Responsive design
- Persistance des données

---

## 🎨 Interface Utilisateur

### Pages Principales

#### 🏠 Dashboard

- Vue d'ensemble avec statistiques
- 3 cartes : Total, Actifs, Inactifs
- Graphique en barres : Répartition par rôle
- Graphique en secteurs : Répartition par ministère
- Liste des 5 dernières activités

#### 👥 Liste des Utilisateurs

- Tableau avec colonnes : Nom, Email, Rôle, Ministère, Département, Statut
- Badges colorés pour les rôles et statuts
- Actions : Éditer, Supprimer, Changer statut
- Export CSV
- Filtrage automatique selon les permissions

#### ➕ Créer un Utilisateur

- Formulaire avec validation en temps réel
- Champs conditionnels selon le rôle sélectionné
- Indicateurs de force du mot de passe
- Messages d'aide et d'erreur clairs
- Dialog de partage automatique après création

#### 📋 Journal d'Audit (ADMIN uniquement)

- Tableau chronologique des actions
- Colonnes : Date/Heure, Action, Utilisateur, Cible, Détails
- Filtres : Par action, par utilisateur
- Export CSV

#### ⚙️ Paramètres Système (ADMIN uniquement)

- Gestion des Ministères : Ajout, suppression
- Gestion des Départements : Ajout, suppression
- Listes triées automatiquement
- Confirmations de suppression

---

## 🔧 Configuration

### Variables d'Environnement

Aucune variable d'environnement requise. L'application fonctionne en mode standalone avec localStorage.

### Personnalisation

#### Ajouter une Langue

1. Éditer `/utils/translations.ts`
2. Ajouter les traductions dans l'objet correspondant
3. Mettre à jour le type `Language` dans `/types/index.ts`

#### Modifier les Rôles

1. Éditer le type `UserRole` dans `/types/index.ts`
2. Mettre à jour `/utils/permissions.ts`
3. Ajuster les formulaires et filtres

#### Thème et Couleurs

1. Éditer `/styles/globals.css`
2. Modifier les tokens CSS (--primary, --secondary, etc.)
3. Tailwind applique automatiquement les changements

---

## 🐛 Dépannage

### Problème : Les données ne se sauvent pas

**Solution :** Vérifier que localStorage est activé dans le navigateur

```javascript
// Tester dans la console
localStorage.setItem("test", "test");
console.log(localStorage.getItem("test"));
```

### Problème : Interface non responsive

**Solution :** Vider le cache du navigateur et recharger (Ctrl+Shift+R)

### Problème : Traductions manquantes

**Solution :** Vérifier que la clé existe dans `/utils/translations.ts` pour les deux langues

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le projet
2. **Créer une branche** pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir une Pull Request**

### Standards de Code

- TypeScript strict mode activé
- ESLint et Prettier configurés
- Composants fonctionnels avec hooks
- Naming conventions : camelCase pour variables, PascalCase pour composants
- Commentaires en français pour la logique métier

---

## 📝 Changelog

### Version 1.0.0 (Octobre 2024)

#### Ajouté

- ✅ Système complet de gestion des utilisateurs
- ✅ 4 rôles hiérarchiques avec permissions
- ✅ Interface bilingue FR/HT
- ✅ Journal d'audit complet
- ✅ Filtrage des données selon le rôle
- ✅ RH voient uniquement leurs créations
- ✅ Partage de credentials (copier, email, imprimer)
- ✅ Gestion dynamique des ministères et départements
- ✅ Export CSV
- ✅ Responsive design mobile/tablette/desktop
- ✅ 21 utilisateurs de démonstration
- ✅ Documentation complète (README, Guide, Tests)

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Auteurs

**Équipe de Développement**

- Développement Frontend : React + TypeScript + Tailwind
- Design UI/UX : Shadcn/ui components
- Internationalisation : Français / Créole Haïtien

---

## 🙏 Remerciements

- [React](https://reactjs.org/) - Bibliothèque UI
- [Shadcn/ui](https://ui.shadcn.com/) - Composants UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide](https://lucide.dev/) - Icônes
- [Recharts](https://recharts.org/) - Graphiques
- Communauté open-source pour les outils et bibliothèques

---

## 📞 Support

Pour toute question ou problème :

- 📧 Email : support@example.ht
- 📚 Documentation : [GUIDE_UTILISATION.md](GUIDE_UTILISATION.md)
- 🐛 Issues : [GitHub Issues](https://github.com/votre-repo/dashboard-admin-haiti/issues)

---

<div align="center">

**Fait avec ❤️ pour l'Administration Publique Haïtienne**

⭐ N'oubliez pas de star le projet si vous l'aimez !

</div>
