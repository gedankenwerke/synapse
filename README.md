# Synapse

Internal Organization System — a Next.js admin dashboard with Thai/English localization.

## Tech Stack

- **Next.js 16** (App Router)
- **Mantine 9** — UI components
- **next-intl** — i18n with `[locale]` URL routing
- **Zustand** — client state management
- **No Tailwind** — Mantine-only styling (no Tailwind)
- **TypeScript**

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/th/` (Thai, default locale).

## Internationalization

- **Locales**: `th` (default), `en`
- **URL pattern**: `/th/dashboard`, `/en/dashboard`, etc.
- **Translation files**: `messages/th.json`, `messages/en.json`
- **Routing config**: `i18n/routing.ts`
- **Navigation**: always import `useRouter`, `usePathname`, `Link` from `@/navigation` (not `next/navigation`) — the locale-aware router automatically prepends the locale prefix

### Adding a new translation key

1. Add the key to both `messages/th.json` and `messages/en.json`
2. Use it in components: `const t = useTranslations("namespace"); t("key")`

### Adding a new page

1. Create the page under `app/[locale]/(dashboard)/your-page/page.tsx`
2. Add nav entry in `components/SidebarNav.tsx`
3. Add breadcrumb in `components/HeaderBar.tsx`
4. Add translation keys under `nav` and `breadcrumb` namespaces

## Project Structure

```
app/
  layout.tsx              # Root layout (<html>, fonts, CSS)
  [locale]/
    layout.tsx             # Locale layout (NextIntlClientProvider, ThemeProvider)
    page.tsx               # Login page
    (dashboard)/
      layout.tsx           # Auth guard + app shell
      dashboard/
      account-statement/
      deposits-withdrawals/
      net-balance/
      api-keys/
      customer-settlement/
      user-management/

components/
  AppShellLayout.tsx      # Sidebar + header shell
  SidebarNav.tsx           # Navigation sidebar
  HeaderBar.tsx            # Breadcrumbs + theme toggle + user avatar
  UserAvatar.tsx           # Profile dropdown with logout
  LanguageSwitcher.tsx     # TH/EN switcher (segmented + menu variants)
  ThemeProvider.tsx        # Mantine color scheme provider

i18n/
  routing.ts              # Locale config (locales, defaultLocale)
  request.ts              # Server-side request config

messages/
  th.json                 # Thai translations
  en.json                 # English translations

navigation.ts             # Locale-aware useRouter, usePathname, Link, redirect

proxy.ts                  # Middleware (locale routing + auth guard)
```

## Key Conventions

- **Navigation**: use `@/navigation` exports, not `next/navigation`. The locale-aware router handles URL prefixes automatically.
- **Auth**: `proxy.ts` checks `auth_token` cookie; unauthenticated users redirect to `/{locale}/`
- **State**: Zustand store at `store/useAppStore.ts` — holds auth state (token, user, isAuthenticated)
- **API**: Axios instance at `libs/axios.ts`, services under `services/`
- **Refresh Token**: 401 responses auto-refresh via `GET /api/v1/token` and retry the original request (see `libs/axios.ts` interceptor)

## API Integration Status

| API | Endpoint(s) | Service | Page | Status |
|---|---|---|---|---|
| Auth | `POST /login`, `POST /register`, `POST /me`, `GET /token` | `authentication.ts` | Login page + auto-refresh | ✅ Done |
| PayAgent | `POST /add-pay-agent` | `pay-agent.ts` | `/pay-agent` form | ✅ Done |
| Settlement | `POST /settlement` | `settlement.ts` | `/customer-settlement` form | ✅ Done |
| Bank Statement | `POST /search-bank-statement` | `account-statement.ts` | `/account-statement` | ✅ Done |
| Net Balance | `POST /search-net-balance` | `net-balance.ts` | `/net-balance` | ✅ Done |
| Transaction | `POST /search-transaction-history` | `transaction.ts` | `/deposits-withdrawals` | ✅ Done |
| User | `GET/POST /users`, `GET/PUT/DELETE /users/{id}` | `user.ts` | `/user-management` | ✅ Done |
| Policy | `GET /policies`, `POST /policies/reload` | `policy.ts` | — | 🔧 Service only |
| Tenant | `GET/POST /tenants`, `GET/PUT/DELETE /tenants/{id}` | `tenant.ts` | `/user-management` Tenants tab | ✅ Done |
| TenantRole | `GET/POST /tenant-roles`, `GET/PUT/DELETE /tenant-roles/{id}` | `tenant-role.ts` | `/user-management` Roles tab | ✅ Done |
| TenantPermission | `GET/POST /tenant-permissions`, `GET/PUT/DELETE /tenant-permissions/{id}` | `tenant-permission.ts` | `/user-management` Roles tab (drawer) | ✅ Done |
| TenantUser | `GET/POST /tenant-users`, `GET/PUT/DELETE /tenant-users/{id}` | `tenant-user.ts` | `/user-management` Users tab (assignments) | ✅ Done |
| Info | `GET /health`, `GET /scalar` | — | — | ⬜ N/A |