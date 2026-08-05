"use client";
import { useState, useEffect } from "react";
import { getDocumentByField } from "@/lib/firestoreService";
import { getOptimizedUrl } from "@/lib/cloudinaryService";

export function useClientByLink(link) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(Boolean(link));

  useEffect(() => {
    if (!link) return;

    let mounted = true;

    async function loadClient() {
      try {
        setLoading(true);

        const data = await getDocumentByField("clients", "link", link);

        if (!mounted) return;

        if (data) {
          setClient({
            ...data,
            image: getOptimizedUrl(data.image || data.coverImage || ""),
            coverImage: getOptimizedUrl(data.coverImage || data.image || ""),
            logo: getOptimizedUrl(data.logo || ""),
          });
        } else {
          setClient(null);
        }
      } catch (error) {
        console.error("Failed to load client:", error);
        if (mounted) setClient(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadClient();
    return () => { mounted = false; };
  }, [link]);

  return { client, loading };
}
