import { NextResponse } from "next/server";

import { ROUTES } from "@/constants/routes";

const SESSION_COOKIE = "session";

function loginUrl(request, pathname) {
  const url = new URL(ROUTES.LOGIN, request.url);
  url.searchParams.set("redirect", pathname);
  return url;
}

// Lightweight guard. It never imports heavy server-only SDKs (firebase-admin)
// nor makes outbound verification calls, so it stays fast and crash-proof on
// the serverless/edge runtime. Real session/authorisation verification runs
// server-side in /api/auth/session and client-side in <ProtectedRoute>.
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Require a session cookie to enter the dashboard.
  if (pathname.startsWith(ROUTES.DASHBOARD)) {
    const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
    if (!hasSession) {
      return NextResponse.redirect(loginUrl(request, pathname));
    }
    return NextResponse.next();
  }

  // Signed-in users do not need to see the auth pages.
  if (pathname.startsWith("/auth/")) {
    const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
    if (hasSession) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};