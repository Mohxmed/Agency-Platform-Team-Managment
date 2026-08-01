"use client";

import { useEffect, useState } from "react";

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
  FolderKanban,
  ClipboardList,
  BarChart3,
} from "lucide-react";

import { useSidebar } from "@/providers/SidebarProvider";
import { useAuth } from "@/features/auth";
import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";

import { getPermissionsForRole, roleConfig } from "@/constants/permissions";

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
    title: "المحتوى",
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
        permission: "profiles",
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
          permission: "team",
        },
        {
          title: "المشاريع",
          href: "/dashboard/team/projects",
          icon: FolderKanban,
          permission: "team",
        },
        {
          title: "لوحة التقدم",
          href: "/dashboard/team/progress",
          icon: BarChart3,
          permission: "team",
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
    setOpenSections((prev) => {
      const next = { ...prev };

      menuSections.forEach((section) => {
        if (section.items.some((item) => isActive(item.href))) {
          next[section.title] = true;
        }
      });

      return next;
    });
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

  const permissions = getPermissionsForRole(role);

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

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

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
            text-gray-300
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
                text-gray-400
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
                  text-gray-300
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

        {!collapsed && <span className="ml-4 font-medium">{item.title}</span>}
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
                  text-gray-400
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
                          text-gray-400
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
                  text-gray-300
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
          className="
            flex
            h-20
            shrink-0
            items-center
            justify-between
            border-b
            border-ink/20
            px-5
          "
        >
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-red-600">NO2TA</h1>

              <p className="text-xs text-gray-500">CMS Dashboard</p>
            </div>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? "فتح القائمة" : "تصغير القائمة"}
            className="
              rounded-xl
              border
              border-ink/20
              p-2
              text-ink/60
              transition
              hover:bg-ink/[0.06]
              hover:text-ink
            "
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
            <div>
              <h1 className="text-xl font-bold text-red-600">NO2TA</h1>

              <p className="text-xs text-gray-500">CMS Dashboard</p>
            </div>

            <button
              type="button"
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
