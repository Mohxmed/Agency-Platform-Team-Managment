"use client";

import {
  Search,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  ExternalLink,
  LogOut,
  LayoutDashboard,
  UserRound,
  Loader2,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/features/auth";
import { useTheme } from "@/providers/ThemeProvider";

import NotificationDropdown from "@/features/dashboard/components/NotificationDropdown";
import clsx from "clsx";
import { roleConfig } from "@/constants/permissions";
import DashboardSearch from "./DashboardSearch";

import { getPageMeta } from "@/config/nav";
import { usePageTheme } from "../hooks/usePageTheme";

export default function DashboardHeader() {
  const [profileOpen, setProfileOpen] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const pageTheme = usePageTheme();

  const { section, item } = getPageMeta(pathname);

  const PageIcon = item?.icon || LayoutDashboard;

  const displayName = profile?.name || user?.email?.split("@")[0] || "المستخدم";

  const email = user?.email || "";

  const photoURL =
    profile?.photoURL ||
    profile?.logo ||
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName,
    )}&background=000000&color=ffffff&bold=true`;

  const role = roleConfig[profile?.role] || roleConfig.default;

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      setProfileOpen(false);

      await logout();

      router.replace(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);

      setLoggingOut(false);
    }
  }

  return (
    <header
      className="
        sticky
        top-0
        z-30
        mb-6
        flex
        flex-wrap
        items-center
        justify-between
        gap-3
        rounded-2xl
        border
        border-gray-200/80
        bg-card/90
        px-4
        py-3
        shadow-[0_1px_2px_rgba(0,0,0,0.04)]
        backdrop-blur-md
        sm:px-5
      "
    >
      {/* =====================================================
          PAGE TITLE
      ====================================================== */}

      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${pageTheme.chip} ring-1 ${pageTheme.border}`}
        >
          <PageIcon size={18} />
        </span>

        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
            <span>لوحة التحكم</span>
            <span className="text-gray-500">/</span>
            <span className="truncate">{section}</span>
          </p>

          <h1 className="truncate text-sm font-black tracking-tight text-ink sm:text-base">
            {item?.title || "لوحة التحكم"}
          </h1>
        </div>
      </div>

      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <div className="flex items-center gap-2">
        {/* SEARCH */}

        <div className="hidden md:block">
          <DashboardSearch />
        </div>

        {/* ===================================================
            NOTIFICATIONS
        ==================================================== */}

        <NotificationDropdown />

        {/* ===================================================
            THEME
        ==================================================== */}

        <button
          type="button"
          aria-label="تغيير المظهر"
          onClick={toggleTheme}
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-gray-100
            text-ink/60
            transition-all
            hover:bg-gray-200
            hover:text-ink
          "
        >
          {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* ===================================================
            PROFILE
        ==================================================== */}

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="
              group
              flex
              h-10
              items-center
              gap-2
              rounded-xl
              bg-gray-100
              pl-2
              pr-1
              text-right
              transition-all
              hover:bg-gray-200
            "
          >
            <img
              src={photoURL}
              alt={displayName}
              className="h-8 w-8 rounded-lg object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
            />

            <div className="hidden min-w-0 sm:block">
              <p className="max-w-[140px] truncate text-xs font-bold text-ink">
                {displayName}
              </p>

              <p
                className={clsx(
                  "mt-0.5 max-w-[140px] truncate text-[10px]",
                  role.className,
                )}
              >
                {role.label}
              </p>
            </div>

            <ChevronDown
              size={14}
              className={`
                hidden
                text-ink/60
                transition-transform
                sm:block
                ${profileOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          {profileOpen && (
            <>
              <button
                type="button"
                aria-label="إغلاق القائمة"
                onClick={() => setProfileOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              <div
                className="
                  fixed
                  left-3
                  right-3
                  top-20
                  z-50
                  overflow-hidden
                  rounded-2xl
                  bg-card
                  p-2
                  shadow-[0_25px_80px_rgba(0,0,0,0.14)]
                  animate-in
                  fade-in
                  slide-in-from-top-2
                  duration-200
                  sm:absolute
                  sm:left-0
                  sm:right-auto
                  sm:top-[calc(100%+12px)]
                  sm:w-72
                "
              >
                <div className="space-y-1">
                  <DashboardMenuItem
                    icon={UserRound}
                    title="لوحة المستخدم"
                    description="نظرة عامة على حسابك"
                    href="/dashboard/user"
                  />

                  <DashboardMenuItem
                    icon={Settings}
                    title="الإعدادات"
                    description="إدارة إعدادات الحساب"
                    href="/dashboard/settings"
                  />

                  <DashboardMenuItem
                    icon={ExternalLink}
                    title="الذهاب للموقع"
                    description="عرض الموقع الرئيسي"
                    href={ROUTES.HOME || "/"}
                    external
                  />
                </div>

                <div className="my-2 h-px bg-ink/[0.04]" />

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-right
                    transition-all
                    hover:bg-red-50
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition group-hover:bg-red-100">
                    {loggingOut ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <LogOut size={16} />
                    )}
                  </span>

                  <div className="cursor-pointer">
                    <p className="text-sm font-semibold text-red-500">
                      {loggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
                    </p>

                    <p className="mt-0.5 text-[11px] text-red-400/60">
                      {loggingOut ? "لحظات من فضلك" : "الخروج من لوحة التحكم"}
                    </p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   MENU ITEM
========================================================= */

function DashboardMenuItem({
  icon: Icon,
  title,
  description,
  href,
  external = false,
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="
        group
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        transition-all
        hover:bg-ink/[0.04]
      "
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-ink/60 transition-all group-hover:bg-gray-200 group-hover:text-ink">
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>

        <p className="mt-0.5 truncate text-[11px] text-ink/60">
          {description}
        </p>
      </div>
    </Link>
  );
}
