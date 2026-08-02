"use client";

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getCountFromServer,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

/* ============================================================
   SUBSCRIBE TO COLLECTION
============================================================ */

export function subscribeToCollection(
  collectionName,
  callback,
  orderField = "createdAt",
) {
  const collectionRef = collection(db, collectionName);

  let fallbackUnsubscribe = null;

  const q = query(collectionRef, orderBy(orderField, "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })),
      );
    },
    (error) => {
      console.warn(`Ordered query failed for "${collectionName}".`, error);

      fallbackUnsubscribe = onSnapshot(
        collectionRef,
        (snapshot) => {
          callback(
            snapshot.docs.map((document) => ({
              id: document.id,
              ...document.data(),
            })),
          );
        },
        (fallbackError) => {
          console.error(
            `Firestore fallback failed for "${collectionName}":`,
            fallbackError,
          );

          callback([]);
        },
      );
    },
  );

  return () => {
    unsubscribe();

    if (fallbackUnsubscribe) {
      fallbackUnsubscribe();
    }
  };
}

/* ============================================================
   GET DOCUMENT BY ID
============================================================ */

export async function getDocumentById(collectionName, id) {
  try {
    if (!collectionName || !id) {
      return null;
    }

    const documentRef = doc(db, collectionName, id);

    const snapshot = await getDoc(documentRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error(
      `Failed to get document "${id}" from "${collectionName}":`,
      error,
    );

    throw error;
  }
}

/* ============================================================
   GET DOCUMENT BY FIELD
============================================================ */

export async function getDocumentByField(collectionName, fieldName, value) {
  try {
    if (
      !collectionName ||
      !fieldName ||
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return null;
    }

    const collectionRef = collection(db, collectionName);

    const q = query(collectionRef, where(fieldName, "==", value));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const document = snapshot.docs[0];

    return {
      id: document.id,
      ...document.data(),
    };
  } catch (error) {
    console.error(
      `Failed to get document where ${fieldName} == ${value}:`,
      error,
    );

    throw error;
  }
}

/* ============================================================
   CREATE DOCUMENT
============================================================ */

export function createDocument(collectionName, data) {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/* ============================================================
   UPDATE DOCUMENT
============================================================ */

export function updateDocument(collectionName, id, data) {
  return updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/* ============================================================
   SET DOCUMENT (UPSERT)
============================================================ */

export function setDocument(collectionName, id, data) {
  return setDoc(doc(db, collectionName, id), data, { merge: true });
}

/* ============================================================
   DELETE DOCUMENT
============================================================ */

export function removeDocument(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id));
}

/* ============================================================
   GET COLLECTION COUNT
============================================================ */

export async function getCollectionCount(collectionName) {
  const snapshot = await getCountFromServer(collection(db, collectionName));

  return snapshot.data().count;
}

/* ============================================================
   NOTIFICATIONS
============================================================ */

export function subscribeToNotifications(userId, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const notificationsRef = collection(db, "notifications");

  const q = query(notificationsRef, where("userId", "==", userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications = snapshot.docs
        .map((document) => ({
          id: document.id,
          ...document.data(),
        }))
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;

          const bTime = b.createdAt?.toMillis?.() || 0;

          return bTime - aTime;
        });

      callback(notifications);
    },
    (error) => {
      console.error("Failed to subscribe to notifications:", error);

      callback([]);
    },
  );
}

/* ============================================================
   CREATE NOTIFICATION
============================================================ */

export function createNotification({
  userId,
  title,
  message,
  type = "info",
  link = "",
  projectId = "",
  projectTitle = "",
}) {
  if (!userId || !title || !message) {
    throw new Error("userId, title and message are required.");
  }

  return addDoc(collection(db, "notifications"), {
    userId,
    title,
    message,
    type,
    link,
    projectId,
    projectTitle,
    read: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/* ============================================================
   NOTIFY USER (respects notifications settings toggles)
============================================================ */

export async function notifyUser({
  userId,
  title,
  message,
  type = "info",
  link = "",
  projectId = "",
  projectTitle = "",
  eventKey = "",
}) {
  if (!userId || !title || !message) return;

  try {
    const { fetchSettings } = await import("@/lib/settingsCache");
    const settings = await fetchSettings();

    const toggles = settings?.notifications || {};

    if (toggles.enabled === false) return;

    if (eventKey && toggles[eventKey] === false) return;
  } catch {
    // Best-effort: notification failures (including settings read) are silent.
  }

  try {
    return createNotification({
      userId,
      title,
      message,
      type,
      link,
      projectId,
      projectTitle,
    });
  } catch {
    // Best-effort.
  }
}

/* ============================================================
   MARK NOTIFICATION AS READ
============================================================ */

export function markNotificationAsRead(notificationId) {
  return updateDoc(doc(db, "notifications", notificationId), {
    read: true,
    updatedAt: serverTimestamp(),
  });
}

/* ============================================================
   MARK ALL NOTIFICATIONS AS READ
============================================================ */

export async function markAllNotificationsAsRead(notifications) {
  const unread = notifications.filter((notification) => !notification.read);

  await Promise.all(
    unread.map((notification) => markNotificationAsRead(notification.id)),
  );
}

/* ============================================================
   DELETE NOTIFICATION
============================================================ */

export function deleteNotification(notificationId) {
  return deleteDoc(doc(db, "notifications", notificationId));
}
