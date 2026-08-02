import { getProfile, createProfile } from "../repos/profile.repo";

export async function fetchProfile(uid) {
  return await getProfile(uid);
}

// Creates (or returns) the user's profile document.
// This is the single source of truth for user data.
export async function createUserProfile(user, extraData = {}) {
  if (!user) return null;
  const existing = await getProfile(user.uid);
  if (existing) return existing;
  return await createProfile(user, extraData);
}
