import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const ADMIN_APP_NAME = "admin";

function resolveCredentials() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    try {
      return cert(JSON.parse(Buffer.from(raw, "base64").toString("utf8")));
    } catch {
      return cert(JSON.parse(raw));
    }
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  }

  return null;
}

export function isAdminConfigured() {
  return resolveCredentials() !== null;
}

function getAdminApp() {
  if (!isAdminConfigured()) {
    return null;
  }
  const existing = getApps().find((app) => app.name === ADMIN_APP_NAME);
  if (existing) {
    return existing;
  }
  return initializeApp(
    { credential: resolveCredentials(), projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID },
    ADMIN_APP_NAME,
  );
}

export function adminAuth() {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}
