"use client";

import { useEffect } from "react";
import { ShieldCheck, Save, AlertTriangle } from "lucide-react";
import Button from "@/features/dashboard/ui/Button";
import Input from "@/features/dashboard/ui/Input";
import { Select } from "@/features/dashboard/ui/Input";
import { SettingsCard, ToggleRow } from "@/features/dashboard/ui/SettingsCard";
import { useSettingsDashboard } from "@/hooks/useSettingsDashboard";

const defaults = {
  system: { maintenanceMode: false, currency: "EGP", maintenanceTitle: "", maintenanceMessage: "" },
};

export default function SystemSettingsPage() {
  const { settings, loading, saving, load, save, updateNested } = useSettingsDashboard(defaults);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 animate-pulse rounded-[24px] bg-ink/[0.035]" />;

  return (
    <SettingsCard icon={ShieldCheck} title="النظام والأمان" description="إعدادات تشغيل الموقع: الصيانة والعملة.">
      <div className="space-y-3">
        <ToggleRow
          title="وضع الصيانة"
          description="إيقاف الموقع مؤقتًا وعرض صفحة الصيانة للزوار."
          checked={settings.system.maintenanceMode}
          onChange={(value) => updateNested("system", "maintenanceMode", value)}
          danger
        />
      </div>

      {settings.system.maintenanceMode && (
        <div className="mt-4 space-y-4 rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
          <Input
            label="عنوان صفحة الصيانة"
            value={settings.system.maintenanceTitle}
            placeholder="الموقع في الصيانة حاليًا"
            onChange={(e) => updateNested("system", "maintenanceTitle", e.target.value)}
          />
          <Input
            label="رسالة صفحة الصيانة"
            value={settings.system.maintenanceMessage}
            placeholder="نرجع قريبًا! جاري العمل على تحسين الموقع."
            onChange={(e) => updateNested("system", "maintenanceMessage", e.target.value)}
          />
        </div>
      )}

      <div className="mt-6">
        <Select label="العملة" value={settings.system.currency}
          options={[{ value: "EGP", label: "جنيه مصري (EGP)" }, { value: "USD", label: "دولار أمريكي (USD)" }, { value: "EUR", label: "يورو (EUR)" }]}
          onChange={(e) => updateNested("system", "currency", e.target.value)}
        />
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-xs leading-6 text-amber-700/70">
          تفعيل وضع الصيانة سيؤثر على الزوار في الموقع الرئيسي. المشرفون فقط يستطيعون تصفح الموقع أثناء الصيانة.
        </p>
      </div>

      <div className="mt-8 flex justify-end">
        <Button icon={Save} loading={saving} onClick={() => save(settings)} className="rounded-xl">حفظ التغييرات</Button>
      </div>
    </SettingsCard>
  );
}
