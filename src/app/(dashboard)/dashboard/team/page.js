"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  FolderKanban,
  Plus,
  ClipboardList,
  Users,
  ChevronLeft,
  Layers,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Timer,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import ProjectModal from "@/features/team/components/ProjectModal";
import TaskModal from "@/features/team/components/TaskModal";
import ProjectCard from "@/features/team/components/ProjectCard";

import {
  getUserName,
  getAssigneeId,
  getWorkflowMeta,
  canManageTeam,
  sortProjects,
  deriveProjectStatus,
  isDeadlineOverdue,
} from "@/features/team/lib/teamUtils";

import { removeDocument } from "@/lib/firestoreService";

import Avatar from "@/features/dashboard/ui/Avatar";
import Card from "@/features/dashboard/ui/Card";
import StatsCard from "@/features/dashboard/ui/StatsCard";

import PageHero from "@/features/dashboard/components/PageHero";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";

import { useToast } from "@/hooks/useToast";

import { roleConfig } from "@/constants/permissions";

export default function TeamPage() {
  const theme = usePageTheme();

  const { showToast } = useToast();

  const { user: currentUser, profile } = useAuth();

  const canManage = canManageTeam(profile?.role);

  const { projects, tasks, activeUsers, userMap, clientMap, clients, loading } =
    useTeamData();

  const [modalOpen, setModalOpen] = useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const [taskModalOpen, setTaskModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem("quickActionCreate") === "open-create") {
      sessionStorage.removeItem("quickActionCreate");
      // Intentional: open the create modal once on mount via a stored flag.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalOpen(true);
    }
  }, []);

  const tasksByProject = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (!task.projectId) return;
      map[task.projectId] = map[task.projectId] || [];
      map[task.projectId].push(task);
    });
    return map;
  }, [tasks]);

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        })
        .slice(0, 6),
    [tasks],
  );

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

  const latestProjects = useMemo(
    () => sortProjects(projects, "newest").slice(0, 4),
    [projects],
  );

  const derivedStatusByProject = useMemo(() => {
    const map = {};
    projects.forEach((project) => {
      map[project.id] = deriveProjectStatus(
        tasksByProject[project.id] || [],
        project.status,
      );
    });
    return map;
  }, [projects, tasksByProject]);

  const activeProjects = projects.filter((project) =>
    ["in-progress", "review", "revision"].includes(
      derivedStatusByProject[project.id],
    ),
  ).length;

  const doneProjects = projects.filter(
    (project) => derivedStatusByProject[project.id] === "done",
  ).length;

  const overdueProjects = projects.filter(
    (project) =>
      derivedStatusByProject[project.id] !== "done" &&
      isDeadlineOverdue(project.deadline),
  ).length;

  function openCreate() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function openEdit(project) {
    setEditingProject(project);
    setModalOpen(true);
  }

  async function handleDelete(project) {
    if (!canManageTeam(profile?.role)) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message: "ليس لديك صلاحية حذف المشاريع.",
      });
      return;
    }

    const confirmed = window.confirm(
      `هل أنت متأكد من حذف مشروع "${project.title}" وجميع مهامه؟`,
    );

    if (!confirmed) return;

    if (deleting) return;

    setDeleting(true);

    try {
      const projectTasks = tasks.filter((task) => task.projectId === project.id);

      await Promise.all([
        removeDocument("teamProjects", project.id),
        ...projectTasks.map((task) => removeDocument("tasks", task.id)),
      ]);
    } catch (error) {
      console.error("Failed to delete project:", error);
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء حذف المشروع.",
      });
    } finally {
      setDeleting(false);
    }
  }

  function getRoleLabel(role) {
    return roleConfig[role]?.label || roleConfig.default.label;
  }

  return (
    <ProtectedRoute permission="team">
      <div dir="rtl" className="space-y-6">
        <PageHero
          icon={FolderKanban}
          eyebrow="الفريق"
          title="إدارة الفريق والمشاريع"
          subtitle="أنشئ مشاريع، وقسّمها إلى مهام، ووزّعها على فريقك المسجل."
          badge="TEAM"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-red-700 shadow-md transition-all hover:-translate-y-0.5 hover:bg-red-50 dark:bg-black dark:text-white dark:hover:bg-black/80 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              مشروع جديد
            </button>

            <button
              type="button"
              onClick={() => setTaskModalOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-violet-700 dark:bg-violet-400 dark:text-violet-950 dark:hover:bg-violet-300 sm:w-auto"
            >
              <Layers className="h-4 w-4" />
              مهمة فردية
            </button>
          </div>
        </PageHero>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-[20px] bg-gray-100 dark:bg-white/[0.04]"
                />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="h-72 animate-pulse rounded-[28px] bg-gray-100 dark:bg-white/[0.04]" />
                <div className="h-64 animate-pulse rounded-[28px] bg-gray-100 dark:bg-white/[0.04]" />
              </div>

              <div className="space-y-6">
                <div className="h-80 animate-pulse rounded-[28px] bg-gray-100 dark:bg-white/[0.04]" />
                <div className="h-72 animate-pulse rounded-[28px] bg-gray-100 dark:bg-white/[0.04]" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatsCard
                label="إجمالي المشاريع"
                value={projects.length}
                description="كل مشاريع الفريق"
                icon={FolderKanban}
                accent="primary"
              />

              <StatsCard
                label="قيد التنفيذ"
                value={activeProjects}
                description="تنفيذ ومراجعة"
                icon={Loader2}
                accent="amber"
              />

              <StatsCard
                label="منجزة"
                value={doneProjects}
                description="مكتملة ومعتمدة"
                icon={CheckCircle2}
                accent="emerald"
              />

              <StatsCard
                label="متأخرة"
                value={overdueProjects}
                description="تجاوزت موعد التسليم"
                icon={Timer}
                accent="danger"
              />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* ==================== Main column ==================== */}
              <div className="min-w-0 space-y-6 lg:col-span-2">
                {/* أحدث المشاريع */}
                <Card hover={false} className="p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                        <FolderKanban className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-base font-black tracking-tight text-ink">
                          أحدث المشاريع
                        </h2>

                        <p className="mt-0.5 text-xs font-medium text-ink/60">
                          آخر المشاريع المضافة للفريق
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/dashboard/team/projects"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-ink/[0.08] bg-card px-3 py-2 text-xs font-bold text-ink/60 transition hover:border-red-200 hover:text-red-600 dark:hover:border-red-400/40 dark:hover:text-red-400"
                    >
                      عرض الكل
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {projects.length === 0 ? (
                    <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 text-center dark:border-white/10 dark:bg-white/[0.03]">
                      <FolderKanban className="h-6 w-6 text-gray-500 dark:text-ink/40" />

                      <p className="mt-2 text-sm font-bold text-ink/60">
                        لا توجد مشاريع بعد
                      </p>

                      <p className="mt-1 text-[11px] text-ink/60">
                        أنشئ أول مشروع ووزّع مهامه على فريقك.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {latestProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          tasks={tasksByProject[project.id] || []}
                          userMap={userMap}
                          clientMap={clientMap}
                          theme={theme}
                          canManage={canManage}
                          onEdit={openEdit}
                          onDelete={handleDelete}
                          variant="row"
                        />
                      ))}
                    </div>
                  )}
                </Card>

                {/* أحدث المهام */}
                <Card hover={false} className="p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                        <ClipboardList className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-base font-black tracking-tight text-ink">
                          أحدث المهام
                        </h2>

                        <p className="mt-0.5 text-xs font-medium text-ink/60">
                          آخر المهام المضافة للفريق
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/dashboard/team/all-tasks"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-ink/[0.08] bg-card px-3 py-2 text-xs font-bold text-ink/60 transition hover:border-red-200 hover:text-red-600 dark:hover:border-red-400/40 dark:hover:text-red-400"
                    >
                      عرض كل المهام
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {recentTasks.length === 0 ? (
                    <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 text-center dark:border-white/10 dark:bg-white/[0.03]">
                      <ClipboardList className="h-6 w-6 text-gray-500 dark:text-ink/40" />

                      <p className="mt-2 text-sm font-bold text-ink/60">
                        لا توجد مهام بعد
                      </p>

                      <p className="mt-1 text-[11px] text-ink/60">
                        أضف مهامًا داخل المشاريع أو أنشئ مهمة واحدة للفريق.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {recentTasks.map((task) => {
                        const project = projects.find(
                          (item) => item.id === task.projectId,
                        );

                        const assignee = userMap.get(getAssigneeId(task));

                        return (
                          <Link
                            key={task.id}
                            href={`/dashboard/team/tasks/${task.id}`}
                            className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50/40 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-amber-400/40 dark:hover:bg-amber-500/10"
                          >
                            <Avatar user={assignee} size={36} />

                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-bold text-ink transition-colors group-hover:text-amber-700">
                                {task.title || "بدون عنوان"}
                              </h3>

                              <p className="mt-0.5 truncate text-[11px] font-medium text-ink/60">
                                {project?.title ||
                                  (task.projectId
                                    ? "مشروع محذوف"
                                    : getWorkflowMeta(task.status).labelAr)}{" "}
                                • {getUserName(userMap, getAssigneeId(task))}
                              </p>
                            </div>

                            <ChevronLeft className="h-4 w-4 shrink-0 text-gray-500 transition-all group-hover:-translate-x-0.5 group-hover:text-amber-600 dark:text-ink/40 dark:group-hover:text-amber-400" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>

              {/* ==================== Sidebar ==================== */}
              <div className="min-w-0 space-y-6">
                {/* المهمات الفردية */}
                <Card hover={false} className="p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                        <Layers className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-base font-black tracking-tight text-ink">
                          المهمات الفردية
                        </h2>

                        <p className="mt-0.5 text-xs font-medium text-ink/60">
                          مهام مستقلة لا تتبع مشروعًا
                        </p>
                      </div>
                    </div>

                    {standaloneTasks.length > 0 && (
                      <Link
                        href="/dashboard/team/single-tasks"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-ink/[0.08] bg-card px-3 py-2 text-xs font-bold text-ink/60 transition hover:border-violet-300 hover:text-violet-600 dark:hover:border-violet-400/40 dark:hover:text-violet-400"
                      >
                        عرض الكل
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>

                  {standaloneTasks.length === 0 ? (
                    <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 text-center dark:border-white/10 dark:bg-white/[0.03]">
                      <Layers className="h-6 w-6 text-gray-500 dark:text-ink/40" />

                      <p className="mt-2 text-sm font-bold text-ink/60">
                        لا توجد مهمات فردية
                      </p>

                      <p className="mt-1 text-[11px] text-ink/60">
                        أنشئ مهمة مستقلة وأسندها لعضو الفريق مباشرة.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {standaloneTasks.slice(0, 5).map((task) => {
                        const assignee = userMap.get(getAssigneeId(task));

                        return (
                          <Link
                            key={task.id}
                            href={`/dashboard/team/tasks/${task.id}`}
                            className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/40 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-violet-400/40 dark:hover:bg-violet-500/10"
                          >
                            <Avatar user={assignee} size={36} />

                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-bold text-ink transition-colors group-hover:text-violet-700">
                                {task.title || "بدون عنوان"}
                              </h3>

                              <p className="mt-0.5 truncate text-[11px] font-medium text-ink/60">
                                {getWorkflowMeta(task.status).labelAr}{" "}
                                • {getUserName(userMap, getAssigneeId(task))}
                              </p>
                            </div>

                            <ChevronLeft className="h-4 w-4 shrink-0 text-gray-500 transition-all group-hover:-translate-x-0.5 group-hover:text-violet-600 dark:text-ink/40 dark:group-hover:text-violet-400" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </Card>

                {/* أعضاء الفريق */}
                <Card hover={false} className="p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                        <Users className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-base font-black tracking-tight text-ink">
                          أعضاء الفريق
                        </h2>

                        <p className="mt-0.5 text-xs font-medium text-ink/60">
                          {activeUsers.length} عضو مسجل
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/dashboard/team/members"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-ink/[0.08] bg-card px-3 py-2 text-xs font-bold text-ink/60 transition hover:border-red-200 hover:text-red-600 dark:hover:border-red-400/40 dark:hover:text-red-400"
                    >
                      عرض الكل
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {activeUsers.length === 0 ? (
                    <div className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 text-center dark:border-white/10 dark:bg-white/[0.03]">
                      <p className="text-sm font-bold text-ink/60">
                        لا يوجد أعضاء بعد
                      </p>

                      <p className="mt-1 text-[11px] text-ink/60">
                        سجّل الأعضاء ليتمكنوا من استلام المهام.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {activeUsers.slice(0, 6).map((user) => (
                        <li
                          key={user.id}
                          className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-2.5 dark:border-white/[0.06] dark:bg-white/[0.03]"
                        >
                          <Avatar user={user} size={36} />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-ink">
                              {user.name || "بدون اسم"}
                            </p>

                            <p className="truncate text-[11px] text-ink/60">
                              {getRoleLabel(user.role)}
                            </p>
                          </div>

                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              user.status === "active"
                                ? "bg-green-500"
                                : "bg-gray-300 dark:bg-white/20"
                            }`}
                            title={user.status === "active" ? "نشط" : "غير نشط"}
                          />
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeUsers.length > 6 && (
                    <p className="mt-3 text-center text-[11px] font-bold text-ink/60">
                      + {activeUsers.length - 6} عضو آخر
                    </p>
                  )}
                </Card>
              </div>
            </div>
          </>
        )}
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editingProject}
        users={activeUsers}
        clients={clients}
      />

      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        projects={projects}
        users={activeUsers}
        defaultProjectId=""
        defaultStatus="backlog"
        currentUser={currentUser}
        onSaved={() => {}}
      />
    </ProtectedRoute>
  );
}
