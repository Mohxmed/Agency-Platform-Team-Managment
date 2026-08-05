"use client";

import { useEffect } from "react";
import { Share2, Save } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaTiktok, FaXTwitter } from "react-icons/fa6";
import Button from "@/features/dashboard/ui/Button";
import Input from "@/features/dashboard/ui/Input";
import { SettingsCard } from "@/features/dashboard/ui/SettingsCard";
import { useSettingsDashboard } from "@/hooks/useSettingsDashboard";

const defaults = {
  social: { facebook: "", instagram: "", linkedin: "", youtube: "", tiktok: "", twitter: "" },
};

const socialFields = [
  { key: "facebook", label: "Facebook", icon: FaFacebook, placeholder: "https://facebook.com/..." },
  { key: "instagram", label: "Instagram", icon: FaInstagram, placeholder: "https://instagram.com/..." },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedin, placeholder: "https://linkedin.com/in/..." },
  { key: "youtube", label: "YouTube", icon: FaYoutube, placeholder: "https://youtube.com/..." },
  { key: "tiktok", label: "TikTok", icon: FaTiktok, placeholder: "https://tiktok.com/@..." },
  { key: "twitter", label: "X (Twitter)", icon: FaXTwitter, placeholder: "https://x.com/..." },
];

export default function SocialSettingsPage() {
  const { settings, loading, saving, load, save, updateNested } = useSettingsDashboard(defaults);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 animate-pulse rounded-[24px] bg-ink/[0.035]" />;

  return (
    <SettingsCard icon={Share2} title="التواصل الاجتماعي" description="أضف روابط حساباتك على منصات التواصل المختلفة.">
      <div className="space-y-4">
        {socialFields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="rounded-2xl border border-ink/[0.07] bg-surface p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-ink/60 shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <Input label={field.label} value={settings.social[field.key]} placeholder={field.placeholder}
                    onChange={(e) => updateNested("social", field.key, e.target.value)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button icon={Save} loading={saving} onClick={() => save(settings)} className="rounded-xl">حفظ التغييرات</Button>
      </div>
    </SettingsCard>
  );
}
