import { NextResponse } from "next/server";

import { adminAuth, isAdminConfigured } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

function unauthorized(message = "غير مصرح بالوصول.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function assertAdminRole(request) {
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
    const decoded = await auth.verifyIdToken(idToken);

    let profile = null;
    try {
      const snapshot = await getFirestore(auth.app).collection("profiles").doc(decoded.uid).get();
      profile = snapshot.data();
    } catch {
      profile = null;
    }

    const role = profile?.role || "member";

    if (role !== "admin") {
      return unauthorized("يحتاج هذا الإجراء صلاحية مدير النظام.");
    }

    return { uid: decoded.uid, profile };
  } catch {
    return unauthorized();
  }
}
