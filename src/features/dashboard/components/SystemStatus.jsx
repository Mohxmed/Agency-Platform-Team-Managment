"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  UserX,
  Eye,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import { getDocumentById } from "@/lib/firestoreService";

export default function SystemStatus() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getDocumentById("settings", "site")
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="h-28 animate-pulse rounded-[24px] border border-gray-200/80 bg-card" />
    );
  }

  const maintenance = settings?.system?.maintenanceMode === true;
  const registrationOff = settings?.auth?.allowRegistration === false;
  const hasWarnings = maintenance || registrationOff;

  return (
    <section
      dir="rtl"
      className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Wrench className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight text-gray-900">
            حالة الموقع
          </h2>
          <p className="mt-0.5 text-xs font-medium text-gray-400">
            ملخص سريع لوضع الموقع الحالي
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {maintenance && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200/70 bg-red-50/60 p-3.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div>
              <p className="text-xs font-black text-red-700">
                وضع الصيانة مفعّل
              </p>
              <p className="mt-0.5 text-[11px] leading-5 text-red-600/70">
                الزوار مش هيشوفوا الموقع حاليًا.
              </p>
            </div>
          </div>
        )}

        {registrationOff && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-3.5">
            <UserX className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <p className="text-xs font-black text-amber-700">
                التسجيل الجديد موقوف
              </p>
              <p className="mt-0.5 text-[11px] leading-5 text-amber-600/70">
                الزوار مش قادرين ينشئوا حسابات جديدة.
              </p>
            </div>
          </div>
        )}

        {!hasWarnings && (
          <div className="flex items-start gap-3 rounded-2xl border border-green-200/70 bg-green-50/60 p-3.5 dark:border-green-500/20 dark:bg-green-500/10">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
            <div>
              <p className="text-xs font-black text-green-700">
                الموقع يعمل بشكل طبيعي
              </p>
              <p className="mt-0.5 text-[11px] leading-5 text-green-600/70">
                مفيش مشاكل في الإعدادات الحالية.
              </p>
            </div>
          </div>
        )}

        <Link
          href="/dashboard/settings/system"
          className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-gray-50/60 py-2.5 text-xs font-bold text-gray-500 transition-colors hover:border-blue-100 hover:bg-blue-50/40 hover:text-blue-600"
        >
          <Wrench className="h-3.5 w-3.5" />
          إعدادات النظام
        </Link>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-gray-50/60 py-2.5 text-xs font-bold text-gray-500 transition-colors hover:border-blue-100 hover:bg-blue-50/40 hover:text-blue-600"
        >
          <Eye className="h-3.5 w-3.5" />
          معاينة الموقع
        </Link>
      </div>
    </section>
  );
}
