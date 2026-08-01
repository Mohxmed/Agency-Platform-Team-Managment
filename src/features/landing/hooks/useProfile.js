"use client";
import { useState, useEffect } from "react";
import { getDocumentByField } from "@/lib/firestoreService";

export function useProfile(username) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const data = await getDocumentByField("profiles", "link", username);

        if (!mounted) return;

        if (!data) {
          setProfile(null);
          setError("البروفايل غير موجود.");
          return;
        }

        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (mounted) {
          setError("حدث خطأ أثناء تحميل البروفايل.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => { mounted = false; };
  }, [username]);

  return { profile, loading, error };
}
