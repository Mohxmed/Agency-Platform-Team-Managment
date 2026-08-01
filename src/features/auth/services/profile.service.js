import { getProfile, createProfile } from "../repos/profile.repo";
import { PROFILE_DEFAULTS } from "../constants/profile.defaults";

export async function fetchProfile(uid) {
  return await getProfile(uid);
}

export async function createUserProfile(user, extraData = {}) {
  const profile = {
    uid: user.uid,
    name: extraData.name || user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    role: extraData.role || "member",
    status: "active",
    ...PROFILE_DEFAULTS,
    createdAt: new Date(),
  };

  return await createProfile(user.uid, profile);
}
