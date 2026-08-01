"use client";

import { useEffect } from "react";
import { UserCog, Save, AlertTriangle } from "lucide-react";
import Button from "@/features/dashboard/ui/Button";
import { SettingsCard, ToggleRow } from "@/features/dashboard/ui/SettingsCard";
import { useSettingsDashboard } from "@/hooks/useSettingsDashboard";

const defaults = {
  auth: { allowRegistration: true },
};

export default function AuthSettingsPage() {
  const { settings, loading, saving, load, save, updateNested } = useSettingsDashboard(defaults);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 animate-pulse rounded-[24px] bg-ink/[0.035]" />;

  return (
    <SettingsCard icon={UserCog} title="التسجيل والدخول" description="التحكم في إعدادات الدخول والتسجيل في الموقع.">
      <div className="space-y-3">
        <ToggleRow
          title="السماح بالتسجيل"
          description="السماح للزوار بإنشاء حسابات جديدة في الموقع."
          checked={settings.auth.allowRegistration}
          onChange={(value) => updateNested("auth", "allowRegistration", value)}
        />
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-xs leading-6 text-amber-700/70">إيقاف التسجيل يمنع الزوار من إنشاء حسابات جديدة. المستخدمين الحاليين سيظل بإمكانهم تسجيل الدخول.</p>
      </div>

      <div className="mt-8 flex justify-end">
        <Button icon={Save} loading={saving} onClick={() => save(settings)} className="rounded-xl">حفظ التغييرات</Button>
      </div>
    </SettingsCard>
  );
}
