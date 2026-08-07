"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  Layers,
  ClipboardList,
  Loader2,
  CheckCircle2,
  Timer,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { ProtectedRoute } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import WorkflowBadge from "@/features/team/components/WorkflowBadge";
import PriorityBadge from "@/features/team/components/PriorityBadge";

import {
  formatDeadline,
  getUserName,
  getAssigneeId,
  isDeadlineOverdue,
} from "@/features/team/lib/teamUtils";

import Avatar from "@/features/dashboard/ui/Avatar";
import Card from "@/features/dashboard/ui/Card";
import StatsCard from "@/features/dashboard/ui/StatsCard";
import { Select } from "@/features/dashboard/ui/Input";

import PageHero from "@/features/dashboard/components/PageHero";

import { WORKFLOW_STATUSES } from "@/constants/workflow";

const PAGE_SIZE = 12;

export default function SingleTasksPage() {
  const { tasks, activeUsers, userMap, loading } = useTeamData();

  const [search, setSearch] = useState("");

  const [memberFilter, setMemberFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);

  const standaloneTasks = useMemo(
    () =>
      [...tasks]
        .filter((task) => !task.projectId)
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        }),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return standaloneTasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query);

      const matchesMember =
        memberFilter === "all" || getAssigneeId(task) === memberFilter;

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      return matchesSearch && matchesMember && matchesStatus;
    });
  }, [standaloneTasks, search, memberFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const pageTasks = filteredTasks.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const activeCount = standaloneTasks.filter(
    (task) =>
      task.status === "in-progress" ||
      task.status === "review" ||
      task.status === "revision",
  ).length;

  const doneCount = standaloneTasks.filter((task) => task.status === "done").length;

  const overdueCount = standaloneTasks.filter(
    (task) => task.status !== "done" && isDeadlineOverdue(task.deadline),
  ).length;

  const stats = [
    {
      label: "إجمالي المهمات",
      value: standaloneTasks.length,
      description: "المهمات الفردية",
      icon: Layers,
      accent: "primary",
    },
    {
      label: "قيد التنفيذ",
      value: activeCount,
      description: "تنفيذ ومراجعة",
      icon: Loader2,
      accent: "amber",
    },
    {
      label: "منجزة",
      value: doneCount,
      description: "مكتملة ومعتمدة",
      icon: CheckCircle2,
      accent: "emerald",
    },
    {
      label: "متأخرة",
      value: overdueCount,
      description: "تجاوزت الموعد",
      icon: Timer,
      accent: "danger",
    },
  ];

  function pageNumbers() {
    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, safePage + 2);
    const numbers = [];

    for (let i = start; i <= end; i += 1) {
      numbers.push(i);
    }

    return numbers;
  }

  if (loading) {
    return (
      <ProtectedRoute permission="team">
        <div className="space-y-6" dir="rtl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded-xl dark:bg-white/[0.08]" />
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-2xl dark:bg-white/[0.04]" />
              ))}
            </div>
            <div className="h-96 bg-gray-100 rounded-2xl dark:bg-white/[0.04]" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute permission="team">
      <div dir="rtl" className="space-y-6">
        <PageHero
          icon={Layers}
          eyebrow="الفريق"
          title="المهمات الفردية"
          subtitle="جميع المهمات المستقلة التي لا تتبع مشروعًا، مع تصفية وترقيم صفحات."
          badge="SINGLE TASKS"
        />

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              accent={stat.accent}
            />
          ))}
        </div>

        {/* Toolbar */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/60" />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="ابحث بعنوان المهمة أو وصفها..."
                className="w-full h-11 pr-10 pl-4 rounded-xl border border-ink/10 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-wrap">
              <Select
                value={memberFilter}
                onChange={(event) => {
                  setMemberFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="جميع الأعضاء"
                options={[
                  { value: "all", label: "جميع الأعضاء" },
                  ...activeUsers.map((user) => ({
                    value: user.id,
                    label: user.name || user.email || "بدون اسم",
                  })),
                ]}
                className="sm:w-48"
              />

              <Select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="كل الحالات"
                options={[
                  { value: "all", label: "كل الحالات" },
                  ...WORKFLOW_STATUSES.map((status) => ({
                    value: status.value,
                    label: status.labelAr,
                  })),
                ]}
                className="sm:w-44"
              />
            </div>
          </div>
        </Card>

        {/* Tasks Table */}
        <Card hover={false} className="p-0">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <Layers className="h-16 w-16 mx-auto text-ink/20" />
              <h3 className="mt-4 text-lg font-bold text-ink">
                {standaloneTasks.length === 0
                  ? "لا توجد مهمات فردية"
                  : "لا توجد نتائج مطابقة"}
              </h3>
              <p className="mt-1 text-ink/60">
                {standaloneTasks.length === 0
                  ? "أنشئ مهمة مستقلة وأسندها لعضو الفريق مباشرة"
                  : "جرب تغيير البحث أو الفلاتر"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px]">
                  <thead>
                    <tr className="border-b border-ink/10 text-[11px] font-bold uppercase tracking-wider text-ink/60 bg-ink/[0.02]">
                      <th className="py-4 pr-6 text-right">المهمة</th>
                      <th className="py-4 px-4 text-right">المسؤول</th>
                      <th className="py-4 px-4 hidden md:table-cell text-center">الحالة</th>
                      <th className="py-4 px-4 hidden sm:table-cell text-center">الأولوية</th>
                      <th className="py-4 pl-6 text-center">الموعد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {pageTasks.map((task) => {
                      const assignee = userMap.get(getAssigneeId(task));

                      const overdue =
                        task.status !== "done" && isDeadlineOverdue(task.deadline);

                      return (
                        <tr key={task.id} className="hover:bg-ink/[0.02] transition-colors">
                          <td className="py-4 pr-6">
                            <Link
                              href={`/dashboard/team/tasks/${task.id}`}
                              className="block max-w-md"
                            >
                              <p className="truncate text-sm font-bold text-ink transition-colors hover:text-primary">
                                {task.title || "بدون عنوان"}
                              </p>

                              <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-ink/60">
                                <span className="inline-flex items-center gap-1 rounded-lg bg-violet-50 px-2 py-0.5 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                                  <Layers className="h-3 w-3" />
                                  مهمة واحدة
                                </span>
                              </p>
                            </Link>
                          </td>

                          <td className="py-4 px-4">
                            {getAssigneeId(task) ? (
                              <Link
                                href={`/dashboard/team/members/${getAssigneeId(task)}`}
                                className="flex items-center gap-2.5 group"
                              >
                                <Avatar user={assignee} size={30} />

                                <span className="min-w-0">
                                  <span className="block truncate max-w-[140px] text-xs font-bold text-ink group-hover:text-primary transition-colors">
                                    {getUserName(userMap, getAssigneeId(task))}
                                  </span>
                                </span>
                              </Link>
                            ) : (
                              <span className="flex items-center gap-2.5">
                                <Avatar user={assignee} size={30} />

                                <span className="truncate max-w-[140px] text-xs font-medium text-ink/60">
                                  غير معين
                                </span>
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 hidden md:table-cell">
                            <div className="flex justify-center">
                              <WorkflowBadge status={task.status} />
                            </div>
                          </td>

                          <td className="py-4 px-4 hidden sm:table-cell">
                            <div className="flex justify-center">
                              <PriorityBadge priority={task.priority} />
                            </div>
                          </td>

                          <td className="py-4 pl-6">
                            <div className="flex justify-center">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-bold ${
                                  overdue ? "text-red-600" : "text-ink/60"
                                }`}
                              >
                                {overdue && <AlertCircle className="h-3.5 w-3.5" />}
                                {formatDeadline(task.deadline)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-ink/10 px-6 py-4">
                <p className="text-xs font-medium text-ink/60">
                  عرض {pageTasks.length} من {filteredTasks.length} مهمة
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                    disabled={safePage === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white text-ink/60 transition hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-30 dark:border-white/10 dark:bg-white/[0.05]"
                    title="الصفحة السابقة"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {safePage > 3 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setPage(1)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white text-xs font-bold text-ink/60 transition hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/[0.05]"
                      >
                        1
                      </button>

                      <span className="px-1 text-xs text-ink/40">...</span>
                    </>
                  )}

                  {pageNumbers().map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setPage(number)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition ${
                        number === safePage
                          ? "bg-primary text-white shadow-sm"
                          : "border border-ink/10 bg-white text-ink/60 hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/[0.05]"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  {safePage < totalPages - 2 && (
                    <>
                      <span className="px-1 text-xs text-ink/40">...</span>

                      <button
                        type="button"
                        onClick={() => setPage(totalPages)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white text-xs font-bold text-ink/60 transition hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/[0.05]"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setPage((previous) => Math.min(totalPages, previous + 1))
                    }
                    disabled={safePage === totalPages}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white text-ink/60 transition hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-30 dark:border-white/10 dark:bg-white/[0.05]"
                    title="الصفحة التالية"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
