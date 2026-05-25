import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

const localePattern = new RegExp(`^/(${routing.locales.join("|")})(/.*)?$`);

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

  // Extract locale from pathname
  const localeMatch = pathname.match(localePattern);
  const locale = localeMatch?.[1] || routing.defaultLocale;
  const subPath = localeMatch?.[2] || "/";

  // Authenticated user accessing login page -> redirect to dashboard
  const isLoginPage = subPath === "/" || subPath === "" || subPath === "/login";
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL(`/${locale}/superadmin`, request.url));
  }

  // Unauthenticated user accessing protected route -> redirect to login
  const isProtectedRoute =
    subPath.startsWith("/superadmin") ||
    subPath.startsWith("/account-statement") ||
    subPath.startsWith("/net-balance") ||
    subPath.startsWith("/deposits-withdrawals") ||
    subPath.startsWith("/api-keys") ||
    subPath.startsWith("/customer-settlement") ||
    subPath.startsWith("/user-management") ||
    subPath.startsWith("/transactions") ||
    subPath.startsWith("/account");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
    "/([\\w-]+)?/superadmin/:path*",
  ],
};