"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const sections = ["hero", "clients", "works", "services", "contact"];

export default function SectionsNavigator() {
  const [active, setActive] = useState(sections[0]);

  useEffect(() => {
    const elements = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActive(visible.target.id);
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      },
    );
    elements.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
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
        bg-white/40
        px-3
        py-4
        shadow-[0_8px_40px_rgba(0,0,0,0.12)]
        backdrop-blur-2xl
        backdrop-saturate-150
        lg:block
        dark:border-white/10
        dark:bg-black/40
      "
    >
      <ul className="flex flex-col items-center gap-4">
        {sections.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-label={id}
              className={clsx(
                ` block rounded-full transition-all duration-500 ease-out `,

                active === id
                  ? `h-10 w-2.5 bg-primary-600 shadow-[0_0_18px_rgba(185,28,28,0.55) scale-100`
                  : `h-2.5 w-2.5 bg-black/50 hover:bg-primary-500 hover:scale-125 dark:bg-white/40`,
              )}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
