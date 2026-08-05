"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Home, Users, Briefcase, Settings, Mail } from "lucide-react";

const sections = [
  { id: "hero", label: "الرئيسية", icon: Home },
  { id: "clients", label: "عملائنا", icon: Users },
  { id: "works", label: "أعمالنا", icon: Briefcase },
  { id: "services", label: "خدماتنا", icon: Settings },
  { id: "contact", label: "تواصل", icon: Mail },
];

export default function SectionsNavigator() {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        className="
          fixed
          left-3
          top-1/2
          z-50
          hidden
          -translate-y-1/2
          rounded-full
          border
          border-white/60
          bg-white/70
          px-3
          py-4
          shadow-[0_8px_40px_rgba(0,0,0,0.12)]
          lg:block
          dark:border-white/10
          dark:bg-black/60
        "
      >
        <ul className="flex flex-col items-center gap-4">
          {sections.map(({ id, icon: Icon }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-label={id}
                className={clsx(
                  "block rounded-full transition-all duration-500 ease-out",
                  active === id
                    ? "h-10 w-2.5 bg-primary-600 shadow-[0_0_18px_rgba(185,28,28,0.55)] scale-100"
                    : "h-2.5 w-2.5 bg-black/50 hover:bg-primary-500 hover:scale-125 dark:bg-white/40"
                )}
              />
            </li>
          ))}
        </ul>
      </nav>

      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          lg:hidden
        "
      >
        <div className="
          mx-4
          mb-4
          rounded-2xl
          border
          border-black/5
          bg-white/95
          shadow-[0_-8px_40px_rgba(0,0,0,0.12)]
          dark:border-white/10
          dark:bg-card/95
        ">
          <div className="mx-auto flex max-w-lg items-center justify-around py-3">
            {sections.map(({ id, label, icon: Icon }) => {
              const isActive = active === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className="
                    group
                    relative
                    flex
                    flex-col
                    items-center
                    gap-1
                    rounded-xl
                    px-3
                    py-2
                    transition-all
                    duration-200
                    hover:bg-primary-50
                    dark:hover:bg-primary-500/10
                  "
                >
                  {isActive && (
                    <motion.span
                      layoutId="bottom-active-bg"
                      className="
                        absolute
                        inset-0
                        rounded-xl
                        bg-primary-50
                        dark:bg-primary-500/10
                      "
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon
                    size={20}
                    className={clsx(
                      "relative z-10 transition-colors duration-200",
                      isActive
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-ink/60 group-hover:text-ink/70 dark:text-white/30"
                    )}
                  />

                  <span
                    className={clsx(
                      "relative z-10 text-[10px] font-medium transition-colors duration-200",
                      isActive
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-ink/60 group-hover:text-ink/70 dark:text-white/30"
                    )}
                  >
                    {label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </>
  );
}