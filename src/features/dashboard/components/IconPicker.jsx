"use client";

import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { Search, Check, ChevronDown } from "lucide-react";

import { usePageTheme } from "../hooks/usePageTheme";

export default function IconPicker({
  label = "الأيقونة",
  value = "",
  onChange,
}) {
  const theme = usePageTheme();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  /*
   * =========================================================
   * NORMALIZE VALUE
   * =========================================================
   *
   * Firebase لازم يخزن اسم الأيقونة فقط:
   *
   * "Palette"
   * "Video"
   * "School"
   *
   * لو لأي سبب وصل object / component
   * هنرجع لقيمة آمنة.
   */

  const iconValue = typeof value === "string" ? value : "";

  /*
   * =========================================================
   * ICON NAMES
   * =========================================================
   */

  const iconNames = useMemo(() => {
    const query = search.trim().toLowerCase();

    return Object.keys(Icons)
      .filter((name) => {
        const Icon = Icons[name];

        /*
         * نستبعد أي exports مش Icons حقيقية
         */
        if (typeof Icon !== "object" && typeof Icon !== "function") {
          return false;
        }

        /*
         * نستبعد الأسماء الخاصة
         */
        if (name === "createLucideIcon" || name === "IconNode") {
          return false;
        }

        return true;
      })
      .filter((name) => {
        if (!query) return true;

        return name.toLowerCase().includes(query);
      })
      .slice(0, 100);
  }, [search]);

  /*
   * =========================================================
   * SELECTED ICON
   * =========================================================
   */

  const SelectedIcon =
    iconValue && Icons[iconValue] ? Icons[iconValue] : Icons.Sparkles;

  /*
   * =========================================================
   * HANDLE SELECT
   * =========================================================
   */

  const handleSelect = (name) => {
    /*
     * مهم جدًا:
     * نرسل STRING فقط للـ parent
     */

    onChange?.(String(name));

    setOpen(false);
    setSearch("");
  };

  return (
    <div className="relative">
      {/* LABEL */}

      <label className="mb-2 block text-sm font-bold text-ink">{label}</label>

      {/* =====================================================
          SELECTED
      ====================================================== */}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex
          h-12
          w-full
          items-center
          justify-between
          rounded-xl
          border
          px-4
          text-sm
          transition
          focus:bg-card
          ${theme.borderSoft}
          ${theme.searchBg}
          ${theme.searchHover}
          ${theme.focus}
        `}
      >
        <span className="flex items-center gap-3">
          <span
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              ${theme.bgSoftStrong}
              ${theme.text}
            `}
          >
            <SelectedIcon className="h-4 w-4" />
          </span>

          <span className="font-semibold">{iconValue || "اختر أيقونة"}</span>
        </span>

        <ChevronDown
          className={`
            h-4
            w-4
            transition
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* =====================================================
          DROPDOWN
      ====================================================== */}

      {open && (
        <div
          className={`
            absolute
            z-50
            mt-2
            w-full
            overflow-hidden
            rounded-2xl
            border
            bg-card
            p-3
            shadow-[0_20px_60px_rgba(0,0,0,0.12)]
            ${theme.borderSoft}
          `}
        >
          {/* =================================================
              SEARCH
          ================================================== */}

          <div className="relative mb-3">
            <Search
              className="
                absolute
                right-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن أيقونة..."
              autoFocus
              className={`
                h-10
                w-full
                rounded-xl
                border
                border-gray-100
                bg-gray-50
                pr-9
                pl-3
                text-sm
                outline-none
                transition
                focus:bg-card
                focus:border-red-200
              `}
            />
          </div>

          {/* =================================================
              ICONS
          ================================================== */}

          <div
            className="
              grid
              max-h-72
              grid-cols-5
              gap-2
              overflow-y-auto
              p-1
            "
          >
            {iconNames.map((name) => {
              const Icon = Icons[name];

              if (!Icon) {
                return null;
              }

              const selected = iconValue === name;

              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => handleSelect(name)}
                  className={`
                    group
                    relative
                    flex
                    h-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    transition-all

                    ${
                      selected
                        ? `${theme.border} ${theme.bgSoft} ${theme.text}`
                        : `
                          border-gray-100
                          bg-card
                          text-gray-500
                          ${theme.hoverBorder}
                          ${theme.hoverBgSoft}
                        `
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />

                  {selected && (
                    <span
                      className={`
                        absolute
                        -right-1
                        -top-1
                        flex
                        h-4
                        w-4
                        items-center
                        justify-center
                        rounded-full
                        ${theme.solid}
                        ${theme.solidText}
                      `}
                    >
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* =================================================
              EMPTY
          ================================================== */}

          {iconNames.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-400">
              مفيش أيقونة بالاسم ده
            </div>
          )}
        </div>
      )}
    </div>
  );
}
