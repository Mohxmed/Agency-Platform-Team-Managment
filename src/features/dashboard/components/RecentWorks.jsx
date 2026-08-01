"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Briefcase, ArrowLeft } from "lucide-react";
import { db } from "@/lib/firebase";

export default function RecentWorks() {
  const [works, setWorks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const worksQuery = query(
          collection(db, "works"),
          orderBy("createdAt", "desc"),
          limit(5),
        );
        const worksSnap = await getDocs(worksQuery);

        const catsQuery = query(collection(db, "categories"));
        const catsSnap = await getDocs(catsQuery);
        const catsMap = {};
        catsSnap.docs.forEach((d) => {
          catsMap[d.id] = d.data().name;
        });

        if (!cancelled) {
          setCategories(catsMap);
          setWorks(
            worksSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          );
        }
      } catch (err) {
        console.error("Failed loading recent works:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-[24px] border border-gray-200/80 bg-card" />
    );
  }

  return (
    <section
      dir="rtl"
      className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-gray-900">
              أحدث الأعمال
            </h2>
            <p className="mt-0.5 text-xs font-medium text-gray-400">
              آخر ما تم إضافته لمعرض الأعمال
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/portfolio"
          className="group flex items-center gap-1.5 text-xs font-bold text-red-600 transition-colors hover:text-red-700"
        >
          الكل
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>

      {works.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-10 text-center">
          <Briefcase className="h-6 w-6 text-gray-300" />
          <p className="text-sm font-bold text-gray-500">لا توجد أعمال بعد</p>
          <p className="text-[11px] text-gray-400">
            أضف أول عمل ليظهر هنا.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {works.map((work) => (
            <li key={work.id}>
              <Link
                href="/dashboard/portfolio"
                className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-3 transition-all duration-200 hover:border-red-100 hover:bg-red-50/40"
              >
                {work.image ? (
                  <img
                    src={work.image}
                    alt={work.title || ""}
                    className="h-12 w-16 shrink-0 rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-card text-gray-300 ring-1 ring-gray-100">
                    <Briefcase className="h-4 w-4" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-red-600">
                    {work.title || "بدون عنوان"}
                  </h3>
                  <p className="mt-0.5 truncate text-[11px] text-gray-400">
                    {categories[work.categoryId] || "غير مصنف"}
                    {work.year ? ` • ${work.year}` : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
