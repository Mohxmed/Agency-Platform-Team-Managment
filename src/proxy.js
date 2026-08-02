import { NextResponse } from "next/server";

// Pure pass-through middleware.
//
// Server-side auth is handled by <ProtectedRoute> (client) and /api/auth/session
// (server). Enforcing the session cookie here caused two classes of failures on
// Vercel: a 500 when firebase-admin was imported, and redirect loops that
// bounced successful logins back to /auth/login when the cookie wasn't set.
// Keeping this file dependency-free and as next() avoids both problems.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};