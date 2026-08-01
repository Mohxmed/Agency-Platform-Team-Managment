"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CACHE_KEY = "landing_pricing_cache";

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

export function usePricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchPlans() {
      const cached = getCached();
      if (cached) {
        if (!cancelled) {
          setPlans(cached);
          setLoading(false);
        }
        return;
      }

      try {
        const q = query(collection(db, "pricing"), orderBy("sortOrder", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCached(data);

        if (!cancelled) {
          setPlans(data);
        }
      } catch (err) {
        console.error("Failed loading pricing:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPlans();
    return () => { cancelled = true; };
  }, []);

  return { plans, loading };
}
