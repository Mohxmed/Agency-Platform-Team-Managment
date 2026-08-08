"use client";

import * as Icons from "lucide-react";

const HERO_COLORS = {
  red: {
    bg: "bg-primary-600",
    border: "border-primary-900/40",
    badgeText: "text-red-700",
    badgeTextDark: "dark:text-red-100",
    dotRing: "ring-primary-600",
    iconBox: "bg-white/15 text-white ring-white/20",
    dot: "bg-white",
    eyebrowText: "text-white/70",
    titleText: "text-white",
    subtitleText: "text-white/70",
  },

  emerald: {
    bg: "bg-emerald-600",
    border: "border-emerald-700/30",
    badgeText: "text-emerald-700",
    badgeTextDark: "dark:text-emerald-100",
    dotRing: "ring-emerald-600",
    iconBox: "bg-white/15 text-white dark:bg-black/10 dark:text-black",
    dot: "bg-white dark:bg-black",
    eyebrowText: "text-white/70 dark:text-black/70",
    titleText: "text-white dark:text-black",
    subtitleText: "text-white/70 dark:text-black/70",
  },
};

export default function PageHero({
  icon: iconProp = "FolderKanban",
  title,
  subtitle,
  eyebrow,
  badge,
  children,
  color = "red",
  className = "",
}) {
  const Icon =
    typeof iconProp === "string"
      ? Icons[iconProp] || Icons.FolderKanban
      : iconProp || Icons.FolderKanban;

  const hero = HERO_COLORS[color] || HERO_COLORS.red;

  return (
    <section
      className={`group relative overflow-hidden rounded-[28px] border ${hero.border} ${hero.bg} p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8 ${className}`}
    >
      {/* Subtle decorative circles (flat, no gradient) */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/[0.06] dark:bg-black/[0.06]" />

      <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-black/[0.06]" />

      <div className="pointer-events-none absolute right-8 top-8 h-20 w-20 rounded-full border border-white/20 opacity-40 dark:border-black/20" />

      <div className="pointer-events-none absolute right-12 top-12 h-12 w-12 rounded-full border border-white/15 opacity-25 dark:border-black/15" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg ring-4 transition-all duration-500 group-hover:scale-105 ${hero.iconBox}`}>
            <Icon className="h-6 w-6" />

            <span
              className={`absolute -bottom-1 -left-1 h-3 w-3 rounded-full ring-2 ${hero.dot} ${hero.dotRing}`}
            />
          </div>

          <div>
            {eyebrow && (
              <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${hero.eyebrowText}`}>
                {eyebrow}
              </p>
            )}

            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-black tracking-tight sm:text-2xl ${hero.titleText}`}>
                {title}
              </h1>

              {badge && (
                <span
                  className={`rounded-md bg-white px-2 py-1 text-[10px] font-black tracking-wide ${hero.badgeText} ${hero.badgeTextDark}`}
                >
                  {badge}
                </span>
              )}
            </div>

            {subtitle && (
              <p className={`mt-1.5 text-sm ${hero.subtitleText}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
