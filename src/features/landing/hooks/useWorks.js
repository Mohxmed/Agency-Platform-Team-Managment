"use client";
import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CACHE_KEY = "landing_works_cache";
const CACHE_KEY_CATEGORIES = "landing_categories_cache";

function getCached(key) {
  try {
    const cached = sessionStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch { return null; }
}

function setCached(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch { /* noop */ }
}

export function useWorks() {
  const [works, setWorks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      const cachedWorks = getCached(CACHE_KEY);
      const cachedCategories = getCached(CACHE_KEY_CATEGORIES);

      if (cachedWorks && cachedCategories) {
        if (!cancelled) {
          setWorks(cachedWorks);
          setCategories(cachedCategories);
          setLoading(false);
        }
        return;
      }

      try {
        let worksData = null;
        let categoriesData = null;

        if (!cachedWorks) {
          const q = query(collection(db, "works"), orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);
          worksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }

        if (!cachedCategories) {
          const qCat = query(collection(db, "categories"), orderBy("createdAt", "desc"));
          const snapshotCat = await getDocs(qCat);
          categoriesData = snapshotCat.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }

        const finalWorks = worksData || cachedWorks;
        const finalCategories = categoriesData || cachedCategories;

        if (!cancelled) {
          if (worksData) setCached(CACHE_KEY, worksData);
          if (categoriesData) setCached(CACHE_KEY_CATEGORIES, categoriesData);
          setWorks(finalWorks || []);
          setCategories(finalCategories || []);
        }
      } catch (err) {
        console.error("Failed to load works/categories:", err);
        if (!cancelled) {
          setWorks(cachedWorks || []);
          setCategories(cachedCategories || []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const worksWithCategory = useMemo(() => {
    const categoryMap = Object.fromEntries(
      categories.map((cat) => [cat.id, cat])
    );

    return works.map((work) => ({
      ...work,
      categoryName: categoryMap[work.categoryId]?.name || "",
      category: categoryMap[work.categoryId]?.name || "",
      image: work.image || work.coverImage || work.gallery?.[0] || "",
      gallery: Array.isArray(work.gallery) ? work.gallery : [],
      stats: Array.isArray(work.stats) ? work.stats : [],
      year: work.year || "",
      link: work.link || work.id,
    }));
  }, [works, categories]);

  const categoryMap = useMemo(() => {
    return Object.fromEntries(categories.map((cat) => [cat.id, cat]));
  }, [categories]);

  return { works: worksWithCategory, categories, categoryMap, loading };
}
