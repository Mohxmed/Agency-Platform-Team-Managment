"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe2,
  Search,
  Share2,
  Settings2,
  LayoutTemplate,
  UserCog,
  MapPin,
  Users,
  BarChart3,
  LayoutDashboard,
  FileText,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { ProtectedRoute } from "@/features/auth";

const navGroups = [
  {
    items: [
      { href: "/dashboard/settings", label: "نظرة عامة", desc: "لوحة التحكم المركزية", icon: LayoutDashboard },
    ],
  },
  {
    title: "عام",
    items: [
      { href: "/dashboard/settings/general", label: "الهوية العامة", desc: "اسم وشعار ووصف الموقع", icon: Globe2 },
      { href: "/dashboard/settings/content", label: "المحتوى الثابت", desc: "نصوص أقسام الصفحة الرئيسية", icon: FileText },
      { href: "/dashboard/settings/sections", label: "الأقسام", desc: "إظهار وإخفاء أقسام الموقع", icon: LayoutTemplate },
    ],
  },
  {
    title: "التواصل",
    items: [
      { href: "/dashboard/settings/contact", label: "بيانات التواصل", desc: "بريد وهاتف وعنوان وخرائط", icon: MapPin },
      { href: "/dashboard/settings/social", label: "السوشيال ميديا", desc: "روابط منصات التواصل", icon: Share2 },
    ],
  },
  {
    title: "SEO والأداء",
    items: [
      { href: "/dashboard/settings/seo", label: "SEO", desc: "تحسين محركات البحث", icon: Search },
      { href: "/dashboard/settings/stats", label: "إحصائيات الرئيسية", desc: "أرقام الصفحة الرئيسية", icon: BarChart3 },
    ],
  },
  {
    title: "الحسابات",
    items: [
      { href: "/dashboard/settings/users", label: "المستخدمون", desc: "الحسابات والأدوار", icon: Users },
      { href: "/dashboard/settings/auth", label: "التسجيل والدخول", desc: "صلاحيات التسجيل", icon: UserCog },
    ],
  },
  {
    title: "النظام",
    items: [
      { href: "/dashboard/settings/notifications", label: "الإشعارات", desc: "أنواع التنبيهات", icon: Bell },
      { href: "/dashboard/settings/system", label: "النظام والأمان", desc: "صيانة ولغة وعملة", icon: ShieldCheck },
    ],
  },
];

export default function SettingsLayout({ children }) {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <ProtectedRoute permission="settings">
      <div dir="rtl" className="space-y-6 pb-10">
        <section className="relative overflow-hidden rounded-[28px] bg-card p-6 shadow-[0_15px_50px_rgba(0,0,0,0.035)] sm:p-8">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Settings2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-ink">إعدادات الموقع</h1>
                <p className="mt-1 text-sm text-ink/40">تحكم كامل في هوية ومحتوى وإعدادات الموقع.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <nav className="h-fit space-y-4 rounded-[24px] border border-ink/[0.07] bg-card p-2 shadow-none lg:sticky lg:top-6">
            {navGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-1">
                {group.title && (
                  <p className="px-3 pb-1 pt-2 text-[10px] font-black uppercase tracking-[0.14em] text-ink/25">
                    {group.title}
                  </p>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex w-full items-center gap-3 rounded-2xl p-3 text-right transition-all duration-200 ${
                        active ? "bg-primary/[0.07] text-primary" : "text-ink/50 hover:bg-ink/[0.035] hover:text-ink"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "bg-ink/[0.035] text-ink/40 group-hover:bg-ink/[0.06]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm font-bold ${active ? "text-primary" : "text-ink/70"}`}>
                          {item.label}
                        </span>
                        <span className="mt-0.5 block truncate text-[10px] text-ink/30">{item.desc}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
