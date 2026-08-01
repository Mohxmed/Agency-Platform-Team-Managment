import * as authRepository from "../repos/auth.repo";
import * as profileRepository from "../repos/profile.repo";
import getAuthErrorMessage from "../utils/auth-errors";

export async function loginWithEmail(email, password) {
  try {
    const credential = await authRepository.login(email, password);
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
    const credential = await authRepository.register(email, password);
    if (name) {
      await authRepository.updateUserProfile(credential.user, {
        displayName: name,
      });
    }
    await profileRepository.createProfile(credential.user, {
      name,
    });
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
      await profileRepository.createProfile(credential.user);
    }

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

export const logout = authRepository.logout;

export const subscribeToAuthChanges = authRepository.subscribe;
