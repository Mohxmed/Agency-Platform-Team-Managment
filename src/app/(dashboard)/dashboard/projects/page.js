"use client";

import { FolderKanban } from "lucide-react";
import { ProtectedRoute } from "@/features/auth";
import CrudTable from "@/features/dashboard/components/CrudTable";

/* =========================================================
   PROJECTS PAGE
========================================================= */

export default function ProjectsPage() {
  /* =======================================================
     FORM FIELDS
  ======================================================= */

  const fields = [
    {
      name: "title",
      label: "اسم المشروع",
      type: "text",
      required: true,
      placeholder: "مثال: موقع أستاذ سعد الدين",
    },

    {
      name: "client",
      label: "العميل",
      type: "text",
      required: true,
      placeholder: "مثال: أستاذ سعد الدين",
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
      name: "status",
      label: "حالة المشروع",
      type: "select",
      defaultValue: "planning",
      options: [
        {
          value: "planning",
          label: "قيد التخطيط",
        },
        {
          value: "in-progress",
          label: "قيد التنفيذ",
        },
        {
          value: "completed",
          label: "مكتمل",
        },
      ],
    },

    {
      name: "description",
      label: "وصف المشروع",
      type: "textarea",
      placeholder: "اكتب وصفًا مختصرًا عن المشروع...",
    },

    {
      name: "coverImage",
      label: "صورة المشروع",
      type: "image",
    },
  ];

  /* =======================================================
     TABLE COLUMNS
  ======================================================= */

  const columns = [
    {
      key: "coverImage",
      label: "الصورة",
      type: "image",
    },

    {
      key: "title",
      label: "المشروع",
    },

    {
      key: "client",
      label: "العميل",
    },

    {
      key: "category",
      label: "التصنيف",
    },

    {
      key: "status",
      label: "الحالة",

      render: (value) => {
        const statusMap = {
          planning: {
            label: "قيد التخطيط",
            className: "bg-gray-100 text-gray-700",
          },

          "in-progress": {
            label: "قيد التنفيذ",
            className: "bg-yellow-100 text-yellow-700",
          },

          completed: {
            label: "مكتمل",
            className: "bg-green-100 text-green-700",
          },
        };

        const status = statusMap[value] || statusMap.planning;

        return (
          <span
            className={`
              inline-flex
              items-center
              rounded-full
              px-3
              py-1
              text-xs
              font-bold
              ${status.className}
            `}
          >
            {status.label}
          </span>
        );
      },
    },
  ];

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <ProtectedRoute permission="projects">
      <div dir="rtl" className="space-y-6">
        <CrudTable
          collectionName="projects"
          fields={fields}
          columns={columns}
          storagePath="projects"
          emptyTitle="مفيش مشاريع لسه"
          emptyDescription="ابدأ بإضافة أول مشروع للموقع."
          entityName="مشروع"
          entityNamePlural="المشاريع"
          icon={FolderKanban}
          titleField="title"
        />
      </div>
    </ProtectedRoute>
  );
}
