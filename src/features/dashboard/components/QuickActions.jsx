"use client";

import { useRouter } from "next/navigation";
import {
  FolderPlus,
  UserPlus,
  Layers,
  PackagePlus,
  Users,
  FolderKanban,
  ClipboardList,
  UsersRound,
  ListTodo,
  BarChart3,
  Sparkles,
  ArrowUpLeft,
  Zap,
  UserRound,
} from "lucide-react";

import { motion } from "framer-motion";

import { useAuth } from "@/features/auth";
import { getPermissionsForProfile } from "@/constants/permissions";

const TONES = {
  red: {
    icon: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
    glow: "bg-red-500/[0.07]",
    hoverIcon: "group-hover:bg-red-500 group-hover:text-white dark:group-hover:bg-red-500",
    hoverGlow: "group-hover:shadow-[0_14px_30px_-10px_rgba(239,68,68,0.35)]",
    hoverBorder: "group-hover:border-red-200 dark:group-hover:border-red-500/30",
    hoverText: "group-hover:text-red-600 dark:group-hover:text-red-400",
  },
  violet: {
    icon: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    glow: "bg-violet-500/[0.07]",
    hoverIcon: "group-hover:bg-violet-500 group-hover:text-white dark:group-hover:bg-violet-500",
    hoverGlow: "group-hover:shadow-[0_14px_30px_-10px_rgba(139,92,246,0.35)]",
    hoverBorder: "group-hover:border-violet-200 dark:group-hover:border-violet-500/30",
    hoverText: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    glow: "bg-blue-500/[0.07]",
    hoverIcon: "group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-500",
    hoverGlow: "group-hover:shadow-[0_14px_30px_-10px_rgba(59,130,246,0.35)]",
    hoverBorder: "group-hover:border-blue-200 dark:group-hover:border-blue-500/30",
    hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    glow: "bg-amber-500/[0.07]",
    hoverIcon: "group-hover:bg-amber-500 group-hover:text-white dark:group-hover:bg-amber-500",
    hoverGlow: "group-hover:shadow-[0_14px_30px_-10px_rgba(245,158,11,0.35)]",
    hoverBorder: "group-hover:border-amber-200 dark:group-hover:border-amber-500/30",
    hoverText: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    glow: "bg-emerald-500/[0.07]",
    hoverIcon: "group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:bg-emerald-500",
    hoverGlow: "group-hover:shadow-[0_14px_30px_-10px_rgba(16,185,129,0.35)]",
    hoverBorder: "group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30",
    hoverText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
  },
};

const GROUPS = [
  {
    id: "team",
    label: "الفريق والمهمات",
    description: "مهامك ولوحات الفريق",
    icon: ClipboardList,
    chip: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
    items: [
      {
        id: "my-tasks",
        title: "مهماتي",
        description: "لوحة كانبان لمهامك الخاصة",
        icon: ClipboardList,
        tone: "red",
        href: "/dashboard/team/my-tasks",
        permission: "my-tasks",
      },
      {
        id: "team",
        title: "لوحة الفريق",
        description: "نظرة عامة على نشاط الفريق",
        icon: UsersRound,
        tone: "violet",
        href: "/dashboard/team",
        permission: "team",
      },
      {
        id: "members",
        title: "الأعضاء",
        description: "إدارة أعضاء الفريق وملفاتهم",
        icon: Users,
        tone: "blue",
        href: "/dashboard/team/members",
        permission: "team",
      },
      {
        id: "projects",
        title: "المشاريع",
        description: "مشاريع الفريق ومتابعتها",
        icon: FolderKanban,
        tone: "emerald",
        href: "/dashboard/team/projects",
        permission: "team",
      },
      {
        id: "all-tasks",
        title: "كل المهام",
        description: "تتبع جميع مهام الفريق",
        icon: ListTodo,
        tone: "amber",
        href: "/dashboard/team/all-tasks",
        permission: "team",
      },
      {
        id: "progress",
        title: "لوحة التقدم",
        description: "تقدم المهام والأعضاء",
        icon: BarChart3,
        tone: "blue",
        href: "/dashboard/team/progress",
        permission: "progress",
      },
      {
        id: "single-tasks",
        title: "المهمات الفردية",
        description: "مهمات لا تتبع مشروعًا",
        icon: Layers,
        tone: "violet",
        href: "/dashboard/team/single-tasks",
        permission: "team",
      },
    ],
  },
  {
    id: "cms",
    label: "إدارة الموقع",
    description: "إنشاء وتحرير المحتوى",
    icon: Sparkles,
    chip: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    items: [
      {
        id: "works",
        title: "إضافة عمل جديد",
        description: "أضف مشروعًا إلى معرض الأعمال",
        icon: FolderPlus,
        tone: "emerald",
        href: "/dashboard/portfolio",
        permission: "portfolio",
        create: true,
      },
      {
        id: "clients",
        title: "إضافة عميل جديد",
        description: "سجّل بيانات عميل جديد",
        icon: UserRound,
        tone: "blue",
        href: "/dashboard/teachers",
        permission: "clients",
        create: true,
      },
      {
        id: "services",
        title: "إضافة خدمة جديدة",
        description: "أضف خدمة إلى قائمة الخدمات",
        icon: Layers,
        tone: "amber",
        href: "/dashboard/services",
        permission: "services",
        create: true,
      },
      {
        id: "pricing",
        title: "إضافة باقة جديدة",
        description: "أنشئ باقة أسعار جديدة",
        icon: PackagePlus,
        tone: "violet",
        href: "/dashboard/pricing",
        permission: "settings",
        create: true,
      },
      {
        id: "users",
        title: "إدارة المستخدمين",
        description: "الحسابات والأدوار والصلاحيات",
        icon: Users,
        tone: "red",
        href: "/dashboard/settings/users",
        permission: "users",
      },
    ],
  },
];

export default function QuickActions() {
  const router = useRouter();
  const { profile } = useAuth();

  const permissions = profile ? getPermissionsForProfile(profile) : {};

  const visibleGroups = GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(
      (action) => permissions[action.permission] === true,
    ),
  })).filter((group) => group.items.length > 0);

  function handleClick(action) {
    if (action.create && action.id !== "users") {
      sessionStorage.setItem("quickActionCreate", "open-create");
    }

    router.push(action.href);
  }

  if (visibleGroups.length === 0) {
    return null;
  }

  const totalActions = visibleGroups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  return (
    <section
      dir="rtl"
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-ink/[0.07]
        bg-card
        p-5
        shadow-[0_1px_2px_rgba(0,0,0,0.04)]
        sm:p-6
      "
    >
      {/* Header */}

      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <span className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-white shadow-[0_8px_20px_rgba(220,38,38,0.25)]">
              <Zap className="h-5 w-5" />
            </span>
          </div>

          <div>
            <h2 className="text-lg font-black tracking-tight text-ink">
              إجراءات سريعة
            </h2>

            <p className="mt-0.5 text-xs font-medium text-ink/60">
              وصول مباشر لمهامك وأهم عمليات لوحة التحكم
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black text-primary">
          <Sparkles className="h-3 w-3" />
          {totalActions} إجراء متاح
        </span>
      </div>

      {/* Groups */}

      <div className="space-y-6">
        {visibleGroups.map((group, groupIndex) => {
          const GroupIcon = group.icon;

          return (
            <div key={group.id}>
              {/* Group Label */}

              <div className="mb-3 flex items-center gap-2.5">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${group.chip}`}
                >
                  <GroupIcon className="h-3.5 w-3.5" />
                </span>

                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-black text-ink">
                    {group.label}
                  </h3>

                  <span className="text-[11px] font-medium text-ink/45">
                    {group.description}
                  </span>
                </div>

                <span className="h-px flex-1 bg-ink/[0.05]" />
              </div>

              {/* Action Tiles */}

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((action, index) => {
                  const Icon = action.icon;
                  const tone = TONES[action.tone] || TONES.red;

                  return (
                    <motion.button
                      key={action.id}
                      type="button"
                      onClick={() => handleClick(action)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: groupIndex * 0.08 + index * 0.04,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className={`
                        group
                        relative
                        flex
                        w-full
                        items-center
                        gap-3.5
                        overflow-hidden
                        rounded-2xl
                        border
                        border-ink/[0.06]
                        bg-card
                        p-3.5
                        text-right
                        shadow-[0_1px_2px_rgba(0,0,0,0.03)]
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        active:scale-[0.98]
                        ${tone.hoverBorder}
                        ${tone.hoverGlow}
                      `}
                    >
                      {/* Hover Glow */}

                      <span
                        className={`pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full ${tone.glow} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
                      />

                      {/* Icon */}

                      <span
                        className={`
                          relative
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          transition-all
                          duration-300
                          group-hover:scale-105
                          ${tone.icon}
                          ${tone.hoverIcon}
                        `}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      {/* Content */}

                      <span className="relative min-w-0 flex-1">
                        <span className="block text-sm font-black text-ink">
                          {action.title}
                        </span>

                        <span className="mt-0.5 block truncate text-[11px] font-medium leading-4 text-ink/55">
                          {action.description}
                        </span>
                      </span>

                      {/* Arrow */}

                      <span
                        className={`
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          text-ink/40
                          transition-all
                          duration-300
                          group-hover:-translate-x-0.5
                          ${tone.hoverText}
                        `}
                      >
                        <ArrowUpLeft className="h-4 w-4" />
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
