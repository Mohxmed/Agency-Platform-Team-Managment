"use client";

import { useEffect, useState } from "react";
import { BarChart3, Save, Plus, Trash2 } from "lucide-react";
import Button from "@/features/dashboard/ui/Button";
import Input from "@/features/dashboard/ui/Input";
import { SettingsCard } from "@/features/dashboard/ui/SettingsCard";
import { useSettingsDashboard } from "@/hooks/useSettingsDashboard";
import IconPicker from "@/features/dashboard/components/IconPicker";

const defaultStat = {
  value: "",
  label: "",
  icon: "Sparkles",
};

export default function StatsSettingsPage() {
  const { settings, loading, saving, load, save, update } = useSettingsDashboard({
    stats: [defaultStat],
  });

  useEffect(() => { load(); }, [load]);

  const stats = settings.stats || [defaultStat];

  const addStat = () => {
    update("stats", [...stats, defaultStat]);
  };

  const removeStat = (index) => {
    const next = stats.filter((_, i) => i !== index);
    update("stats", next);
  };

  const handleStatChange = (index, field, value) => {
    const next = stats.map((stat, i) =>
      i === index ? { ...stat, [field]: value } : stat
    );
    update("stats", next);
  };

  if (loading) return <div className="h-64 animate-pulse rounded-[24px] bg-ink/[0.035]" />;

  return (
    <SettingsCard icon={BarChart3} title="إحصائيات الصفحة الرئيسية" description="تحكم في أرقام وإحصائيات قسم الإنجازات في الصفحة الرئيسية.">
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="
              flex
              flex-col
              gap-4
              rounded-2xl
              border
              border-ink/10
              bg-card
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-ink">إحصائية #{index + 1}</h4>
              {stats.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Trash2}
                  onClick={() => removeStat(index)}
                  className="text-red-600 hover:bg-red-50 border-red-200"
                >
                  حذف
                </Button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="القيمة"
                value={stat.value}
                placeholder="مثال: 120+"
                onChange={(e) => handleStatChange(index, "value", e.target.value)}
              />
              <Input
                label="النص/التسمية"
                value={stat.label}
                placeholder="مثال: مشروع مكتمل"
                onChange={(e) => handleStatChange(index, "label", e.target.value)}
              />
              <div>
                <label className="mb-2 block text-sm font-bold text-ink">الأيقونة</label>
                <IconPicker
                  value={stat.icon}
                  onChange={(iconName) => handleStatChange(index, "icon", iconName)}
                />
              </div>
            </div>
          </div>
        ))}

        {stats.length < 6 && (
          <Button
            variant="outline"
            icon={Plus}
            onClick={addStat}
            className="w-full justify-center"
          >
            إضافة إحصائية
          </Button>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <Button icon={Save} loading={saving} onClick={() => save(settings)} className="rounded-xl">
          حفظ التغييرات
        </Button>
      </div>
    </SettingsCard>
  );
}