"use client";

import { useEffect } from "react";
import { Bell, Clock, Save } from "lucide-react";
import Button from "@/features/dashboard/ui/Button";
import { SettingsCard, ToggleRow } from "@/features/dashboard/ui/SettingsCard";
import { useSettingsDashboard } from "@/hooks/useSettingsDashboard";

const defaults = {
  notifications: { projectStatus: true, teamUpdates: true, deadlines: true, newProjects: true, tasks: true },
};

const notificationItems = [
  { key: "projectStatus", title: "حالة المشاريع", description: "عند تغيير حالة مشروع أو عمل." },
  { key: "teamUpdates", title: "تحديثات الفريق", description: "عند إضافة أو تعديل أعضاء الفريق." },
  { key: "deadlines", title: "مواعيد التسليم", description: "تنبيهات مواعيد تسليم الأعمال." },
  { key: "newProjects", title: "المشاريع الجديدة", description: "إشعار عند إضافة مشروع جديد." },
  { key: "tasks", title: "المهام", description: "تنبيهات المهام والتحديثات الخاصة بها." },
];

export default function NotificationsSettingsPage() {
  const { settings, loading, saving, load, save, updateNested } = useSettingsDashboard(defaults);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="h-64 animate-pulse rounded-[24px] bg-ink/[0.035]" />;

  return (
    <SettingsCard icon={Bell} title="الإشعارات" description="أنواع الأحداث التي يتابعها نظام الإشعارات داخل اللوحة.">
      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <div>
          <p className="text-xs font-bold text-blue-700/80">قريبًا</p>
          <p className="mt-1 text-xs leading-6 text-blue-700/60">
            نظام الإشعارات الكامل قيد التطوير. يمكنك الآن ضبط أنواع الأحداث التي سيتم متابعتها لاحقًا.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notificationItems.map((item) => (
          <ToggleRow
            key={item.key}
            title={item.title}
            description={item.description}
            checked={settings.notifications[item.key]}
            onChange={(value) => updateNested("notifications", item.key, value)}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button icon={Save} loading={saving} onClick={() => save(settings)} className="rounded-xl">حفظ التغييرات</Button>
      </div>
    </SettingsCard>
  );
}
