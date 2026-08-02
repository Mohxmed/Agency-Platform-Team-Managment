"use client";

import {
  Search,
  ArrowUpLeft,
  FolderKanban,
  Tags,
  Users,
  Settings,
  MessageSquare,
  LayoutDashboard,
  Command,
  X,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const SEARCH_ITEMS = [
  {
    title: "لوحة التحكم",
    description: "نظرة عامة على لوحة التحكم",
    keywords: "dashboard home الرئيسية لوحة التحكم",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "المشاريع",
    description: "إدارة أعمال ومشاريع الموقع",
    keywords: "projects portfolio أعمال مشاريع بورتفوليو work",
    href: "/dashboard/portfolio",
    icon: FolderKanban,
  },

  {
    title: "التصنيفات",
    description: "إدارة تصنيفات المشاريع",
    keywords: "categories category تصنيفات تصنيف",
    href: "/dashboard/categories",
    icon: Tags,
  },

  {
    title: "المستخدمون",
    description: "إدارة مستخدمي النظام والأدوار",
    keywords: "users user مستخدمين مستخدم accounts صلاحيات",
    href: "/dashboard/settings/users",
    icon: Users,
  },

  {
    title: "بيانات التواصل",
    description: "البريد والهاتف والعنوان والخرائط",
    keywords: "messages message contact رسائل رسالة تواصل بيانات",
    href: "/dashboard/settings/contact",
    icon: MessageSquare,
  },

  {
    title: "الإعدادات",
    description: "إدارة إعدادات الحساب",
    keywords: "settings account profile إعدادات حساب",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const inputRef = useRef(null);

  /* =========================================================
     FILTER RESULTS
  ========================================================= */

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return SEARCH_ITEMS;
    }

    return SEARCH_ITEMS.filter((item) => {
      const searchableText = `
        ${item.title}
        ${item.description}
        ${item.keywords}
      `.toLowerCase();

      return searchableText.includes(value);
    });
  }, [query]);

  /* =========================================================
     CTRL + K / CMD + K / ESC
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isSearchShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

      if (!isSearchShortcut) {
        if (event.key === "Escape") {
          setOpen(false);
          inputRef.current?.blur();
        }

        return;
      }

      // مهم جدًا لمنع Chrome من فتح Search
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      setOpen(true);

      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    };

    // capture = true
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);
  /* =========================================================
     NAVIGATE
  ========================================================= */

  function handleNavigate(href) {
    setOpen(false);
    setQuery("");

    router.push(href);
  }

  /* =========================================================
     ENTER
  ========================================================= */

  function handleInputKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (results.length > 0) {
        handleNavigate(results[0].href);
      }

      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  /* =========================================================
     CLEAR
  ========================================================= */

  function handleClear() {
    setQuery("");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  return (
    <div
      className="
        relative
        w-full
        sm:w-80
        lg:w-80
        xl:w-96
      "
    >
      {/* =====================================================
          SEARCH INPUT
      ===================================================== */}

      <div className="group relative">
        {/* SEARCH ICON */}

        <Search
          size={20}
          strokeWidth={2}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            z-10
            -translate-y-1/2
            text-gray-400
            transition-all
            duration-200
            group-focus-within:text-primary
            group-focus-within:scale-105
          "
        />

        {/* INPUT */}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (
              (event.ctrlKey || event.metaKey) &&
              event.key.toLowerCase() === "k"
            ) {
              event.preventDefault();
              event.stopPropagation();

              setOpen(true);
              inputRef.current?.focus();

              return;
            }

            handleInputKeyDown(event);
          }}
          placeholder="ابحث في لوحة التحكم..."
          autoComplete="off"
          className="
            h-12
            w-full
            rounded-2xl
            bg-surface-muted
            pl-12
            pr-28
            text-sm
            font-medium
            text-ink
            outline-none

            shadow-[inset_0_0_0_1px_rgba(0,0,0,0.025)]

            transition-all
            duration-200

            placeholder:text-gray-400

            hover:bg-gray-100/80

            focus:bg-card

            focus:shadow-[0_10px_35px_rgba(0,0,0,0.07)]

            focus:ring-4
            focus:ring-primary/10
          "
        />

        {/* ===================================================
            RIGHT SIDE
        ==================================================== */}

        <div
          className="
            absolute
            right-3
            top-1/2
            flex
            -translate-y-1/2
            items-center
            gap-2
          "
        >
          {/* CLEAR */}

          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="مسح البحث"
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                text-gray-400
                transition-all
                hover:bg-gray-100
                hover:text-ink
              "
            >
              <X size={15} />
            </button>
          )}

          {/* SHORTCUT */}

          {!query && (
            <kbd
              className="
                hidden
                items-center
                gap-1
                rounded-lg
                border
                border-ink/[0.05]
                bg-card
                px-2
                py-1
                text-[10px]
                font-bold
                text-gray-400
                shadow-sm
                sm:flex
              "
            >
              <Command size={10} />

              <span className="text-[9px]">Ctrl</span>

              <span className="text-gray-300">+</span>

              <span>K</span>
            </kbd>
          )}
        </div>
      </div>

      {/* =====================================================
          BACKDROP + RESULTS
      ===================================================== */}

      {open && (
        <>
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="إغلاق البحث"
            onClick={() => setOpen(false)}
            className="
              fixed
              inset-0
              z-40
              cursor-default
              bg-ink/[0.01]
            "
          />

          {/* =================================================
              RESULTS DROPDOWN
          ================================================= */}

          <div
            className="
              absolute
              left-1/2
              top-[calc(100%+12px)]
              z-50
              w-[min(420px,calc(100vw-2rem))]
              -translate-x-1/2
              overflow-hidden
              rounded-[1.5rem]
              border
              border-ink/[0.05]
              bg-card
              p-2

              shadow-[0_30px_90px_rgba(0,0,0,0.16)]

              animate-in
              fade-in
              slide-in-from-top-2
              duration-200

              sm:w-[420px]
              xl:w-[460px]
            "
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                px-3
                py-2.5
              "
            >
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary/10
                    text-primary
                  "
                >
                  <Search size={14} />
                </div>

                <p className="text-[11px] font-bold text-gray-400">
                  {query ? "نتائج البحث" : "الوصول السريع"}
                </p>
              </div>

              {query && (
                <span className="text-[10px] font-medium text-gray-400">
                  {results.length} نتيجة
                </span>
              )}
            </div>

            {/* =================================================
                RESULTS
            ================================================= */}

            {results.length > 0 ? (
              <div className="max-h-[360px] space-y-1 overflow-y-auto">
                {results.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => handleNavigate(item.href)}
                      className="
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-right
                        transition-all
                        duration-200

                        hover:bg-surface-muted

                        active:scale-[0.99]
                      "
                    >
                      {/* ICON */}

                      <span
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-surface-muted
                          text-gray-500

                          transition-all
                          duration-200

                          group-hover:bg-primary/10
                          group-hover:text-primary
                          group-hover:scale-105
                        "
                      >
                        <Icon size={18} />
                      </span>

                      {/* INFO */}

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            truncate
                            text-sm
                            font-bold
                            text-ink
                          "
                        >
                          {item.title}
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[11px]
                            text-gray-400
                          "
                        >
                          {item.description}
                        </p>
                      </div>

                      {/* ARROW */}

                      <span
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          text-gray-300

                          transition-all
                          duration-200

                          group-hover:bg-card
                          group-hover:text-primary
                          group-hover:shadow-sm
                        "
                      >
                        <ArrowUpLeft
                          size={16}
                          className="
                            transition-transform
                            duration-200
                            group-hover:-translate-x-0.5
                            group-hover:-translate-y-0.5
                          "
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* =================================================
                 EMPTY STATE
              ================================================= */

              <div
                className="
                  px-4
                  py-10
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gray-100
                    text-gray-400
                  "
                >
                  <Search size={19} />
                </div>

                <p
                  className="
                    mt-3
                    text-sm
                    font-bold
                    text-ink
                  "
                >
                  لا توجد نتائج
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-400
                  "
                >
                  جرّب البحث باستخدام كلمة مختلفة
                </p>
              </div>
            )}

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              className="
                mt-2
                flex
                items-center
                justify-between
                border-t
                border-ink/[0.04]
                px-3
                py-2.5
              "
            >
              <div className="flex items-center gap-2">
                <kbd
                  className="
                    rounded-md
                    bg-gray-100
                    px-1.5
                    py-0.5
                    text-[9px]
                    font-bold
                    text-gray-500
                  "
                >
                  Enter
                </kbd>

                <span className="text-[10px] text-gray-400">فتح النتيجة</span>
              </div>

              <div className="flex items-center gap-2">
                <kbd
                  className="
                    rounded-md
                    bg-gray-100
                    px-1.5
                    py-0.5
                    text-[9px]
                    font-bold
                    text-gray-500
                  "
                >
                  Esc
                </kbd>

                <span className="text-[10px] text-gray-400">إغلاق</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
