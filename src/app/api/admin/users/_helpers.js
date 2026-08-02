import { NextResponse } from "next/server";

import { adminAuth, isAdminConfigured } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

const ADMIN_ROLES = ["admin"];
const TEAM_ROLES = ["admin", "manager"];

function unauthorized(message = "غير مصرح بالوصول.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

function forbidden(message) {
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function assertRole(request, allowedRoles = ADMIN_ROLES) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "لم يتم إعداد بيانات خدمة Firebase (Admin SDK).", code: "NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const auth = adminAuth();
  if (!auth) {
    return unauthorized();
  }

  const authHeader = request.headers.get("authorization") || "";
  const idToken = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!idToken) {
    return unauthorized();
  }

  try {
    const decoded = await auth.verifyIdToken(idToken, true);

    const db = getFirestore(auth.app);

    let profile = null;
    try {
      const snapshot = await db.collection("profiles").doc(decoded.uid).get();
      profile = snapshot.data() || null;
    } catch {
      profile = null;
    }

    const role = profile?.role || "member";

    if (!allowedRoles.includes(role)) {
      return unauthorized("يحتاج هذا الإجراء صلاحية مدير النظام.");
    }

    if (profile?.status === "inactive") {
      return forbidden("حسابك موقوف. تواصل مع مدير النظام.");
    }

    return { uid: decoded.uid, profile, db };
  } catch {
    return unauthorized();
  }
}

export async function assertAdminRole(request) {
  return assertRole(request, ADMIN_ROLES);
}

export async function assertTeamRole(request) {
  return assertRole(request, TEAM_ROLES);
}
