import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { PROFILE_DEFAULTS } from "../constants/profile.defaults";

// Get Profile
export async function getProfile(uid) {
  if (!uid) return null;
  const snapshot = await getDoc(doc(db, "profiles", uid));
  if (!snapshot.exists()) {
    return null;
  }
  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

// Create Profile
export async function createProfile(user, extraData = {}) {
  if (!user) return null;
  const profile = {
    uid: user.uid,
    name: extraData.name || user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    ...PROFILE_DEFAULTS,
    role: extraData.role || PROFILE_DEFAULTS.role,
    status: extraData.status || PROFILE_DEFAULTS.status,
    logo: extraData.logo || user.photoURL || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "profiles", user.uid), profile);
  return profile;
}
