"use client";

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

import firebaseApp, { db } from "./firebase";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

const SW_PATH = "/firebase-messaging-sw";

let messaging = null;
let swRegistration = null;

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    typeof Notification !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    Boolean(VAPID_KEY)
  );
}

export function isBrowserNotificationSupported() {
  return typeof window !== "undefined" && typeof Notification !== "undefined";
}

export function getPushPermission() {
  return isBrowserNotificationSupported()
    ? Notification.permission
    : "unsupported";
}

async function getMessagingInstance() {
  if (messaging) return messaging;
  if (!firebaseApp) return null;

  try {
    messaging = getMessaging(firebaseApp);
    return messaging;
  } catch (error) {
    console.error("Failed to init Firebase Messaging:", error);
    return null;
  }
}

export async function ensureFirebaseSw() {
  if (swRegistration) return swRegistration;
  if (!("serviceWorker" in navigator)) return null;

  try {
    swRegistration = await navigator.serviceWorker.register(SW_PATH);
    return swRegistration;
  } catch (error) {
    console.error("Failed to register messaging service worker:", error);
    return null;
  }
}

function tokenDocId(token) {
  return token.replace(/[:\/]/g, "_");
}

export async function savePushToken(userId, token) {
  if (!db || !userId || !token) return;

  try {
    const tokenRef = doc(collection(db, "pushTokens"), tokenDocId(token));

    await setDoc(
      tokenRef,
      {
        userId,
        token,
        platform: "web",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Failed to save push token:", error);
  }
}

export async function removePushToken(token) {
  if (!db || !token) return;

  try {
    const tokenRef = doc(collection(db, "pushTokens"), tokenDocId(token));

    await deleteDoc(tokenRef);
  } catch (error) {
    console.error("Failed to remove push token:", error);
  }
}

export async function requestPushPermission({ userId } = {}) {
  if (!isBrowserNotificationSupported()) return null;

  if (Notification.permission === "denied") return null;

  if (Notification.permission === "default") {
    try {
      const result = await Notification.requestPermission();
      if (result !== "granted") return null;
    } catch (error) {
      console.error("Notification permission request failed:", error);
      return null;
    }
  }

  // FCM token (background PWA push) is optional and only available when the
  // VAPID key is configured.
  if (!isPushSupported() || !userId) return null;

  try {
    const instance = await getMessagingInstance();
    if (!instance) return null;

    const registration = await ensureFirebaseSw();

    const currentToken = await getToken(instance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration || undefined,
    });

    if (!currentToken) return null;

    await savePushToken(userId, currentToken);

    return currentToken;
  } catch (error) {
    console.error("Failed to get FCM token:", error);
    return null;
  }
}
