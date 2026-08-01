"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { logout } from "@/features/auth/services/auth.service";
import { ROUTES } from "@/constants/routes";

export default function UserMenu() {
  const { user, mounted } = useAuth();
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
          flex items-center gap-2
          rounded-full
          border border-ink/10
          bg-card
          p-1
          text-ink
          shadow-sm
          transition-all
          hover:bg-gray-50
          hover:shadow-md
          dark:hover:bg-white/5
        "
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            className="
              h-9 w-9
              rounded-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              bg-primary-600
              text-sm font-semibold
              uppercase
              text-white
            "
          >
            {user.displayName?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        <ChevronDown
          size={16}
          className={`mr-1 text-ink/60 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute
            left-0
            top-[calc(100%+10px)]
            z-50
            w-64
            overflow-hidden
            rounded-xl
            border border-ink/10
            bg-card
            shadow-xl
          "
          role="menu"
        >
          {/* User Info */}
          <div className="border-b border-ink/10 px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">
              {user.displayName || "User"}
            </p>

            <p className="truncate text-xs text-ink/50">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              href={ROUTES.DASHBOARD}
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-3
                rounded-lg
                px-3 py-2.5
                text-sm text-ink/75
                transition
                hover:bg-gray-100
                hover:text-ink
                dark:hover:bg-white/5
              "
              role="menuitem"
            >
              <LayoutDashboard size={18} />
              <span>لوحة التحكم</span>
            </Link>

            <Link
              href="/dashboard/user"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-3
                rounded-lg
                px-3 py-2.5
                text-sm text-ink/75
                transition
                hover:bg-gray-100
                hover:text-ink
                dark:hover:bg-white/5
              "
              role="menuitem"
            >
              <Settings size={18} />
              <span>إعدادات الحساب</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-ink/10 p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="
                flex w-full
                items-center gap-3
                rounded-lg
                px-3 py-2.5
                text-sm                 text-red-500
                transition
                hover:bg-red-50
                dark:hover:bg-red-500/10
              "
              role="menuitem"
            >
              <LogOut size={18} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
