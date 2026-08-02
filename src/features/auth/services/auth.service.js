import * as authRepository from "../repos/auth.repo";
import * as profileRepository from "../repos/profile.repo";
import getAuthErrorMessage from "../utils/auth-errors";
import { fetchSettings } from "@/lib/settingsCache";

const REGISTRATION_DISABLED_ERROR = "التسجيل موقوف مؤقتاً من قِبل الإدارة.";

/* =========================================================
   REGISTRATION GATE
========================================================= */

async function isRegistrationDisabled() {
  try {
    const data = await fetchSettings();
    return data?.auth?.allowRegistration === false;
  } catch {
    return false;
  }
}

/* =========================================================
   SESSION COOKIE (server-side auth for /dashboard)
========================================================= */

async function setSessionCookie(user) {
  if (!user) return;
  try {
    const idToken = await user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    console.error("Failed to create session cookie:", error);
  }
}

async function clearSessionCookie() {
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
  } catch (error) {
    console.error("Failed to clear session cookie:", error);
  }
}

export async function loginWithEmail(email, password) {
  try {
    const credential = await authRepository.login(email, password);
    await setSessionCookie(credential.user);
    return {
      user: credential.user,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: getAuthErrorMessage(error),
    };
  }
}

export async function registerWithEmail({ name, email, password }) {
  try {
    if (await isRegistrationDisabled()) {
      return { user: null, error: REGISTRATION_DISABLED_ERROR };
    }
    const credential = await authRepository.register(email, password);
    if (name) {
      await authRepository.updateUserProfile(credential.user, {
        displayName: name,
      });
    }
    await profileRepository.createProfile(credential.user, {
      name,
    });
    await setSessionCookie(credential.user);
    return {
      user: credential.user,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: getAuthErrorMessage(error),
    };
  }
}

export async function loginWithGoogle() {
  try {
    const credential = await authRepository.loginWithGoogle();
    // أنشئ Profile لأول مرة فقط
    if (credential.additionalUserInfo?.isNewUser) {
      if (await isRegistrationDisabled()) {
        // منع إنشاء حساب جديد بينما التسجيل موقوف، مع تسجيل خروج المستخدم
        await authRepository.logout();
        return { user: null, error: REGISTRATION_DISABLED_ERROR };
      }
      await profileRepository.createProfile(credential.user);
    }
    await setSessionCookie(credential.user);

    return {
      user: credential.user,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: getAuthErrorMessage(error),
    };
  }
}

export async function logout() {
  await clearSessionCookie();
  return authRepository.logout();
}

export const subscribeToAuthChanges = authRepository.subscribe;
