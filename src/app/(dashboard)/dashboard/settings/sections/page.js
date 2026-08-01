"use client";

import { useEffect } from "react";
import { LayoutTemplate, Save } from "lucide-react";
import Button from "@/features/dashboard/ui/Button";
import { SettingsCard, ToggleRow } from "@/features/dashboard/ui/SettingsCard";
import { useSettingsDashboard } from "@/hooks/useSettingsDashboard";

const defaults = {
  sections: { hero: true, clients: true, works: true, services: true, contact: true, social: true },
};

const sections = [
  { key: "hero", title: "الواجهة الرئيسية", description: "القسم الأول في الصفحة الرئيسية" },
  { key: "clients", title: "عملاؤنا المميزون", description: "عرض العملاء المميزين" },
  { key: "works", title: "أعمالنا", description: "عرض الأعمال والمشاريع" },
  { key: "services", title: "خدماتنا", description: "الخدمات المقدمة" },
  { key: "contact", title: "تواصل معنا", description: "قسم التواصل والاستمارة" },
  { key: "social", title: "السوشيال ميديا", description: "قسم متابعة المنصات" },
];

export default function SectionsSettingsPage() {
  const { settings, loading, saving, load, save, updateNested } = useSettingsDashboard(defaults);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 animate-pulse rounded-[24px] bg-ink/[0.035]" />;

  return (
    <SettingsCard icon={LayoutTemplate} title="أقسام الموقع" description="حدد الأقسام التي تريد ظهورها على الصفحة الرئيسية.">
      <div className="space-y-3">
        {sections.map((section) => (
          <ToggleRow
            key={section.key}
            title={section.title}
            description={section.description}
            checked={settings.sections[section.key] !== false}
            onChange={(value) => updateNested("sections", section.key, value)}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button icon={Save} loading={saving} onClick={() => save(settings)} className="rounded-xl">حفظ التغييرات</Button>
      </div>
    </SettingsCard>
  );
}
