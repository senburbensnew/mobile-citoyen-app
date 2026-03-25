# CLAUDE.md — frontend-mobile

## Project overview

React Native / Expo budget transparency dashboard for Haiti (mobile citoyen app).

- **Styling:** NativeWind (Tailwind classes) + `StyleSheet.create()` — both are used, do not remove either
- **State:** Redux Toolkit — `fiscalYears`, `selectedMinistry`, `initialDataLoaded` slices
- **Auth:** `context/AuthContext.js` + `hooks/useAuth.ts`; JWT stored via `lib/storage.js`
- **Routing:** Expo Router (file-based). Auth guard lives in `app/(root)/_layout.tsx` — it redirects to login when `user` is null automatically
- **i18n:** react-i18next with `fr` and `ht` (Haitian Creole) locales at `i18n/translations/`
- **Charts:** d3-shape + react-native-svg (donut — `LivePieChart`), react-native-gifted-charts (bar — `LiveBarChart`)
- **HTTP:** axios via `lib/api.js` — `validateStatus` already throws for non-2xx; no manual status check needed in consumers

---

## Architecture rules

- **Auth guard handles logout redirect.** Do not call `router.replace` inside logout handlers; the guard reacts to `user` becoming null.
- **Outer components need their own `useTranslation()`.** Components defined outside the main render function (e.g. `NotificationCard`, `EmptyState` in `notifications.tsx`) cannot close over the parent's `t` — each must call `const { t } = useTranslation()` itself.
- **Static arrays that use `t()` must live inside the component body**, not at module scope. `filterOptions`, `categoryOptions`, and similar must be defined inside the component so `t` is available.
- **`console.error` in catch blocks is intentional** in `VueEnsemble`, `notifications.tsx`, and `ErrorBoundary`. Do not remove those.
- **Module-level `const { width }` pattern:** always declare `Dimensions.get("window")` at module level (above the component function), never inside JSX or StyleSheet blocks.

---

## Completed work

### Session 1 — Bug fixes & code quality

| File | Fix |
|---|---|
| `lib/storage.js` | `getToken` web branch now returns `localStorage.getItem(TOKEN_KEY)` instead of `null` |
| `context/AuthContext.js` | Removed `console.log(parseJwt(data.token))` security leak on every login |
| `context/AuthContext.js` | `logout()` dispatches `clearSelectedMinistry()` + `setInitialDataLoaded(false)` to reset Redux |
| `app/(root)/profile.tsx` | Removed redundant `router.replace("/(root)")` from `handleLogout` |
| `hooks/useApi.ts` | Removed dead status check (axios already throws) + `console.log` |
| `hooks/useAppStartup.ts` | Removed `console.log("STARTUP ERROR:", ...)` |
| `components/FiltersSection.tsx` | Removed `console.log(ministriesData)` |
| `components/LivePieChart.tsx` | Removed fetch + response `console.log` calls |
| `components/LiveBarChart.tsx` | Removed `console.log("Error fetching...")` |
| `components/PieChartSection.tsx` | Moved `width` declaration to module level; removed dead duplicate `StyleSheet` block |
| `components/LoadingScreen.tsx` | Simplified `t ? t("key") : "fallback"` → `t("key", "fallback")` |
| `components/ErrorScreen.tsx` | Same simplification as LoadingScreen |

### Session 2 — Chart redesign

| Component | Changes |
|---|---|
| `components/PieChartSection.tsx` | Blue `#2563EB` accent bar, `MaterialIcons pie-chart` icon in `#EFF6FF` container, selected ministry subtitle, `borderRadius: 20` card |
| `components/BarChartSection.tsx` | Green `#10b981` accent bar, bar-chart icon in `#ECFDF5` container, fiscal year badge, legend as color pills |
| `components/LiveBarChart.tsx` | Selected-month section replaced with 3 metric mini-cards (Allocation / Depenses / Solde), each with `borderLeftWidth: 3` color accent |
| `components/LivePieChart.tsx` | White bordered list items, 8px gap separator, modal article label + formatted values (`Md HTG`), blue-tinted show-more button |

### Session 3 — Full FR / HT i18n

**Translation files** (`i18n/translations/fr.json` + `ht.json`): added ~80 keys across these namespaces:

- `common` — `online`
- `index_screen.tabs` — `apercu_budgetaire`, `vue_detaillee`, `projets`
- `index_screen.dashboard_header` — `dashboard`, `role`, `ministere`
- `index_screen.filters_section` — title, subtitle, search placeholder, dropdown placeholder
- `index_screen.piechart_section` / `barchart_section` — titles, legends, metric labels
- `livepiechart` — loading, errors (404/500/network/generic), article label, repartition title, show more/less, modal labels
- `profile_screen` — all field labels, preferences, quick actions, security zone, footer
- `notifications_screen` — header stats, filter options, category options, alert dialogs, empty state

**Components wired to `useTranslation`:**

| File | What changed |
|---|---|
| `app/(root)/index.tsx` | Tabs use `labelKey` instead of `labelFR`/`labelHT`; header strings translated |
| `app/(root)/profile.tsx` | Replaced stale `import { t } from "i18next"` with hook; all strings translated |
| `app/(root)/notifications.tsx` | All UI strings translated; `filterOptions`/`categoryOptions` moved inside component body; `NotificationCard` + `EmptyState` got own `useTranslation()` |
| `components/FiltersSection.tsx` | Title, subtitle, search placeholder, dropdown placeholder |
| `components/BarChartSection.tsx` | Title, legend labels |
| `components/LiveBarChart.tsx` | Allocation / Depenses / Solde metric labels |
| `components/PieChartSection.tsx` | Title, ministry subtitle |
| `components/LivePieChart.tsx` | All user-facing strings |

---

## Remaining work

| Item | File | Notes |
|---|---|---|
| i18n — error/modal strings | `components/SectionsComponent.tsx` | Used in VueDetaillee; hardcoded French error messages and modal labels |
| i18n — fiscal year placeholder | `components/Header.tsx` | One hardcoded `"Sélectionner une année fiscale"` |
| i18n — review | `app/(auth)/login.tsx`, `app/(root)/parametres.tsx` | Mostly done but worth a final audit |
| Redux reset on logout | `context/AuthContext.js` | Dispatch `clearSelectedMinistry()` + `setInitialDataLoaded(false)` in `logout()` |
| Web auth fix | `lib/storage.js` | `getToken` web branch returns `null`; should return `localStorage.getItem(TOKEN_KEY)` |
