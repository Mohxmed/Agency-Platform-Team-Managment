"use client";

import { getAnalytics, isSupported } from "firebase/analytics";
import app from "./firebase";

let analytics = null;

export async function getFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();

  if (!supported) {
    return null;
  }

  if (!analytics) {
    analytics = getAnalytics(app);
  }

  return analytics;
}
