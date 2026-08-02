"use client";
// Init Firebase Configs
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (typeof window !== "undefined") {
  const missing = [
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      "Firebase is not configured. Missing env variables:",
      missing.join(", "),
    );
  }
}

function createApp() {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    if (typeof window !== "undefined") {
      console.error(
        "Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* environment variables.",
      );
    }
    return null;
  }

  try {
    if (getApps().length) {
      return getApp();
    }
    return initializeApp(firebaseConfig);
  } catch (error) {
    if (typeof window !== "undefined") {
      console.error("Firebase init error:", error);
    }
    return null;
  }
}

const app = createApp();

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export default app;
