import { NextResponse } from "next/server";

import { adminAuth, isAdminConfigured } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { assertTeamRole } from "../_helpers";

function notFound() {
  return NextResponse.json({ error: "المستخدم غير موجود." }, { status: 404 });
}

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function forbidden(message) {
  return NextResponse.json({ error: message }, { status: 403 });
}

async function getTargetRole(db, uid) {
  try {
    const snapshot = await db.collection("profiles").doc(uid).get();
    return snapshot.exists ? snapshot.data()?.role || "member" : "member";
  } catch {
    return "member";
  }
}

export async function PATCH(request, { params }) {
  const guard = await assertTeamRole(request);
  if (guard instanceof NextResponse) return guard;

  const { uid, profile: actor, db } = guard;
  const actorRole = actor.role || "member";

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "لم يتم إعداد بيانات خدمة Firebase (Admin SDK).", code: "NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const { uid: targetUid } = await params;

  if (!targetUid) {
    return badRequest("معرّف المستخدم مطلوب.");
  }

  try {
    const body = await request.json();

    if (targetUid === uid && (body.disabled !== undefined || body.password !== undefined || body.role !== undefined)) {
      return forbidden("لا يمكنك تعطيل حسابك أو تغيير بيانات الدخول لنفسك من هنا.");
    }

    if (actorRole !== "admin") {
      const targetRole = await getTargetRole(db, targetUid);
      if (targetRole === "admin") {
        return forbidden("لا يمكن للمدير تعديل حسابات مسؤولي النظام.");
      }
      if (body.role !== undefined && body.role === "admin") {
        return forbidden("لا يمكن للمدير ترقية الحسابات إلى مسؤول نظام.");
      }
    }

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

    const userRecord = await adminAuth().updateUser(targetUid, updates);

    if (body.disabled) {
      await adminAuth().revokeRefreshTokens(targetUid).catch(() => {});
    }

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

    return NextResponse.json(
      { error: message, code, detail: error.message || "" },
      { status: 400 },
    );
  }
}

export async function DELETE(request, { params }) {
  const guard = await assertTeamRole(request);
  if (guard instanceof NextResponse) return guard;

  const { uid, profile: actor, db } = guard;
  const actorRole = actor.role || "member";

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "لم يتم إعداد بيانات خدمة Firebase (Admin SDK).", code: "NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const { uid: targetUid } = await params;

  if (!targetUid) {
    return badRequest("معرّف المستخدم مطلوب.");
  }

  try {
    if (targetUid === uid) {
      return forbidden("لا يمكنك حذف حسابك من هنا.");
    }

    if (actorRole !== "admin") {
      const targetRole = await getTargetRole(db, targetUid);
      if (targetRole === "admin") {
        return forbidden("لا يمكن للمدير حذف حسابات مسؤولي النظام.");
      }
    } else {
      const targetRole = await getTargetRole(db, targetUid);
      if (targetRole === "admin") {
        const adminSnapshot = await db
          .collection("profiles")
          .where("role", "==", "admin")
          .limit(2)
          .get();
        if (adminSnapshot.size <= 1) {
          return forbidden("لا يمكن حذف آخر مسؤول نظام في المنصة.");
        }
      }
    }

    await adminAuth().deleteUser(targetUid);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    const code = error.code || "UNKNOWN";
    if (code === "auth/user-not-found") {
      return notFound();
    }
    return NextResponse.json(
      {
        error: "حصل خطأ أثناء حذف الحساب.",
        code,
        detail: error.message || "",
      },
      { status: 400 },
    );
  }
}
