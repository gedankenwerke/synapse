import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);
const localePattern = new RegExp(`^/(${routing.locales.join("|")})(/.*)?$`);
const TENANT_ID_COOKIE = "tenant_id";
const SUPERADMIN_TENANT_ID = "1";

// Old-style dashboard route prefixes (without tenantId)
const DASHBOARD_ROUTES = [
  "/dashboard",
  "/account-statement",
  "/net-balance",
  "/deposits-withdrawals",
  "/api-keys",
  "/customer-settlement",
  "/user-management",
  "/transactions",
  "/account",
  "/pay-agent",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and internal paths
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  const userTenantId = request.cookies.get(TENANT_ID_COOKIE)?.value;

  // Extract locale from pathname
  const localeMatch = pathname.match(localePattern);
  const locale = localeMatch?.[1] || routing.defaultLocale;
  const subPath = localeMatch?.[2] || "/";

  // ── Login page detection ──
  const isLoginPage = subPath === "/" || subPath === "" || subPath === "/login";

  // Authenticated user accessing login page → redirect to their tenant dashboard
  if (isLoginPage && token) {
    const tenantId = userTenantId || SUPERADMIN_TENANT_ID;
    return NextResponse.redirect(
      new URL(`/${locale}/${tenantId}/dashboard`, request.url)
    );
  }

  // ── Old-style URL redirect (without tenantId) ──
  // e.g. /en/dashboard → /en/{tenantId}/dashboard
  const isOldDashboardRoute = DASHBOARD_ROUTES.some((route) =>
    subPath.startsWith(route)
  );

  if (isOldDashboardRoute) {
    if (!token) {
      // Unauthenticated user accessing protected route → redirect to login
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    // Authenticated user → redirect to tenant-scoped URL
    const tenantId = userTenantId || SUPERADMIN_TENANT_ID;
    return NextResponse.redirect(
      new URL(`/${locale}/${tenantId}${subPath}`, request.url)
    );
  }

  // ── Extract tenantId from URL path: /[locale]/[tenantId]/... ──
  const tenantMatch = subPath.match(/^\/([^/]+)(\/.*)?$/);
  const urlTenantId = tenantMatch?.[1];

  // If path has a tenantId segment, check tenant isolation
  if (urlTenantId) {
    // Unauthenticated user accessing protected route → redirect to login
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    // Tenant isolation: non-superadmin users can only access their own tenant
    if (
      userTenantId &&
      userTenantId !== SUPERADMIN_TENANT_ID &&
      urlTenantId !== userTenantId
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/${userTenantId}/dashboard`, request.url)
      );
    }
  }

  // ── Let next-intl handle locale routing ──
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};