"use client";

import { ExternalLink } from "lucide-react";
import CrudTable from "@/features/dashboard/components/CrudTable";
import { ProtectedRoute } from "@/features/auth";

export default function PortfolioPage() {
  const fields = [
    {
      name: "title",
      label: "عنوان العمل",
      required: true,
      placeholder: "مثال: تصميم هوية بصرية لمؤسسة",
    },

    {
      name: "categoryId",
      label: "التصنيف",
      type: "collection-select",
      collection: "categories",
      optionValue: "id",
      optionLabel: "name",
      required: true,
      placeholder: "اختر التصنيف",
    },

    {
      name: "year",
      label: "سنة المشروع",
      required: true,
      placeholder: "2026",
      type: "number",
    },

    {
      name: "link",
      label: "رابط المشروع",
      placeholder: "الرابط اللي بيظهر في URL",
      type: "url",
    },

    {
      name: "description",
      label: "وصف العمل",
      type: "textarea",
      required: true,
      placeholder: "اكتب وصف عن المشروع...",
      rows: 5,
    },

    {
      name: "image",
      label: "الصورة الرئيسية",
      type: "image",
    },

    {
      name: "gallery",
      label: "صور إضافية للعمل",
      type: "images",
    },
  ];

  const columns = [
    {
      key: "image",
      label: "الصورة",
      render: (value) => {
        if (!value) {
          return <span className="text-ink/60">لا توجد صورة</span>;
        }

        return (
          <img
            src={value}
            alt=""
            className="
              h-12
              w-16
              rounded-lg
              border
              border-ink/[0.07]
              object-cover
            "
          />
        );
      },
    },

    {
      key: "title",
      label: "العنوان",
    },

    {
      key: "categoryId",
      label: "التصنيف",
      type: "relation",
      collection: "categories",
      optionValue: "id",
      optionLabel: "name",
    },

    {
      key: "year",
      label: "السنة",
    },

    {
      key: "link",
      label: "الرابط",
      render: (value) => {
        if (!value) {
          return <span className="text-ink/60">—</span>;
        }

        return (
          <a
            href={"/portfolio/" + value}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              gap-1
              rounded-lg
              px-2
              py-1
              text-primary
              transition
              hover:bg-primary/5
            "
          >
            فتح
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        );
      },
    },
  ];

  return (
    <ProtectedRoute permission="portfolio">
      <CrudTable
        collectionName="works"
        fields={fields}
        columns={columns}
        storagePath="works"
        emptyTitle="لا توجد أعمال بعد"
        emptyDescription="أضف أول مشروع ليظهر على الموقع."
        entityName="العمل"
        entityNamePlural="الأعمال"
        titleField="title"
      />
    </ProtectedRoute>
  );
}
