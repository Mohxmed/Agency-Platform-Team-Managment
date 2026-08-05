"use client";

import { BriefcaseBusiness, Eye, EyeOff, Star } from "lucide-react";

import { ProtectedRoute } from "@/features/auth";
import CrudTable from "@/features/dashboard/components/CrudTable";

export default function ServicesPage() {
  const fields = [
    {
      name: "title",
      label: "اسم الخدمة",
      type: "text",
      required: true,
      placeholder: "مثال: تصميم وتطوير المواقع",
    },

    {
      name: "shortDescription",
      label: "الوصف المختصر",
      type: "textarea",
      required: true,
      placeholder: "وصف مختصر يظهر في بطاقة الخدمة...",
      rows: 3,
    },

    {
      name: "description",
      label: "الوصف الكامل",
      type: "textarea",
      placeholder: "اكتب وصفًا تفصيليًا للخدمة...",
      rows: 5,
    },

    {
      name: "icon",
      label: "أيقونة الخدمة",
      type: "icon-picker",
      default: "Sparkles",
    },

    {
      name: "order",
      label: "الترتيب",
      type: "number",
      placeholder: "1",
      default: 1,
    },

    {
      name: "active",
      label: "الحالة",
      type: "select",
      required: true,
      default: "true",
      options: [
        {
          value: "true",
          label: "مفعلة - تظهر في الموقع",
        },
        {
          value: "false",
          label: "مخفية - لا تظهر في الموقع",
        },
      ],
    },

    {
      name: "featured",
      label: "عرض في الصفحة الرئيسية",
      type: "select",
      default: "false",
      options: [
        {
          value: "true",
          label: "نعم - تظهر في الصفحة الرئيسية",
        },
        {
          value: "false",
          label: "لا - لا تظهر في الصفحة الرئيسية",
        },
      ],
    },
  ];

  const columns = [
    {
      key: "title",
      label: "الخدمة",
    },

    {
      key: "shortDescription",
      label: "الوصف",
    },

    {
      key: "icon",
      label: "الأيقونة",
      type: "badge",
    },

    {
      key: "order",
      label: "الترتيب",
      render: (value) => (
        <span className="font-black text-ink">#{value || 0}</span>
      ),
    },

    {
      key: "active",
      label: "الحالة",
      render: (value) => {
        const isActive = value === true || value === "true";

        return (
          <span
            className={`
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              px-2.5
              py-1.5
              text-xs
              font-bold
              ${
                isActive
                  ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-gray-100 text-gray-500"
              }
            `}
          >
            {isActive ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                ظاهرة
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                مخفية
              </>
            )}
          </span>
        );
      },
    },

    {
      key: "featured",
      label: "رئيسية",
      render: (value) => {
        const isFeatured = value === true || value === "true";

        return (
          <span
            className={`
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              px-2.5
              py-1.5
              text-xs
              font-bold
              ${
                isFeatured
                  ? "bg-amber-50 text-amber-600"
                  : "bg-gray-100 text-gray-500"
              }
            `}
          >
            <Star className={`h-3.5 w-3.5 ${isFeatured ? "fill-amber-500" : ""}`} />
            {isFeatured ? "مميزة" : "عادية"}
          </span>
        );
      },
    },
  ];

  return (
    <ProtectedRoute permission="services">
      <CrudTable
        collectionName="services"
        fields={fields}
        columns={columns}
        entityName="الخدمة"
        entityNamePlural="الخدمات"
        titleField="title"
        icon={BriefcaseBusiness}
        storagePath="services"
        emptyTitle="لا توجد خدمات"
        emptyDescription="ابدأ بإضافة الخدمات التي تقدمها ليتم التحكم فيها وعرضها على الموقع."
        pageSize={10}
        stats={({ items, filteredItems, search }) => {
        const activeServices = items.filter(
          (item) => item.active === true || item.active === "true",
        );

        return [
          {
            label: "إجمالي الخدمات",
            value: items.length,
            description: "إجمالي الخدمات الموجودة في النظام.",
            icon: BriefcaseBusiness,
            footer: "All Services",
          },

          {
            label: "الخدمات الظاهرة",
            value: activeServices.length,
            description: "الخدمات التي تظهر حاليًا على الموقع.",
            icon: Eye,
            footer: "Published",
          },

          {
            label: "نتائج البحث",
            value: filteredItems.length,
            description: search
              ? "عدد الخدمات المطابقة للبحث."
              : "يتم عرض جميع الخدمات.",
            icon: BriefcaseBusiness,
            footer: search ? "Current Query" : "All Records",
          },
        ];
      }}
    />
  </ProtectedRoute>
  );
}
