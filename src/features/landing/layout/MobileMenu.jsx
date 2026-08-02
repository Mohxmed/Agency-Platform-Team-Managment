"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/constants/navigation";
import Button from "@/shared/ui/buttons/Buttons";
import { FaWhatsapp } from "react-icons/fa";
import {
  Home,
  Users,
  Briefcase,
  Settings,
  Mail,
  X,
} from "lucide-react";

const iconMap = {
  "/": Home,
  "/pricing": Settings,
  "/portfolio": Briefcase,
  "/clients": Users,
  "/services": Settings,
  "/contact": Mail,
};

export default function MobileMenu({ open, onClose }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="
              fixed
              right-0
              top-0
              z-50
              h-full
              w-[300px]
              max-w-[85vw]
              bg-white
              shadow-2xl
              lg:hidden
              dark:bg-card
            "
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-lg font-bold text-ink dark:text-white">
                  القائمة
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    text-ink/60
                    transition-colors
                    hover:bg-gray-100
                    hover:text-ink
                    dark:hover:bg-white/10
                    dark:text-white/60
                  "
                  aria-label="إغلاق القائمة"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mx-3 h-px bg-black/5 dark:bg-white/10" />

              <nav className="flex-1 overflow-y-auto py-2">
                <ul className="flex flex-col gap-1 px-2">
                  {navLinks.map((link) => {
                    const Icon = iconMap[link.href] || Home;
                    const active = isActive(link.href);

                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className={`
                            group
                            flex
                            items-center
                            gap-4
                            rounded-xl
                            px-4
                            py-3.5
                            text-[15px]
                            font-medium
                            transition-all
                            duration-200
                            ${
                              active
                                ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                                : "text-ink/70 hover:bg-gray-50 hover:text-ink dark:text-white/70 dark:hover:bg-white/5"
                            }
                          `}
                        >
                          <Icon
                            size={20}
                            className={`
                              shrink-0
                              transition-colors
                              duration-200
                              ${
                                active
                                  ? "text-primary-600 dark:text-primary-400"
                                  : "text-ink/40 group-hover:text-ink/70 dark:text-white/30"
                              }
                            `}
                          />
                          <span>{link.name}</span>
                          {active && (
                            <motion.span
                              layoutId="mobile-active-indicator"
                              className="ml-auto h-2 w-2 rounded-full bg-primary-600 dark:bg-primary-400"
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                              }}
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="shrink-0 border-t border-black/5 px-4 py-4 dark:border-white/10">
                <Button
                  href="/contact"
                  onClick={onClose}
                  className="w-full"
                >
                  <FaWhatsapp className="text-lg" />
                  ابعتلنا على واتساب
                </Button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}