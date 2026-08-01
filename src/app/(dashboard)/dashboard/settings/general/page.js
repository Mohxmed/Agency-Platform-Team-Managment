"use client";

import { useEffect } from "react";
import { Globe2, Save, CheckCircle2 } from "lucide-react";
import Button from "@/features/dashboard/ui/Button";
import Input, { Textarea } from "@/features/dashboard/ui/Input";
import { SettingsCard } from "@/features/dashboard/ui/SettingsCard";
import { useSettingsDashboard } from "@/hooks/useSettingsDashboard";

const defaults = {
  siteName: "",
  tagline: "",
  description: "",
  whatsapp: "",
  copyright: "",
};

export default function GeneralSettingsPage() {
  const { settings, loading, saving, load, save, update } = useSettingsDashboard(defaults);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 animate-pulse rounded-[24px] bg-ink/[0.035]" />;

  return (
    <SettingsCard icon={Globe2} title="الهوية العامة" description="الاسم والوصف وبيانات التواصل الأساسية للعلامة التجارية.">
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="اسم الموقع" value={settings.siteName} placeholder="نقطة" onChange={(e) => update("siteName", e.target.value)} />
          <Input label="الشعار/السطر الوصفي" value={settings.tagline} placeholder="نقطة ومن أول السطر، شغلك محتاج إبداع." onChange={(e) => update("tagline", e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <Textarea label="وصف الموقع" value={settings.description} rows={3} placeholder="وصف قصير يظهر في الواجهة والمحركات..." onChange={(e) => update("description", e.target.value)} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="رقم WhatsApp" value={settings.whatsapp} placeholder="+20 100 000 0000" onChange={(e) => update("whatsapp", e.target.value)} />
          <Input label="نص الحقوق (Copyright)" value={settings.copyright} placeholder="© {year} No2ta. جميع الحقوق محفوظة." onChange={(e) => update("copyright", e.target.value)} />
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.04] p-4">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        <p className="text-xs leading-6 text-emerald-700/70">اسم الموقع ووصفه يظهران في الواجهة وروابط المشاركة والبحث.</p>
      </div>

      <div className="mt-8 flex justify-end">
        <Button icon={Save} loading={saving} onClick={() => save(settings)} className="rounded-xl">حفظ التغييرات</Button>
      </div>
    </SettingsCard>
  );
}
