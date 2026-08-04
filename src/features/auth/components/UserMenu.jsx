"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { logout } from "@/features/auth/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { roleConfig } from "@/constants/permissions";

const panelTransition = {
  duration: 0.22,
  ease: [0.16, 1, 0.3, 1],
};

export default function UserMenu() {
  const { user, profile, mounted } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Not mounted yet or not logged in
  if (!mounted || !user) {
    return (
      <Link
        href={ROUTES.LOGIN}
        className="
          flex h-10 w-10
          items-center justify-center
          rounded-full
          bg-primary-600
          text-white
          transition
          hover:bg-primary-700
        "
      >
        <User size={22} />
      </Link>
    );
  }

  const avatar = user.photoURL || profile?.photoURL || profile?.logo || "";

  const displayName =
    user.displayName || profile?.name || "مستخدم";

  const email = user.email || profile?.email || "";

  const roleKey = profile?.role || "member";
  const role = roleConfig[roleKey] || roleConfig.default;

  const initial = displayName?.charAt(0)?.toUpperCase() || "U";

  async function handleLogout() {
    try {
      await logout();

      setIsOpen(false);

      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div ref={menuRef} className="relative">
      {/* User Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          group
          flex
          items-center
          gap-2
          rounded-full
          border
          border-ink/10
          bg-white/85
          p-1.5
          pl-2
          text-ink
          shadow-[0_8px_30px_rgba(0,0,0,0.06)]
          transition-all
          duration-300
          hover:bg-white
          hover:shadow-[0_12px_40px_rgba(232,33,37,0.15)]
          dark:border-white/10
          dark:bg-white/10
          dark:hover:bg-white/15
        "
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div
          className="
            rounded-full
            bg-gradient-to-br
            from-primary-400
            to-primary-700
            p-[2px]
          "
        >
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="
                h-8
                w-8
                rounded-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-white
                text-sm
                font-black
                uppercase
                text-primary-600
                dark:bg-background
              "
            >
              {initial}
            </div>
          )}
        </div>

        <ChevronDown
          size={16}
          className={`
            text-ink/60
            transition-transform
            duration-300
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.96,
            }}
            transition={panelTransition}
            className="
              absolute
              left-0
              top-[calc(100%+12px)]
              z-50
              w-72
              origin-top
              overflow-hidden
              rounded-[24px]
              border
              border-white/40
              bg-white/90
              shadow-[0_30px_80px_rgba(0,0,0,0.12)]
              dark:border-white/10
              dark:bg-[#12121a]
            "
            role="menu"
          >
            {/* Decorative top glow (static gradient) */}
            <div
              className="
                pointer-events-none
                absolute
                -top-16
                -end-16
                h-40
                w-40
                rounded-full
                [background:radial-gradient(circle_at_center,rgba(217,4,41,0.15),transparent_62%)]
              "
            />

            {/* User Info */}
            <div
              className="
                relative
                border-b
                border-ink/[0.06]
                px-4
                py-5
                dark:border-white/5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    shrink-0
                    rounded-full
                    bg-gradient-to-br
                    from-primary-400
                    to-primary-700
                    p-[2px]
                    shadow-[0_8px_20px_rgba(232,33,37,0.3)]
                  "
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={displayName}
                      className="
                        h-14
                        w-14
                        rounded-full
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-xl
                        font-black
                        uppercase
                        text-primary-600
                        dark:bg-background
                      "
                    >
                      {initial}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-ink">
                    {displayName}
                  </p>

                  <p
                    dir="ltr"
                    className="
                      mt-0.5
                      truncate
                      text-xs
                      text-muted
                    "
                  >
                    {email}
                  </p>

                  <span
                    className="
                      mt-1.5
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      bg-primary-600/10
                      px-2.5
                      py-0.5
                      text-[10px]
                      font-bold
                      text-primary-600
                    "
                  >
                    <ShieldCheck size={11} />
                    {role.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="relative p-2">
              <Link
                href={ROUTES.DASHBOARD}
                onClick={() => setIsOpen(false)}
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
                  hover:bg-white/80
                  hover:text-ink
                  dark:hover:bg-white/5
                "
                role="menuitem"
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary-600/10
                    text-primary-600
                  "
                >
                  <LayoutDashboard size={16} />
                </span>

                <span>لوحة التحكم</span>
              </Link>

              <Link
                href="/dashboard/user"
                onClick={() => setIsOpen(false)}
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
                  hover:bg-white/80
                  hover:text-ink
                  dark:hover:bg-white/5
                "
                role="menuitem"
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary-600/10
                    text-primary-600
                  "
                >
                  <Settings size={16} />
                </span>

                <span>إعدادات الحساب</span>
              </Link>
            </div>

            {/* Logout */}
            <div
              className="
                relative
                border-t
                border-ink/[0.06]
                p-2
                dark:border-white/5
              "
            >
              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-semibold
                  text-red-500
                  transition
                  hover:bg-red-50
                  dark:hover:bg-red-500/10
                "
                role="menuitem"
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-500/10
                    text-red-500
                  "
                >
                  <LogOut size={16} />
                </span>

                <span>تسجيل الخروج</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
