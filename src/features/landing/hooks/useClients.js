"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CACHE_KEY = "landing_clients_cache";

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

function getTimestampValue(timestamp) {
  if (!timestamp) return 0;
  if (typeof timestamp?.toMillis === "function") return timestamp.toMillis();
  if (timestamp instanceof Date) return timestamp.getTime();
  if (typeof timestamp === "object" && typeof timestamp.seconds === "number") {
    return timestamp.seconds * 1000 + Math.floor((timestamp.nanoseconds || 0) / 1000000);
  }
  const value = new Date(timestamp).getTime();
  return Number.isNaN(value) ? 0 : value;
}

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchClients() {
      const cached = getCached();
      if (cached) {
        if (!cancelled) {
          setClients(cached);
          setLoading(false);
        }
        return;
      }

      try {
        const q = query(
          collection(db, "clients"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sorted = [...data].sort((a, b) => {
          const dateA = getTimestampValue(a?.createdAt);
          const dateB = getTimestampValue(b?.createdAt);
          return dateB - dateA;
        });

        setCached(sorted);

        if (!cancelled) {
          setClients(sorted);
        }
      } catch (err) {
        console.error("Failed loading clients:", err);
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchClients();
    return () => { cancelled = true; };
  }, []);

  return { clients, loading, error };
}
