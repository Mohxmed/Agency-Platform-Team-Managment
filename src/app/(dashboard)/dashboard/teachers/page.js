"use client";

import { ProtectedRoute } from "@/features/auth";
import CrudTable from "@/features/dashboard/components/CrudTable";

export default function ClientsPage() {
  const fields = [
    // =====================================================
    // BASIC INFO
    // =====================================================

    {
      name: "name",
      label: "اسم العميل",
      required: true,
      placeholder: "مثال: شركة الشتري",
    },

    {
      name: "specialty",
      label: "التخصص",
      placeholder: "مثال : أستاذ الكيمياء",
    },
    {
      name: "link",
      label: "رابط الصفحة",
      placeholder: "هتكون/client-link",
    },

    // =====================================================
    // STATS
    // =====================================================

    {
      name: "stats",
      label: "إحصائيات العميل",
      type: "stats",
      placeholder: "مثال: متابعين",
      valuePlaceholder: "مثال: 510K",
    },

    // =====================================================
    // IMAGES
    // =====================================================

    {
      name: "logo",
      label: "صورة العميل / اللوجو",
      type: "image",
    },

    {
      name: "coverImage",
      label: "صورة الكوفر",
      type: "image",
    },

    // =====================================================
    // CONTACT
    // =====================================================

    {
      name: "email",
      label: "البريد الإلكتروني",
      type: "email",
      placeholder: "client@example.com",
    },

    {
      name: "phone",
      label: "رقم الهاتف",
      placeholder: "مثال: 01000000000",
    },

    {
      name: "website",
      label: "الموقع الإلكتروني",
      type: "url",
      placeholder: "https://example.com",
    },

    // =====================================================
    // DESCRIPTION
    // =====================================================

    {
      name: "description",
      label: "وصف العميل",
      type: "textarea",
      placeholder: "نبذة مختصرة عن العميل أو الشركة...",
    },

    // =====================================================
    // SOCIAL MEDIA
    // =====================================================

    {
      name: "facebook",
      label: "Facebook",
      type: "url",
      placeholder: "https://facebook.com/...",
    },

    {
      name: "instagram",
      label: "Instagram",
      type: "url",
      placeholder: "https://instagram.com/...",
    },

    {
      name: "linkedin",
      label: "LinkedIn",
      type: "url",
      placeholder: "https://linkedin.com/company/...",
    },

    {
      name: "youtube",
      label: "YouTube",
      type: "url",
      placeholder: "https://youtube.com/@...",
    },

    {
      name: "tiktok",
      label: "TikTok",
      type: "url",
      placeholder: "https://tiktok.com/@...",
    },
  ];

  // =====================================================
  // TABLE COLUMNS
  // =====================================================

  const columns = [
    {
      key: "name",
      label: "اسم العميل",
    },

    {
      key: "specialty",
      label: "الشركة",
    },

    {
      key: "email",
      label: "البريد الإلكتروني",
    },

    {
      key: "phone",
      label: "الهاتف",
    },
  ];

  return (
    <ProtectedRoute permission="clients">
      <CrudTable
        collectionName="clients"
        fields={fields}
        columns={columns}
        storagePath="clients"
        entityName="العميل"
        entityNamePlural="العملاء"
        titleField="name"
        emptyTitle="لا يوجد عملاء بعد"
        emptyDescription="أضف أول عميل إلى قائمة عملائك"
      />
    </ProtectedRoute>
  );
}
