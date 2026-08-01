"use client";

import { useEffect } from "react";
import { FileText, Save, Sparkles, Share2, Mail, ChevronDown } from "lucide-react";
import Button from "@/features/dashboard/ui/Button";
import Input, { Textarea } from "@/features/dashboard/ui/Input";
import { SettingsCard } from "@/features/dashboard/ui/SettingsCard";
import { useSettingsDashboard } from "@/hooks/useSettingsDashboard";

const defaults = {
  content: {
    hero: { badge: "", ctaPrimary: "", ctaSecondary: "" },
    social: { title: "", redTitle: "", description: "" },
    contact: { badgeTitle: "", heading: "", headingHighlight: "" },
    footer: { description: "" },
  },
};

const groups = [
  {
    key: "hero",
    title: "الواجهة الرئيسية",
    description: "نصوص قسم الواجهة والزرّين الرئيسيين.",
    icon: Sparkles,
    fields: [
      { key: "badge", label: "نص الشارة العلوية", type: "text" },
      { key: "ctaPrimary", label: "الزر الرئيسي (تواصل)", type: "text" },
      { key: "ctaSecondary", label: "الزر الثانوي (أعمالنا)", type: "text" },
    ],
  },
  {
    key: "social",
    title: "قسم السوشيال ميديا",
    description: "العنوان والنصوص الظاهرة في قسم تابعنا.",
    icon: Share2,
    fields: [
      { key: "title", label: "العنوان العلوي", type: "text" },
      { key: "redTitle", label: "العنوان الرئيسي", type: "text" },
      { key: "description", label: "الوصف", type: "textarea" },
    ],
  },
  {
    key: "contact",
    title: "قسم التواصل",
    description: "نصوص قسم تواصل معنا والاستمارة.",
    icon: Mail,
    fields: [
      { key: "badgeTitle", label: "نص الشارة", type: "text" },
      { key: "heading", label: "العنوان الرئيسي", type: "text" },
      { key: "headingHighlight", label: "العنوان المميز", type: "text" },
    ],
  },
  {
    key: "footer",
    title: "الفوتر",
    description: "الوصف المعروض في أسفل الموقع.",
    icon: ChevronDown,
    fields: [{ key: "description", label: "وصف الفوتر", type: "textarea" }],
  },
];

export default function ContentSettingsPage() {
  const { settings, loading, saving, load, save, updatePath } = useSettingsDashboard(defaults);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 animate-pulse rounded-[24px] bg-ink/[0.035]" />;

  const content = settings.content || defaults.content;

  return (
    <SettingsCard icon={FileText} title="المحتوى الثابت" description="نصوص الأقسام شبه الثابتة في الصفحة الرئيسية — عدّلها من هنا.">
      <div className="space-y-6">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.key} className="rounded-2xl border border-ink/[0.07] bg-[#fafafa] p-4 dark:bg-surface">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink/[0.045] text-ink/50">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-ink">{group.title}</h3>
                  <p className="mt-0.5 text-[11px] text-ink/40">{group.description}</p>
                </div>
              </div>
              <div className="space-y-4">
                {group.fields.map((field) => {
                  const value = content[group.key]?.[field.key] || "";
                  const props = {
                    label: field.label,
                    value,
                    placeholder: "",
                    onChange: (e) => updatePath(`content.${group.key}.${field.key}`, e.target.value),
                  };
                  if (field.type === "textarea") {
                    return <Textarea key={field.key} {...props} rows={3} />;
                  }
                  return <Input key={field.key} {...props} />;
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-xs leading-6 text-amber-700/70">
          اترك أي حقل فارغًا لاستخدام النص الافتراضي المدمج في الموقع.
        </p>
      </div>

      <div className="mt-8 flex justify-end">
        <Button icon={Save} loading={saving} onClick={() => save(settings)} className="rounded-xl">حفظ التغييرات</Button>
      </div>
    </SettingsCard>
  );
}
