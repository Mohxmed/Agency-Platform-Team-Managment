"use client";

import { useEffect } from "react";
import { MapPin, Save } from "lucide-react";
import Button from "@/features/dashboard/ui/Button";
import Input from "@/features/dashboard/ui/Input";
import { SettingsCard } from "@/features/dashboard/ui/SettingsCard";
import { useSettingsDashboard } from "@/hooks/useSettingsDashboard";

const defaults = {
  contactSectionEmail: "",
  contactSectionPhone: "",
  contactSectionAddress: "",
  contactSectionMapLink: "",
  contactSectionWhatsapp: "",
};

export default function ContactSettingsPage() {
  const { settings, loading, saving, load, save, update } = useSettingsDashboard(defaults);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 animate-pulse rounded-[24px] bg-ink/[0.035]" />;

  return (
    <SettingsCard icon={MapPin} title="بيانات التواصل" description="البريد والهاتف والعنوان وروابط الخرائط.">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="البريد الإلكتروني" value={settings.contactSectionEmail} placeholder="hello@nokta.com" onChange={(e) => update("contactSectionEmail", e.target.value)} />
        <Input label="رقم الهاتف" value={settings.contactSectionPhone} placeholder="+201064571025" onChange={(e) => update("contactSectionPhone", e.target.value)} />
        <Input label="العنوان" value={settings.contactSectionAddress} placeholder="طلخا، المنصورة - مصر" onChange={(e) => update("contactSectionAddress", e.target.value)} />
        <Input label="رابط الخريطة" value={settings.contactSectionMapLink} placeholder="https://maps.google.com/..." onChange={(e) => update("contactSectionMapLink", e.target.value)} />
        <Input label="رقم WhatsApp" value={settings.contactSectionWhatsapp} placeholder="+201066855480" onChange={(e) => update("contactSectionWhatsapp", e.target.value)} />
      </div>

      <div className="mt-8 flex justify-end">
        <Button icon={Save} loading={saving} onClick={() => save(settings)} className="rounded-xl">حفظ التغييرات</Button>
      </div>
    </SettingsCard>
  );
}
