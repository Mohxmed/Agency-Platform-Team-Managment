"use client";

import { useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Users,
  Clock,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import WorkflowBadge from "@/features/team/components/WorkflowBadge";
import PriorityBadge from "@/features/team/components/PriorityBadge";
import ProgressBar from "@/features/team/components/ProgressBar";
import Avatar from "@/features/dashboard/ui/Avatar";
import TaskBoard from "@/features/team/components/TaskBoard";
import TaskModal from "@/features/team/components/TaskModal";
import ProjectModal from "@/features/team/components/ProjectModal";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";

import { useToast } from "@/hooks/useToast";

import { ProjectIcon } from "@/constants/projectIcons";

import {
  formatDeadline,
  getUserName,
  getClientName,
  getAssigneeId,
  calcProjectProgress,
  nextWorkflowStatus,
  prevWorkflowStatus,
  getWorkflowMeta,
  getProjectMemberIds,
  canManageTeam,
  uid,
} from "@/features/team/lib/teamUtils";

import {
  updateDocument,
  removeDocument,
} from "@/lib/firestoreService";

export default function ProjectDetailPage() {
  const params = useParams();

  const router = useRouter();

  const { showToast } = useToast();

  const { user: currentUser, profile } = useAuth();

  const canManage = canManageTeam(profile?.role);

  const { projects, tasks, activeUsers, userMap, clientMap, clients, loading } =
    useTeamData();

  const projectId = params?.id;

  const project = projects.find((item) => item.id === projectId);

  const projectTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.projectId === projectId)
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return aTime - bTime;
        }),
    [tasks, projectId],
  );

  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const [defaultStatus, setDefaultStatus] = useState("backlog");

  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const [busy, setBusy] = useState(false);

  const currentAuthorName =
    userMap.get(currentUser?.uid)?.name ||
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
    if (busy) return;

    const isAssignee = getAssigneeId(task) === currentUser?.uid;

    if (!canManage && !isAssignee) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message: "ليس لديك صلاحية تعديل حالة هذه المهمة.",
      });
      return;
    }

    const fromMeta = getWorkflowMeta(task.status);

    const nextStatus =
      direction === "forward"
        ? nextWorkflowStatus(task.status)
        : prevWorkflowStatus(task.status);

    if (nextStatus === task.status) return;

    const toMeta = getWorkflowMeta(nextStatus);

    setBusy(true);

    try {
      await updateDocument("tasks", task.id, {
        status: nextStatus,
        activity: addActivity(
          task,
          "status",
          `تم نقل المهمة من "${fromMeta.labelAr}" إلى "${toMeta.labelAr}"`,
        ),
      });
    } catch (error) {
      console.error("Failed to move task:", error);
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء نقل المهمة.",
      });
    } finally {
      setBusy(false);
    }
  }

  function openCreateTask(status = "backlog") {
    setEditingTask(null);
    setDefaultStatus(status);
    setTaskModalOpen(true);
  }

  function openEditTask(task) {
    setEditingTask(task);
    setTaskModalOpen(true);
  }

  async function handleDeleteTask(task) {
    if (!canManageTeam(profile?.role)) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message: "ليس لديك صلاحية حذف المهام.",
      });
      return;
    }

    const confirmed = window.confirm(
      `هل أنت متأكد من حذف مهمة "${task.title}"؟`,
    );

    if (!confirmed) return;

    try {
      await removeDocument("tasks", task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء حذف المهمة.",
      });
    }
  }

  async function handleDeleteProject() {
    if (!canManageTeam(profile?.role)) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message: "ليس لديك صلاحية حذف المشروع.",
      });
      return;
    }

    const confirmed = window.confirm(
      `هل أنت متأكد من حذف مشروع "${project.title}" وجميع مهامه؟`,
    );

    if (!confirmed) return;

    setBusy(true);

    try {
      await Promise.all([
        removeDocument("teamProjects", project.id),
        ...projectTasks.map((task) => removeDocument("tasks", task.id)),
      ]);

      router.push("/dashboard/team");
    } catch (error) {
      console.error("Failed to delete project:", error);
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء حذف المشروع.",
      });
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <ProtectedRoute permission="team">
        <div dir="rtl" className="space-y-6">
          <div className="h-40 animate-pulse rounded-[28px] border border-red-100 bg-red-50/50" />
          <div className="h-72 animate-pulse rounded-3xl border border-gray-100 bg-gray-50" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute permission="team">
      <div dir="rtl" className="space-y-6">
        <Link
          href="/dashboard/team"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/45 transition hover:text-red-600"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          العودة إلى الفريق والمشاريع
        </Link>

        {!project ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[24px] border border-dashed border-red-200 bg-red-50/30 px-6 text-center">
            <ClipboardList className="h-8 w-8 text-red-300" />
            <h2 className="mt-4 text-lg font-black text-ink">المشروع غير موجود</h2>
            <Link
              href="/dashboard/team"
              className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 dark:bg-red-400 dark:hover:bg-red-300"
            >
              العودة للقائمة
            </Link>
          </div>
        ) : (
          <>
            <section className="group relative overflow-hidden rounded-[28px] border border-red-100 bg-gradient-to-br from-red-50 via-card to-gray-50 p-6 shadow-[0_12px_40px_rgba(220,38,38,0.06)] sm:p-8">
              <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-red-500/10 blur-3xl" />

              <div className="relative">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg dark:from-red-500 dark:to-red-400">
                      <ProjectIcon name={project?.icon} className="h-7 w-7" />
                    </div>

                    <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <WorkflowBadge status={project.status} />
                      <PriorityBadge priority={project.priority} />
                    </div>

                    <h1 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl">
                      {project.title || "بدون عنوان"}
                    </h1>

                    {project.description && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/45">
                        {project.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-ink/45">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-ink/30" />
                        {getClientName(clientMap, project.clientId)}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-ink/30" />
                        التسليم: {formatDeadline(project.deadline)}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <ClipboardList className="h-3.5 w-3.5 text-ink/30" />
                        {projectTasks.length} مهمة
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-ink/30" />
                        المنفقة:{" "}
                        {projectTasks.reduce(
                          (sum, task) => sum + (Number(task.spentHours) || 0),
                          0,
                        )}
                        س
                      </span>
                    </div>
                  </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setProjectModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-ink/[0.08] bg-card px-3.5 py-2.5 text-xs font-bold text-ink/70 transition hover:border-ink/[0.16] hover:text-ink"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      تعديل
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteProject}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 dark:bg-red-400 dark:hover:bg-red-300 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      حذف
                    </button>

                    <button
                      type="button"
                      onClick={() => openCreateTask("backlog")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(220,38,38,0.22)] transition hover:from-red-700 hover:to-black dark:from-red-500 dark:to-red-400 dark:hover:from-red-400 dark:hover:to-red-300"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      مهمة جديدة
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <ProgressBar
                      value={calcProjectProgress(projectTasks)}
                      className="rounded-2xl border border-ink/[0.06] bg-card/80 p-4"
                    />

                    <div className="mt-3 rounded-2xl border border-ink/[0.06] bg-card/80 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-ink/35" />
                        <p className="text-sm font-bold text-ink">
                          أعضاء الفريق
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {getProjectMemberIds(project).length === 0 ? (
                          <span className="text-xs text-ink/35">
                            لم يتم تعيين أعضاء بعد
                          </span>
                        ) : (
                          getProjectMemberIds(project).map((memberId) => (
                            <span
                              key={memberId}
                              className="inline-flex items-center gap-2 rounded-full border border-ink/[0.06] bg-card px-2.5 py-1"
                            >
                              <Avatar
                                user={userMap.get(memberId)}
                                size={24}
                              />
                              <span className="text-[11px] font-bold text-ink/70">
                                {getUserName(userMap, memberId)}
                              </span>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-ink/[0.06] bg-card/80 p-4">
                    <div className="mb-3">
                      <p className="text-sm font-bold text-ink">
                        توزيع المهام
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {projectTasks.length === 0 ? (
                        <p className="py-3 text-center text-xs text-ink/35">
                          لا توجد مهام في هذا المشروع
                        </p>
                      ) : (
                        [
                          ["backlog", "تراكمي"],
                          ["ready", "جاهز"],
                          ["in-progress", "قيد التنفيذ"],
                          ["review", "مراجعة"],
                          ["revision", "تعديلات"],
                          ["approved", "معتمد"],
                          ["done", "منجز"],
                        ].map(([value, label]) => {
                          const count = projectTasks.filter(
                            (task) => task.status === value,
                          ).length;

                          return (
                            <div
                              key={value}
                              className="flex items-center justify-between gap-2"
                            >
                              <span className="text-[11px] font-semibold text-ink/50">
                                {label}
                              </span>

                              <div className="flex h-5 min-w-5 items-center justify-center rounded-md bg-ink/[0.05] px-1.5 text-[10px] font-black text-ink/60">
                                {count}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <TaskBoard
              tasks={projectTasks}
              userMap={userMap}
              onMoveForward={(task) => handleMove(task, "forward")}
              onMoveBackward={(task) => handleMove(task, "backward")}
              onEdit={openEditTask}
              onDelete={handleDeleteTask}
              onAddTask={(status) => openCreateTask(status)}
            />
          </>
        )}
      </div>

      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        editing={editingTask}
        projects={projects}
        users={activeUsers}
        defaultProjectId={projectId}
        defaultStatus={defaultStatus}
        currentUser={currentUser}
        onSaved={() => {}}
      />

      <ProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        editing={project}
        users={activeUsers}
        clients={clients}
      />
    </ProtectedRoute>
  );
}
