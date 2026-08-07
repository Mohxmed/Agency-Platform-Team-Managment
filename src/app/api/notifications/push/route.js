import { NextResponse } from "next/server";

import { adminAuth, adminDb, adminMessaging, isAdminConfigured } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, reason: "not-configured" },
      { status: 503 },
    );
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid-body" },
      { status: 400 },
    );
  }

  const {
    userId,
    title,
    message,
    type,
    link,
    projectId,
    projectTitle,
    eventKey,
  } = payload || {};

  if (!userId || !title || !message) {
    return NextResponse.json(
      { ok: false, reason: "missing-fields" },
      { status: 400 },
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  if (!token) {
    return NextResponse.json(
      { ok: false, reason: "unauthorized" },
      { status: 401 },
    );
  }

  try {
    const auth = adminAuth();
    if (!auth) {
      return NextResponse.json(
        { ok: false, reason: "not-configured" },
        { status: 503 },
      );
    }

    await auth.verifyIdToken(token);
  } catch {
    return NextResponse.json(
      { ok: false, reason: "unauthorized" },
      { status: 401 },
    );
  }

  const db = adminDb();
  const messaging = adminMessaging();

  if (!db || !messaging) {
    return NextResponse.json(
      { ok: false, reason: "not-configured" },
      { status: 503 },
    );
  }

  try {
    const tokensSnapshot = await db
      .collection("pushTokens")
      .where("userId", "==", userId)
      .get();

    const tokens = tokensSnapshot.docs
      .map((document) => document.data().token)
      .filter(Boolean);

    if (tokens.length === 0) {
      return NextResponse.json({ ok: true, delivered: 0, failed: 0 });
    }

    const target = link || "/dashboard";

    const messagePayload = {
      tokens,
      notification: {
        title,
        body: message,
      },
      data: {
        title,
        body: message,
        link: target,
        url: target,
        type: type || "info",
        projectId: projectId || "",
        projectTitle: projectTitle || "",
        eventKey: eventKey || "",
      },
      webpush: {
        headers: { TTL: "86400" },
        notification: {
          title,
          body: message,
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
        },
      },
    };

    const response = await messaging.sendEachForMulticast(messagePayload);

    const failedTokens = response.responses
      .map((result, index) => (result.success ? null : tokens[index]))
      .filter(Boolean);

    if (failedTokens.length > 0) {
      const batch = db.batch();

      tokensSnapshot.docs.forEach((document) => {
        if (failedTokens.includes(document.data().token)) {
          batch.delete(document.ref);
        }
      });

      await batch.commit();
    }

    return NextResponse.json({
      ok: true,
      delivered: response.successCount,
      failed: response.failureCount,
    });
  } catch (error) {
    console.error("Failed to send push notification:", error);
    return NextResponse.json(
      { ok: false, reason: "send-failed" },
      { status: 500 },
    );
  }
}
