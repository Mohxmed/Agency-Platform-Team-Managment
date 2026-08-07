"use client";

import { FolderKanban } from "lucide-react";

export default function TeamHero({
  icon: Icon = FolderKanban,
  title,
  subtitle,
  badge = "TEAM",
  children,
}) {
  return (
    <section
      className={`group relative overflow-hidden rounded-[28px] border border-red-700/30 bg-red-600 p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8`}
    >
      {/* Subtle decorative circles (flat, no gradient) */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/[0.06]" />

      <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-black/[0.06]" />

      <div className="pointer-events-none absolute right-8 top-8 h-20 w-20 rounded-full border border-white/20 opacity-40" />

      <div className="pointer-events-none absolute right-12 top-12 h-12 w-12 rounded-full border border-white/15 opacity-25" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white shadow-lg ring-4 ring-white/20 transition-all duration-500 group-hover:scale-105">
            <Icon className="h-6 w-6" />

            <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-white ring-2 ring-red-600" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                {title}
              </h1>

              {badge && (
                <span className="rounded-md bg-white px-2 py-1 text-[10px] font-black tracking-wide text-red-700">
                  {badge}
                </span>
              )}
            </div>

            {subtitle && (
              <p className="mt-1.5 text-sm text-white/70">{subtitle}</p>
            )}
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
