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
    <Card className={className}>
      <div className="relative p-6 sm:p-7">
        {/* Ambient color */}
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-52
            w-52
            rounded-full
            blur-3xl
            opacity-20
            transition-opacity
            duration-500
            group-hover:opacity-40
          "
          style={{
            backgroundColor: theme.softHex,
          }}
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${theme.solid}
                  `}
                />

                <p
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-ink/60
                  "
                >
                  {label}
                </p>
              </div>

              <h3
                className={`
                  mt-5
                  text-4xl
                  font-semibold
                  tracking-[-0.05em]
                  leading-none
                  ${theme.text}
                `}
              >
                {value}
              </h3>

              {description && (
                <p
                  className="
                    mt-4
                    max-w-[240px]
                    text-sm
                    leading-6
                    text-ink/60
                  "
                >
                  {description}
                </p>
              )}
            </div>

            {Icon && (
              <div
                className={`
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  ${theme.borderSoft}
                  bg-white/60
                  dark:bg-white/[0.05]
                  backdrop-blur-xl
                  transition-transform
                  duration-500
                  group-hover:scale-105
                `}
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


          {(footer || trend) && (
            <div
              className="
                mt-8
                flex
                items-center
                justify-between
                border-t
                border-black/[0.06]
                pt-5
                dark:border-white/[0.08]
              "
            >
              {footer && (
                <span
                  className="
                    text-xs
                    font-medium
                    text-ink/60
                  "
                >
                  {footer}
                </span>
              )}

              {trend && (
                <span
                  className={`
                    rounded-full
                    border
                    ${theme.borderSoft}
                    ${theme.chip}
                    px-3
                    py-1
                    text-[11px]
                    font-semibold
                  `}
                >
                  {trend}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}