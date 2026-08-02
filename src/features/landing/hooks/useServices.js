"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      try {
        const q = query(collection(db, "services"), limit(100));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const activeServices = data
          .filter(
            (service) =>
              service.active !== false && service.active !== "false",
          )
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        if (!cancelled) {
          setServices(activeServices);
        }
      } catch (err) {
        console.error("Failed loading services:", err);
        if (!cancelled) {
          setServices([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchServices();
    return () => { cancelled = true; };
  }, []);

  return { services, loading };
}
