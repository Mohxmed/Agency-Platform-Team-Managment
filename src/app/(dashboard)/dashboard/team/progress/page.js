"use client";

import { useMemo } from "react";
import Link from "next/link";

import {
  BarChart3,
  FolderKanban,
  Loader2,
  CheckCircle2,
  Users,
  ListChecks,
  TrendingUp,
  Clock3,
  Target,
} from "lucide-react";

import { motion } from "framer-motion";

import { ProtectedRoute } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import TeamHero from "@/features/team/components/TeamHero";

import {
  calcProjectProgress,
  formatDeadline,
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

  const {
    projects,
    tasks,
    activeUsers,
    loading,
  } = useTeamData();


  const tasksByProject = useMemo(() => {
    const map = {};

    tasks.forEach((task) => {
      if (!map[task.projectId]) {
        map[task.projectId] = [];
      }

      map[task.projectId].push(task);
    });

    return map;
  }, [tasks]);


  const tasksByUser = useMemo(() => {
    const map = {};

    tasks.forEach((task) => {
      const userId = getAssigneeId(task);

      if (!userId) return;

      if (!map[userId]) {
        map[userId] = [];
      }

      map[userId].push(task);
    });

    return map;
  }, [tasks]);


  const completedTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.status === "done" ||
          task.status === "approved",
      ).length,
    [tasks],
  );


  const totalHours = useMemo(
    () =>
      tasks.reduce(
        (sum, task) =>
          sum + Number(task.spentHours || 0),
        0,
      ),
    [tasks],
  );


  const completionRate = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;


  const activeProjects = useMemo(
    () =>
      projects.filter((project) => {
        const projectTasks =
          tasksByProject[project.id] || [];

        return calcProjectProgress(projectTasks) < 100;
      }).length,
    [projects, tasksByProject],
  );


  const stats = useMemo(
    () => [
      {
        label: "المشاريع",
        value: projects.length,
        description:
          "إجمالي المشاريع المسجلة داخل الفريق.",
        icon: FolderKanban,
        footer: "TOTAL PROJECTS",
      },
      {
        label: "مشاريع نشطة",
        value: activeProjects,
        description:
          "المشاريع التي ما زالت قيد التنفيذ.",
        icon: Loader2,
        footer: "ACTIVE",
      },
      {
        label: "نسبة الإنجاز",
        value: `${completionRate}%`,
        description:
          "متوسط اكتمال مهام الفريق.",
        icon: CheckCircle2,
        footer: "COMPLETION",
      },
      {
        label: "ساعات العمل",
        value: `${totalHours}h`,
        description:
          "إجمالي الوقت المسجل للمهام.",
        icon: Clock3,
        footer: "TRACKED HOURS",
      },
    ],
    [
      projects.length,
      activeProjects,
      completionRate,
      totalHours,
    ],
  );


  return (
    <ProtectedRoute permission="progress">
      <div
        dir="rtl"
        className="space-y-8"
      >
        <TeamHero
          icon={BarChart3}
          title="لوحة التقدم"
          subtitle="تحليل أداء المشاريع، الفريق، وسير العمل."
        />


        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  h-36
                  animate-pulse
                  rounded-[28px]
                  bg-black/[0.04]
                  dark:bg-white/[0.04]
                "
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {stats.map((stat, index) => (
              <StatsCard
                key={`${stat.label}-${index}`}
                {...stat}
              />
            ))}
          </motion.div>
        )}
        <div className="grid gap-6 xl:grid-cols-5">
          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="
              xl:col-span-2
              rounded-[28px]
              border
              border-black/[0.06]
              bg-white/70
              p-6
              backdrop-blur-2xl
              dark:border-white/[0.08]
              dark:bg-white/[0.04]
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-2xl
                    ${theme.chip}
                  `}
                >
                  <ListChecks className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-ink">
                    توزيع مراحل العمل
                  </h3>

                  <p className="mt-1 text-xs font-medium text-ink/35">
                    حالة المهام الحالية
                  </p>
                </div>
              </div>

              <span
                className="
                  rounded-full
                  bg-black/[0.04]
                  px-3
                  py-1
                  text-[11px]
                  font-bold
                  text-ink/40
                  dark:bg-white/[0.06]
                "
              >
                {tasks.length} مهمة
              </span>
            </div>


            {loading ? (
              <div className="mt-8 space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="
                      h-12
                      animate-pulse
                      rounded-2xl
                      bg-black/[0.04]
                      dark:bg-white/[0.05]
                    "
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 space-y-5">
                {WORKFLOW_STATUSES.map((status) => {
                  const count = tasks.filter(
                    (task) =>
                      task.status === status.value,
                  ).length;

                  const percentage = tasks.length
                    ? Math.round(
                        (count / tasks.length) * 100,
                      )
                    : 0;


                  return (
                    <div
                      key={status.value}
                      className="group"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                status.color,
                            }}
                          />

                          <span className="text-xs font-bold text-ink/60">
                            {status.labelAr}
                          </span>
                        </div>


                        <span className="text-xs font-black text-ink">
                          {count}
                        </span>
                      </div>


                      <div
                        className="
                          h-2
                          overflow-hidden
                          rounded-full
                          bg-black/[0.05]
                          dark:bg-white/[0.06]
                        "
                      >
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${percentage}%`,
                          }}
                          transition={{
                            duration: 0.8,
                          }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor:
                              status.color,
                          }}
                        />
                      </div>


                      <div className="mt-1 text-end">
                        <span
                          className="
                            text-[10px]
                            font-bold
                            text-ink/30
                          "
                        >
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>


          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="
              xl:col-span-3
              rounded-[28px]
              border
              border-black/[0.06]
              bg-white/70
              p-6
              backdrop-blur-2xl
              dark:border-white/[0.08]
              dark:bg-white/[0.04]
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-2xl
                    ${theme.chip}
                  `}
                >
                  <TrendingUp className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-ink">
                    أداء الفريق
                  </h3>

                  <p className="mt-1 text-xs font-medium text-ink/35">
                    توزيع المهام حسب الأعضاء
                  </p>
                </div>
              </div>

              <span
                className="
                  rounded-full
                  bg-black/[0.04]
                  px-3
                  py-1
                  text-[11px]
                  font-bold
                  text-ink/40
                  dark:bg-white/[0.06]
                "
              >
                {activeUsers.length} عضو
              </span>
            </div>


            {loading ? (
              <div className="mt-8 space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="
                      h-14
                      animate-pulse
                      rounded-2xl
                      bg-black/[0.04]
                      dark:bg-white/[0.05]
                    "
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 space-y-5">
                {activeUsers.map((user) => {
                  const userTasks =
                    tasksByUser[user.id] || [];

                  const done =
                    userTasks.filter(
                      (task) =>
                        task.status === "done" ||
                        task.status === "approved",
                    ).length;

                  const active =
                    userTasks.length - done;

                  const percentage = userTasks.length
                    ? Math.round(
                        (done / userTasks.length) *
                          100,
                      )
                    : 0;


                  return (
                    <div
                      key={user.id}
                      className="
                        flex
                        items-center
                        gap-4
                      "
                    >
                      <Avatar
                        user={user}
                        size={42}
                      />


                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <p className="truncate text-xs font-black text-ink">
                            {user.name ||
                              user.email ||
                              "بدون اسم"}
                          </p>

                          <span
                            className="
                              text-[11px]
                              font-bold
                              text-ink/40
                            "
                          >
                            {done}/{userTasks.length}
                          </span>
                        </div>


                        <div
                          className="
                            mt-2
                            h-2
                            overflow-hidden
                            rounded-full
                            bg-black/[0.05]
                            dark:bg-white/[0.06]
                          "
                        >
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${percentage}%`,
                            }}
                            transition={{
                              duration: 0.7,
                            }}
                            className={`
                              h-full
                              rounded-full
                              bg-gradient-to-l
                              ${theme.gradient}
                            `}
                          />
                        </div>
                      </div>


                      {active > 0 && (
                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-[10px]
                            font-black
                            ${theme.chip}
                          `}
                        >
                          {active} نشطة
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>
        </div>        
        <ProjectsSection
          projects={projects}
          tasksByProject={tasksByProject}
          loading={loading}
          theme={theme}
        />
      </div>
    </ProtectedRoute>
  );
}
function ProjectsSection({
  projects,
  tasksByProject,
  loading,
  theme,
}) {
  const projectsWithProgress = useMemo(
    () =>
      projects
        .map((project) => {
          const projectTasks =
            tasksByProject[project.id] || [];

          const overdue =
            projectTasks.filter(
              (task) =>
                !(
                  task.status === "done" ||
                  task.status === "approved"
                ) &&
                isDeadlineOverdue(task.deadline),
            ).length;


          return {
            ...project,
            tasks: projectTasks,
            progress:
              calcProjectProgress(projectTasks),
            overdue,
          };
        })
        .sort(
          (a, b) =>
            b.progress - a.progress,
        ),
    [
      projects,
      tasksByProject,
    ],
  );


  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.3,
      }}
      className="
        rounded-[28px]
        border
        border-black/[0.06]
        bg-white/70
        p-6
        backdrop-blur-2xl
        dark:border-white/[0.08]
        dark:bg-white/[0.04]
      "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-2xl
              ${theme.chip}
            `}
          >
            <FolderKanban className="h-5 w-5" />
          </div>


          <div>
            <h3 className="text-sm font-black text-ink">
              تقدم المشاريع
            </h3>

            <p className="mt-1 text-xs font-medium text-ink/35">
              متابعة حالة المشاريع الحالية
            </p>
          </div>
        </div>


        <Link
          href="/dashboard/team"
          className={`
            text-xs
            font-black
            ${theme.text}
            transition
            hover:opacity-70
          `}
        >
          عرض الكل →
        </Link>
      </div>


      {loading ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="
                  h-44
                  animate-pulse
                  rounded-[24px]
                  bg-black/[0.04]
                  dark:bg-white/[0.05]
                "
              />
            ),
          )}
        </div>
      ) : projectsWithProgress.length === 0 ? (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            py-16
            text-center
          "
        >
          <FolderKanban
            className="
              h-10
              w-10
              text-ink/10
            "
          />

          <p className="mt-4 text-sm font-bold text-ink/40">
            لا توجد مشاريع حاليا
          </p>
        </div>
      ) : (
        <div
          className="
            mt-8
            grid
            gap-5
            lg:grid-cols-2
          "
        >
          {projectsWithProgress.map(
            (project) => {
              const ProjectIcon =
                getProjectIcon(
                  project.icon,
                );


              return (
                <Link
                  key={project.id}
                  href={`/dashboard/team/projects/${project.id}`}
                  className="
                    group
                    rounded-[24px]
                    border
                    border-black/[0.06]
                    bg-white/50
                    p-5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                    dark:border-white/[0.08]
                    dark:bg-white/[0.03]
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div
                        className={`
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-2xl
                          bg-gradient-to-br
                          ${theme.heroGradient}
                          text-white
                        `}
                      >
                        <ProjectIcon className="h-6 w-6" />
                      </div>


                      <div>
                        <h4
                          className="
                            text-sm
                            font-black
                            text-ink
                          "
                        >
                          {project.title}
                        </h4>

                        <p
                          className="
                            mt-1
                            text-xs
                            font-medium
                            text-ink/40
                          "
                        >
                          {project.tasks.length}
                          {" "}
                          مهمة
                        </p>
                      </div>
                    </div>


                    <span
                      className={`
                        text-xl
                        font-black
                        ${theme.text}
                      `}
                    >
                      {project.progress}%
                    </span>
                  </div>


                  <div className="mt-6">
                    <div
                      className="
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-black/[0.05]
                        dark:bg-white/[0.06]
                      "
                    >
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${project.progress}%`,
                        }}
                        transition={{
                          duration: 0.8,
                        }}
                        className={`
                          h-full
                          rounded-full
                          bg-gradient-to-l
                          ${theme.gradient}
                        `}
                      />
                    </div>
                  </div>


                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.overdue > 0 && (
                      <span
                        className="
                          rounded-full
                          bg-red-500/10
                          px-3
                          py-1
                          text-[10px]
                          font-black
                          text-red-500
                        "
                      >
                        {project.overdue}
                        {" "}
                        متأخرة
                      </span>
                    )}

                    {project.tasks
                      .slice(0, 4)
                      .map((task) => (
                        <span
                          key={task.id}
                          className="
                            rounded-full
                            bg-black/[0.04]
                            px-3
                            py-1
                            text-[10px]
                            font-bold
                            text-ink/50
                            dark:bg-white/[0.06]
                          "
                        >
                          {task.title}
                        </span>
                      ))}


                    {project.tasks.length > 4 && (
                      <span
                        className="
                          rounded-full
                          bg-black/[0.04]
                          px-3
                          py-1
                          text-[10px]
                          font-bold
                          text-ink/40
                        "
                      >
                        +
                        {project.tasks.length - 4}
                      </span>
                    )}
                  </div>
                </Link>
              );
            },
          )}
        </div>
      )}
    </motion.section>
  );
}