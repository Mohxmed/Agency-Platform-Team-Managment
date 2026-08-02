import { NextResponse } from "next/server";

import { adminAuth, isAdminConfigured } from "@/lib/firebaseAdmin";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}

// Create a session cookie from a Firebase ID token.
export async function POST(request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "التحقق من الجلسة غير متاح حالياً.", code: "NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const auth = adminAuth();
  if (!auth) {
    return NextResponse.json(
      { error: "التحقق من الجلسة غير متاح حالياً.", code: "NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "معرّف الدخول مطلوب." },
        { status: 400 },
      );
    }

    const decoded = await auth.verifyIdToken(idToken);
    if (!decoded.uid) {
      return NextResponse.json(
        { error: "معرّف الدخول غير صالح." },
        { status: 401 },
      );
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE * 1000,
    });

    const response = NextResponse.json({ success: true, uid: decoded.uid });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: sessionCookie,
      maxAge: SESSION_MAX_AGE,
      ...cookieOptions(),
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "فشل إنشاء الجلسة. سجّل الدخول مرة أخرى." },
      { status: 401 },
    );
  }
}

// Clear the session cookie on logout.
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    maxAge: 0,
    ...cookieOptions(),
  });
  return response;
}
