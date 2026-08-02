"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  FolderKanban,
  Plus,
  ClipboardList,
  Users,
  CheckCircle2,
  Pencil,
  Trash2,
  CalendarDays,
  Building2,
  ArrowLeft,
  Loader2,
  ChevronLeft,
  BarChart3,
  UserCog,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import WorkflowBadge from "@/features/team/components/WorkflowBadge";
import PriorityBadge from "@/features/team/components/PriorityBadge";
import ProgressBar from "@/features/team/components/ProgressBar";
import ProjectModal from "@/features/team/components/ProjectModal";

import {
  formatDeadline,
  getUserName,
  getClientName,
  calcProjectProgress,
  isDeadlineOverdue,
  getAssigneeId,
  getProjectMemberIds,
  canManageTeam,
} from "@/features/team/lib/teamUtils";

import { removeDocument } from "@/lib/firestoreService";

import { getProjectIcon } from "@/constants/projectIcons";

import StatsCard from "@/features/dashboard/ui/StatsCard";
import Avatar from "@/features/dashboard/ui/Avatar";

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
        .filter((task) => task.projectId)
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        })
        .slice(0, 5),
    [tasks],
  );

  const stats = useMemo(
    () => [
      {
        label: "المشاريع",
        value: projects.length,
        description: "إجمالي المشاريع النشطة في الفريق.",
        icon: FolderKanban,
        footer: "teamProjects",
      },
      {
        label: "المهام",
        value: tasks.length,
        description: "إجمالي المهام الموزعة على الفريق.",
        icon: ClipboardList,
        footer: "tasks",
      },
      {
        label: "قيد التنفيذ",
        value: tasks.filter((task) => task.status === "in-progress").length,
        description: "مهام تعمل الآن داخل الفريق.",
        icon: Loader2,
        footer: "in-progress",
      },
      {
        label: "المكتملة",
        value: tasks.filter(
          (task) => task.status === "done",
        ).length,
        description: "مهام تم إنهاؤها واعتمادها.",
        icon: CheckCircle2,
        footer: "done",
      },
    ],
    [projects, tasks],
  );

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

  function getDoneCount(projectId) {
    const projectTasks = tasksByProject[projectId] || [];
    return projectTasks.filter(
      (task) => task.status === "done",
    ).length;
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
          <button
            type="button"
            onClick={openCreate}
            className={`group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r ${theme.gradient} px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 ${theme.gradientHover} sm:w-auto`}
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              مشروع جديد
            </span>
          </button>
        </PageHero>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {[
            {
              href: "/dashboard/team/members",
              icon: Users,
              label: "الأعضاء",
              count: activeUsers.length,
            },
            {
              href: "/dashboard/team/projects",
              icon: FolderKanban,
              label: "المشاريع",
              count: projects.length,
            },
            {
              href: "/dashboard/team/my-tasks",
              icon: ClipboardList,
              label: "مهماتي",
              count: tasks.filter(
                (task) => getAssigneeId(task) === currentUser?.uid,
              ).length,
            },
            {
              href: "/dashboard/team/progress",
              icon: BarChart3,
              label: "لوحة التقدم",
              count: `${Math.round(
                (tasks.filter(
                  (task) => task.status === "done",
                ).length /
                  (tasks.length || 1)) *
                  100,
              )}%`,
            },
          ].map(({ href, icon: Icon, label, count }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center justify-between rounded-2xl border border-gray-200/80 bg-card p-4 shadow-[0_8px_30px_rgba(0,0,0,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.07)] ${theme.hoverBorder}`}
            >
              <span className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${theme.chip}`}>
                  <Icon className="h-5 w-5" />
                </span>

                <span className="text-sm font-black text-ink">{label}</span>
              </span>

              <span className="rounded-lg bg-black px-2.5 py-1 text-[11px] font-black text-white dark:bg-white dark:text-black">
                {count}
              </span>
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatsCard
                key={`${stat.label}-${index}`}
                label={stat.label}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                footer={stat.footer}
              />
            ))}
          </div>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-ink">
                  المشاريع
                </h2>

                <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${theme.chip}`}>
                  {projects.length}
                </span>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className={`flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-dashed ${theme.border} ${theme.bgSofter} px-6 text-center`}>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.bgSoftStrong} ${theme.textSoft}`}>
                  <FolderKanban className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-base font-black text-ink">
                  لا توجد مشاريع بعد
                </h3>

                <p className="mt-1.5 max-w-sm text-sm leading-6 text-ink/40">
                  أنشئ أول مشروع ووزّع مهامه على أعضاء فريقك.
                </p>

                <button
                  type="button"
                  onClick={openCreate}
                  className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition ${theme.solid} ${theme.solidHover}`}
                >
                  <Plus className="h-4 w-4" />
                  إنشاء مشروع
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => {
                  const projectTasks = tasksByProject[project.id] || [];
                  const progress = calcProjectProgress(projectTasks);
                  const overdue = isDeadlineOverdue(project.deadline);
                  const memberIds = getProjectMemberIds(project);

return (
                    <div
                      key={project.id}
                      className={`group relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-card shadow-[0_8px_30px_rgba(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] ${theme.hoverBorder} cursor-pointer`}
                      onClick={() => window.location.href = `/dashboard/team/projects/${project.id}`}
                    >
                      {(() => {
                        const ProjectIcon = getProjectIcon(project.icon);

                        return (
                          <>
                            <div
                              className={`absolute inset-x-0 top-0 h-1 origin-right transition-transform duration-500 ${
                                progress >= 100
                                  ? "bg-green-500"
                                  : progress >= 60
                                  ? "bg-emerald-500"
                                  : progress >= 30
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                            />

                            <div className="relative p-5">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-white shadow-md ring-4 ring-ink/[0.03] transition-transform duration-300 group-hover:scale-105`}>
                                    <ProjectIcon className="h-5 w-5" />
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <WorkflowBadge status={project.status} />
                                      <PriorityBadge priority={project.priority} />
                                    </div>

                                    <h3 className={`mt-1.5 truncate text-sm font-black tracking-tight text-ink transition-colors ${theme.groupHoverText}`}>
                                      {project.title || "بدون عنوان"}
                                    </h3>
                                  </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); openEdit(project); }}
                                    title="تعديل المشروع"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink/[0.045] text-ink/50 transition hover:bg-ink/[0.08] hover:text-ink"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>

                                  {canManage && (
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleDelete(project); }}
                                      title="حذف المشروع"
                                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-400 transition hover:bg-red-600 hover:text-white dark:hover:bg-red-400"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {project.description && (
                                <p className="mt-3 line-clamp-2 text-xs leading-5 text-ink/40">
                                  {project.description}
                                </p>
                              )}

                              <div className="mt-4 grid grid-cols-2 gap-2.5">
                                <div className="flex items-center gap-2 rounded-xl bg-surface/80 px-3 py-2">
                                  <Building2 className="h-3.5 w-3.5 shrink-0 text-ink/30" />

                                  <span className="truncate text-[11px] font-bold text-ink/60">
                                    {getClientName(clientMap, project.clientId)}
                                  </span>
                                </div>

                                <div
                                  className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                                    overdue
                                      ? "bg-red-50 text-red-600"
                                      : "bg-surface/80"
                                  }`}
                                >
                                  <CalendarDays className="h-3.5 w-3.5 shrink-0 text-ink/30" />

                                  <span
                                    className={`truncate text-[11px] font-bold ${
                                      overdue ? "text-red-600" : "text-ink/60"
                                    }`}
                                  >
                                    {formatDeadline(project.deadline)}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-4">
                                <ProgressBar value={progress} />
                              </div>

                              <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink/[0.07] pt-3.5">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/45">
                                    <ClipboardList className="h-3.5 w-3.5 text-ink/30" />
                                    {getDoneCount(project.id)}/{projectTasks.length}
                                  </span>

                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/45">
                                    <Users className="h-3.5 w-3.5 text-ink/30" />
                                    {memberIds.length}
                                  </span>
                                </div>

                                <span className={`inline-flex items-center gap-1 text-[11px] font-bold transition-all duration-200 group-hover:gap-2 ${theme.text}`}>
                                  عرض المهام
                                  <ArrowLeft className="h-3.5 w-3.5" />
                                </span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-6">
            <section className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-black tracking-tight text-ink">
                      أحدث المهام
                    </h2>

                    <p className="mt-0.5 text-xs font-medium text-ink/40">
                      آخر المهام المضافة للفريق
                    </p>
                  </div>
                </div>
              </div>

              {recentTasks.length === 0 ? (
                <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 text-center">
                  <ClipboardList className="h-6 w-6 text-gray-300" />
                  <p className="mt-2 text-sm font-bold text-ink/50">
                    لا توجد مهام بعد
                  </p>
                  <p className="mt-1 text-[11px] text-ink/35">
                    أضف مهامًا داخل المشاريع لتبدأ العمل.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentTasks.map((task) => {
                    const project = projects.find(
                      (item) => item.id === task.projectId,
                    );

                    return (
                      <Link
                        key={task.id}
                        href={`/dashboard/team/tasks/${task.id}`}
                        className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50/40"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-bold text-ink transition-colors group-hover:text-amber-700">
                            {task.title || "بدون عنوان"}
                          </h3>

                          <p className="mt-0.5 truncate text-[11px] font-medium text-ink/40">
                            {project?.title || "مشروع محذوف"} •{" "}
                            {getUserName(userMap, getAssigneeId(task))}
                          </p>
                        </div>

                        <ChevronLeft className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:-translate-x-0.5 group-hover:text-amber-600" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Users className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-black tracking-tight text-ink">
                      أعضاء الفريق
                    </h2>

                    <p className="mt-0.5 text-xs font-medium text-ink/40">
                      {activeUsers.length} عضو مسجل
                    </p>
                  </div>
                </div>
              </div>

              {activeUsers.length === 0 ? (
                <div className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 text-center">
                  <p className="text-sm font-bold text-ink/50">
                    لا يوجد أعضاء بعد
                  </p>
                  <p className="mt-1 text-[11px] text-ink/35">
                    سجّل الأعضاء ليتمكنوا من استلام المهام.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {activeUsers.slice(0, 6).map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-2.5"
                    >
                      <Avatar user={user} size={36} />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink">
                          {user.name || "بدون اسم"}
                        </p>

                        <p className="truncate text-[11px] text-ink/40">
                          {getRoleLabel(user.role)}
                        </p>
                      </div>

                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          user.status === "active" ? "bg-green-500" : "bg-gray-300"
                        }`}
                        title={user.status === "active" ? "نشط" : "غير نشط"}
                      />
                    </li>
                  ))}
                </ul>
              )}

              {activeUsers.length > 6 && (
                <p className="mt-3 text-center text-[11px] font-bold text-ink/35">
                  + {activeUsers.length - 6} عضو آخر
                </p>
              )}
            </section>
          </div>
        </div>
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editingProject}
        users={activeUsers}
        clients={clients}
      />
    </ProtectedRoute>
  );
}
