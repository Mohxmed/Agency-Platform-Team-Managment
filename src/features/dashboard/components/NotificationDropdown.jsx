"use client";

import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  Trash2,
  BriefcaseBusiness,
  Users,
  PackageCheck,
  ListChecks,
  MessageSquare,
  Paperclip,
  AlertCircle,
  Info,
  ArrowUpLeft,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import Link from "next/link";

import { useAuth } from "@/features/auth";

import {
  subscribeToNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/lib/firestoreService";

export default function NotificationDropdown() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  /* =========================================================
     REAL-TIME NOTIFICATIONS
  ========================================================= */

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToNotifications(user.uid, (data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  /* =========================================================
     UNREAD
  ========================================================= */

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  function formatDate(timestamp) {
    if (!timestamp) {
      return "الآن";
    }

    const date = timestamp?.toDate?.() || new Date(timestamp);

    if (Number.isNaN(date?.getTime?.())) {
      return "الآن";
    }

    return new Intl.DateTimeFormat("ar-EG", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  /* =========================================================
     TYPE
  ========================================================= */

  function getNotificationType(type) {
    switch (type) {
      case "project":
        return {
          icon: BriefcaseBusiness,
          className: "bg-blue-50 text-blue-600",
        };

      case "team":
        return {
          icon: Users,
          className: "bg-violet-50 text-violet-600",
        };

      case "delivery":
        return {
          icon: PackageCheck,
          className: "bg-emerald-50 text-emerald-600",
        };

      case "task":
        return {
          icon: ListChecks,
          className: "bg-sky-50 text-sky-600",
        };

      case "comment":
        return {
          icon: MessageSquare,
          className: "bg-indigo-50 text-indigo-600",
        };

      case "checklist":
        return {
          icon: ListChecks,
          className: "bg-emerald-50 text-emerald-600",
        };

      case "attachment":
        return {
          icon: Paperclip,
          className: "bg-sky-50 text-sky-600",
        };

      case "warning":
        return {
          icon: AlertCircle,
          className: "bg-amber-50 text-amber-600",
        };

      default:
        return {
          icon: Info,
          className: "bg-primary/10 text-primary",
        };
    }
  }

  /* =========================================================
     OPEN NOTIFICATION
  ========================================================= */

  async function handleNotificationClick(notification) {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
      }

      setOpen(false);

      if (notification.link) {
        router.push(notification.link);
      }
    } catch (error) {
      console.error("Failed to open notification:", error);
    }
  }

  /* =========================================================
     MARK ALL
  ========================================================= */

  async function handleMarkAllAsRead() {
    try {
      await markAllNotificationsAsRead(notifications);
    } catch (error) {
      console.error("Failed to mark notifications:", error);
    }
  }

  /* =========================================================
     DELETE
  ========================================================= */

  async function handleDelete(event, notificationId) {
    event.stopPropagation();

    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  }

  return (
    <div className="relative">
      {/* =====================================================
          BELL
      ====================================================== */}

      <button
        type="button"
        aria-label="الإشعارات"
        onClick={() => setOpen((previous) => !previous)}
        className="
          relative
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-surface-muted
          text-gray-500
          transition-all
          hover:-translate-y-0.5
          hover:bg-gray-100
          hover:text-ink
        "
      >
        <Bell size={19} />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              min-h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-primary
              px-1
              text-[9px]
              font-black
              text-white
              ring-2
              ring-white
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* =====================================================
          DROPDOWN
      ====================================================== */}

      {open && (
        <>
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="إغلاق الإشعارات"
            onClick={() => setOpen(false)}
            className="
              fixed
              inset-0
              z-40
              cursor-default
            "
          />

          {/* PANEL */}

          <div
            className="
              fixed
              inset-x-3
              top-20
              z-50
              max-h-[80vh]
              overflow-hidden
              rounded-[1.5rem]
              border
              border-ink/[0.06]
              bg-card
              shadow-[0_25px_80px_rgba(0,0,0,0.14)]
              animate-in
              fade-in
              slide-in-from-top-2
              duration-200
              sm:absolute
              sm:inset-x-auto
              sm:left-0
              sm:top-[calc(100%+12px)]
              sm:max-h-none
              sm:w-[500px]
              sm:max-w-[calc(100vw-2rem)]
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-ink/[0.05]
                px-4
                py-4
              "
            >
              <div>
                <h3 className="text-sm font-black text-ink">الإشعارات</h3>

                <p className="mt-1 text-[11px] text-gray-500">
                  {unreadCount > 0
                    ? `لديك ${unreadCount} إشعار غير مقروء`
                    : "لا توجد إشعارات جديدة"}
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    px-2.5
                    py-2
                    text-[11px]
                    font-bold
                    text-primary
                    transition
                    hover:bg-primary/5
                  "
                >
                  <CheckCheck size={14} />
                  قراءة الكل
                </button>
              )}
            </div>

            {/* CONTENT */}

            <div
              className="
                max-h-[60vh]
                overflow-y-auto
                sm:max-h-[420px]
              "
            >
              {/* LOADING */}

              {loading && (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="
                          flex
                          gap-3
                          rounded-xl
                          p-2
                        "
                    >
                      <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-ink/[0.05]" />

                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 animate-pulse rounded bg-ink/[0.05]" />

                        <div className="h-3 w-48 animate-pulse rounded bg-ink/[0.04]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* EMPTY */}

              {!loading && notifications.length === 0 && (
                <div
                  className="
                      flex
                      min-h-[260px]
                      flex-col
                      items-center
                      justify-center
                      px-6
                      text-center
                    "
                >
                  <div
                    className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-ink/[0.04]
                        text-gray-500
                      "
                  >
                    <Bell size={24} />
                  </div>

                  <p className="mt-4 text-sm font-bold text-ink">
                    لا توجد إشعارات
                  </p>

                  <p className="mt-1 max-w-[230px] text-xs leading-5 text-gray-500">
                    أي تحديث في الشغل أو الفريق أو التسليم هيظهر هنا.
                  </p>
                </div>
              )}

              {/* LIST */}

              {!loading && notifications.length > 0 && (
                <div className="divide-y divide-ink/[0.04]">
                  {notifications.slice(0, 10).map((notification) => {
                    const { icon: Icon, className } = getNotificationType(
                      notification.type,
                    );

                    return (
                      <div
                        key={notification.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleNotificationClick(notification)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleNotificationClick(notification);
                          }
                        }}
                        className={`
                              group
                              relative
                              flex
                              cursor-pointer
                              gap-3
                              px-4
                              py-4
                              text-right
                              transition
                              hover:bg-ink/[0.02]
                              ${!notification.read ? "bg-primary/[0.025]" : ""}
                            `}
                      >
                        {/* ICON */}

                        <div
                          className={`
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                ${className}
                              `}
                        >
                          <Icon size={17} />
                        </div>

                        {/* TEXT */}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
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

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {notification.message}
                          </p>

                          {notification.projectTitle && (
                            <p className="mt-2 text-[10px] font-bold text-primary">
                              {notification.projectTitle}
                            </p>
                          )}

                          <p className="mt-2 text-[10px] text-gray-500">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>

                        {/* ACTIONS */}

                        <div
                          className="
                                absolute
                                left-3
                                top-3
                                hidden
                                items-center
                                gap-1
                                group-hover:flex
                              "
                        >
                          {notification.link && (
                            <ExternalLink size={13} className="text-gray-500" />
                          )}

                          <button
                            type="button"
                            aria-label="حذف الإشعار"
                            onClick={(event) =>
                              handleDelete(event, notification.id)
                            }
                            className="
                                  flex
                                  h-7
                                  w-7
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-gray-500
                                  transition
                                  hover:bg-red-50
                                  hover:text-red-500
                                "
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {!notification.read && (
                          <Check
                            size={13}
                            className="
                                  absolute
                                  bottom-4
                                  left-4
                                  text-primary/40
                                "
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* VIEW ALL */}
            </div>

            {/* FOOTER */}
            {!loading && notifications.length > 0 && (
              <Link
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  border-t
                  border-ink/[0.05]
                  px-4
                  py-3.5
                  text-sm
                  font-bold
                  text-primary
                  transition
                  hover:bg-primary/[0.04]
                "
              >
                <span className="flex items-center gap-2">
                  <Bell size={15} />
                  عرض كل الإشعارات
                </span>

                <span className="flex items-center gap-2 text-[11px] text-ink/45 transition group-hover:text-primary">
                  {notifications.length}
                  <ArrowUpLeft
                    size={14}
                    className="transition-transform duration-200 group-hover:-translate-x-0.5"
                  />
                </span>
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
