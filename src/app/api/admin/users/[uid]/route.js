import { NextResponse } from "next/server";

import { adminAuth, isAdminConfigured } from "@/lib/firebaseAdmin";
import { assertAdminRole } from "../_helpers";

function notFound() {
  return NextResponse.json({ error: "المستخدم غير موجود." }, { status: 404 });
}

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function PATCH(request, { params }) {
  const guard = await assertAdminRole(request);
  if (guard instanceof NextResponse) return guard;

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "لم يتم إعداد بيانات خدمة Firebase (Admin SDK).", code: "NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const { uid } = await params;

  if (!uid) {
    return badRequest("معرّف المستخدم مطلوب.");
  }

  try {
    const body = await request.json();

    const updates = {};

    if (body.email !== undefined) {
      const email = body.email.trim().toLowerCase();
      if (!email) {
        return badRequest("البريد الإلكتروني مطلوب.");
      }
      updates.email = email;
    }

    if (body.password !== undefined) {
      if (!body.password) {
        return badRequest("كلمة المرور مطلوبة.");
      }
      if (body.password.length < 6) {
        return badRequest("كلمة المرور يجب ألا تقل عن 6 أحرف.");
      }
      updates.password = body.password;
    }

    if (body.name !== undefined) {
      updates.displayName = body.name.trim();
    }

    if (body.disabled !== undefined) {
      updates.disabled = Boolean(body.disabled);
    }

    if (Object.keys(updates).length === 0) {
      return badRequest("لا توجد بيانات للتحديث.");
    }

    const userRecord = await adminAuth().updateUser(uid, updates);

    return NextResponse.json({ uid: userRecord.uid });
  } catch (error) {
    console.error("Update user error:", error);
    const code = error.code || "UNKNOWN";
    let message = "حصل خطأ أثناء تعديل الحساب.";

    if (code === "auth/user-not-found") {
      return notFound();
    } else if (code === "auth/email-already-exists") {
      message = "هذا البريد الإلكتروني مسجل بالفعل.";
    } else if (code === "auth/invalid-email") {
      message = "البريد الإلكتروني غير صالح.";
    } else if (code === "auth/invalid-password") {
      message = "كلمة المرور غير صالحة.";
    }

    return NextResponse.json({ error: message, code }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const guard = await assertAdminRole(request);
  if (guard instanceof NextResponse) return guard;

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "لم يتم إعداد بيانات خدمة Firebase (Admin SDK).", code: "NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const { uid } = await params;

  if (!uid) {
    return badRequest("معرّف المستخدم مطلوب.");
  }

  try {
    await adminAuth().deleteUser(uid);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    const code = error.code || "UNKNOWN";
    if (code === "auth/user-not-found") {
      return notFound();
    }
    return NextResponse.json(
      { error: "حصل خطأ أثناء حذف الحساب.", code },
      { status: 400 },
    );
  }
}
