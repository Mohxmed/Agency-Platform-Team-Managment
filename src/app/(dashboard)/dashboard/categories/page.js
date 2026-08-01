"use client";

import { Layers3 } from "lucide-react";

import { ProtectedRoute } from "@/features/auth";
import CrudTable from "@/features/dashboard/components/CrudTable";

const fields = [
  {
    name: "name",
    label: "اسم التصنيف",
    type: "text",
    required: true,
    placeholder: "مثال: Web Development",
  },

  {
    name: "description",
    label: "وصف التصنيف",
    type: "textarea",
    placeholder: "وصف مختصر للتصنيف...",
    rows: 3,
  },
];

const columns = [
  {
    key: "name",
    label: "التصنيف",
  },

  {
    key: "description",
    label: "الوصف",
  },
];

export default function CategoriesPage() {
  return (
    <ProtectedRoute permission="categories">
      <CrudTable
        collectionName="categories"
        entityName="التصنيف"
        entityNamePlural="التصنيفات"
        titleField="name"
        icon={Layers3}
        fields={fields}
        columns={columns}
        emptyTitle="لا توجد تصنيفات"
        emptyDescription="ابدأ بإضافة أول تصنيف لمشاريعك."
        storagePath="categories"
        createEvent="open-create-category"
      />
    </ProtectedRoute>
  );
}
