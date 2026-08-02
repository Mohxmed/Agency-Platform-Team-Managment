"use client";
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  createContext,
} from "react";
import { fetchProfile, createUserProfile } from "../services/profile.service";
import {
  subscribeToAuthChanges,
  logout,
} from "@/features/auth/services/auth.service";

// Context
export const AuthContext = createContext(null);
// Provider
export function AuthProvider({ children }) {
  // States
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load User Profile (auto-creates it on first sign-in)
  const loadProfile = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setProfile(null);
      return;
    }
    try {
      setProfileLoading(true);
      let data = await fetchProfile(firebaseUser.uid);
      if (!data) {
        await createUserProfile(firebaseUser);
        data = await fetchProfile(firebaseUser.uid);
      }
      setProfile(data);
    } catch (error) {
      console.error("Profile loading error:", error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Refresh User Profile
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await loadProfile(user);
  }, [user, loadProfile]);

  // Handle Auth
  useEffect(() => {
    // Intentional: flag that auth has initialized on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setUser(firebaseUser);
      await loadProfile(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [loadProfile]);

  // Provider Data
  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      profileLoading,
      logout,
      refreshProfile,
      mounted,
    }),
    [user, profile, loading, profileLoading, refreshProfile, mounted],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
