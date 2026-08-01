import { NextResponse } from "next/server";

// Application middleware.
// This is the place to implement:
//   1. Authentication checks (e.g. verifying a session/JWT cookie and
//      redirecting unauthenticated users away from protected routes).
//   2. Role-based route protection (e.g. restricting (dashboard) routes
//      to specific roles defined in src/constants/roles.js and
//      src/constants/permissions.js).
//
// No logic has been implemented yet — this is a scaffold only.

export function middleware(request) {
  return NextResponse.next();
}

export const config = {
  // Define which routes this middleware should run on, e.g.:
  // matcher: ["/dashboard/:path*"],
  matcher: [],
};
