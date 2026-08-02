import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const ADMIN_APP_NAME = "admin";

function parseServiceAccount(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function resolveCredentials() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    const parsed = parseServiceAccount(raw);
    if (parsed) {
      try {
        return cert(parsed);
      } catch {
        return null;
      }
    }

    try {
      return cert(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    try {
      return cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
    } catch {
      return null;
    }
  }

  return null;
}

export function isAdminConfigured() {
  return resolveCredentials() !== null;
}

function getAdminApp() {
  try {
    const credential = resolveCredentials();
    if (!credential) {
      return null;
    }

    const existing = getApps().find((app) => app.name === ADMIN_APP_NAME);
    if (existing) {
      return existing;
    }

    const options = { credential };
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId) {
      options.projectId = projectId;
    }

    return initializeApp(options, ADMIN_APP_NAME);
  } catch {
    return null;
  }
}

export function adminAuth() {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}
