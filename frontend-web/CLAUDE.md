# CLAUDE.md — frontend-web

## Project Overview

Admin dashboard for Haitian government user management ("Créer Dashboard d'Administration"). Allows administrators to create and manage government employees across ministries, with role-based access control and bilingual support (French / Haitian Creole).

## Dev Commands

```bash
npm run dev      # Start dev server at http://localhost:3000 (auto-opens browser)
npm run build    # Production build → build/ directory
```

No test suite is configured.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3, TypeScript |
| Build tool | Vite 6 + SWC |
| Styling | Tailwind CSS v4 |
| Component library | Shadcn/UI (Radix UI primitives) |
| Icons | Lucide React |
| Charts | Recharts |
| HTTP client | Axios (pointing at `http://budget.gouv.ht:5000/api`) |
| Forms | React Hook Form |
| Toasts | Sonner |
| Themes | next-themes |

Path alias: `@` maps to `./src`

## Architecture

### Routing
No React Router. Navigation is a `useState<Page>` in [App.tsx](src/App.tsx). Pages: `"dashboard" | "users" | "create-user" | "audit-trail" | "settings"`.

### State Management
Context API only — no Redux or Zustand.
- `AuthProvider` / `useAuth` — current user, token, login/logout ([src/hooks/useAuth.tsx](src/hooks/useAuth.tsx))
- `LanguageProvider` / `useLanguage` — active language, `t(key)` helper ([src/hooks/useLanguage.tsx](src/hooks/useLanguage.tsx))

### Persistence
All data lives in **localStorage** via the mock data layer in [src/utils/storage.ts](src/utils/storage.ts). The Axios client in [src/lib/api.ts](src/lib/api.ts) is wired up with auth interceptors for when a real backend is integrated. Network calls currently simulate delays with `setTimeout`.

### Internationalization
Translations for French (`fr`) and Haitian Creole (`ht`) live in [src/utils/translations.ts](src/utils/translations.ts). Always add both languages when adding new translation keys. Use the `t(key)` function from `useLanguage()`.

## Key Directories

```
src/
├── components/
│   ├── AuditTrail.tsx        # Audit log viewer (ADMIN only)
│   ├── Dashboard.tsx         # Stats overview with charts
│   ├── Login.tsx             # Auth form
│   ├── ShareCredentials.tsx  # Modal to share new user credentials
│   ├── SystemSettings.tsx    # Ministry/department management (ADMIN only)
│   ├── UserForm.tsx          # Create/edit user form
│   ├── UsersList.tsx         # Users table with CRUD actions
│   ├── figma/                # Figma-generated components
│   └── ui/                   # Shadcn/UI component library (do not modify)
├── hooks/
│   ├── useAuth.tsx
│   └── useLanguage.tsx
├── lib/
│   └── api.ts                # Axios instance with interceptors
├── types/
│   └── index.ts              # All shared TypeScript types
├── utils/
│   ├── mockData.ts           # Seed data loaded into localStorage on first run
│   ├── permissions.ts        # RBAC helper functions
│   ├── storage.ts            # localStorage read/write layer
│   ├── translations.ts       # FR/HT translation strings
│   └── validation.ts         # Input validators + password generator
└── guidelines/
    └── Guidelines.md         # Design guidelines
```

## Roles & Permissions

Hierarchy: `ADMIN > RH > GRAND_COMMIS > FONCTIONNAIRE`

| Action | ADMIN | RH | GRAND_COMMIS | FONCTIONNAIRE |
|---|:---:|:---:|:---:|:---:|
| View dashboard | Y | Y | Y | Y |
| View users list | Y | Y (own) | Y (self) | Y (self) |
| Create users | Y | Y (FONCTIONNAIRE only) | N | N |
| Edit/delete users | Y | Y (own FONCTIONNAIRE) | N | N |
| View audit trail | Y | N | N | N |
| System settings | Y | N | N | N |

RH users only see FONCTIONNAIRE accounts they created (`createdBy === rh.id`).

Permission logic lives in [src/utils/permissions.ts](src/utils/permissions.ts).

## Conventions

- **Components:** PascalCase functional components, one component per file
- **Hooks:** `use` prefix, live in `src/hooks/`
- **Types:** All shared types in `src/types/index.ts` — add there, not inline
- **Translations:** Always provide both `fr` and `ht` entries; use simple string keys
- **UI components:** Use existing Shadcn/UI components from `src/components/ui/` — do not modify them directly; add new ones via `shadcn` CLI if needed
- **Audit logging:** Every mutating action (create/update/delete/activate/deactivate) must create an `AuditLog` entry via `addAuditLog()` from `storage.ts`

## Mock Data & Test Credentials

Loaded automatically on first launch via [src/utils/mockData.ts](src/utils/mockData.ts):

| Username | Password | Role |
|---|---|---|
| `admin` | `Admin2024!` | ADMIN |
| `mdubois` | `Password123!` | RH (Interior Ministry) |
| `lgermain` | `Password123!` | RH (Health Ministry) |

Reset localStorage in browser DevTools to re-seed mock data.

---

## Session Log — 2026-03-24

### What was done

**API integration — user creation**
- `UserForm.tsx` now calls `POST /api/User/create` (real backend) instead of writing to localStorage
- `storage.ts` `authenticate()` response typed as `Record<string, any>` and now maps both `ministereId` and `ministerId` as mutual fallbacks (API field name is inconsistent across endpoints)
- `AuthProvider.tsx` now persists the user and token to localStorage after login (`persistCurrentUser` / `persistToken`), fixing session loss on page refresh

**Role-based create-user access**
- "Create User" button added to `UsersList.tsx` — visible only to ADMIN and RH, opens a dialog with `UserForm`
- `permissions.ts` updated: ADMIN can only create RH; RH can create GRAND_COMMIS or FONCTIONNAIRE
- Role dropdown in `UserForm` now derives available roles from `currentUser.roles[0].toUpperCase()` (the `User` type uses `roles[]`, not `role`)

**RH ministry auto-fill**
- When an RH user opens the create form, `ministerId` is automatically set to `currentUser.ministereId` and the field is disabled

**Fast Refresh fix**
- Split `useAuth.tsx` and `useLanguage.tsx`: each file now exports only a hook
- Providers moved to `src/hooks/AuthProvider.tsx` and `src/hooks/LanguageProvider.tsx`
- `App.tsx` imports updated accordingly — eliminates the Vite HMR invalidation warning

**Type system**
- `User` interface in `src/types/index.ts` expanded to include all fields used at runtime: `role`, `status`, `fullName`, `nif`, `ninu`, `phoneNumber`, `password`, `ministerId`, `ministere`, `departement`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`

**Architecture notes (updated)**
- `AuthProvider` and `LanguageProvider` now live in `src/hooks/` as separate files from their hooks
- `primaryRole` pattern: derive a single string with `(currentUser?.roles?.[0]?.toUpperCase() ?? "LAMBDA") as UserRole` — used in `UserForm` and `App.tsx` for permission checks

### What's next

- Hook up remaining CRUD operations (edit, delete, activate/deactivate) to real API endpoints — currently still using localStorage via `storage.ts`
- The `User` type has both `ministereId` and `ministerId` — should be unified once the API naming is confirmed
- `filterUsersByPermissions` in `permissions.ts` uses `createdBy === currentUser.id` but `currentUser.id` may be undefined if the auth response doesn't return it — verify and fix
- Add error handling for API failures in `UserForm` (currently shows a generic toast on any error)
- The `extractUserInfosFromJwtToken` stub in `storage.ts` is not implemented — token claims (like ministry/role) could be parsed from it instead of relying on the login response body

---

## Session Log — 2026-03-26

### What was done

**UsersList — real API integration**
- `loadUsers` now calls `GET /api/User` instead of localStorage; server handles filtering per role (Admin sees all, RH sees own ministry only)
- `normalizeRole()` helper maps API role strings (`"Admin"`, `"GrandCommis"`, `"Fonctionnaire"`) to internal `UserRole` type (`"ADMIN"`, `"GRAND_COMMIS"`, `"FONCTIONNAIRE"`)
- `mapApiUser()` builds a `User` from the API response (constructs `fullName`, derives `role` from `roles[0]`)
- Table columns updated to match API response: removed `username`, `departement`, `status`; shows `ministereId`, `sectionId`, `phoneNumber`
- Loading spinner added while fetching

**Current user row protection**
- Own row highlighted in blue with a `Vous` badge
- Edit and delete buttons disabled for own row (`isSelf = user.id === currentUser?.id`)

**Permission rules updated**
- ADMIN: can create RH or GRAND_COMMIS (not ADMIN, not FONCTIONNAIRE)
- RH: can create FONCTIONNAIRE only (server also enforces this and forces its own `ministerId`)
- Role dropdown populated dynamically via `getRolesForUser(primaryRole)`

**UserForm — API create + validation**
- `POST /api/User/create` payload now maps internal role to API role name (`GRAND_COMMIS → "GrandCommis"`, etc.) — ASP.NET Identity role names are PascalCase
- `sectionId` sent as `undefined` (omitted) when empty to avoid required-field errors
- Client-side validation added: NIF must match `\d{3}-\d{3}-\d{3}-\d`; phone must start with 2/3/4/5 and be 8 digits
- Error handling improved: ASP.NET `ValidationProblemDetails` errors (`data.errors`) shown field-by-field in toast
- Error toast stays 5 seconds, is dismissible, and text is selectable
- Readonly `Créateur` field shows `currentUser.username` (mapped from `data.userName ?? data.username` in `authenticate()`)

**Dashboard**
- Removed active/inactive user cards and recent activities section
- Total count and role breakdown now fetched from `GET /api/User` with a loading spinner

**Bug fixes**
- All `import { toast } from 'sonner@2.0.3'` replaced with `'sonner'` across `AuditTrail.tsx`, `ShareCredentials.tsx`, `SystemSettings.tsx`, `ui/sonner.tsx` — was crashing the entire Vite bundle
- `storage.ts` `authenticate()` now maps `data.userName ?? data.username` to handle ASP.NET Identity's `UserName` casing

### What's next

- Edit and delete user actions still call localStorage (`updateUser`, `deleteUser`) — need real API endpoints
- `currentUser.id` may not be populated from the auth response, making `isSelf` check unreliable — verify the login response includes `id`
- `ministereId` vs `ministerId` naming is still duplicated in the `User` type — unify once API is consistent
- The `extractUserInfosFromJwtToken` stub in `storage.ts` is unused — role/ministry from JWT claims would be more reliable than login response body
- Remove `console.log` statements added for debugging (`storage.ts` line 140, `UserForm.tsx` payload log)
