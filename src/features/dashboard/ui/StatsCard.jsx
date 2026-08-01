"use client";

import { getThemeByName } from "@/constants/pageThemes";

import { usePageTheme } from "../hooks/usePageTheme";

import Card from "./Card";

export default function StatsCard({
  label,
  value,
  description,
  icon: Icon,
  footer,
  trend,
  accent,
  className = "",
}) {
  const pageTheme = usePageTheme();

  const theme = accent
    ? typeof accent === "string"
      ? getThemeByName(accent)
      : accent
    : pageTheme;

  return (
    <Card
      className={`
        group
        relative
        isolate
        overflow-hidden
        border
        ${theme.borderSoft}
        bg-card
        p-0
        shadow-none
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border
        hover:${theme.border}
        hover:shadow-md
        ${className}
      `}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150"
        style={{ backgroundColor: `${theme.softHex}44` }}
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Content */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${theme.solid}`}
              />

              <p className="text-xs font-bold text-ink/45">{label}</p>
            </div>

            <p
              className={`mt-3 text-3xl font-black leading-none tracking-[-0.04em] sm:text-4xl ${theme.text}`}
            >
              {value}
            </p>

            {description && (
              <p className="mt-3 max-w-[230px] text-[11px] font-medium leading-5 text-ink/35">
                {description}
              </p>
            )}
          </div>

          {/* Icon */}
          {Icon && (
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${theme.chip} ring-1 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${theme.border}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Footer */}
        {(footer || trend) && (
          <div className="mt-6 flex items-center justify-between gap-3">
            {footer && (
              <span className="text-[10px] font-bold text-ink/25">
                {footer}
              </span>
            )}

            {trend && (
              <span
                className={`rounded-lg px-2 py-1 text-[10px] font-black ${theme.chip}`}
              >
                {trend}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Accent */}
      <div
        className={`absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full ${theme.solid}`}
      />
    </Card>
  );
}
