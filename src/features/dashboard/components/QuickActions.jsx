"use client";

import { useRouter } from "next/navigation";
import {
  FolderPlus,
  UserPlus,
  Layers,
  PackagePlus,
  Users,
  FolderKanban,
} from "lucide-react";
import { useAuth } from "@/features/auth";
import { getPermissionsForProfile } from "@/constants/permissions";

const actions = [
  {
    id: "works",
    title: "إضافة عمل جديد",
    description: "أضف مشروعًا جديدًا إلى معرض الأعمال.",
    icon: FolderPlus,
    href: "/dashboard/portfolio",
    permission: "portfolio",
  },
  {
    id: "clients",
    title: "إضافة عميل جديد",
    description: "سجّل بيانات عميل جديد وتابع مشاريعه.",
    icon: UserPlus,
    href: "/dashboard/teachers",
    permission: "clients",
  },
  {
    id: "services",
    title: "إضافة خدمة جديدة",
    description: "أضف خدمة جديدة إلى قائمة خدمات الموقع.",
    icon: Layers,
    href: "/dashboard/services",
    permission: "services",
  },
  {
    id: "pricing",
    title: "إضافة باقة جديدة",
    description: "أنشئ باقة جديدة لتظهر في صفحة الباقات.",
    icon: PackagePlus,
    href: "/dashboard/pricing",
    permission: "settings",
  },
  {
    id: "projects",
    title: "إضافة مشروع للفريق",
    description: "أنشئ مشروعًا جديدًا ووزّع مهامه على أعضاء الفريق.",
    icon: FolderKanban,
    href: "/dashboard/team",
    permission: "team",
  },
  {
    id: "users",
    title: "إدارة المستخدمين",
    description: "أضف أو عدّل حسابات ومستخدمين الموقع.",
    icon: Users,
    href: "/dashboard/settings/users",
    permission: "users",
  },
];

export default function QuickActions() {
  const router = useRouter();
  const { profile } = useAuth();

  const permissions = profile ? getPermissionsForProfile(profile) : {};

  const visibleActions = actions.filter(
    (action) => permissions[action.permission] === true,
  );

  function handleClick(action) {
    if (action.id === "users") {
      router.push(action.href);
      return;
    }

    sessionStorage.setItem("quickActionCreate", "open-create");
    router.push(action.href);
  }

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <section
      dir="rtl"
      className="
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-gray-200/80
        bg-card
        p-5
        shadow-[0_8px_30px_rgba(0,0,0,0.035)]
        sm:p-6
      "
    >
      {/* Header */}

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-600
            "
          >
            <FolderPlus className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-black tracking-tight text-gray-900">
              تنفيذ سريع
            </h2>

            <p className="mt-0.5 text-xs font-medium text-gray-400">
              اختصارات لأهم العمليات في لوحة التحكم
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}

      <div className="grid gap-3 sm:grid-cols-2">
        {visibleActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleClick(action)}
              className="
                group
                relative
                flex
                w-full
                items-center
                gap-4
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-gray-50/50
                p-4
                text-right
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-red-200
                hover:bg-red-50/50
                hover:shadow-[0_10px_25px_rgba(220,38,38,0.08)]
                active:scale-[0.98]
              "
            >
              {/* Hover Glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -left-8
                  -top-8
                  h-20
                  w-20
                  rounded-full
                  bg-red-500/5
                  blur-2xl
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />

              {/* Icon */}

              <div
                className="
                  relative
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-card
                  text-red-600
                  shadow-sm
                  ring-1
                  ring-gray-100
                  transition-all
                  duration-300
                  group-hover:scale-105
                  group-hover:bg-red-600
                  dark:group-hover:bg-red-500
                  group-hover:text-white
                  group-hover:shadow-[0_8px_18px_rgba(220,38,38,0.22)]
                "
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Content */}

              <div className="relative min-w-0 flex-1">
                <h3
                  className="
                    text-sm
                    font-black
                    text-gray-900
                    transition-colors
                    group-hover:text-red-600
                  "
                >
                  {action.title}
                </h3>

                <p
                  className="
                    mt-1
                    text-[11px]
                    font-medium
                    leading-5
                    text-gray-400
                    transition-colors
                    group-hover:text-gray-500
                  "
                >
                  {action.description}
                </p>
              </div>

              {/* Arrow */}

              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-gray-300
                  transition-all
                  duration-300
                  group-hover:translate-x-[-2px]
                  group-hover:bg-red-100
                  group-hover:text-red-600
                "
              >
                <span className="text-sm">←</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
