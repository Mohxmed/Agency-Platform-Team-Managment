"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  ClipboardList,
  CheckCircle2,
  Loader2,
  Timer,
  Search,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ListChecks,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { motion } from "framer-motion";

import { ProtectedRoute, useAuth } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import { WORKFLOW_STATUSES } from "@/constants/workflow";

import { updateDocument } from "@/lib/firestoreService";

import {
  formatDeadline,
  getAssigneeId,
  isDeadlineOverdue,
  canManageTeam,
  canMemberAdvance,
  uid,
} from "@/features/team/lib/teamUtils";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";

import { useToast } from "@/hooks/useToast";

import TeamHero from "@/features/team/components/TeamHero";

import PriorityBadge from "@/features/team/components/PriorityBadge";

import Avatar from "@/features/dashboard/ui/Avatar";

import StatsCard from "@/features/dashboard/ui/StatsCard";

import { Select } from "@/features/dashboard/ui/Input";


export default function MyTasksPage() {
  return (
    <Suspense fallback={null}>
      <MyTasksPageInner />
    </Suspense>
  );
}

function MyTasksPageInner() {
  const theme = usePageTheme();

  const { showToast } = useToast();

  const searchParams = useSearchParams();

  const assigneeParam = searchParams.get("assignee");

  const {
    user: currentUser,
    profile,
  } = useAuth();


  const {
    tasks,
    projects,
    users,
    userMap,
    loading,
  } = useTeamData();


  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const [projectFilter, setProjectFilter] =
    useState("all");

  const [viewMode, setViewMode] =
    useState("kanban");


  const myTasks = useMemo(() => {
    const targetId = assigneeParam || currentUser?.uid;

    if (!targetId) return [];

    return tasks.filter(
      (task) =>
        getAssigneeId(task) ===
        targetId,
    );
  }, [
    tasks,
    currentUser,
    assigneeParam,
  ]);


  const taskStats = useMemo(() => {
    return myTasks.reduce(
      (result, task) => {
        const status = task.status;

        if (
          status === "done"
        ) {
          result.completed++;
        }

        if (
          status === "in-progress"
        ) {
          result.active++;
        }

        if (
          status === "review" ||
          status === "revision"
        ) {
          result.review++;
        }

        if (
          status !== "done" &&
          isDeadlineOverdue(
            task.deadline,
          )
        ) {
          result.overdue++;
        }

        return result;
      },
      {
        completed: 0,
        active: 0,
        review: 0,
        overdue: 0,
      },
    );
  }, [
    myTasks,
  ]);


  const completionRate = useMemo(() => {
    if (!myTasks.length) return 0;

    return Math.round(
      (taskStats.completed /
        myTasks.length) *
        100,
    );
  }, [
    taskStats.completed,
    myTasks.length,
  ]);


  const stats = useMemo(
    () => [
      {
        label: "مهماتي",
        value: myTasks.length,
        description:
          "إجمالي المهام المسندة إليك.",
        icon: ClipboardList,
        footer:
          "TOTAL TASKS",
      },

      {
        label: "قيد التنفيذ",
        value: taskStats.active,
        description:
          "المهام التي تعمل عليها الآن.",
        icon: Loader2,
        footer:
          "ACTIVE",
      },

      {
        label: "المراجعة",
        value: taskStats.review,
        description:
          "المهام المنتظرة للمراجعة.",
        icon: Search,
        footer:
          "REVIEW",
      },

      {
        label: "الإنجاز",
        value: `${completionRate}%`,
        description:
          "نسبة اكتمال مهامك.",
        icon: CheckCircle2,
        footer:
          "COMPLETION",
      },

      {
        label: "متأخرة",
        value: taskStats.overdue,
        description:
          "مهام تجاوزت الموعد المحدد.",
        icon: Timer,
        footer:
          "OVERDUE",
      },
    ],
    [
      myTasks.length,
      taskStats,
      completionRate,
    ],
  );


  const filteredTasks = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return myTasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title
          ?.toLowerCase()
          .includes(query) ||
        task.description
          ?.toLowerCase()
          .includes(query);


      const matchesProject =
        projectFilter === "all" ||
        task.projectId === projectFilter;


      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;


      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;


      return (
        matchesSearch &&
        matchesProject &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    myTasks,
    search,
    projectFilter,
    statusFilter,
    priorityFilter,
  ]);


  const tasksByStatus = useMemo(() => {
    const result = {};

    WORKFLOW_STATUSES.forEach(
      (status) => {
        result[status.value] =
          filteredTasks.filter(
            (task) =>
              task.status ===
              status.value,
          );
      },
    );

    return result;
  }, [
    filteredTasks,
  ]);


  function getProjectTitle(projectId) {
    return (
      projects.find(
        (project) =>
          project.id === projectId,
      )?.title ||
      "بدون مشروع"
    );
  }


  const currentAuthorName =
    userMap.get(currentUser?.uid)?.name ||
    profile?.name ||
    currentUser?.displayName ||
    "مستخدم";


  function addActivity(
    task,
    type,
    text,
  ) {
    const activity =
      Array.isArray(task.activity)
        ? task.activity
        : [];


    return [
      ...activity,
      {
        id: uid(),
        type,
        text,
        authorId:
          currentUser?.uid ||
          "",
        authorName:
          currentAuthorName,
        createdAt:
          new Date().toISOString(),
      },
    ];
  }
  async function handleMove(task, direction) {
    const role = profile?.role;

    if (
      direction === "backward" &&
      !canManageTeam(role) &&
      task.status !== "revision"
    ) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message:
          "لا يمكنك التراجع في مراحل المهمة.",
      });

      return;
    }


    const currentIndex =
      WORKFLOW_STATUSES.findIndex(
        (status) =>
          status.value === task.status,
      );

    if (currentIndex === -1) return;

    const delta =
      direction === "forward"
        ? 1
        : -1;


    const nextIndex = Math.min(
      Math.max(
        currentIndex + delta,
        0,
      ),
      WORKFLOW_STATUSES.length - 1,
    );


    if (
      currentIndex === nextIndex
    ) {
      return;
    }


    if (
      direction === "forward" &&
      !canManageTeam(role) &&
      !canMemberAdvance(task.status)
    ) {
      showToast({
        type: "warning",
        title: "لا يمكن التقدم",
        message:
          "تم إرسال المهمة للمراجعة وينتظر القرار.",
      });

      return;
    }


    const from =
      WORKFLOW_STATUSES[currentIndex];

    const to =
      WORKFLOW_STATUSES[nextIndex];


    try {
      await updateDocument(
        "tasks",
        task.id,
        {
          status: to.value,

          activity: addActivity(
            task,
            "status",
            `تم نقل المهمة من "${from.labelAr}" إلى "${to.labelAr}"`,
          ),
        },
      );

    } catch (error) {
      console.error(
        error,
      );

      showToast({
        type: "error",
        title: "حدث خطأ",
        message:
          "تعذر تحديث حالة المهمة.",
      });
    }
  }


  const handleMoveForward = (
    task,
  ) =>
    handleMove(
      task,
      "forward",
    );


  const handleMoveBackward = (
    task,
  ) =>
    handleMove(
      task,
      "backward",
    );


  return (
    <ProtectedRoute permission="my-tasks">
      <div
        dir="rtl"
        className="space-y-8"
      >

        <TeamHero
          icon={ClipboardList}
          title={assigneeParam ? "مهام العضو" : "مهماتي"}
          subtitle={
            assigneeParam
              ? "مراجعة مهام هذا العضو ومتابعة تقدمها."
              : "تابع تقدم مهامك، حدّث الحالات، ونظّم سير العمل."
          }
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <button
              onClick={() =>
                setViewMode(
                  viewMode === "kanban"
                    ? "list"
                    : "kanban",
                )
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-red-100
                bg-white
                px-4
                py-2.5
                text-xs
                font-black
                text-red-700
                shadow-md
                transition
                hover:bg-red-50
                dark:border-white/25
                dark:bg-black
                dark:text-white
                dark:hover:bg-white/10
              "
            >
              {viewMode === "kanban"
                ? "عرض القائمة"
                : "عرض كانبان"}
            </button>
          </div>
        </TeamHero>


        {loading ? (
          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-5
            "
          >
            {[1,2,3,4,5].map(
              (item)=>(
                <div
                  key={item}
                  className="
                    h-36
                    animate-pulse
                    rounded-[28px]
                    bg-black/[0.04]
                    dark:bg-white/[0.05]
                  "
                />
              ),
            )}
          </div>
        ) : (
          <motion.div
            initial={{
              opacity:0,
              y:20,
            }}
            animate={{
              opacity:1,
              y:0,
            }}
            className="
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-5
            "
          >
            {stats.map(
              (stat,index)=>(
                <StatsCard
                  key={
                    `${stat.label}-${index}`
                  }
                  {...stat}
                />
              ),
            )}
          </motion.div>
        )}



        <div
          className="
            rounded-[28px]
            border
            border-black/[0.06]
            bg-white/70
            p-4
            backdrop-blur-2xl
            dark:border-white/[0.08]
            dark:bg-white/[0.04]
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              lg:flex-row
            "
          >

            <div
              className="
                relative
                flex-1
              "
            >
              <Search
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-ink/60
                "
              />


              <input
                value={search}
                onChange={(event)=>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="ابحث عن مهمة..."
                className={`
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-black/[0.08]
                  bg-white/70
                  pr-11
                  pl-4
                  text-sm
                  font-medium
                  text-ink
                  outline-none
                  transition
                  dark:border-white/[0.1]
                  dark:bg-white/[0.05]
                  ${theme.focus}
                `}
              />
            </div>


            <Select
              value={projectFilter}
              onChange={(event) =>
                setProjectFilter(event.target.value)
              }
              placeholder="كل المشاريع"
              options={[
                { value: "all", label: "كل المشاريع" },
                ...projects.map((project) => ({
                  value: project.id,
                  label: project.title,
                })),
              ]}
              className="lg:w-48"
            />

            <Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              placeholder="كل الحالات"
              options={[
                { value: "all", label: "كل الحالات" },
                ...WORKFLOW_STATUSES.map((status) => ({
                  value: status.value,
                  label: status.labelAr,
                })),
              ]}
              className="lg:w-44"
            />

            <Select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
              placeholder="كل الأولويات"
              options={[
                { value: "all", label: "كل الأولويات" },
                { value: "low", label: "منخفضة" },
                { value: "medium", label: "متوسطة" },
                { value: "high", label: "عالية" },
                { value: "urgent", label: "عاجلة" },
              ]}
              className="lg:w-44"
            />

          </div>

        </div>
                {viewMode === "kanban" ? (
          <div
            className="
              flex
              gap-5
              overflow-x-auto
              pb-5
            "
          >
            {WORKFLOW_STATUSES.map(
              (status) => {
                const columnTasks =
                  tasksByStatus[
                    status.value
                  ] || [];


                return (
                  <motion.div
                    key={status.value}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      flex
                      w-[300px]
                      shrink-0
                      flex-col
                      rounded-[28px]
                      border
                      border-black/[0.06]
                      bg-black/[0.02]
                      p-3
                      dark:border-white/[0.08]
                      dark:bg-white/[0.03]
                    "
                  >

                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-between
                        px-2
                        py-2
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <span
                          className="
                            h-2.5
                            w-2.5
                            rounded-full
                          "
                          style={{
                            backgroundColor:
                              status.color,
                          }}
                        />


                        <span
                          className="
                            text-sm
                            font-black
                            text-ink
                          "
                        >
                          {status.labelAr}
                        </span>

                      </div>


                      <span
                        className="
                          rounded-full
                          bg-white
                          px-2.5
                          py-1
                          text-[11px]
                          font-black
                          text-ink/60
                          shadow-sm
                          dark:bg-white/10
                        "
                      >
                        {columnTasks.length}
                      </span>

                    </div>



                    <div
                      className="
                        max-h-[650px]
                        space-y-3
                        overflow-y-auto
                        px-1
                        pb-2
                      "
                    >

                      {columnTasks.length === 0 ? (

                        <div
                          className="
                            flex
                            h-40
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-dashed
                            border-black/[0.08]
                            text-xs
                            font-bold
                            text-ink/60
                            dark:border-white/[0.1]
                          "
                        >
                          لا توجد مهام
                        </div>

                      ) : (

                        columnTasks.map(
                          (task)=>(
                            <MyTaskCard
                              key={task.id}
                              task={task}
                              projects={projects}
                              userMap={userMap}
                              canManage={
                                canManageTeam(
                                  profile?.role,
                                )
                              }
                              onMoveForward={
                                handleMoveForward
                              }
                              onMoveBackward={
                                handleMoveBackward
                              }
                            />
                          ),
                        )

                      )}

                    </div>

                  </motion.div>
                );
              },
            )}

          </div>

        ) : (

          <TaskListView
            tasks={filteredTasks}
            projects={projects}
            theme={theme}
          />

        )}

      </div>
    </ProtectedRoute>
  );
}





function MyTaskCard({
  task,
  projects,
  userMap,
  canManage,
  onMoveForward,
  onMoveBackward,
}) {


  const project =
    projects.find(
      (item)=>
        item.id === task.projectId,
    );


  const overdue =
    task.status !== "done" &&
    isDeadlineOverdue(
      task.deadline,
    );


  const assignee =
    userMap.get(
      getAssigneeId(task),
    );



  const completedChecklist =
    task.checklist?.filter(
      (item)=>item.done,
    ).length || 0;


  const taskHref =
    task.id
      ? `/dashboard/team/tasks/${task.id}`
      : null;


  return (

    <motion.div

      initial={{
        opacity:0,
        scale:.96,
      }}

      animate={{
        opacity:1,
        scale:1,
      }}

      className="
        group
        relative
        overflow-visible
        rounded-[22px]
        border
        border-black/[0.06]
        bg-card
        p-4
        shadow-sm
        transition
        hover:border-primary/30
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
        dark:border-white/[0.08]
        dark:hover:border-primary/40
        dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]
      "
    >


      <Link
        href={taskHref || "#"}
        aria-disabled={!taskHref}
        className={`
          block
          ${taskHref ? "cursor-pointer" : "cursor-default"}
        `}
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >

          <div
            className="
              min-w-0
            "
          >

            <h4
              className="
                line-clamp-2
                text-sm
                font-black
                leading-6
                text-ink
                transition-colors
                group-hover:text-primary
              "
            >
              {task.title ||
                "بدون عنوان"}
            </h4>


            <p
              className="
                mt-1
                truncate
                text-[11px]
                font-bold
                text-ink/60
              "
            >
              {project?.title ||
                "بدون مشروع"}
            </p>

          </div>


          <PriorityBadge
            priority={
              task.priority
            }
          />

        </div>



        <div
          className="
            mt-4
            flex
            items-center
            justify-between
          "
        >

          <Avatar
            user={assignee}
            size={28}
          />

          <span
            className="
              inline-flex
              items-center
              gap-1
              text-[11px]
              font-black
              text-primary/70
              transition
              group-hover:text-primary
            "
          >
            التفاصيل
            <ChevronLeft
              className="
                h-3.5
                w-3.5
              "
            />
          </span>

        </div>




        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-2
          "
        >

        {task.deadline && (

          <span
            className={`
              flex
              items-center
              gap-1
              rounded-lg
              px-2
              py-1
              text-[10px]
              font-black
              ${
                overdue
                  ? "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                  : "bg-black/[0.04] text-ink/60 dark:bg-white/[0.06] dark:text-ink/70"
              }
            `}
          >

            <CalendarDays
              className="
                h-3
                w-3
              "
            />

            {formatDeadline(
              task.deadline,
            )}

          </span>

        )}



        {task.checklist?.length > 0 && (

          <span
            className="
              flex
              items-center
              gap-1
              rounded-lg
              bg-black/[0.04]
              px-2
              py-1
              text-[10px]
              font-black
              text-ink/60
              dark:bg-white/[0.06]
            "
          >

            <ListChecks
              className="
                h-3
                w-3
              "
            />

            {completedChecklist}/
            {task.checklist.length}

          </span>
        )}

      </div>

      </Link>

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          border-t
          border-dashed
          border-black/[0.08]
          pt-3
          dark:border-white/[0.1]
        "
      >

        <button
          type="button"
          aria-label={`نقل المهمة "${task.title}" إلى الخلف`}
          onClick={() =>
            onMoveBackward(task)
          }

          disabled={
            (!canManage && task.status !== "revision") ||
            task.status === "backlog"
          }

          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            bg-black/[0.05]
            text-ink/60
            transition
            hover:bg-black/[0.1]
            disabled:opacity-30
            dark:bg-white/[0.06]
            dark:hover:bg-white/[0.12]
          "
        >

          <ChevronRight
            className="
              h-4
              w-4
            "
          />

        </button>



        <button
          type="button"
          aria-label={`نقل المهمة "${task.title}" إلى الأمام`}
          onClick={() =>
            onMoveForward(task)
          }

          disabled={
            task.status === "done" ||
            (!canManage && !canMemberAdvance(task.status))
          }

          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            bg-primary/10
            text-primary
            transition
            hover:bg-primary
            hover:text-white
            disabled:opacity-30
          "
        >

          <ChevronLeft
            className="
              h-4
              w-4
            "
          />

        </button>


      </div>


    </motion.div>

  );
}
function TaskListView({
  tasks,
  projects,
  theme,
}) {
  if (!tasks.length) {
    return (
      <div
        className="
          flex
          min-h-[300px]
          flex-col
          items-center
          justify-center
          gap-3
          rounded-[28px]
          border
          border-dashed
          border-black/[0.08]
          bg-card
          text-center
          dark:border-white/[0.1]
        "
      >
        <ClipboardList
          className="
            h-10
            w-10
            text-ink/20
          "
        />

        <p
          className="
            text-sm
            font-black
            text-ink/60
          "
        >
          لا توجد مهام مطابقة
        </p>

      </div>
    );
  }


  return (
    <div
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-black/[0.06]
        bg-card
        dark:border-white/[0.08]
      "
    >

      <div
        className="
          overflow-x-auto
        "
      >

        <table
          className="
            w-full
            min-w-[900px]
          "
        >

          <thead>

            <tr
              className="
                border-b
                border-black/[0.06]
                bg-black/[0.02]
                dark:border-white/[0.08]
                dark:bg-white/[0.03]
              "
            >

              {[
                "المهمة",
                "المشروع",
                "الحالة",
                "الأولوية",
                "الموعد",
              ].map(
                (item)=>(
                  <th
                    key={item}
                    className="
                      px-6
                      py-4
                      text-right
                      text-[10px]
                      font-black
                      uppercase
                      tracking-wider
                      text-ink/60
                    "
                  >
                    {item}
                  </th>
                ),
              )}

            </tr>

          </thead>



          <tbody>

            {tasks.map(
              (task)=>{

                const project =
                  projects.find(
                    (item)=>
                      item.id ===
                      task.projectId,
                  );


                const overdue =
                  task.status !== "done" &&
                  isDeadlineOverdue(
                    task.deadline,
                  );


                return (

                  <tr
                    key={task.id}
                    className="
                      border-b
                      border-black/[0.04]
                      transition
                      hover:bg-black/[0.02]
                      dark:border-white/[0.06]
                      dark:hover:bg-white/[0.03]
                    "
                  >

                    <td
                      className="
                        px-6
                        py-5
                      "
                    >

                      <Link
                        href={`/dashboard/team/tasks/${task.id}`}
                        className="
                          text-sm
                          font-black
                          text-ink
                          transition
                          hover:text-primary
                        "
                      >
                        {task.title ||
                          "بدون عنوان"}
                      </Link>


                      <p
                        className="
                          mt-1
                          text-[11px]
                          font-bold
                          text-ink/60
                        "
                      >
                        {task.description?.slice(
                          0,
                          60,
                        )}
                      </p>

                    </td>



                    <td
                      className="
                        px-6
                        py-5
                      "
                    >

                      <span
                        className="
                          rounded-lg
                          bg-black/[0.04]
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          text-ink/60
                          dark:bg-white/[0.06]
                          dark:text-ink/70
                        "
                      >
                        {project?.title ||
                          "بدون مشروع"}
                      </span>

                    </td>




                    <td
                      className="
                        px-6
                        py-5
                      "
                    >

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          px-3
                          py-1.5
                          text-[11px]
                          font-black
                        "
                        style={{
                          color:
                            getWorkflowColor(
                              task.status,
                            ),

                          backgroundColor:
                            `${getWorkflowColor(
                              task.status,
                            )}18`,
                        }}
                      >

                        <span
                          className="
                            h-1.5
                            w-1.5
                            rounded-full
                          "
                          style={{
                            backgroundColor:
                              getWorkflowColor(
                                task.status,
                              ),
                          }}
                        />

                        {
                          WORKFLOW_STATUSES.find(
                            (item)=>
                              item.value ===
                              task.status,
                          )
                            ?.labelAr
                        }

                      </span>

                    </td>



                    <td
                      className="
                        px-6
                        py-5
                      "
                    >

                      <PriorityBadge
                        priority={
                          task.priority
                        }
                      />

                    </td>



                    <td
                      className="
                        px-6
                        py-5
                      "
                    >

                      <span
                        className={`
                          text-xs
                          font-black
                          ${
                            overdue
                              ? "text-red-600"
                              : "text-ink/60"
                          }
                        `}
                      >
                        {
                          formatDeadline(
                            task.deadline,
                          )
                        }
                      </span>

                    </td>


                  </tr>

                );
              },
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}



function getWorkflowColor(status) {
  return (
    WORKFLOW_STATUSES.find(
      (item)=>
        item.value === status,
    )?.color ||
    "#999"
  );
}
