"use client";

import { useMemo, useState } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Users,
  Lock,
  CheckCircle2,
  Clock3,
  Layers3,
  Activity,
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

import { useToast } from "@/hooks/useToast";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";

import { ProjectIcon } from "@/constants/projectIcons";

import { WORKFLOW_STATUSES } from "@/constants/workflow";

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
  canMemberAdvance,
  uid,
} from "@/features/team/lib/teamUtils";

import {
  updateDocument,
  removeDocument,
} from "@/lib/firestoreService";

import {
  notifyMany,
  getTaskRecipientUserIds,
} from "@/lib/notificationService";



export default function ProjectDetailPage() {

  const params = useParams();

  const router = useRouter();

  const theme = usePageTheme();

  const { showToast } = useToast();


  const {
    user: currentUser,
    profile,
  } = useAuth();


  const canManage =
    canManageTeam(profile?.role);



  const {
    projects,
    tasks,
    users,
    activeUsers,
    userMap,
    clientMap,
    clients,
    loading,
  } = useTeamData();



  const projectId =
    params?.id;



  const project =
    projects.find(
      (item) =>
        item.id === projectId,
    );



  const projectTasks = useMemo(
    () =>
      tasks
        .filter(
          (task) =>
            task.projectId === projectId,
        )
        .sort(
          (a, b) =>
            (a.createdAt?.toMillis?.() || 0) -
            (b.createdAt?.toMillis?.() || 0),
        ),

    [
      tasks,
      projectId,
    ],
  );



  const projectProgress =
    useMemo(
      () =>
        calcProjectProgress(
          projectTasks,
        ),
      [
        projectTasks,
      ],
    );



  const projectMembers =
    useMemo(
      () =>
        getProjectMemberIds(
          project,
        ),

      [
        project,
      ],
    );



  const workflowStats =
    useMemo(
      () =>
        WORKFLOW_STATUSES.map(
          (status) => ({
            ...status,
            count:
              projectTasks.filter(
                (task) =>
                  task.status ===
                  status.value,
              ).length,
          }),
        ),

      [
        projectTasks,
      ],
    );



  const completedTasks =
    useMemo(
      () =>
        projectTasks.filter(
          (task) =>
            task.status === "done",
        ).length,

      [
        projectTasks,
      ],
    );



  const activeTasks =
    useMemo(
      () =>
        projectTasks.filter(
          (task) =>
            task.status !== "done",
        ).length,

      [
        projectTasks,
      ],
    );



  const [
    taskModalOpen,
    setTaskModalOpen,
  ] = useState(false);



  const [
    editingTask,
    setEditingTask,
  ] = useState(null);



  const [
    defaultStatus,
    setDefaultStatus,
  ] = useState("backlog");



  const [
    projectModalOpen,
    setProjectModalOpen,
  ] = useState(false);



  const [
    busy,
    setBusy,
  ] = useState(false);




  const currentAuthorName =
    userMap.get(
      currentUser?.uid,
    )?.name ||
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
          currentUser?.uid || "",

        authorName:
          currentAuthorName,

        createdAt:
          new Date().toISOString(),
      },
    ];
  }
    async function handleMove(task, direction) {
    if (busy) return;


    const isAssignee =
      getAssigneeId(task) === currentUser?.uid;



    if (!canManage && !isAssignee) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message:
          "ليس لديك صلاحية تعديل حالة هذه المهمة.",
      });

      return;
    }



    if (
      direction === "backward" &&
      !canManage
    ) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message:
          "لا يمكنك التراجع في مراحل المهمة.",
      });

      return;
    }



    const fromMeta =
      getWorkflowMeta(
        task.status,
      );



    const nextStatus =
      direction === "forward"
        ? nextWorkflowStatus(
            task.status,
          )
        : prevWorkflowStatus(
            task.status,
          );



    if (
      nextStatus === task.status
    ) {
      return;
    }



    if (
      direction === "forward" &&
      !canManage &&
      !canMemberAdvance(
        task.status,
      )
    ) {
      showToast({
        type: "warning",
        title: "توقف التقدم",
        message:
          "بعد المراجعة يتولى المسؤول قرار التسليم أو التعديل.",
      });

      return;
    }



    const toMeta =
      getWorkflowMeta(
        nextStatus,
      );



    setBusy(true);


    try {

      await updateDocument(
        "tasks",
        task.id,
        {
          status: nextStatus,

          activity:
            addActivity(
              task,
              "status",
              `تم نقل المهمة من "${fromMeta.labelAr}" إلى "${toMeta.labelAr}"`,
            ),
        },
      );



      notifyMany(
        getTaskRecipientUserIds(
          task,
          users,
          currentUser?.uid || "",
        ),

        {
          title:
            "تم تحديث حالة المهمة",

          message:
            `تم نقل المهمة "${task.title}" من "${fromMeta.labelAr}" إلى "${toMeta.labelAr}".`,

          type:
            "task",

          link:
            `/dashboard/team/tasks/${task.id}`,

          projectId:
            task.projectId,

          projectTitle:
            project?.title || "",

          eventKey:
            "tasks",
        },
      );


    } catch(error) {

      console.error(
        "Move task error:",
        error,
      );


      showToast({
        type: "error",
        title: "حدث خطأ",
        message:
          "تعذر تحديث حالة المهمة.",
      });


    } finally {

      setBusy(false);

    }
  }




  function openCreateTask(
    status = "backlog",
  ) {

    setEditingTask(null);

    setDefaultStatus(status);

    setTaskModalOpen(true);

  }




  function openEditTask(task) {

    setEditingTask(task);

    setTaskModalOpen(true);

  }




  async function handleDeleteTask(task) {

    if (!canManage) {

      showToast({
        type:"warning",
        title:"صلاحيات غير كافية",
        message:
          "لا يمكنك حذف المهام.",
      });

      return;
    }



    const confirmDelete =
      window.confirm(
        `هل تريد حذف "${task.title}"؟`,
      );



    if (!confirmDelete)
      return;



    try {

      await removeDocument(
        "tasks",
        task.id,
      );


    } catch(error) {

      console.error(error);


      showToast({
        type:"error",
        title:"حدث خطأ",
        message:
          "تعذر حذف المهمة.",
      });

    }

  }




  async function handleDeleteProject() {

    if (!canManage) {

      showToast({
        type:"warning",
        title:"صلاحيات غير كافية",
        message:
          "لا يمكنك حذف المشروع.",
      });

      return;

    }



    const confirmDelete =
      window.confirm(
        `هل تريد حذف المشروع "${project.title}" وجميع المهام؟`,
      );



    if (!confirmDelete)
      return;



    setBusy(true);



    try {


      await Promise.all([

        removeDocument(
          "teamProjects",
          project.id,
        ),


        ...projectTasks.map(
          (task)=>
            removeDocument(
              "tasks",
              task.id,
            ),
        ),

      ]);



      router.push(
        "/dashboard/team",
      );


    } catch(error) {


      console.error(error);


      showToast({
        type:"error",
        title:"حدث خطأ",
        message:
          "تعذر حذف المشروع.",
      });


      setBusy(false);

    }

  }




  const isProjectMember =
    canManage ||
    (
      profile?.uid &&
      projectMembers.includes(
        profile.uid,
      )
    );




  if (loading) {

    return (

      <ProtectedRoute permission="projects">

        <div
          dir="rtl"
          className="space-y-6"
        >

          <div
            className="
              h-72
              animate-pulse
              rounded-[32px]
              bg-black/[0.04]
            "
          />

        </div>

      </ProtectedRoute>

    );

  }




  return (

    <ProtectedRoute permission="projects">

      <div
        dir="rtl"
        className="
          space-y-6
        "
      >


        <Link
          href="/dashboard/team"
          className="
            inline-flex
            items-center
            gap-2
            text-xs
            font-black
            text-ink/40
            transition
            hover:text-primary
          "
        >

          <ArrowRight
            className="h-4 w-4"
          />

          العودة للمشاريع

        </Link>



        {!isProjectMember ? (

          <div
            className="
              flex
              min-h-[320px]
              flex-col
              items-center
              justify-center
              rounded-[32px]
              border
              border-dashed
              border-red-200
              bg-red-50/40
            "
          >

            <Lock
              className="
                h-10
                w-10
                text-red-400
              "
            />


            <h2
              className="
                mt-4
                text-xl
                font-black
              "
            >
              لا يمكنك الوصول للمشروع
            </h2>


          </div>


        ) : !project ? (

          <div
            className="
              rounded-[32px]
              bg-card
              p-10
              text-center
            "
          >

            المشروع غير موجود

          </div>


        ) : (

          <>

            <section
              className="
                relative
                overflow-hidden
                rounded-[36px]
                border
                border-black/[0.06]
                bg-card
                p-6
                shadow-[0_20px_60px_rgba(0,0,0,.06)]
                sm:p-8
              "
            >

              <div
                className="
                  absolute
                  -left-24
                  -top-24
                  h-72
                  w-72
                  rounded-full
                  bg-primary/10
                  blur-3xl
                "
              />


              <div
                className="
                  relative
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-6
                    lg:flex-row
                    lg:justify-between
                  "
                >

                  <div
                    className="
                      flex
                      gap-4
                    "
                  >

                    <div
                      className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-3xl
                        bg-gradient-to-br
                        from-primary
                        to-primary/70
                        text-white
                      "
                    >

                      <ProjectIcon
                        name={project.icon}
                        className="h-8 w-8"
                      />

                    </div>


                    <div>

                      <div className="flex gap-2">

                        <WorkflowBadge
                          status={project.status}
                        />

                        <PriorityBadge
                          priority={project.priority}
                        />

                      </div>


                      <h1
                        className="
                          mt-3
                          text-3xl
                          font-black
                        "
                      >
                        {project.title}
                      </h1>


                      <p
                        className="
                          mt-2
                          max-w-xl
                          text-sm
                          font-medium
                          text-ink/45
                        "
                      >
                        {project.description}
                      </p>


                    </div>

                  </div>
                                    <div
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-2
                    "
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setProjectModalOpen(true)
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-black/[0.08]
                        bg-card
                        px-4
                        py-3
                        text-xs
                        font-black
                        text-ink/70
                        transition
                        hover:border-black/20
                        hover:text-ink
                      "
                    >

                      <Pencil
                        className="h-4 w-4"
                      />

                      تعديل

                    </button>


                    <button
                      type="button"
                      onClick={handleDeleteProject}
                      disabled={busy}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-2xl
                        bg-red-500
                        px-4
                        py-3
                        text-xs
                        font-black
                        text-white
                        transition
                        hover:bg-red-600
                        disabled:opacity-50
                      "
                    >

                      <Trash2
                        className="h-4 w-4"
                      />

                      حذف

                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        openCreateTask("backlog")
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-2xl
                        bg-primary
                        px-5
                        py-3
                        text-xs
                        font-black
                        text-white
                        shadow-lg
                        shadow-primary/20
                        transition
                        hover:-translate-y-0.5
                      "
                    >

                      <Plus
                        className="h-4 w-4"
                      />

                      مهمة جديدة

                    </button>

                  </div>

                </div>




                <div
                  className="
                    mt-8
                    grid
                    gap-5
                    lg:grid-cols-[1fr_320px]
                  "
                >


                  <div
                    className="
                      rounded-[28px]
                      border
                      border-black/[0.06]
                      bg-black/[0.015]
                      p-5
                    "
                  >

                    <div
                      className="
                        mb-4
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div>

                        <p
                          className="
                            text-xs
                            font-black
                            text-ink/40
                          "
                        >
                          تقدم المشروع
                        </p>


                        <p
                          className="
                            mt-1
                            text-3xl
                            font-black
                          "
                        >
                          {projectProgress}%

                        </p>

                      </div>



                      <Activity
                        className="
                          h-8
                          w-8
                          text-primary/50
                        "
                      />

                    </div>



                    <ProgressBar
                      value={projectProgress}
                    />



                    <div
                      className="
                        mt-6
                        grid
                        grid-cols-3
                        gap-3
                      "
                    >

                      <ProjectMetric
                        icon={ClipboardList}
                        label="المهام"
                        value={
                          projectTasks.length
                        }
                      />


                      <ProjectMetric
                        icon={CheckCircle2}
                        label="مكتملة"
                        value={
                          completedTasks
                        }
                      />


                      <ProjectMetric
                        icon={Clock3}
                        label="نشطة"
                        value={
                          activeTasks
                        }
                      />

                    </div>


                  </div>





                  <div
                    className="
                      rounded-[28px]
                      border
                      border-black/[0.06]
                      bg-card
                      p-5
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <Users
                        className="
                          h-4
                          w-4
                          text-ink/40
                        "
                      />


                      <p
                        className="
                          text-sm
                          font-black
                        "
                      >
                        فريق العمل
                      </p>

                    </div>



                    <div
                      className="
                        mt-5
                        space-y-3
                      "
                    >

                      {projectMembers.length === 0 ? (

                        <p
                          className="
                            text-xs
                            font-bold
                            text-ink/35
                          "
                        >
                          لا يوجد أعضاء
                        </p>

                      ) : (

                        projectMembers.map(
                          (memberId)=>(

                            <div
                              key={memberId}
                              className="
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                bg-black/[0.03]
                                p-2.5
                              "
                            >

                              <Avatar
                                user={
                                  userMap.get(
                                    memberId,
                                  )
                                }
                                size={34}
                              />


                              <div>

                                <p
                                  className="
                                    text-xs
                                    font-black
                                  "
                                >
                                  {
                                    getUserName(
                                      userMap,
                                      memberId,
                                    )
                                  }
                                </p>


                                <p
                                  className="
                                    text-[10px]
                                    font-bold
                                    text-ink/35
                                  "
                                >
                                  عضو في المشروع
                                </p>


                              </div>


                            </div>

                          ),
                        )

                      )}

                    </div>


                  </div>


                </div>

              </div>

            </section>




            <div
              className="
                grid
                gap-6
                xl:grid-cols-[1fr_340px]
              "
            >

              <div
                className="
                  min-w-0
                "
              ></div>
                              <TaskBoard
                  tasks={projectTasks}
                  userMap={userMap}

                  onMoveForward={(task) =>
                    handleMove(
                      task,
                      "forward",
                    )
                  }

                  onMoveBackward={(task) =>
                    handleMove(
                      task,
                      "backward",
                    )
                  }

                  onEdit={openEditTask}

                  onDelete={handleDeleteTask}

                  onAddTask={(status) =>
                    openCreateTask(status)
                  }
                />

              </div>




              <aside
                className="
                  space-y-5
                "
              >

                <div
                  className="
                    rounded-[28px]
                    border
                    border-black/[0.06]
                    bg-card
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <Layers3
                      className="
                        h-4
                        w-4
                        text-primary
                      "
                    />


                    <h3
                      className="
                        text-sm
                        font-black
                      "
                    >
                      معلومات المشروع
                    </h3>

                  </div>



                  <div
                    className="
                      mt-5
                      space-y-4
                    "
                  >

                    <ProjectInfoRow
                      label="العميل"
                      value={
                        getClientName(
                          clientMap,
                          project.clientId,
                        )
                      }
                    />


                    <ProjectInfoRow
                      label="موعد التسليم"
                      value={
                        formatDeadline(
                          project.deadline,
                        )
                      }
                    />


                    <ProjectInfoRow
                      label="عدد المهام"
                      value={
                        `${projectTasks.length} مهمة`
                      }
                    />


                    <ProjectInfoRow
                      label="الحالة"
                      value={
                        <WorkflowBadge
                          status={
                            project.status
                          }
                        />
                      }
                    />


                  </div>


                </div>





                <div
                  className="
                    rounded-[28px]
                    border
                    border-black/[0.06]
                    bg-card
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <ClipboardList
                      className="
                        h-4
                        w-4
                        text-primary
                      "
                    />


                    <h3
                      className="
                        text-sm
                        font-black
                      "
                    >
                      توزيع العمل
                    </h3>


                  </div>




                  <div
                    className="
                      mt-5
                      space-y-3
                    "
                  >

                    {
                      workflowStats.map(
                        (status)=>(
                          <div
                            key={
                              status.value
                            }
                            className="
                              flex
                              items-center
                              justify-between
                              rounded-xl
                              bg-black/[0.03]
                              px-3
                              py-2.5
                            "
                          >

                            <span
                              className="
                                text-xs
                                font-bold
                                text-ink/60
                              "
                            >
                              {
                                status.labelAr
                              }
                            </span>


                            <span
                              className="
                                flex
                                h-6
                                min-w-6
                                items-center
                                justify-center
                                rounded-lg
                                bg-card
                                px-2
                                text-[11px]
                                font-black
                              "
                            >
                              {
                                status.count
                              }
                            </span>


                          </div>
                        ),
                      )
                    }

                  </div>


                </div>


              </aside>


            </div>


          </>

        )}

      </div>




      <TaskModal
        open={
          taskModalOpen
        }

        onClose={() =>
          setTaskModalOpen(false)
        }

        editing={
          editingTask
        }

        projects={
          projects
        }

        users={
          activeUsers
        }

        defaultProjectId={
          projectId
        }

        defaultStatus={
          defaultStatus
        }

        currentUser={
          currentUser
        }

        onSaved={() => {}}
      />




      <ProjectModal
        open={
          projectModalOpen
        }

        onClose={() =>
          setProjectModalOpen(false)
        }

        editing={
          project
        }

        users={
          activeUsers
        }

        clients={
          clients
        }
      />


    </ProtectedRoute>

  );

}





function ProjectInfoRow({
  label,
  value,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        gap-3
      "
    >

      <span
        className="
          text-xs
          font-bold
          text-ink/35
        "
      >
        {label}
      </span>


      <span
        className="
          text-xs
          font-black
          text-ink
        "
      >
        {value}
      </span>


    </div>

  );

}
function ProjectMetric({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div
      className="
        rounded-2xl
        bg-card
        p-4
        border
        border-black/[0.05]
      "
    >

      <Icon
        className="
          h-4
          w-4
          text-primary
        "
      />


      <p
        className="
          mt-3
          text-xl
          font-black
        "
      >
        {value}
      </p>


      <p
        className="
          text-[11px]
          font-bold
          text-ink/40
        "
      >
        {label}
      </p>

    </div>

  );

}