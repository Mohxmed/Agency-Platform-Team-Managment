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
import { useEffect } from "react";

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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          <motion.div
            className="
              fixed
              inset-0
              z-[9998]
              bg-black/30
              backdrop-blur-sm
              lg:hidden
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.aside
            dir="rtl"
            className="
              fixed
              right-0
              top-0
              z-[9999]
              flex
              h-[100dvh]
              w-[320px]
              max-w-[88vw]
              flex-col
              overflow-hidden
              border-s
              border-black/10
              bg-white/70
              shadow-2xl
              backdrop-blur-2xl
              backdrop-saturate-150
              lg:hidden
              dark:border-white/10
              dark:bg-[#111111]/70
            "
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
            }}
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-black/5
                px-5
                py-5
                dark:border-white/10
              "
            >
              <h2
                className="
                  text-lg
                  font-bold
                  text-ink
                  dark:text-white
                "
              >
                القائمة
              </h2>

              <button
                type="button"
                aria-label="إغلاق القائمة"
                onClick={onClose}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-black/5
                  text-ink/70
                  transition
                  hover:bg-black/10
                  dark:bg-white/10
                  dark:text-white/70
                  dark:hover:bg-white/20
                "
              >
                <X size={22} />
              </button>
            </div>


            <nav
              className="
                flex-1
                overflow-y-auto
                px-3
                py-4
              "
            >
              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon =
                    iconMap[link.href] || Home;

                  const active = isActive(link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={`
                          relative
                          flex
                          items-center
                          gap-4
                          rounded-2xl
                          px-4
                          py-4
                          text-[15px]
                          font-medium
                          transition-all
                          duration-200

                          ${
                            active
                              ? `
                                bg-primary-500/10
                                text-primary-600
                                dark:bg-primary-400/10
                                dark:text-primary-400
                              `
                              : `
                                text-ink/70
                                hover:bg-black/5
                                dark:text-white/70
                                dark:hover:bg-white/5
                              `
                          }
                        `}
                      >

                        <span
                          className={`
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl

                            ${
                              active
                                ? `
                                  bg-primary-500/15
                                  text-primary-600
                                  dark:text-primary-400
                                `
                                : `
                                  bg-black/5
                                  text-ink/60
                                  dark:bg-white/10
                                  dark:text-white/50
                                `
                            }
                          `}
                        >
                          <Icon size={20}/>
                        </span>


                        <span>
                          {link.name}
                        </span>


                        {active && (
                          <motion.span
                            layoutId="active-menu"
                            className="
                              absolute
                              left-3
                              h-2
                              w-2
                              rounded-full
                              bg-primary-600
                              dark:bg-primary-400
                            "
                            transition={{
                              type:"spring",
                              stiffness:400,
                              damping:30
                            }}
                          />
                        )}

                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>


            <div
              className="
                shrink-0
                border-t
                border-black/5
                px-4
                pb-5
                pt-4

                dark:border-white/10
              "
              style={{
                paddingBottom:
                  "calc(env(safe-area-inset-bottom) + 20px)",
              }}
            >


            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}