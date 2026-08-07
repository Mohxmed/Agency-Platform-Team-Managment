"use client";

import { getThemeByName } from "@/constants/pageThemes";
import { usePageTheme } from "../hooks/usePageTheme";

export default function StatsCard({
  label,
  value,
  icon: Icon,
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
    <div
      className={`
        rounded-[20px]
        border
        border-black/[0.06]
        bg-card
        p-5
        shadow-[0_1px_2px_rgba(0,0,0,0.05)]
        transition-shadow
        duration-300
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]
        dark:border-white/[0.08]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]
        dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink/60">{label}</p>

          <h3 className="mt-2 text-3xl font-bold leading-none tracking-tight text-ink">
            {value}
          </h3>
        </div>

        {Icon && (
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              transition-transform
              duration-300
              hover:scale-105
            "
            style={{ backgroundColor: `${theme.hex}14` }}
          >
            <Icon
              className={`
                h-5
                w-5
                ${theme.text}
              `}
            />
          </div>
        )}
      </div>

      {trend && (
        <span
          className={`
            mt-4
            inline-flex
            rounded-full
            ${theme.chip}
            px-2.5
            py-0.5
            text-[11px]
            font-semibold
          `}
        >
          {trend}
        </span>
      )}
    </div>
  );
}
