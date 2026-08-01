import { NextResponse } from "next/server";

import { adminAuth, isAdminConfigured } from "@/lib/firebaseAdmin";
import { assertAdminRole } from "./_helpers";

export async function POST(request) {
  const guard = await assertAdminRole(request);
  if (guard instanceof NextResponse) return guard;

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "لم يتم إعداد بيانات خدمة Firebase (Admin SDK).", code: "NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase() || "";
    const password = body.password || "";
    const displayName = body.name?.trim() || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب ألا تقل عن 6 أحرف." },
        { status: 400 },
      );
    }

    const userRecord = await adminAuth().createUser({
      email,
      password,
      ...(displayName ? { displayName } : {}),
    });

    return NextResponse.json({ uid: userRecord.uid });
  } catch (error) {
    console.error("Create user error:", error);
    const code = error.code || "UNKNOWN";
    let message = "حصل خطأ أثناء إنشاء الحساب.";

    if (code === "auth/email-already-exists") {
      message = "هذا البريد الإلكتروني مسجل بالفعل.";
    } else if (code === "auth/invalid-email") {
      message = "البريد الإلكتروني غير صالح.";
    } else if (code === "auth/invalid-password") {
      message = "كلمة المرور غير صالحة.";
    }

    return NextResponse.json({ error: message, code }, { status: 400 });
  }
}
