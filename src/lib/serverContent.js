// Server-only data access for SEO (sitemap, generateMetadata).
// Uses the Admin SDK so pages render titles/URLs from Firestore without client JS.

import { adminDb } from "./firebaseAdmin";

function toDate(value) {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

export async function getServerSettings() {
  const db = adminDb();
  if (!db) return null;
  try {
    const snap = await db.collection("settings").doc("site").get();
    return snap.exists ? snap.data() : null;
  } catch {
    return null;
  }
}

export async function getWorks() {
  const db = adminDb();
  if (!db) return [];
  try {
    const snap = await db
      .collection("works")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();
    return snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        link: data.link || doc.id,
        updatedAt: toDate(data.updatedAt || data.createdAt),
      };
    });
  } catch {
    return [];
  }
}

export async function getWorkByLink(link) {
  const db = adminDb();
  if (!db) return null;
  try {
    const byLink = await db
      .collection("works")
      .where("link", "==", link)
      .limit(1)
      .get();
    if (!byLink.empty) {
      const doc = byLink.docs[0];
      const data = doc.data();
      return { id: doc.id, ...data, link: data.link || doc.id };
    }
    const byId = await db.collection("works").doc(link).get();
    if (byId.exists) {
      const data = byId.data();
      return { id: byId.id, ...data, link: data.link || byId.id };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getClients() {
  const db = adminDb();
  if (!db) return [];
  try {
    const snap = await db
      .collection("clients")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();
    return snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        link: data.link || doc.id,
        updatedAt: toDate(data.updatedAt || data.createdAt),
      };
    });
  } catch {
    return [];
  }
}

export async function getClientByLink(link) {
  const db = adminDb();
  if (!db) return null;
  try {
    const byLink = await db
      .collection("clients")
      .where("link", "==", link)
      .limit(1)
      .get();
    if (!byLink.empty) {
      const doc = byLink.docs[0];
      const data = doc.data();
      return { id: doc.id, ...data, link: data.link || doc.id };
    }
    const byId = await db.collection("clients").doc(link).get();
    if (byId.exists) {
      const data = byId.data();
      return { id: byId.id, ...data, link: data.link || byId.id };
    }
    return null;
  } catch {
    return null;
  }
}
