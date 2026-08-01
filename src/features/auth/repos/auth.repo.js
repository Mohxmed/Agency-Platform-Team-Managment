import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function updateUserProfile(user, data) {
  return updateProfile(user, data);
}

export function logout() {
  return signOut(auth);
}

export function subscribe(callback) {
  return onAuthStateChanged(auth, callback);
}
