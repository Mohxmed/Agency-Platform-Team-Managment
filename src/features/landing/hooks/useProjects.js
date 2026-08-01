"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit as firestoreLimit } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CACHE_KEY = "landing_projects_cache";
const PROJECTS_LIMIT = 6;

function getCached() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCached(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* noop */
  }
}

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      const cached = getCached();
      if (cached) {
        if (!cancelled) {
          setProjects(cached);
          setLoading(false);
        }
        return;
      }

      try {
        const q = query(
          collection(db, "works"),
          orderBy("createdAt", "desc"),
          firestoreLimit(PROJECTS_LIMIT)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCached(data);

        if (!cancelled) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed loading projects:", err);
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProjects();
    return () => { cancelled = true; };
  }, []);

  return { projects, loading, error };
}
