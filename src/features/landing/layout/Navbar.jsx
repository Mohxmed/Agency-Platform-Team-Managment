"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(null);

  return (
    <nav
      className="hidden items-center gap-8 lg:flex"
      onMouseLeave={() => setHovered(null)}
    >
      {navLinks.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        const showUnderline = hovered === link.href || (!hovered && isActive);

        return (
          <Link
            key={link.href}
            href={link.href}
            onMouseEnter={() => setHovered(link.href)}
            className={`relative py-2 transition-colors duration-300 ${
              isActive ? "font-bold" : "text-text-muted hover:text-primary"
            }`}
          >
            {link.name}

            {showUnderline && (
              <motion.span
                layoutId="navbar-underline"
                className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-primary-500"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
