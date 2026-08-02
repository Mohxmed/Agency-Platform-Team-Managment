"use client";

import Link from "next/link";
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
  FileText,
  Bell,
  ShieldCheck,
  LayoutDashboard,
  ArrowUpLeft,
  Wrench,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const groups = [
  {
    title: "عام",
    items: [
      { href: "/dashboard/settings/general", label: "الهوية العامة", desc: "اسم الموقع، الوصف، الواتساب والحقوق.", icon: Globe2 },
      { href: "/dashboard/settings/content", label: "المحتوى الثابت", desc: "نصوص الأقسام: الواجهة، السوشيال، التواصل، الفوتر.", icon: FileText },
      { href: "/dashboard/settings/sections", label: "الأقسام", desc: "إظهار أو إخفاء أقسام الصفحة الرئيسية.", icon: LayoutTemplate },
    ],
  },
  {
    title: "التواصل",
    items: [
      { href: "/dashboard/settings/contact", label: "بيانات التواصل", desc: "البريد، الهاتف، العنوان، الخرائط والواتساب.", icon: MapPin },
      { href: "/dashboard/settings/social", label: "السوشيال ميديا", desc: "روابط فيسبوك، انستجرام، لينكدإن ويوتيوب وتيك توك.", icon: Share2 },
    ],
  },
  {
    title: "SEO والأداء",
    items: [
      { href: "/dashboard/settings/seo", label: "SEO", desc: "عنوان ووصف وكلمات مفتاحية وصور المشاركة.", icon: Search },
      { href: "/dashboard/settings/stats", label: "إحصائيات الرئيسية", desc: "أرقام الإنجازات المعروضة في الصفحة الرئيسية.", icon: BarChart3 },
    ],
  },
  {
    title: "الحسابات",
    items: [
      { href: "/dashboard/settings/users", label: "المستخدمون", desc: "إدارة الحسابات والأدوار والصلاحيات.", icon: Users },
      { href: "/dashboard/settings/auth", label: "التسجيل والدخول", desc: "السماح أو إيقاف إنشاء الحسابات الجديدة.", icon: UserCog },
    ],
  },
  {
    title: "النظام",
    items: [
      { href: "/dashboard/settings/notifications", label: "الإشعارات", desc: "أنواع الأحداث التي يتابعها نظام الإشعارات.", icon: Bell },
      { href: "/dashboard/settings/system", label: "النظام والأمان", desc: "وضع الصيانة، اللغة والعملة.", icon: ShieldCheck },
    ],
  },
];

export default function SettingsOverviewPage() {
  const { settings, loading } = useSettings();

  const maintenanceOn = settings?.system?.maintenanceMode;
  const registrationOn = settings?.auth?.allowRegistration;
  const hasSocial = Object.values(settings?.social || {}).some(Boolean);
  const hasContact = Boolean(
    settings?.contactSectionEmail || settings?.contactSectionPhone || settings?.contactSectionWhatsapp,
  );

  const statusCards = [
    {
      label: "وضع الصيانة",
      href: "/dashboard/settings/system",
      on: maintenanceOn,
      onText: "مفعّل — الموقع موقوف للزوار",
      offText: "الموقع يعمل بشكل طبيعي",
      icon: Wrench,
    },
    {
      label: "تسجيل الحسابات",
      href: "/dashboard/settings/auth",
      on: registrationOn,
      onText: "مفعل — الزوار يستطيعون التسجيل",
      offText: "موقوف — التسجيل غير متاح",
      icon: UserPlus,
    },
    {
      label: "السوشيال ميديا",
      href: "/dashboard/settings/social",
      on: hasSocial,
      onText: "تمت إضافة روابط المنصات",
      offText: "لم تتم إضافة روابط بعد",
      icon: Share2,
    },
    {
      label: "بيانات التواصل",
      href: "/dashboard/settings/contact",
      on: hasContact,
      onText: "اكتملت بيانات التواصل الأساسية",
      offText: "تنقص بعض بيانات التواصل",
      icon: MapPin,
    },
  ];

  return (
    <div dir="rtl" className="space-y-6">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-[28px] bg-card p-6 shadow-[0_15px_50px_rgba(0,0,0,0.035)] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl" />
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-ink">نظرة عامة</h1>
          <p className="mt-1 max-w-2xl text-sm leading-7 text-ink/45">
            من هنا تتحكم في كل إعدادات الموقع من مكان واحد: الهوية، المحتوى، التواصل، SEO، الحسابات والنظام.
          </p>
        </div>
      </section>

      {/* Status cards */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statusCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="group relative overflow-hidden rounded-[24px] border border-ink/[0.07] bg-card p-5 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      card.on ? "bg-emerald-500/10 text-emerald-600" : "bg-ink/[0.045] text-ink/50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${
                      card.on ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {card.on ? "مفعل" : "غير مفعل"}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-black text-ink">{card.label}</h3>
                <p className="mt-1 text-[11px] leading-5 text-ink/40">{card.on ? card.onText : card.offText}</p>
              </Link>
            );
          })}
        </div>
      )}

      {/* Groups */}
      {groups.map((group) => (
        <section key={group.title}>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-primary" />
            <h2 className="text-sm font-black text-ink/70">{group.title}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative overflow-hidden rounded-[24px] border border-ink/[0.07] bg-card p-5 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink/[0.045] text-ink/50 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-black text-ink">{item.label}</h3>
                      <p className="mt-1 text-[11px] leading-5 text-ink/40">{item.desc}</p>
                    </div>
                    <ArrowUpLeft className="h-4 w-4 shrink-0 text-ink/20 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex items-start gap-3 rounded-2xl border border-ink/[0.06] bg-ink/[0.02] p-4">
        <Settings2 className="mt-0.5 h-4 w-4 shrink-0 text-ink/30" />
        <p className="text-xs leading-6 text-ink/35">
          التغييرات تُحفظ مباشرة في قاعدة البيانات وتُطبَّق فورًا على الموقع. استخدم قسم النظام لإيقاف الموقع مؤقتًا أو
          إعادة تفعيل التسجيل.
        </p>
      </div>
    </div>
  );
}
