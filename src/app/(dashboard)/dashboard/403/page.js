"use client";

import Link from "next/link";
import { ShieldX, ArrowLeft, Lock } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div dir="rtl" className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-red-50">
          <Lock className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-gray-900">403</h1>
        <p className="mt-2 text-lg font-bold text-gray-600">ليس لديك صلاحية</p>
        <p className="mt-1 text-sm text-gray-500">
          لا تملك الصلاحية المطلوبة للوصول إلى هذه الصفحة.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة للوحة التحكم
        </Link>
      </div>
    </div>
  );
}
