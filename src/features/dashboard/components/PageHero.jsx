"use client";

import * as Icons from "lucide-react";

import { usePageTheme } from "../hooks/usePageTheme";
import { getThemeByName } from "@/constants/pageThemes";

export default function PageHero({
  icon: iconProp = "FolderKanban",
  title,
  subtitle,
  eyebrow,
  badge,
  accent,
  children,
  className = "",
}) {
  const resolvedAccent =
    typeof accent === "string" ? getThemeByName(accent) : accent;

  const pageTheme = usePageTheme();

  const theme = resolvedAccent || pageTheme;

  const Icon =
    typeof iconProp === "string"
      ? Icons[iconProp] || Icons.FolderKanban
      : iconProp || Icons.FolderKanban;

  return (
    <section
      className={`group relative overflow-hidden rounded-[28px] border ${theme.heroBg} ${theme.heroBgDark} p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8 ${className}`}
    >
      {/* Soft glow */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"
        style={{ backgroundColor: `${theme.softHex}55` }}
      />

      <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-ink/[0.03] blur-3xl" />

      <div
        className={`pointer-events-none absolute right-8 top-8 h-20 w-20 rounded-full border transition-transform duration-700 group-hover:rotate-45 ${theme.border} opacity-50`}
      />

      <div
        className={`pointer-events-none absolute right-12 top-12 h-12 w-12 rounded-full border ${theme.border} opacity-30`}
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.heroGradient} ${theme.gradientText} shadow-lg ring-4 ring-white/80 dark:ring-white/10 transition-all duration-500 group-hover:rotate-3 group-hover:scale-105`}
          >
            <Icon className="h-6 w-6" />

            <span
              className={`absolute -bottom-1 -left-1 h-3 w-3 rounded-full ring-2 ring-white dark:ring-black/50 ${theme.solid}`}
            />
          </div>

          <div>
            {eyebrow && (
              <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${theme.text}`}>
                {eyebrow}
              </p>
            )}

            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-ink sm:text-2xl">
                {title}
              </h1>

              {badge && (
                <span className="rounded-md bg-black px-2 py-1 text-[10px] font-black tracking-wide text-white dark:bg-white dark:text-black">
                  {badge}
                </span>
              )}
            </div>

            {subtitle && (
              <p className="mt-1.5 text-sm text-ink/40">{subtitle}</p>
            )}
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
