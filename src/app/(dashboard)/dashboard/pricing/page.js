"use client";

import { Wallet } from "lucide-react";

import { ProtectedRoute } from "@/features/auth";
import CrudTable from "@/features/dashboard/components/CrudTable";

const fields = [
  {
    name: "name",
    label: "اسم الباقة",
    type: "text",
    required: true,
    placeholder: "مثال: البداية",
  },
  {
    name: "description",
    label: "الوصف",
    type: "textarea",
    required: true,
    placeholder: "وصف مختصر للباقة...",
    rows: 3,
  },
  {
    name: "icon",
    label: "الأيقونة",
    type: "icon-picker",
    default: "Sparkles",
  },
  {
    name: "popular",
    label: "الأكثر طلبًا",
    type: "select",
    required: true,
    default: "false",
    options: [
      { value: "false", label: "عادية" },
      { value: "true", label: "الأكثر طلبًا" },
    ],
  },
  {
    name: "features",
    label: "المميزات (كل ميزة في سطر)",
    type: "textarea",
    required: true,
    placeholder: "تصميم هوية بصرية أساسية\n8 تصاميم سوشيال ميديا\nكتابة المحتوى الأساسي",
    rows: 6,
  },
  {
    name: "sortOrder",
    label: "الترتيب",
    type: "number",
    placeholder: "0",
    default: 0,
  },
];

const columns = [
  { key: "name", label: "الباقة" },
  { key: "description", label: "الوصف" },
  {
    key: "popular",
    label: "الحالة",
    render: (value) => {
      const isPopular = value === true || value === "true";
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${isPopular ? "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400" : "bg-gray-100 text-gray-500"}`}
        >
          {isPopular ? "الأكثر طلبًا" : "عادية"}
        </span>
      );
    },
  },
  {
    key: "sortOrder",
    label: "الترتيب",
    render: (value) => (
      <span className="font-black text-ink">#{value || 0}</span>
    ),
  },
];

export default function PricingPage() {
  return (
    <ProtectedRoute permission="settings">
      <CrudTable
        collectionName="pricing"
        fields={fields}
        columns={columns}
        entityName="الباقة"
        entityNamePlural="الباقات"
        titleField="name"
        icon={Wallet}
        storagePath="pricing"
        emptyTitle="لا توجد باقات"
        emptyDescription="أضف أول باقة أسعار لتظهر في صفحة الباقات."
        pageSize={10}
      />
    </ProtectedRoute>
  );
}
