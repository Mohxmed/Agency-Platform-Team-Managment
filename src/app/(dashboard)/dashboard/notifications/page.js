"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  BriefcaseBusiness,
  Users,
  PackageCheck,
  ListChecks,
  MessageSquare,
  Paperclip,
  AlertCircle,
  Info,
  Inbox,
  Sparkles,
  ExternalLink,
  ArrowUpLeft,
  ShieldCheck,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";

import { ProtectedRoute } from "@/features/auth";
import { useAuth } from "@/features/auth";

import PageHero from "@/features/dashboard/components/PageHero";
import Button from "@/features/dashboard/ui/Button";

import { useToast } from "@/hooks/useToast";

import {
  subscribeToNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "@/lib/firestoreService";

const PAGE_SIZE = 8;

/* =========================================================
   TYPE META
========================================================= */

function getNotificationType(type) {
  switch (type) {
    case "project":
      return {
        icon: BriefcaseBusiness,
        chip: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
        glow: "bg-blue-500/[0.06]",
        solid: "bg-blue-500",
      };

    case "team":
      return {
        icon: Users,
        chip: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
        glow: "bg-violet-500/[0.06]",
        solid: "bg-violet-500",
      };

    case "delivery":
      return {
        icon: PackageCheck,
        chip: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
        glow: "bg-emerald-500/[0.06]",
        solid: "bg-emerald-500",
      };

    case "task":
      return {
        icon: ListChecks,
        chip: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
        glow: "bg-sky-500/[0.06]",
        solid: "bg-sky-500",
      };

    case "comment":
      return {
        icon: MessageSquare,
        chip: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
        glow: "bg-indigo-500/[0.06]",
        solid: "bg-indigo-500",
      };

    case "checklist":
      return {
        icon: ListChecks,
        chip: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
        glow: "bg-emerald-500/[0.06]",
        solid: "bg-emerald-500",
      };

    case "attachment":
      return {
        icon: Paperclip,
        chip: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
        glow: "bg-sky-500/[0.06]",
        solid: "bg-sky-500",
      };

    case "warning":
      return {
        icon: AlertCircle,
        chip: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
        glow: "bg-amber-500/[0.06]",
        solid: "bg-amber-500",
      };

    case "الحساب":
    case "account":
      return {
        icon: ShieldCheck,
        chip: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
        glow: "bg-red-500/[0.06]",
        solid: "bg-red-500",
      };

    default:
      return {
        icon: Info,
        chip: "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary-300",
        glow: "bg-primary/[0.06]",
        solid: "bg-primary",
      };
  }
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(timestamp) {
  if (!timestamp) return "الآن";

  const date = timestamp?.toDate?.() || new Date(timestamp);

  if (Number.isNaN(date?.getTime?.())) return "الآن";

  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatFullDate(timestamp) {
  if (!timestamp) return "الآن";

  const date = timestamp?.toDate?.() || new Date(timestamp);

  if (Number.isNaN(date?.getTime?.())) return "الآن";

  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/* =========================================================
   PAGE
========================================================= */

function NotificationsPageContent() {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [busyAction, setBusyAction] = useState(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  /* =========================================================
     REAL-TIME SUBSCRIPTION
  ========================================================= */

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToNotifications(user.uid, (data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user?.uid]);

  /* =========================================================
     READ USER PREFERENCE
  ========================================================= */

  useEffect(() => {
    if (!user?.uid) return;

    getDoc(doc(db, "profiles", user.uid))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const value = snapshot.data()?.notificationsEnabled;

          setNotificationsEnabled(value !== false);
        }
      })
      .catch(() => {
        // Best-effort.
      });
  }, [user?.uid]);

  /* =========================================================
     DERIVED
  ========================================================= */

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(notifications.length / PAGE_SIZE),
  );

  const safePage = Math.min(currentPage, totalPages);

  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return notifications.slice(start, start + PAGE_SIZE);
  }, [notifications, safePage]);

  /* =========================================================
     OPEN NOTIFICATION
  ========================================================= */

  async function handleOpen(notification) {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
      }

      if (notification.link) {
        router.push(notification.link);
      }
    } catch (error) {
      console.error("Failed to open notification:", error);
    }
  }

  /* =========================================================
     MARK ALL AS READ
  ========================================================= */

  async function handleMarkAllAsRead() {
    if (unreadCount === 0 || busyAction) return;

    setBusyAction("read");

    try {
      await markAllNotificationsAsRead(notifications);

      showToast({
        type: "success",
        title: "تمت القراءة",
        message: "تم تعيين جميع الإشعارات كمقروءة.",
      });
    } catch (error) {
      console.error("Failed to mark all as read:", error);

      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "تعذر تحديث حالة الإشعارات.",
      });
    } finally {
      setBusyAction(null);
    }
  }

  /* =========================================================
     DELETE ALL
  ========================================================= */

  async function handleDeleteAll() {
    if (notifications.length === 0 || busyAction) return;

    setBusyAction("delete-all");

    try {
      await deleteAllNotifications(user.uid);

      showToast({
        type: "success",
        title: "تم الحذف",
        message: "تم حذف جميع الإشعارات.",
      });
    } catch (error) {
      console.error("Failed to delete all:", error);

      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "تعذر حذف الإشعارات.",
      });
    } finally {
      setBusyAction(null);
    }
  }

  /* =========================================================
     TOGGLE NOTIFICATIONS
  ========================================================= */

  async function handleToggleNotifications() {
    if (busyAction) return;

    const next = !notificationsEnabled;

    setBusyAction("toggle");

    try {
      const profileRef = doc(db, "profiles", user.uid);

      const existing = await getDoc(profileRef);

      const profileData = {
        notificationsEnabled: next,
        updatedAt: serverTimestamp(),
        ...(existing.exists() ? existing.data() : {}),
      };

      await setDoc(profileRef, profileData, { merge: true });

      setNotificationsEnabled(next);

      await refreshProfile();

      showToast({
        type: "success",
        title: next ? "تم التفعيل" : "تم الإيقاف",
        message: next
          ? "سوف تصلك الإشعارات الجديدة."
          : "تم إيقاف الإشعارات مؤقتًا. يمكنك تفعيلها في أي وقت.",
      });
    } catch (error) {
      console.error("Failed to toggle notifications:", error);

      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "تعذر تحديث إعدادات الإشعارات.",
      });
    } finally {
      setBusyAction(null);
    }
  }

  /* =========================================================
     DELETE ONE
  ========================================================= */

  async function handleDeleteOne(event, notificationId) {
    event.stopPropagation();

    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div dir="rtl" className="space-y-6">
      <PageHero
        icon="Bell"
        eyebrow="مركز الإشعارات"
        title="كل الإشعارات"
        subtitle="تابع كل تحديثات المشاريع والمهام والفريق في مكان واحد."
        badge={`${notifications.length}`}
        color="red"
      >
        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
          {/* TOGGLE NOTIFICATIONS */}
          <button
            type="button"
            onClick={handleToggleNotifications}
            disabled={busyAction}
            className={`
              inline-flex
              items-center
              gap-2
              rounded-xl
              px-4
              py-3
              text-sm
              font-bold
              transition-all
              disabled:cursor-not-allowed
              disabled:opacity-60
              ${
                notificationsEnabled
                  ? "bg-white/15 text-white ring-1 ring-white/20 hover:bg-white/25"
                  : "bg-white text-red-700 shadow-md hover:bg-red-50"
              }
            `}
          >
            {busyAction === "toggle" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : notificationsEnabled ? (
              <BellOff size={16} />
            ) : (
              <Bell size={16} />
            )}

            {notificationsEnabled ? "إيقاف الإشعارات" : "تفعيل الإشعارات"}
          </button>

          {/* MARK ALL READ */}
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || busyAction}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-white/15
              px-4
              py-3
              text-sm
              font-bold
              text-white
              ring-1
              ring-white/20
              transition-all
              hover:bg-white/25
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {busyAction === "read" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCheck size={16} />
            )}

            تعيين الكل كمقروء
          </button>

          {/* DELETE ALL */}
          <button
            type="button"
            onClick={handleDeleteAll}
            disabled={notifications.length === 0 || busyAction}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-white/15
              px-4
              py-3
              text-sm
              font-bold
              text-white
              ring-1
              ring-white/20
              transition-all
              hover:bg-white/25
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {busyAction === "delete-all" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}

            حذف الكل
          </button>
        </div>
      </PageHero>

      {/* =====================================================
          SUMMARY STRIP
      ====================================================== */}

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          icon={Inbox}
          label="إجمالي الإشعارات"
          value={notifications.length}
          tone="red"
          delay={0}
        />

        <SummaryCard
          icon={Bell}
          label="غير مقروءة"
          value={unreadCount}
          tone="amber"
          delay={0.06}
        />

        <SummaryCard
          icon={notificationsEnabled ? Bell : BellOff}
          label={notificationsEnabled ? "الإشعارات مفعلة" : "الإشعارات متوقفة"}
          value={notificationsEnabled ? "نشط" : "متوقف"}
          tone={notificationsEnabled ? "emerald" : "gray"}
          delay={0.12}
        />
      </div>

      {/* =====================================================
          NOTIFICATIONS LIST
      ====================================================== */}

      <section
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-ink/[0.07]
          bg-card
          shadow-[0_1px_2px_rgba(0,0,0,0.04)]
        "
      >
        {/* LIST HEADER */}

        <header
          className="
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-ink/[0.05]
            px-5
            py-4
          "
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bell size={16} />
            </span>

            <div>
              <h2 className="text-sm font-black text-ink">سجل الإشعارات</h2>

              <p className="text-[11px] text-ink/55">
                آخر التحديثات مرتبة من الأحدث
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black text-primary">
              {notifications.length} إشعار
            </span>
          )}
        </header>

        {/* BODY */}

        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse gap-4 rounded-2xl border border-ink/[0.05] p-4"
              >
                <div className="h-11 w-11 shrink-0 rounded-xl bg-ink/[0.05]" />

                <div className="flex-1 space-y-2.5">
                  <div className="h-3 w-40 rounded bg-ink/[0.05]" />

                  <div className="h-3 w-64 max-w-full rounded bg-ink/[0.04]" />

                  <div className="h-2.5 w-24 rounded bg-ink/[0.03]" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div
            className="
              flex
              min-h-[360px]
              flex-col
              items-center
              justify-center
              px-6
              py-12
              text-center
            "
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-[28px]
                bg-gradient-to-br
                from-primary/10
                to-primary/[0.03]
                text-primary/50
              "
            >
              <Inbox size={36} />
            </motion.div>

            <h3 className="mt-5 text-base font-black text-ink">
              لا توجد إشعارات
            </h3>

            <p className="mt-1.5 max-w-[280px] text-sm leading-6 text-ink/55">
              أي تحديث في المشاريع أو المهام أو الفريق هيظهر هنا فورًا.
            </p>

            <Link
              href="/dashboard"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-primary-600
                px-5
                py-2.5
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-primary-600/20
                transition-all
                hover:-translate-y-0.5
                hover:bg-primary-700
              "
            >
              <ArrowUpLeft size={14} />
              العودة للوحة التحكم
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-ink/[0.04]">
              <AnimatePresence initial={false}>
                {paged.map((notification, index) => {
                  const { icon: Icon, chip, glow, solid } =
                    getNotificationType(notification.type);

                  return (
                    <motion.article
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.03,
                        duration: 0.28,
                        ease: "easeOut",
                      }}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpen(notification)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleOpen(notification);
                      }}
                      className={`
                        group
                        relative
                        flex
                        cursor-pointer
                        gap-4
                        px-5
                        py-5
                        text-right
                        transition
                        hover:bg-ink/[0.015]
                        ${
                          !notification.read
                            ? "bg-primary/[0.02]"
                            : ""
                        }
                      `}
                    >
                      {/* Unread accent bar */}

                      {!notification.read && (
                        <span
                          className={`absolute inset-y-0 right-0 w-1 rounded-l-full ${solid}`}
                        />
                      )}

                      {/* ICON */}

                      <div className="relative shrink-0">
                        <span
                          className={`absolute inset-0 rounded-2xl ${glow} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100`}
                        />

                        <div
                          className={`relative flex h-11 w-11 items-center justify-center rounded-2xl ${chip}`}
                        >
                          <Icon size={18} />
                        </div>
                      </div>

                      {/* TEXT */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p
                            className={`
                              text-sm
                              leading-5
                              ${
                                notification.read
                                  ? "font-semibold text-ink/70"
                                  : "font-black text-ink"
                              }
                            `}
                          >
                            {notification.title}
                          </p>

                          {!notification.read && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-ink/55">
                          {notification.message}
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {notification.projectTitle && (
                            <span className="rounded-md bg-primary/[0.07] px-2 py-0.5 text-[10px] font-bold text-primary">
                              {notification.projectTitle}
                            </span>
                          )}

                          <span className="text-[10px] text-ink/40">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* HOVER ACTIONS */}

                      <div className="flex shrink-0 items-center gap-1 self-center">
                        {notification.link && (
                          <span className="hidden h-8 w-8 items-center justify-center rounded-lg text-ink/35 group-hover:flex">
                            <ExternalLink size={14} />
                          </span>
                        )}

                        <button
                          type="button"
                          aria-label="حذف الإشعار"
                          onClick={(event) =>
                            handleDeleteOne(event, notification.id)
                          }
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-ink/35
                            opacity-0
                            transition-all
                            hover:bg-red-50
                            hover:text-red-500
                            group-hover:opacity-100
                          "
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* =================================================
                PAGINATION
            ================================================== */}

            {totalPages > 1 && (
              <footer
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  border-t
                  border-ink/[0.05]
                  px-5
                  py-4
                "
              >
                <p className="text-[11px] font-medium text-ink/50">
                  صفحة {safePage} من {totalPages}
                </p>

                <div className="flex items-center gap-1.5">
                  <PaginationButton
                    label="السابقة"
                    disabled={safePage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    <ChevronRight size={16} />
                  </PaginationButton>

                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - safePage) <= 1,
                    )
                    .reduce((acc, page, index, arr) => {
                      if (index > 0 && page - arr[index - 1] > 1) {
                        acc.push("ellipsis");
                      }

                      acc.push(page);

                      return acc;
                    }, [])
                    .map((page, index) =>
                      page === "ellipsis" ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-1.5 text-xs text-ink/35"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`
                            flex
                            h-9
                            min-w-9
                            items-center
                            justify-center
                            rounded-xl
                            px-2
                            text-xs
                            font-black
                            transition-all
                            ${
                              page === safePage
                                ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                                : "text-ink/60 hover:bg-ink/[0.04] hover:text-ink"
                            }
                          `}
                        >
                          {page}
                        </button>
                      ),
                    )}

                  <PaginationButton
                    label="التالية"
                    disabled={safePage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    <ChevronLeft size={16} />
                  </PaginationButton>
                </div>
              </footer>
            )}
          </>
        )}
      </section>

      {/* =====================================================
          FOOTER NOTE
      ====================================================== */}

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-ink/45">
        <Sparkles size={12} className="text-primary/60" />

        تُحذف الإشعارات المحذوفة نهائيًا ولا يمكن استعادتها.
      </p>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

const SUMMARY_TONES = {
  red: {
    chip: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
    dot: "bg-red-500",
  },
  amber: {
    chip: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  emerald: {
    chip: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  gray: {
    chip: "bg-ink/[0.06] text-ink/60 dark:bg-ink/[0.12] dark:text-ink/50",
    dot: "bg-ink/40",
  },
};

function SummaryCard({ icon: Icon, label, value, tone, delay }) {
  const colors = SUMMARY_TONES[tone] || SUMMARY_TONES.gray;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      className="
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-ink/[0.07]
        bg-card
        p-5
        shadow-[0_1px_2px_rgba(0,0,0,0.04)]
      "
    >
      <span
        className={`absolute -left-6 -top-6 h-20 w-20 rounded-full ${colors.chip} opacity-20 blur-2xl`}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-ink/55">{label}</p>

          <p className="mt-1.5 text-2xl font-black tracking-tight text-ink">
            {value}
          </p>
        </div>

        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${colors.chip}`}
        >
          <Icon size={18} />
        </span>
      </div>

      <span
        className={`absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full ${colors.dot}`}
      />
    </motion.div>
  );
}

/* =========================================================
   PAGINATION BUTTON
========================================================= */

function PaginationButton({
  label,
  disabled,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="
        flex
        h-9
        items-center
        gap-1
        rounded-xl
        px-2.5
        text-xs
        font-bold
        text-ink/60
        transition-all
        hover:bg-ink/[0.04]
        hover:text-ink
        disabled:cursor-not-allowed
        disabled:opacity-40
        disabled:hover:bg-transparent
      "
    >
      {children}
      {label}
    </button>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export default function NotificationsPage() {
  return (
    <ProtectedRoute permission="dashboard">
      <NotificationsPageContent />
    </ProtectedRoute>
  );
}
