"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ClipboardList,
  CheckCircle2,
  Loader2,
  Timer,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ListChecks,
  MessageSquare,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import { WORKFLOW_STATUSES } from "@/constants/workflow";

import { updateDocument } from "@/lib/firestoreService";

import { notifyMany, getTaskRecipientUserIds } from "@/lib/notificationService";

import {
  formatDeadline,
  getAssigneeId,
  getWorkflowMeta,
  isDeadlineOverdue,
  canManageTeam,
  canMemberAdvance,
  uid,
} from "@/features/team/lib/teamUtils";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";

import { useToast } from "@/hooks/useToast";

import TeamHero from "@/features/team/components/TeamHero";

import Input from "@/features/dashboard/ui/Input";

import PriorityBadge from "@/features/team/components/PriorityBadge";

import Avatar from "@/features/dashboard/ui/Avatar";

import Link from "next/link";

export default function MyTasksPage() {
  const theme = usePageTheme();

  const { showToast } = useToast();

  const { user: currentUser, profile } = useAuth();

  const { tasks, projects, users, userMap, loading } = useTeamData();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [priorityFilter, setPriorityFilter] = useState("all");

  const [projectFilter, setProjectFilter] = useState("all");

  const [viewMode, setViewMode] = useState("kanban");

  const myTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter((task) => getAssigneeId(task) === currentUser.uid);
  }, [tasks, currentUser]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return myTasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query);

      const matchesProject = projectFilter === "all" || task.projectId === projectFilter;

      const matchesStatus = statusFilter === "all" || task.status === statusFilter;

      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesProject && matchesStatus && matchesPriority;
    });
  }, [myTasks, search, projectFilter, statusFilter, priorityFilter]);

  const tasksByStatus = useMemo(() => {
    const map = {};
    WORKFLOW_STATUSES.forEach((status) => {
      map[status.value] = filteredTasks.filter((task) => task.status === status.value);
    });
    return map;
  }, [filteredTasks]);

  const stats = useMemo(
    () => [
      {
        label: "مهماتي",
        value: myTasks.length,
        description: "إجمالي المهام المسندة لي.",
        icon: ClipboardList,
      },
      {
        label: "قيد التنفيذ",
        value: myTasks.filter((task) => task.status === "in-progress").length,
        description: "مهام أعمل عليها حاليًا.",
        icon: Loader2,
      },
      {
        label: "المراجعة",
        value: myTasks.filter((task) => task.status === "review" || task.status === "revision").length,
        description: "مهام في انتظار المراجعة.",
        icon: Search,
      },
      {
        label: "المكتملة",
        value: myTasks.filter((task) => task.status === "done").length,
        description: "مهام أنهيتها.",
        icon: CheckCircle2,
      },
      {
        label: "متأخرة",
        value: myTasks.filter(
          (task) =>
            !(task.status === "done") && isDeadlineOverdue(task.deadline),
        ).length,
        description: "مهام تجاوزت موعد الاستحقاق.",
        icon: Timer,
      },
    ],
    [myTasks],
  );

  function getProjectTitle(projectId) {
    return projects.find((project) => project.id === projectId)?.title || "بدون مشروع";
  }

  const currentAuthorName =
    userMap.get(currentUser?.uid)?.name ||
    profile?.name ||
    currentUser?.displayName ||
    "مستخدم";

  function addActivity(task, type, text) {
    const activity = Array.isArray(task.activity) ? task.activity : [];

    return [
      ...activity,
      {
        id: uid(),
        type,
        text,
        authorId: currentUser?.uid || "",
        authorName: currentAuthorName,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async function handleMove(task, direction) {
    const role = profile?.role;

    // Members may only advance the workflow (never move backward).
    if (direction === "backward" && !canManageTeam(role)) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message: "لا يمكنك التراجع في مراحل المهمة.",
      });
      return;
    }

    const currentIndex = WORKFLOW_STATUSES.findIndex((s) => s.value === task.status);

    const delta = direction === "forward" ? 1 : -1;

    const nextIndex = Math.min(
      Math.max(currentIndex + delta, 0),
      WORKFLOW_STATUSES.length - 1,
    );

    if (nextIndex === currentIndex) return;

    const fromMeta = WORKFLOW_STATUSES[currentIndex];

    const toMeta = WORKFLOW_STATUSES[nextIndex];

    // Members cannot move past "review" (no revision / done).
    if (
      direction === "forward" &&
      !canManageTeam(role) &&
      !canMemberAdvance(task.status)
    ) {
      showToast({
        type: "warning",
        title: "انتهت مراحل العضو",
        message: "بعد الإرسال للمراجعة، يتولى المسؤول قرار التعديلات أو التسليم.",
      });
      return;
    }

    try {
      await updateDocument("tasks", task.id, {
        status: toMeta.value,
        activity: addActivity(
          task,
          "status",
          `تم نقل المهمة من "${fromMeta.labelAr}" إلى "${toMeta.labelAr}"`,
        ),
      });

      notifyMany(
        getTaskRecipientUserIds(task, users, currentUser?.uid || ""),
        {
          title: "تم تحديث حالة المهمة",
          message: `تم نقل المهمة "${task.title}" من "${fromMeta.labelAr}" إلى "${toMeta.labelAr}".`,
          type: "task",
          link: `/dashboard/team/tasks/${task.id}`,
          projectId: task.projectId,
          projectTitle: getProjectTitle(task.projectId),
          eventKey: "tasks",
        },
      );
    } catch (error) {
      console.error("Failed to move task:", error);
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء نقل المهمة.",
      });
    }
  }

  function handleMoveForward(task) {
    return handleMove(task, "forward");
  }

  function handleMoveBackward(task) {
    return handleMove(task, "backward");
  }

  return (
    <ProtectedRoute permission="my-tasks">
      <div dir="rtl" className="space-y-6">
        <TeamHero
          icon={ClipboardList}
          title="مهماتي"
          subtitle="تابع مهامك المسندة وحدّث حالاتها بكل سهولة."
        >
          <div className="flex items-center gap-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="rounded-xl border border-ink/20 bg-card px-3 py-2 text-sm font-medium text-ink outline-none"
            >
              <option value="kanban">لوحة كانبان</option>
              <option value="list">قائمة</option>
            </select>
          </div>
        </TeamHero>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="rounded-[24px] border border-gray-200/80 bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink/40">{stat.label}</p>
                    <p className="mt-1 text-2xl font-black text-ink">{stat.value}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-ink/40">{stat.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-3 rounded-[24px] border border-gray-200/80 bg-card p-4 shadow-[0_8px_30px_rgba(0,0,0,0.035)] lg:grid-cols-6">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث في مهامي..."
              className={`h-11 w-full rounded-xl border border-ink/40 bg-card pr-10 pl-3 text-sm text-ink outline-none transition placeholder:text-ink/30 ${theme.focus}`}
            />
          </div>

          <select
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            className={`h-11 w-full rounded-xl border border-ink/20 bg-card px-3 text-sm font-medium text-ink outline-none transition ${theme.focus}`}
          >
            <option value="all">كل المشاريع</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className={`h-11 w-full rounded-xl border border-ink/20 bg-card px-3 text-sm font-medium text-ink outline-none transition ${theme.focus}`}
          >
            <option value="all">كل الحالات</option>
            {WORKFLOW_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.labelAr}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className={`h-11 w-full rounded-xl border border-ink/20 bg-card px-3 text-sm font-medium text-ink outline-none transition ${theme.focus}`}
          >
            <option value="all">كل الأولويات</option>
            <option value="low">منخفضة</option>
            <option value="medium">متوسطة</option>
            <option value="high">عالية</option>
            <option value="urgent">عاجلة</option>
          </select>
        </div>

        {viewMode === "kanban" ? (
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
            {WORKFLOW_STATUSES.map((status) => {
              const columnTasks = tasksByStatus[status.value] || [];

              return (
                <div
                  key={status.value}
                  className="flex w-[280px] shrink-0 flex-col rounded-2xl border border-gray-200 bg-gray-50/70"
                >
                  <div className="flex items-center justify-between gap-2 px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-600">{status.labelAr}</span>
                      <span className="text-[10px] font-bold text-ink/30">{status.label}</span>
                    </div>
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/80 px-1.5 text-[11px] font-bold text-ink/50 ring-1 ring-ink/[0.06] dark:bg-white/15 dark:text-white/80">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3 px-3 pb-3 overflow-y-auto max-h-[calc(100vh-400px)]">
                    {columnTasks.length === 0 ? (
                      <div className="flex min-h-[120px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink/[0.08] text-[11px] font-bold text-ink/30" />
                    ) : (
                      columnTasks.map((task) => (
                        <MyTaskCard
                          key={task.id}
                          task={task}
                          projects={projects}
                          userMap={userMap}
                          canManage={canManageTeam(profile?.role)}
                          onMoveForward={handleMoveForward}
                          onMoveBackward={handleMoveBackward}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-card shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-ink/10 bg-gray-50/50">
                  {["المهمة", "المشروع", "الحالة", "الأولوية", "الاستحقاق", "الإجراءات"].map((label) => (
                    <th key={label} className="whitespace-nowrap px-5 py-4 text-start text-[10px] font-black uppercase tracking-[0.08em] text-ink/40">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const overdue = !(task.status === "done") && isDeadlineOverdue(task.deadline);
                  const projectTitle = getProjectTitle(task.projectId);

                  return (
                    <tr key={task.id} className="border-b border-ink/5 hover:bg-ink/[0.02]">
                      <td className="max-w-[280px] px-5 py-4">
                        <Link
                          href={`/dashboard/team/tasks/${task.id || ""}`}
                          className="block text-sm font-bold text-ink transition-colors hover:text-primary"
                        >
                          {task.title || "بدون عنوان"}
                        </Link>
                        <span className="mt-1 text-[11px] text-ink/35">{projectTitle}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black"
                          style={{
                            color: getWorkflowMeta(task.status).color,
                            backgroundColor: `${getWorkflowMeta(task.status).color}14`,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: getWorkflowMeta(task.status).color }}
                          />
                          {getWorkflowMeta(task.status).labelAr}
                        </span>
                      </td>
                      <td className="px-5 py-4"><PriorityBadge priority={task.priority} /></td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold ${overdue ? "text-red-600" : "text-ink/50"}`}>
                          {formatDeadline(task.deadline)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleMoveBackward(task)}
                          disabled={!canManageTeam(profile?.role) || task.status === "backlog"}
                          title="التراجع"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink/[0.04] text-ink/40 hover:bg-ink/[0.08] disabled:opacity-30"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveForward(task)}
                          disabled={task.status === "done" || (!canManageTeam(profile?.role) && !canMemberAdvance(task.status))}
                          title="التقديم"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-30"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

function MyTaskCard({ task, projects, userMap, canManage, onMoveForward, onMoveBackward }) {
  const getProjectTitle = (projectId) => projects.find((p) => p.id === projectId)?.title || "بدون مشروع";

  return (
    <div className="group relative rounded-2xl border border-ink/[0.06] bg-card p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
      </div>

      <span className="block text-sm font-black leading-6 text-ink">{task.title || "بدون عنوان"}</span>

      <Link
        href={`/dashboard/team/tasks/${task.id || ""}`}
        className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary/70 transition hover:text-primary"
      >
        عرض التفاصيل
        <ChevronLeft className="h-3 w-3" />
      </Link>

      <div className="mt-2 text-[10px] font-bold text-ink/35">{getProjectTitle(task.projectId)}</div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Avatar user={userMap.get(getAssigneeId(task))} size={24} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-ink/[0.06] pt-2.5">
        {task.deadline && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ink/40">
            <CalendarDays className="h-3 w-3" />
            {formatDeadline(task.deadline)}
          </span>
        )}

        {task.checklist?.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ink/40">
            <ListChecks className="h-3 w-3" />
            {task.checklist.filter((c) => c.done).length}/{task.checklist.length}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMoveBackward(task)}
          disabled={!canManage || task.status === "backlog"}
          title="التراجع"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink/[0.04] text-ink/40 hover:bg-ink/[0.08] disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onMoveForward(task)}
          disabled={task.status === "done" || (!canManage && !canMemberAdvance(task.status))}
          title="التقديم"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
