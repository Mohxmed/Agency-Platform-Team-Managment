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
  Images,
  GraduationCap,
  Wallet,
  Globe2,
  FileText,
  LayoutTemplate,
  Share2,
  BarChart3,
  UserCog,
  Bell,
  ShieldCheck,
  ClipboardList,
  UsersRound,
  Layers,
  ListTodo,
  Pencil,
  ExternalLink,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* =========================================================
   SEARCH INDEX — static data, no database
   كل صفحات وإعدادات لوحة التحكم في فهرس واحد
========================================================= */

const GROUP_ORDER = [
  "الرئيسية",
  "إدارة الموقع",
  "الفريق",
  "الإعدادات",
  "الملف الشخصي",
];

const SEARCH_ITEMS = [
  /* =============== الرئيسية =============== */
  {
    title: "لوحة التحكم",
    description: "نظرة عامة على نشاط الفريق والأعمال",
    keywords:
      "dashboard home الرئيسية لوحة التحكم نظرة عامة overview cms هيب هيبو مرحبا ترحيب",
    href: "/dashboard",
    icon: LayoutDashboard,
    group: "الرئيسية",
  },

  /* =============== إدارة الموقع =============== */
  {
    title: "محفظة الأعمال",
    description: "إدارة أعمال ومشاريع الموقع",
    keywords:
      "portfolio works gallery مشاريع أعمال بورتفوليو معرض صور work projects معرض الاعمال",
    href: "/dashboard/portfolio",
    icon: FolderKanban,
    group: "إدارة الموقع",
  },

  {
    title: "التصنيفات",
    description: "إدارة تصنيفات المشاريع",
    keywords:
      "categories category tags تصنيفات تصنيف فئات types انواع أقسام الاعمال",
    href: "/dashboard/categories",
    icon: Tags,
    group: "إدارة الموقع",
  },

  {
    title: "العملاء",
    description: "إدارة عملاء وشركاء الموقع",
    keywords:
      "clients client customers عملاء عميل شركاء شريك teachers معلمين حسابات العملاء",
    href: "/dashboard/teachers",
    icon: GraduationCap,
    group: "إدارة الموقع",
  },

  {
    title: "الخدمات",
    description: "إدارة خدمات الموقع",
    keywords:
      "services service خدمات خدمة باقات الاعمال مزايا ميزات what we do",
    href: "/dashboard/services",
    icon: MessageSquare,
    group: "إدارة الموقع",
  },

  {
    title: "إدارة الأسعار",
    description: "إدارة باقات وأسعار الخدمات",
    keywords:
      "pricing price plans costs أسعار سعر باقات خطط تكاليف plans rates تسعير",
    href: "/dashboard/pricing",
    icon: Wallet,
    group: "إدارة الموقع",
  },

  /* =============== الفريق =============== */
  {
    title: "مهماتي",
    description: "المهام المسندة إليك مع لوحة كانبان",
    keywords:
      "my tasks مهماتي مهامي مهام kanban لوحة كانبان مهامي المهام المكلف بها",
    href: "/dashboard/team/my-tasks",
    icon: ClipboardList,
    group: "الفريق",
  },

  {
    title: "الفريق",
    description: "نظرة عامة على نشاط الفريق والمشاريع",
    keywords:
      "team overview فريقي الفريق نشاط الفريق فريق العمل team activity إحصائيات الفريق",
    href: "/dashboard/team",
    icon: UsersRound,
    group: "الفريق",
  },

  {
    title: "الأعضاء",
    description: "إدارة أعضاء الفريق وملفاتهم",
    keywords:
      "members member أعضاء عضو فريق اعضاء profile ملفات الفريق profiles",
    href: "/dashboard/team/members",
    icon: Users,
    group: "الفريق",
  },

  {
    title: "المشاريع",
    description: "إدارة مشاريع الفريق ومتابعتها",
    keywords:
      "projects project مشاريع مشروع team projects مشاريع الفريق مشروع فريق",
    href: "/dashboard/team/projects",
    icon: FolderKanban,
    group: "الفريق",
  },

  {
    title: "المهمات الفردية",
    description: "المهمات المستقلة التي لا تتبع مشروعًا",
    keywords:
      "single tasks مهمات فردية مستقلة standalone مهمات مستقلة بدون مشروع",
    href: "/dashboard/team/single-tasks",
    icon: Layers,
    group: "الفريق",
  },

  {
    title: "كل المهام",
    description: "عرض وتتبع جميع مهام الفريق",
    keywords:
      "all tasks كل المهام جميع المهام all-tasks tracking تتبع المهام جدول المهام",
    href: "/dashboard/team/all-tasks",
    icon: ListTodo,
    group: "الفريق",
  },

  {
    title: "لوحة التقدم",
    description: "لوحة تقدم المهام والأعضاء",
    keywords:
      "progress board تقدم إنجاز لوحة التقدم progress التقدم progress report تقرير",
    href: "/dashboard/team/progress",
    icon: BarChart3,
    group: "الفريق",
  },

  /* =============== الإعدادات =============== */
  {
    title: "الإعدادات",
    description: "نظرة عامة على جميع إعدادات الموقع",
    keywords:
      "settings overview إعدادات الإعدادات نظرة عامة تحكم كل الاعدادات setting control",
    href: "/dashboard/settings",
    icon: Settings,
    group: "الإعدادات",
  },

  {
    title: "الهوية العامة",
    description: "اسم الموقع، الوصف، الواتساب والحقوق",
    keywords:
      "identity name logo description الهوية الاسم الشعار الوصف واتساب whatsapp حقوق النشر copyright هوية الموقع",
    href: "/dashboard/settings/general",
    icon: Globe2,
    group: "الإعدادات",
  },

  {
    title: "المحتوى الثابت",
    description: "نصوص أقسام الصفحة الرئيسية",
    keywords:
      "content ثابت نصوص المحتوى الواجهة hero الفوتر footer الرئيسية نصوص الصفحة content static",
    href: "/dashboard/settings/content",
    icon: FileText,
    group: "الإعدادات",
  },

  {
    title: "الأقسام",
    description: "إظهار أو إخفاء أقسام الصفحة الرئيسية",
    keywords:
      "sections toggles أقسام إظهار إخفاء اظهار اخفاء مفاتيح show hide sections الرئيسية",
    href: "/dashboard/settings/sections",
    icon: LayoutTemplate,
    group: "الإعدادات",
  },

  {
    title: "بيانات التواصل",
    description: "البريد، الهاتف، العنوان، الخرائط والواتساب",
    keywords:
      "contact تواصل بيانات التواصل بريد email هاتف phone عنوان address خريطة maps واتساب whatsapp بيانات الاتصال",
    href: "/dashboard/settings/contact",
    icon: MessageSquare,
    group: "الإعدادات",
  },

  {
    title: "السوشيال ميديا",
    description: "روابط فيسبوك، انستجرام، لينكدإن ويوتيوب وتيك توك",
    keywords:
      "social media روابط منصات تواصل فيسبوك facebook انستجرام instagram لينكدإن linkedin يوتيوب youtube تيك توك tiktok تويتر twitter x وسائل التواصل",
    href: "/dashboard/settings/social",
    icon: Share2,
    group: "الإعدادات",
  },

  {
    title: "SEO",
    description: "تحسين محركات البحث وظهور الموقع",
    keywords:
      "seo محركات بحث keywords كلمات مفتاحية وصف description meta اوبن جراف og صورة مشاركة سيو تحسين البحث",
    href: "/dashboard/settings/seo",
    icon: Search,
    group: "الإعدادات",
  },

  {
    title: "إحصائيات الرئيسية",
    description: "أرقام الإنجازات المعروضة في الصفحة الرئيسية",
    keywords:
      "stats إحصائيات أرقام numbers achievements انجازات عدادات counters أرقام الرئيسية",
    href: "/dashboard/settings/stats",
    icon: BarChart3,
    group: "الإعدادات",
  },

  {
    title: "المستخدمون",
    description: "إدارة الحسابات والأدوار والصلاحيات",
    keywords:
      "users user accounts حسابات مستخدمين مستخدم أدوار roles صلاحيات permissions members admins مسؤول مدير أعضاء",
    href: "/dashboard/settings/users",
    icon: Users,
    group: "الإعدادات",
  },

  {
    title: "التسجيل والدخول",
    description: "السماح أو إيقاف إنشاء الحسابات الجديدة",
    keywords:
      "auth registration login تسجيل دخول إنشاء حساب register authentication مصادقة تسجيل الدخول",
    href: "/dashboard/settings/auth",
    icon: UserCog,
    group: "الإعدادات",
  },

  {
    title: "الإشعارات",
    description: "أنواع الأحداث التي يتابعها نظام الإشعارات",
    keywords:
      "notifications إشعارات تنبيهات alerts events أحداث push تنبيه نظام الاشعارات",
    href: "/dashboard/settings/notifications",
    icon: Bell,
    group: "الإعدادات",
  },

  {
    title: "النظام والأمان",
    description: "وضع الصيانة، اللغة والعملة",
    keywords:
      "system maintenance أمان صيانة لغة عملة currency language وضع الصيانة نظام الأمان security",
    href: "/dashboard/settings/system",
    icon: ShieldCheck,
    group: "الإعدادات",
  },

  /* =============== الملف الشخصي =============== */
  {
    title: "الملف الشخصي",
    description: "تعديل بياناتك وملفك في النظام",
    keywords:
      "profile file شخصي تعديل تحرير edit account بياناتي معلوماتي الحساب الشخصي الاعدادات الشخصية",
    href: "/dashboard/user",
    icon: Pencil,
    group: "الملف الشخصي",
  },

  {
    title: "معاينة الموقع",
    description: "فتح الموقع العام في نافذة جديدة",
    keywords:
      "view site preview معاينة معاينة الموقع موقع عام خارجي public site زيارة الموقع",
    href: "/",
    icon: ExternalLink,
    group: "الملف الشخصي",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getGroupLabel(item) {
  return item.group || "أخرى";
}

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

    const filtered = value
      ? SEARCH_ITEMS.filter((item) => {
          const searchableText = `
            ${item.title}
            ${item.description}
            ${item.keywords}
          `.toLowerCase();

          return searchableText.includes(value);
        })
      : SEARCH_ITEMS;

    // Grouped by group label, preserving GROUP_ORDER.
    const grouped = new Map();

    filtered.forEach((item) => {
      const label = getGroupLabel(item);

      if (!grouped.has(label)) {
        grouped.set(label, []);
      }

      grouped.get(label).push(item);
    });

    const sortedGroups = [...grouped.entries()].sort((a, b) => {
      const indexA = GROUP_ORDER.indexOf(a[0]);
      const indexB = GROUP_ORDER.indexOf(b[0]);

      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

    return sortedGroups.map(([label, items]) => ({ label, items }));
  }, [query]);

  const totalResults = useMemo(
    () => results.reduce((sum, group) => sum + group.items.length, 0),
    [results],
  );

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

    if (href === "/") {
      window.open("/", "_blank", "noopener,noreferrer");
      return;
    }

    router.push(href);
  }

  /* =========================================================
     ENTER
  ========================================================= */

  function handleInputKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (totalResults > 0) {
        handleNavigate(results[0].items[0].href);
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
            text-gray-500
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
          placeholder="ابحث في كل لوحة التحكم..."
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

            placeholder:text-gray-500

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
                text-gray-500
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
                text-gray-500
                shadow-sm
                sm:flex
              "
            >
              <Command size={10} />

              <span className="text-[9px]">Ctrl</span>

              <span className="text-gray-500">+</span>

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

                <p className="text-[11px] font-bold text-gray-500">
                  {query ? "نتائج البحث" : "الوصول السريع"}
                </p>
              </div>

              {query && (
                <span className="text-[10px] font-medium text-gray-500">
                  {totalResults} نتيجة
                </span>
              )}
            </div>

            {/* =================================================
                RESULTS
            ================================================= */}

            {totalResults > 0 ? (
              <div className="max-h-[380px] overflow-y-auto">
                {results.map((group) => (
                  <div key={group.label} className="mb-1">
                    {/* GROUP LABEL */}

                    <p
                      className="
                        flex
                        items-center
                        gap-2
                        px-3
                        pb-1.5
                        pt-2.5
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.14em]
                        text-gray-500
                      "
                    >
                      <span className="h-1 w-1 rounded-full bg-primary/50" />
                      {group.label}
                    </p>

                    {/* GROUP ITEMS */}

                    <div className="space-y-1">
                      {group.items.map((item) => {
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
                                  text-gray-500
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
                                text-gray-500

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
                  </div>
                ))}
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
                    text-gray-500
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
                    text-gray-500
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

                <span className="text-[10px] text-gray-500">فتح النتيجة</span>
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

                <span className="text-[10px] text-gray-500">إغلاق</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
