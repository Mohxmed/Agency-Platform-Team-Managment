"use client";
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  createContext,
} from "react";
import { fetchProfile } from "../services/profile.service";
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

  // Load User Profile
  const loadProfile = useCallback(async (uid) => {
    if (!uid) {
      setProfile(null);
      return;
    }
    try {
      setProfileLoading(true);
      const data = await fetchProfile(uid);
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
    await loadProfile(user.uid);
  }, [user, loadProfile]);

  // Handle Auth
  useEffect(() => {
    setMounted(true);
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setUser(firebaseUser);
      await loadProfile(firebaseUser.uid);
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
