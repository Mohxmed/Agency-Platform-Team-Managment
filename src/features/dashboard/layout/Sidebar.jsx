"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  GraduationCap,
  Images,
  MessageSquareQuote,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Tag,
  Lock,
  Wallet,
  ClipboardList,
  BarChart3,
} from "lucide-react";

import Image from "next/image";
import Logo from "@/shared/ui/identity/Logo";
import logoIcon from "@/assets/identity/logo-icon.png";

import { useSidebar } from "@/providers/SidebarProvider";
import { useAuth } from "@/features/auth";
import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";
import { useTeamData } from "@/features/team/hooks/useTeamData";
import { getAssigneeId } from "@/features/team/lib/teamUtils";

import { getPermissionsForProfile, roleConfig } from "@/constants/permissions";

/* =========================================================
   MENU
========================================================= */

const menuSections = [
  {
    title: "لوحة التحكم",
    items: [
      {
        title: "لوحة التحكم",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard",
      },
    ],
  },
  {
    title: "إدارة الموقع",
    items: [
      {
        title: "محفظة الأعمال",
        href: "/dashboard/portfolio",
        icon: Images,
        permission: "portfolio",
      },
      {
        title: "التصنيفات",
        href: "/dashboard/categories",
        icon: Tag,
        permission: "categories",
      },
      {
        title: "العملاء",
        href: "/dashboard/teachers",
        icon: GraduationCap,
        permission: "clients",
      },
      {
        title: "الخدمات",
        href: "/dashboard/services",
        icon: MessageSquareQuote,
        permission: "services",
      },
      {
        title: "إدارة الأسعار",
        href: "/dashboard/pricing",
        icon: Wallet,
        permission: "settings",
      },
      {
        title: "الإعدادات",
        href: "/dashboard/settings",
        icon: Settings,
        permission: "settings",
      },
    ],
  },
  {
      title: "الفريق",
      items: [
        { title: "الفريق", href: "/dashboard/team", icon: Users, permission: "team" },
        {
          title: "مهماتي",
          href: "/dashboard/team/my-tasks",
          icon: ClipboardList,
          permission: "my-tasks",
        },
        {
          title: "لوحة التقدم",
          href: "/dashboard/team/progress",
          icon: BarChart3,
          permission: "progress",
        },
      ],
    },
];

/* =========================================================
   SIDEBAR
========================================================= */

export default function Sidebar({ open, onClose }) {
  const { user, profile, logout } = useAuth();

  const pathname = usePathname();

  const { collapsed, toggleSidebar } = useSidebar();

  const theme = usePageTheme();

  const { tasks } = useTeamData();

  /* =======================================================
     MY TASKS COUNT
  ======================================================= */

  const profileId = profile?.uid || profile?.id || user?.uid || "";

  const myTasksCount = useMemo(() => {
    if (!profileId) return 0;
    return tasks.filter(
      (task) =>
        getAssigneeId(task) === profileId && task.status !== "done",
    ).length;
  }, [tasks, profileId]);

  const [openSections, setOpenSections] = useState(() => {
    const initial = {};

    menuSections.forEach((section) => {
      initial[section.title] = true;
    });

    return initial;
  });

  /* =======================================================
     OPEN STATE
  ======================================================= */

  useEffect(() => {
    // Intentional: expand sections containing the active route on navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenSections((prev) => {
      const next = { ...prev };

      menuSections.forEach((section) => {
        if (section.items.some((item) => isActive(item.href))) {
          next[section.title] = true;
        }
      });

      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function handleSectionClick(title) {
    if (collapsed) {
      toggleSidebar();
      setOpenSections((prev) => ({ ...prev, [title]: true }));
      return;
    }

    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  /* =======================================================
     ROLE
  ======================================================= */

  const role = profile?.role || "member";

  const permissions = getPermissionsForProfile(profile);

  const currentRole = roleConfig[role] || roleConfig.default;

  /* =======================================================
     PERMISSION CHECK
  ======================================================= */

  const hasPermission = (permission) => {
    return permissions?.[permission] === true;
  };

  /* =======================================================
     ACTIVE STATE
  ======================================================= */

  // An item matches when the path is exact or (for non-dashboard items)
  // nested underneath it. On any given page only the LONGEST matching item
  // is active, so a parent like /dashboard/team does not stay highlighted
  // while browsing its sub-pages (my-tasks, projects, progress, ...).
  const matches = (href) => {
    if (href === "/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const activeHref = useMemo(() => {
    let best = "";
    menuSections.forEach((section) => {
      section.items.forEach((item) => {
        if (matches(item.href) && item.href.length > best.length) {
          best = item.href;
        }
      });
    });
    return best;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActive = (href) => activeHref === href;

  /* =======================================================
     LOGOUT
  ======================================================= */

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  /* =======================================================
     MENU ITEM
  ======================================================= */

  const renderMenuItem = (item, mobile = false) => {
    const Icon = item.icon;

    const active = isActive(item.href);

    const allowed = hasPermission(item.permission);

    /* =====================================================
       DISABLED ITEM
    ===================================================== */

    if (!allowed) {
      return (
        <div
          key={item.href}
          title={collapsed ? `ليس لديك صلاحية: ${item.title}` : undefined}
          className={`
            group
            flex
            w-full
            cursor-not-allowed
            items-center
            gap-6
            rounded-xl
            px-4
            py-3
            text-gray-500
            opacity-60
            select-none
            ${mobile ? "" : ""}
          `}
        >
          {/* ICON */}

          <div
            className="
              relative
              flex
              h-[22px]
              w-[22px]
              shrink-0
              items-center
              justify-center
            "
          >
            <Icon size={21} />

            {/* LOCK */}

            <span
              className="
                absolute
                -bottom-1.5
                -right-1.5
                flex
                h-3.5
                w-3.5
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-gray-500
              "
            >
              <Lock size={8} />
            </span>
          </div>

          {/* TITLE */}

          {!collapsed && (
            <div className="flex min-w-0 flex-1 items-center justify-between">
              <span className="font-medium">{item.title}</span>

              <Lock
                size={14}
                className="
                  text-gray-500
                  transition-colors
                "
              />
            </div>
          )}
        </div>
      );
    }

    /* =====================================================
       ENABLED ITEM
    ===================================================== */

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={mobile ? onClose : undefined}
        aria-label={item.title}
        className={`
          group
          flex
          items-center
          gap-6
          rounded-xl
          px-4
          py-3
          transition-all
          duration-200

          ${
            active
              ? `${theme.bgSoft} ${theme.text} font-bold`
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
      >
        <Icon
          size={22}
          className={`
            shrink-0
            transition-transform
            duration-200
            group-hover:scale-105

            ${
              active
                ? theme.text
                : "text-gray-500 group-hover:text-gray-900"
            }
          `}
        />

        {!collapsed && <span className="ml-4 flex-1 font-medium">{item.title}</span>}

        {!collapsed &&
          item.href === "/dashboard/team/my-tasks" &&
          myTasksCount > 0 && (
            <span
              className={`
                inline-flex
                shrink-0
                items-center
                justify-center
                rounded-full
                px-2
                py-0.5
                text-[10px]
                font-black
                leading-none
                ${
                  active
                    ? `${theme.bgSoft} ${theme.text}`
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                }
              `}
            >
              {myTasksCount}
            </span>
          )}
      </Link>
    );
  };

  /* =======================================================
     SECTION
  ======================================================= */

  const renderSection = (section, mobile = false) => {
    const isOpen = !collapsed && !!openSections[section.title];

    const hasActiveItem = section.items.some((item) => isActive(item.href));

    return (
      <div key={section.title} className="flex flex-col">
        {/* SECTION HEADER */}
        <button
          type="button"
          aria-label={section.title}
          onClick={() => handleSectionClick(section.title)}
          className={`
            group/section
            flex
            w-full
            items-center
            justify-between
            rounded-xl
            transition-all
            duration-200

            ${
              collapsed
                ? `
                  mx-auto
                  my-2
                  h-px
                  w-10
                  cursor-pointer
                  rounded-full
                  bg-gray-200
                  hover:bg-red-400
                `
                : `
                  px-3
                  pt-4
                  pb-2
                  hover:bg-gray-50
                `
            }
          `}
        >
          {!collapsed && (
            <>
              <span
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.12em]
                  text-gray-500
                  transition-colors
                  group-hover/section:text-gray-600
                "
              >
                {section.title}

                <span
                  className={`
                    rounded-md
                    px-1.5
                    py-0.5
                    text-[9px]
                    font-black
                    transition-colors
                    ${
                      hasActiveItem
                        ? theme.chip
                        : `
                          bg-gray-100
                          text-gray-500
                          group-hover/section:bg-gray-200
                          group-hover/section:text-gray-600
                        `
                    }
                  `}
                >
                  {section.items.length}
                </span>
              </span>

              <ChevronDown
                size={14}
                className={`
                  text-gray-500
                  transition-transform
                  duration-200
                  group-hover/section:text-gray-500

                  ${isOpen ? "rotate-180" : ""}
                `}
              />
            </>
          )}
        </button>

        {/* SECTION ITEMS */}
        {isOpen && (
          <div className="mt-1 flex flex-col gap-1">
            {section.items.map((item) => renderMenuItem(item, mobile))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <aside
        className={`
          relative
          hidden
          h-screen
          flex-col
          border-l
          border-gray-200
          bg-card
          transition-all
          duration-300
          lg:flex

          ${collapsed ? "w-20" : "w-72"}
        `}
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className={`flex h-20 shrink-0 items-center justify-between border-b border-ink/20 ${
            collapsed ? "px-2" : "px-5"
          }`}
        >
          {!collapsed ? (
            <div className="shrink-0">
              <Logo className="w-32" />
            </div>
          ) : (
            <Image
              src={logoIcon}
              alt="No2ta"
              className="h-9 w-9 shrink-0 rounded-lg object-contain"
            />
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? "فتح القائمة" : "تصغير القائمة"}
            className={`
              rounded-xl
              border
              border-ink/20
              text-ink/60
              transition
              hover:bg-ink/[0.06]
              hover:text-ink
              ${collapsed ? "p-1" : "p-2"}
            `}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* =================================================
            MENU
        ================================================== */}

        <nav
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-3
            pb-6
            [scrollbar-gutter:stable]
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-200
            [&::-webkit-scrollbar-thumb]:hover:bg-gray-300
          "
        >
          {menuSections.map((section) => renderSection(section))}
        </nav>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-ink/20
            p-4
          "
        >
          {!collapsed && (
            <div className="mb-4">
              <p className="truncate font-semibold">
                {profile?.name ||
                  user?.displayName ||
                  user?.email?.split("@")[0] ||
                  "المستخدم"}
              </p>

              <p
                className={`
                  text-sm
                  ${currentRole.className}
                `}
              >
                {currentRole.label}
              </p>
            </div>
          )}

          <button
            type="button"
            aria-label="تسجيل خروج"
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-4
              rounded-xl
              px-4
              py-3
              text-red-600
              transition
              hover:bg-red-50
              cursor-pointer
            "
          >
            <LogOut size={20} />

            {!collapsed && <span className="ml-3">تسجيل خروج</span>}
          </button>
        </div>
      </aside>

      {/* =====================================================
          MOBILE
      ====================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-50
          lg:hidden

          ${open ? "block" : "hidden"}
        `}
      >
        {/* BACKDROP */}

        <div
          className="
            absolute
            inset-0
            bg-black/50
          "
          onClick={onClose}
        />

        {/* SIDEBAR */}

        <aside
          className="
            absolute
            right-0
            flex
            h-full
            w-72
            flex-col
            bg-card
            shadow-2xl
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              h-20
              shrink-0
              items-center
              justify-between
              border-b
              border-ink/10
              px-5
            "
          >
            <div className="shrink-0">
              <Logo className="w-32" />
            </div>

            <button
              type="button"
              aria-label="إغلاق القائمة"
              onClick={onClose}
              className="
                rounded-xl
                border
                border-ink/10
                p-2
                text-ink/60
                transition
                hover:bg-ink/[0.06]
                hover:text-ink
              "
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* MENU */}

          <nav
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-3
              pb-6
              [scrollbar-gutter:stable]
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-gray-200
            "
          >
            {menuSections.map((section) => renderSection(section, true))}
          </nav>

          {/* MOBILE FOOTER */}

          <div
            className="
              shrink-0
              border-t
              border-ink/10
              p-4
            "
          >
            <div className="mb-4">
              <p className="truncate font-semibold">
                {profile?.name ||
                  user?.displayName ||
                  user?.email?.split("@")[0] ||
                  "المستخدم"}
              </p>

              <p
                className={`
                  text-sm
                  ${currentRole.className}
                `}
              >
                {currentRole.label}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                text-red-600
                transition
                hover:bg-red-50
              "
            >
              <LogOut size={20} />

              <span>تسجيل خروج</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
