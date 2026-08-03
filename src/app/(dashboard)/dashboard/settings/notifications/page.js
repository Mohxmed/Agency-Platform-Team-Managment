"use client";

import { useEffect } from "react";
import { Bell, Save } from "lucide-react";
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
