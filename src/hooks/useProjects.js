"use client";

import { useEffect, useState } from "react";
import { subscribeToCollection } from "@/lib/firestoreService";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToCollection(
      "works",
      (data) => {
        setProjects(data);
        setLoading(false);
      },
      "createdAt",
    );

    return () => unsubscribe?.();
  }, []);

  return {
    projects,
    loading,
    error,
  };
}
