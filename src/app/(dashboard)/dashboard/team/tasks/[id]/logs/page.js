"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  Activity as ActivityIcon,
  ArrowLeft,
  CheckCircle2,
  CalendarDays,
  ListChecks,
  MessageSquare,
  Plus,
  RefreshCw,
  ScrollText,
  Search,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { ProtectedRoute } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import WorkflowBadge from "@/features/team/components/WorkflowBadge";
import PriorityBadge from "@/features/team/components/PriorityBadge";

import Avatar from "@/features/dashboard/ui/Avatar";

import {
  formatDateTime,
  getTimestampMs,
  getAssigneeId,
  getReviewerId,
  getReporterId,
} from "@/features/team/lib/teamUtils";

const ACTIVITY_META = {
  created: {
    icon: Plus,
    label: "إنشاء",
    color: "bg-emerald-500 text-white",
    chip: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  status: {
    icon: RefreshCw,
    label: "تغيير حالة",
    color: "bg-blue-500 text-white",
    chip: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    bar: "bg-blue-500",
  },
  comment: {
    icon: MessageSquare,
    label: "تعليق",
    color: "bg-violet-500 text-white",
    chip: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    bar: "bg-violet-500",
  },
  checklist: {
    icon: ListChecks,
    label: "قائمة تحقق",
    color: "bg-amber-500 text-white",
    chip: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    bar: "bg-amber-500",
  },
};

const DEFAULT_META = {
  icon: ActivityIcon,
  label: "حدث",
  color: "bg-gray-500 text-white",
  chip: "bg-gray-500/10 text-gray-600 dark:bg-white/10 dark:text-ink/60",
  bar: "bg-gray-400",
};

const FILTERS = [
  { value: "all", label: "كل الاحداث", icon: ScrollText },
  { value: "created", label: "الإنشاء", icon: Plus },
  { value: "status", label: "تغيير الحالة", icon: RefreshCw },
  { value: "comment", label: "التعليقات", icon: MessageSquare },
  { value: "checklist", label: "قائمة التحقق", icon: ListChecks },
];

export default function TaskLogsPage() {
  const params = useParams();

  const router = useRouter();

  const { tasks, projects, users, userMap, loading } = useTeamData();

  const [filter, setFilter] = useState("all");

  const [search, setSearch] = useState("");

  const taskId = params?.id;

  const task = tasks.find((item) => item.id === taskId);

  const project = projects.find((item) => item.id === task?.projectId);

  /* =========================================================
     PREPARE LOGS — newest first
  ========================================================= */

  const logs = useMemo(() => {
    if (!task?.activity) return [];

    return [...task.activity]
      .sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt))
      .map((entry) => {
        const authorId = entry.authorId || "";

        return {
          ...entry,
          author: userMap.get(authorId) || null,
        };
      });
  }, [task, userMap]);

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return logs.filter((entry) => {
      const matchesFilter = filter === "all" || entry.type === filter;

      const matchesSearch =
        !query ||
        entry.text?.toLowerCase().includes(query) ||
        entry.authorName?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [logs, filter, search]);

  /* =========================================================
     AGGREGATES
  ========================================================= */

  const stats = useMemo(() => {
    const contributors = new Set();

    logs.forEach((entry) => {
      if (entry.authorId) contributors.add(entry.authorId);
    });

    const counts = {
      created: 0,
      status: 0,
      comment: 0,
      checklist: 0,
    };

    logs.forEach((entry) => {
      if (counts[entry.type] !== undefined) counts[entry.type] += 1;
    });

    const firstTs = logs.length
      ? Math.min(...logs.map((e) => getTimestampMs(e.createdAt)))
      : null;

    return {
      total: logs.length,
      contributors: contributors.size,
      counts,
      firstTs,
    };
  }, [logs]);

  /* =========================================================
     GROUP BY DAY
  ========================================================= */

  const groupedLogs = useMemo(() => {
    const groups = [];

    filteredLogs.forEach((entry) => {
      const ts = getTimestampMs(entry.createdAt);

      const date = new Date(ts || 0);

      const dayKey = date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const last = groups[groups.length - 1];

      if (last && last.day === dayKey) {
        last.items.push(entry);
      } else {
        groups.push({ day: dayKey, date, items: [entry] });
      }
    });

    return groups;
  }, [filteredLogs]);

  const assigneeId = getAssigneeId(task);
  const reviewerId = getReviewerId(task);
  const reporterId = getReporterId(task);

  const assignee = userMap.get(assigneeId);
  const reviewer = userMap.get(reviewerId);
  const reporter = userMap.get(reporterId);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <ProtectedRoute permission="team">
        <div className="space-y-6" dir="rtl">
          <div className="animate-pulse space-y-6">
            <div className="h-44 rounded-[28px] bg-gray-100 dark:bg-white/[0.04]" />
            <div className="h-96 rounded-3xl bg-gray-100 dark:bg-white/[0.04]" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!task) {
    return (
      <ProtectedRoute permission="team">
        <div className="space-y-6" dir="rtl">
          <div className="rounded-[24px] border border-ink/[0.07] bg-card py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink/[0.04]">
              <ScrollText className="h-8 w-8 text-ink/30" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">المهمة غير موجودة</h3>
            <p className="mt-1 text-sm text-ink/60">لم يتم العثور على سجل هذه المهمة.</p>
            <Link
              href="/dashboard/team/all-tasks"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-ink/[0.1] bg-card px-4 py-2.5 text-sm font-bold text-ink/75 transition hover:bg-ink/[0.03]"
            >
              <ArrowLeft className="h-4 w-4" />
              كل المهام
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const summaryItems = [
    {
      label: "إجمالي الأحداث",
      value: stats.total,
      icon: ScrollText,
      tone: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "مساهمون",
      value: stats.contributors,
      icon: UsersRound,
      tone: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "تعليقات",
      value: stats.counts.comment,
      icon: MessageSquare,
      tone: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "تغييرات حالة",
      value: stats.counts.status,
      icon: RefreshCw,
      tone: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <ProtectedRoute permission="team">
      <div dir="rtl" className="space-y-6 pb-10">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[28px] border border-ink/[0.06] bg-card p-6 shadow-[0_15px_50px_rgba(0,0,0,0.035)] sm:p-8">
          <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-primary/[0.07] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-10 h-56 w-56 rounded-full bg-violet-500/[0.06] blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/team/tasks/${task.id}`)}
                  aria-label="رجوع للمهمة"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink/[0.08] bg-card text-ink/60 transition hover:bg-ink/[0.03] hover:text-ink"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ScrollText className="h-5 w-5" />
                    </span>

                    <div>
                      <h1 className="text-xl font-black tracking-tight text-ink sm:text-2xl">
                        سجل الأحداث
                      </h1>

                      <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-ink/60">
                        <Sparkles className="h-3.5 w-3.5 text-primary/70" />
                        {task.title || "بدون عنوان"}
                        {project?.title && (
                          <span className="text-ink/40">· {project.title}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <WorkflowBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
            </div>

            {/* SUMMARY CARDS */}

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {summaryItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-ink/[0.06] bg-card p-3.5 shadow-sm"
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.tone}`}>
                      <Icon className="h-5 w-5" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-lg font-black leading-none text-ink">{item.value}</p>
                      <p className="mt-1 truncate text-[11px] font-bold text-ink/50">{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PEOPLE INVOLVED */}

            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-ink/[0.06] bg-ink/[0.02] p-3.5">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-ink/40">
                الأشخاص
              </p>

              {[
                { user: assignee, role: "المسؤول", icon: UserRound },
                { user: reviewer, role: "المراجع", icon: CheckCircle2 },
                { user: reporter, role: "المنشئ", icon: Plus },
              ].map(({ user, role, icon: RoleIcon }) => (
                <div key={role} className="flex items-center gap-2">
                  <span className="relative">
                    <Avatar user={user} size={32} ring />
                    <span className="absolute -bottom-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-card text-[8px]">
                      <RoleIcon className="h-2.5 w-2.5 text-ink/50" />
                    </span>
                  </span>

                  <span className="leading-tight">
                    <span className="block max-w-[120px] truncate text-xs font-bold text-ink">
                      {user?.name || user?.email || "غير محدد"}
                    </span>
                    <span className="block text-[10px] font-medium text-ink/45">{role}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            LOGS CARD
        ====================================================== */}

        <section className="overflow-hidden rounded-[28px] border border-ink/[0.06] bg-card shadow-[0_15px_50px_rgba(0,0,0,0.035)]">
          {/* TOOLBAR */}

          <div className="flex flex-col gap-3 border-b border-ink/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
            {/* FILTER CHIPS */}

            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.map((item) => {
                const Icon = item.icon;

                const active = filter === item.value;

                const count =
                  item.value === "all"
                    ? logs.length
                    : stats.counts[item.value] || 0;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold transition-all duration-200 ${
                      active
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "bg-surface-muted text-ink/60 hover:bg-ink/[0.04] hover:text-ink"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                        active
                          ? "bg-primary/15 text-primary"
                          : "bg-ink/[0.05] text-ink/45"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SEARCH */}

            <div className="relative sm:w-60">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث في الأحداث..."
                className="h-10 w-full rounded-xl border border-ink/[0.08] bg-card pr-9 pl-9 text-xs font-medium text-ink outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/10 dark:border-white/[0.1]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="مسح البحث"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink/40 transition hover:bg-ink/[0.05] hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* TIMELINE */}

          <div className="max-h-[560px] overflow-y-auto p-4 sm:p-6">
            {groupedLogs.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/[0.04]">
                  <ScrollText className="h-7 w-7 text-ink/30" />
                </div>
                <p className="mt-3 text-sm font-bold text-ink">
                  {logs.length === 0 ? "لا يوجد نشاط مسجل لهذه المهمة" : "لا توجد نتائج مطابقة"}
                </p>
                <p className="mt-1 text-xs text-ink/50">
                  {logs.length === 0
                    ? "عند حدوث أي حدث ستظهر تفاصيله هنا"
                    : "جرّب تغيير الفلتر أو كلمة البحث"}
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {groupedLogs.map((group) => (
                  <div key={group.day} className="mb-8 last:mb-0">
                    {/* DAY DIVIDER */}

                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex items-center gap-1.5 rounded-lg bg-ink/[0.04] px-2.5 py-1 text-[11px] font-black text-ink/55">
                        <CalendarDays className="h-3.5 w-3.5 text-primary/70" />
                        {group.day}
                      </span>

                      <span className="h-px flex-1 bg-ink/[0.05]" />

                      <span className="text-[10px] font-bold text-ink/35">
                        {group.items.length} حدث
                      </span>
                    </div>

                    {/* DAY ITEMS */}

                    <ol className="relative space-y-3 border-r border-ink/[0.08] pr-6">
                      {group.items.map((entry, index) => {
                        const meta = ACTIVITY_META[entry.type] || DEFAULT_META;

                        const Icon = meta.icon;

                        return (
                          <motion.li
                            key={entry.id}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.25 }}
                            className="relative"
                          >
                            {/* TIMELINE DOT + AUTHOR AVATAR */}

                            <span className="absolute -right-[31px] top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-card p-0.5 shadow-sm ring-1 ring-ink/[0.06]">
                              <Avatar user={entry.author} name={entry.authorName} size={26} />
                            </span>

                            {/* EVENT CARD */}

                            <div className="group flex flex-col gap-2 rounded-2xl border border-ink/[0.06] bg-card p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/[0.1] hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)]">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${meta.color}`}>
                                  <Icon className="h-3.5 w-3.5" />
                                </span>

                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${meta.chip}`}>
                                  {meta.label}
                                </span>

                                <span className="mr-auto flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-ink/45">
                                    {entry.authorName || "مستخدم"}
                                  </span>
                                  <span className="hidden text-[10px] text-ink/30 sm:inline">·</span>
                                  <span className="hidden text-[10px] font-medium text-ink/40 sm:inline">
                                    {formatDateTime(entry.createdAt)}
                                  </span>
                                </span>
                              </div>

                              <p className="text-xs font-bold leading-6 text-ink">{entry.text}</p>
                            </div>
                          </motion.li>
                        );
                      })}
                    </ol>
                  </div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* FOOTER */}

          <div className="flex items-center justify-between border-t border-ink/[0.05] px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2 text-[11px] font-medium text-ink/45">
              <Sparkles className="h-3.5 w-3.5 text-primary/60" />
              {logs.length > 0 && stats.firstTs
                ? `بدأ السجل في ${formatDateTime(stats.firstTs)}`
                : "لا يوجد سجل"}
            </div>

            <Link
              href={`/dashboard/team/tasks/${task.id}`}
              className="flex items-center gap-1.5 rounded-xl border border-ink/[0.08] bg-card px-3 py-2 text-[11px] font-bold text-ink/60 transition hover:bg-ink/[0.03] hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              العودة للمهمة
            </Link>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
