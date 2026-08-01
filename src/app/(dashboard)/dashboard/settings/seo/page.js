"use client";

import { useEffect } from "react";
import { Search, Save, ExternalLink, CheckCircle2 } from "lucide-react";
import Button from "@/features/dashboard/ui/Button";
import Input, { Textarea } from "@/features/dashboard/ui/Input";
import ImageUploadField from "@/features/dashboard/components/ImageUploadField";
import { SettingsCard } from "@/features/dashboard/ui/SettingsCard";
import { useSettingsDashboard } from "@/hooks/useSettingsDashboard";

const defaults = {
  seo: {
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "",
    canonicalUrl: "",
    googleVerification: "",
    robots: "",
  },
};

export default function SeoSettingsPage() {
  const { settings, loading, saving, load, save, updateNested } = useSettingsDashboard(defaults);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 animate-pulse rounded-[24px] bg-ink/[0.035]" />;

  const seo = settings.seo || defaults.seo;

  return (
    <SettingsCard icon={Search} title="تحسين محركات البحث (SEO)" description="إعدادات كاملة لظهور الموقع في Google ومحركات البحث ومواقع المشاركة.">
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Meta Title" value={seo.title} placeholder="Ammar Studio | Creative Digital Solutions" onChange={(e) => updateNested("seo", "title", e.target.value)} />
          <Input label="Keywords" value={seo.keywords} placeholder="web development, design, portfolio" onChange={(e) => updateNested("seo", "keywords", e.target.value)} />
        </div>

        <Textarea label="Meta Description" value={seo.description} rows={3} placeholder="وصف الموقع الذي سيظهر في نتائج البحث..." onChange={(e) => updateNested("seo", "description", e.target.value)} />

        <div className="rounded-2xl border border-ink/[0.07] bg-[#fafafa] p-4 dark:bg-surface">
          <h3 className="mb-4 text-sm font-black text-ink">روابط المشاركة (Open Graph)</h3>
          <div className="space-y-4">
            <Input label="OG Title" value={seo.ogTitle} placeholder="عنوان يظهر عند المشاركة" onChange={(e) => updateNested("seo", "ogTitle", e.target.value)} />
            <Textarea label="OG Description" value={seo.ogDescription} rows={2} placeholder="وصف يظهر عند المشاركة" onChange={(e) => updateNested("seo", "ogDescription", e.target.value)} />
            <ImageUploadField label="OG Image" value={seo.ogImage} storagePath="settings" multiple={false} onChange={(image) => updateNested("seo", "ogImage", image)} />
          </div>
        </div>

        <div className="rounded-2xl border border-ink/[0.07] bg-[#fafafa] p-4 dark:bg-surface">
          <h3 className="mb-4 text-sm font-black text-ink">إعدادات متقدمة</h3>
          <div className="space-y-4">
            <Input label="Twitter Card" value={seo.twitterCard} placeholder="summary_large_image" onChange={(e) => updateNested("seo", "twitterCard", e.target.value)} />
            <Input label="Canonical URL" value={seo.canonicalUrl} placeholder="https://yoursite.com/" onChange={(e) => updateNested("seo", "canonicalUrl", e.target.value)} />
            <Input label="Google Site Verification" value={seo.googleVerification} placeholder="Google verification code" onChange={(e) => updateNested("seo", "googleVerification", e.target.value)} />
            <Input label="Robots" value={seo.robots} placeholder="index, follow" onChange={(e) => updateNested("seo", "robots", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.04] p-4">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        <p className="text-xs leading-6 text-emerald-700/70">
          تُطبَّق هذه البيانات مباشرة على الموقع وعلى وسوم المشاركة. اترك الحقول فارغة لاستخدام القيم الافتراضية.
        </p>
      </div>

      <div className="mt-8 flex justify-end">
        <Button icon={Save} loading={saving} onClick={() => save(settings)} className="rounded-xl">حفظ التغييرات</Button>
      </div>
    </SettingsCard>
  );
}
