"use client";

import { useMemo } from "react";

import Link from "next/link";

import {
  BarChart3,
  FolderKanban,
  Loader2,
  CheckCircle2,
  Clock,
  Users,
  ListChecks,
  TrendingUp,
} from "lucide-react";

import { ProtectedRoute } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import TeamHero from "@/features/team/components/TeamHero";
import ProgressBar from "@/features/team/components/ProgressBar";
import WorkflowBadge from "@/features/team/components/WorkflowBadge";

import {
  calcProjectProgress,
  formatDeadline,
  getUserName,
  getAssigneeId,
  isDeadlineOverdue,
} from "@/features/team/lib/teamUtils";

import { WORKFLOW_STATUSES } from "@/constants/workflow";

import StatsCard from "@/features/dashboard/ui/StatsCard";

import Avatar from "@/features/dashboard/ui/Avatar";

import { getProjectIcon } from "@/constants/projectIcons";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";

export default function TeamProgressPage() {
  const theme = usePageTheme();

  const { projects, tasks, activeUsers, userMap, loading } = useTeamData();

  const stats = useMemo(
    () => [
      {
        label: "المشاريع",
        value: projects.length,
        description: "إجمالي المشاريع داخل الفريق.",
        icon: FolderKanban,
        footer: "projects",
      },
      {
        label: "مشاريع نشطة",
        value: projects.filter((project) => {
          const projectTasks = tasks.filter(
            (task) => task.projectId === project.id,
          );
          return calcProjectProgress(projectTasks) < 100;
        }).length,
        description: "مشاريع لم تكتمل بعد.",
        icon: Loader2,
        footer: "active",
      },
      {
        label: "المهام المنجزة",
        value: `${Math.round(
          (tasks.filter(
            (task) => task.status === "done",
          ).length /
            (tasks.length || 1)) *
            100,
        )}%`,
        description: "من إجمالي مهام الفريق.",
        icon: CheckCircle2,
        footer: "completion",
      },
      {
        label: "ساعات العمل",
        value: tasks.reduce(
          (sum, task) => sum + Number(task.spentHours || 0),
          0,
        ),
        description: "إجمالي الساعات المسجلة.",
        icon: Clock,
        footer: "hours",
      },
    ],
    [projects, tasks],
  );

  const distribution = useMemo(
    () =>
      WORKFLOW_STATUSES.map((status) => ({
        ...status,
        count: tasks.filter((task) => task.status === status.value).length,
      })),
    [tasks],
  );

  const totalTasks = tasks.length || 1;

  const projectsWithProgress = useMemo(
    () =>
      projects
        .map((project) => {
          const projectTasks = tasks.filter(
            (task) => task.projectId === project.id,
          );

          const overdue = projectTasks.filter(
            (task) =>
              !(task.status === "done" || task.status === "approved") &&
              isDeadlineOverdue(task.deadline),
          ).length;

          const hours = projectTasks.reduce(
            (sum, task) => sum + Number(task.spentHours || 0),
            0,
          );

          return {
            ...project,
            tasks: projectTasks,
            progress: calcProjectProgress(projectTasks),
            overdue,
            hours,
          };
        })
        .sort((a, b) => b.progress - a.progress),
    [projects, tasks],
  );

  const memberWorkload = useMemo(
    () =>
      activeUsers
        .map((user) => ({
          user,
          total: tasks.filter((task) => getAssigneeId(task) === user.id).length,
          active: tasks.filter(
            (task) =>
              getAssigneeId(task) === user.id &&
              !(task.status === "done" || task.status === "approved"),
          ).length,
          done: tasks.filter(
            (task) =>
              getAssigneeId(task) === user.id &&
              (task.status === "done" || task.status === "approved"),
          ).length,
        }))
        .sort((a, b) => b.total - a.total),
    [tasks, activeUsers],
  );

  return (
    <ProtectedRoute permission="progress">
      <div dir="rtl" className="space-y-6">
        <TeamHero
          icon={BarChart3}
          title="لوحة التقدم"
          subtitle="نظرة عامة على تقدم المشاريع وتوزيع مهام الفريق."
        />

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

        <div className="grid gap-6 xl:grid-cols-5">
          <div className="rounded-[24px] border border-gray-200/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)] xl:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-black text-ink">
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${theme.chip}`}>
                  <ListChecks className="h-4 w-4" />
                </span>
                توزيع مراحل العمل
              </h3>

              <span className="text-[10px] font-black text-ink/30">
                {tasks.length} مهمة
              </span>
            </div>

            {loading ? (
              <div className="mt-6 space-y-3">
                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                  <div
                    key={item}
                    className="h-9 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  {distribution.map((status) =>
                    status.count > 0 ? (
                      <div
                        key={status.value}
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${(status.count / totalTasks) * 100}%`,
                          backgroundColor: status.color,
                        }}
                        title={`${status.labelAr}: ${status.count}`}
                      />
                    ) : null,
                  )}
                </div>

                <div className="mt-6 space-y-2.5">
                  {distribution.map((status) => (
                    <div key={status.value} className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />

                      <span className="w-24 text-xs font-bold text-ink/60">
                        {status.labelAr}
                      </span>

                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(status.count / totalTasks) * 100}%`,
                            backgroundColor: status.color,
                          }}
                        />
                      </div>

                      <span className="w-8 text-end text-xs font-black text-ink">
                        {status.count}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="rounded-[24px] border border-gray-200/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)] xl:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-black text-ink">
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${theme.chip}`}>
                  <TrendingUp className="h-4 w-4" />
                </span>
                عبء عمل الأعضاء
              </h3>

              <span className="text-[10px] font-black text-ink/30">
                {activeUsers.length} عضو
              </span>
            </div>

            {loading ? (
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-12 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {memberWorkload.length === 0 && (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <Users className="h-8 w-8 text-gray-200" />

                    <p className="text-sm font-bold text-ink/40">
                      لا يوجد أعضاء مسجلون بعد.
                    </p>
                  </div>
                )}

                {memberWorkload.map(({ user, total, active, done }) => {
                  const pct = total ? Math.round((done / total) * 100) : 0;

                  return (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar user={user} size={36} />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-bold text-ink/70">
                            {user.name || user.email || "بدون اسم"}
                          </p>

                          <p className="shrink-0 text-[10px] font-black text-ink/30">
                            {done}/{total} منجزة
                          </p>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full bg-gradient-to-l ${theme.gradient} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {active > 0 && (
                        <span className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-black ${theme.chip}`}>
                          {active} نشطة
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-gray-200/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-black text-ink">
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${theme.chip}`}>
                <FolderKanban className="h-4 w-4" />
              </span>
              تقدم المشاريع
            </h3>

            <Link
              href="/dashboard/team"
              className={`text-[11px] font-black transition hover:opacity-80 ${theme.textSoft} ${theme.textStrong}`}
            >
              عرض الكل ←
            </Link>
          </div>

          {loading ? (
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-2xl bg-gray-100"
                />
              ))}
            </div>
          ) : projectsWithProgress.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <FolderKanban className="h-8 w-8 text-gray-200" />

              <p className="text-sm font-bold text-ink/40">
                لا توجد مشاريع بعد.
              </p>

              <Link
                href="/dashboard/team"
                className={`mt-1 text-xs font-black transition hover:opacity-80 ${theme.textSoft} ${theme.textStrong}`}
              >
                أنشئ أول مشروع ←
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {projectsWithProgress.map((project) => {
                const ProjectIcon = getProjectIcon(project.icon);

                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/team/projects/${project.id}`}
                    className={`block rounded-2xl border border-gray-100 p-4 transition-all ${theme.hoverBorder} ${theme.rowHover}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${theme.heroGradient} text-sm font-black text-white`}>
                          <ProjectIcon className="h-5 w-5" />
                        </span>

                      <div>
                        <p className="text-sm font-black text-ink">
                          {project.title}
                        </p>

                        <p className="mt-0.5 text-[11px] font-semibold text-ink/40">
                          {project.tasks.length} مهمة
                          {project.overdue > 0 && (
                            <span className="mr-2 rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-black text-red-600">
                              {project.overdue} متأخرة
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <span className="hidden text-xs font-bold text-ink/40 sm:block">
                        {project.hours} ساعة
                      </span>

                      <span className="hidden text-xs font-bold text-ink/40 sm:block">
                        الاستحقاق: {formatDeadline(project.deadline)}
                      </span>

                      <span className={`text-sm font-black ${theme.text}`}>
                        {project.progress}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ProgressBar value={project.progress} showLabel={false} />
                  </div>

                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {project.tasks.slice(0, 8).map((task) => (
                          <WorkflowBadge key={task.id} status={task.status} small />
                        ))}

                        {project.tasks.length > 8 && (
                          <span className="text-[10px] font-black text-ink/30">
                            +{project.tasks.length - 8}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
