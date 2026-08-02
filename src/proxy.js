import { NextResponse } from "next/server";

import { adminAuth, isAdminConfigured } from "@/lib/firebaseAdmin";
import { ROUTES } from "@/constants/routes";

const SESSION_COOKIE = "session";

function loginUrl(request, pathname) {
  const url = new URL(ROUTES.LOGIN, request.url);
  url.searchParams.set("redirect", pathname);
  return url;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // If the Admin SDK is not configured (e.g. local dev without keys),
  // skip server-side checks and let the client-side guards handle auth.
  if (!isAdminConfigured()) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;

  // Protect dashboard routes: require a valid session cookie.
  if (pathname.startsWith(ROUTES.DASHBOARD)) {
    if (!session) {
      return NextResponse.redirect(loginUrl(request, pathname));
    }

    try {
      await adminAuth().verifySessionCookie(session, false);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(loginUrl(request, pathname));
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }
  }

  // Signed-in users do not need to see the auth pages.
  if (pathname.startsWith("/auth/")) {
    if (!session) {
      return NextResponse.next();
    }

    try {
      await adminAuth().verifySessionCookie(session, false);
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    } catch {
      const response = NextResponse.next();
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
