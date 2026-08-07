"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  ListTodo,
  Layers,
  ExternalLink,
  Pencil,
  FolderKanban,
} from "lucide-react";

import Image from "next/image";
import Logo from "@/shared/ui/identity/Logo";
import logoIcon from "@/assets/identity/logo-icon.png";

import { useSidebar } from "@/providers/SidebarProvider";
import { useAuth } from "@/features/auth";
import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";
import { useTeamData } from "@/features/team/hooks/useTeamData";
import { getAssigneeId } from "@/features/team/lib/teamUtils";
import Avatar from "@/features/dashboard/ui/Avatar";

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
          title: "المشاريع",
          href: "/dashboard/team/projects",
          icon: FolderKanban,
          permission: "team",
        },
        {
          title: "مهماتي",
          href: "/dashboard/team/my-tasks",
          icon: ClipboardList,
          permission: "my-tasks",
        },
        {
          title: "المهمات الفردية",
          href: "/dashboard/team/single-tasks",
          icon: Layers,
          permission: "team",
        },
        {
          title: "كل المهام",
          href: "/dashboard/team/all-tasks",
          icon: ListTodo,
          permission: "team",
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
   PROFILE MENU
========================================================= */

function ProfileMenu({
  collapsed,
  avatarSrc,
  user,
  name,
  roleLabel,
  roleClassName,
  username,
}) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      {/* PROFILE TRIGGER */}

      <button
        type="button"
        aria-label={name}
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex
          w-full
          items-center
          gap-4
          rounded-xl
          transition
          hover:bg-ink/[0.04]
          cursor-pointer
          ${collapsed ? "w-auto px-1 py-1" : "px-3 py-2.5"}
        `}
      >
        <Avatar
          src={avatarSrc}
          user={user}
          name={name}
          size={36}
          ring
        />

        {!collapsed && (
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span className="flex min-w-0 flex-col items-start text-start">
              <span className="max-w-full truncate text-sm font-bold text-ink">
                {name}
              </span>

              <span className={`text-xs font-medium ${roleClassName}`}>
                {roleLabel}
              </span>
            </span>

            <ChevronDown
              size={14}
              className={`shrink-0 text-ink/50 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </span>
        )}
      </button>

      {/* PROFILE DROPDOWN */}

      {open && !collapsed && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-52 overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#12121a]">
          <Link
            href="/dashboard/user"
            onClick={() => setOpen(false)}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-sm
              font-semibold
              text-ink/75
              transition
              hover:bg-ink/[0.04]
              hover:text-ink
            "
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/10 text-primary-600">
              <Pencil size={15} />
            </span>

            <span>تعديل الملف</span>
          </Link>

          <Link
            href={`/${username}`}
            onClick={() => setOpen(false)}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-sm
              font-semibold
              text-ink/75
              transition
              hover:bg-ink/[0.04]
              hover:text-ink
            "
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/10 text-primary-600">
              <ExternalLink size={15} />
            </span>

            <span>عرض الملف</span>
          </Link>
        </div>
      )}
    </div>
  );
}

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

  const profileAvatarSrc = profile?.logo || profile?.photoURL || "";

  const profileName =
    profile?.name || user?.displayName || user?.email?.split("@")[0] || "المستخدم";

  const profileUsername =
    profile?.link ||
    profile?.uid ||
    profile?.id ||
    user?.uid ||
    (profileName ? profileName.toLowerCase().replace(/\s+/g, "-") : "user");

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
            rounded-xl
            text-gray-500
            opacity-60
            select-none
            ${collapsed ? "justify-center px-0 py-3" : "gap-6 px-4 py-3"}
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
          rounded-xl
          transition-all
          duration-200

          ${collapsed ? "justify-center px-0 py-3" : "gap-6 px-4 py-3"}

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

    if (!mobile && collapsed) {
      return (
        <div
          key={section.title}
          className="
            flex
            flex-col
            items-center
            gap-1
            border-t
            border-gray-200
            py-2
            first:border-0
            first:pt-0
          "
        >
          {section.items.map((item) => renderMenuItem(item, mobile))}
        </div>
      );
    }

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

  /* =======================================================
     PROFILE BLOCK
  ======================================================= */

  const renderProfileBlock = (collapsed) => {
    return (
      <ProfileMenu
        collapsed={collapsed}
        avatarSrc={profileAvatarSrc}
        user={profile}
        name={profileName}
        roleLabel={currentRole.label}
        roleClassName={currentRole.className}
        username={profileUsername}
      />
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
            COLLAPSE TOGGLE (floating, absolute)
        ================================================== */}

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={collapsed ? "فتح القائمة" : "تصغير القائمة"}
          title={collapsed ? "فتح القائمة" : "تصغير القائمة"}
          className="
            absolute
            left-1
            top-1/2
            z-20
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-ink/15
            bg-card
            text-ink/60
            shadow-sm
            transition
            hover:bg-ink/[0.06]
            hover:text-ink
          "
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className={`flex h-20 shrink-0 items-center border-b border-ink/20 ${
            collapsed ? "justify-center px-2" : "justify-between px-5"
          }`}
        >
          {!collapsed ? (
            <div className="shrink-0">
              <Logo className="w-32" />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/[0.05]">
              <Image
                src={logoIcon}
                alt="No2ta"
                className="h-5 w-5 shrink-0 object-contain"
              />
            </div>
          )}
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
            <div className="mb-2">{renderProfileBlock(collapsed)}</div>
          )}

          {collapsed && (
            <div className="mb-2 flex justify-center">
              {renderProfileBlock(collapsed)}
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
            <div className="mb-2">{renderProfileBlock(false)}</div>

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
