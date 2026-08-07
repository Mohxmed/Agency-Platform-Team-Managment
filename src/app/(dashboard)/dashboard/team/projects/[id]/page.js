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
  Lock,
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

import { ProjectIcon } from "@/constants/projectIcons";
import { WORKFLOW_STATUSES } from "@/constants/workflow";

import {
  formatDeadline,
  getUserName,
  getClientName,
  getAssigneeId,
  calcProjectProgress,
  deriveProjectStatus,
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

  const { showToast } = useToast();


  const {
    user: currentUser,
    profile,
  } = useAuth();



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



  const projectId = params?.id;



  const project = useMemo(
    () =>
      projects.find(
        (item) => item.id === projectId,
      ),
    [projects, projectId],
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



  const workflowStats = useMemo(
    () =>
      WORKFLOW_STATUSES.map(
        (status) => ({
          ...status,
          count:
            projectTasks.filter(
              (task) =>
                task.status === status.value,
            ).length,
        }),
      ),

    [
      projectTasks,
    ],
  );



  const projectProgress = useMemo(
    () =>
      calcProjectProgress(
        projectTasks,
      ),

    [
      projectTasks,
    ],
  );



  const projectStatus = useMemo(
    () =>
      deriveProjectStatus(
        projectTasks,

        project?.status,
      ),

    [
      projectTasks,

      project?.status,
    ],
  );



  const projectMembers = useMemo(
    () =>
      getProjectMemberIds(
        project,
      ),

    [
      project,
    ],
  );



  const [taskModalOpen, setTaskModalOpen] =
    useState(false);



  const [editingTask, setEditingTask] =
    useState(null);



  const [defaultStatus, setDefaultStatus] =
    useState("backlog");



  const [projectModalOpen, setProjectModalOpen] =
    useState(false);



  const [busy, setBusy] =
    useState(false);



  const canManage =
    canManageTeam(
      profile?.role,
    );



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





  async function handleMove(
    task,
    direction,
  ) {


    if (busy)
      return;



    const isAssignee =
      getAssigneeId(task) ===
      currentUser?.uid;



    if (!canManage && !isAssignee) {

      showToast({
        type: "warning",

        title:
          "صلاحيات غير كافية",

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

        title:
          "صلاحيات غير كافية",

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
    )
      return;




    if (
      direction === "forward" &&
      !canManage &&
      !canMemberAdvance(
        task.status,
      )
    ) {

      showToast({
        type: "warning",

        title:
          "انتهت مراحل العضو",

        message:
          "بعد الإرسال للمراجعة يتولى المسؤول القرار.",
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
          status:
            nextStatus,


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
        error,
      );


      showToast({

        type:
          "error",

        title:
          "حدث خطأ",

        message:
          "حصل خطأ أثناء تحديث المهمة.",
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
        type: "warning",
        title: "صلاحيات غير كافية",
        message: "ليس لديك صلاحية حذف المهام.",
      });

      return;
    }


    const confirmed = window.confirm(
      `هل أنت متأكد من حذف مهمة "${task.title}"؟`,
    );


    if (!confirmed)
      return;



    try {

      await removeDocument(
        "tasks",
        task.id,
      );


      showToast({
        type: "success",
        title: "تم الحذف",
        message: "تم حذف المهمة بنجاح.",
      });


    } catch(error) {

      console.error(
        "Failed to delete task:",
        error,
      );


      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء حذف المهمة.",
      });

    }
  }




  async function handleDeleteProject() {

    if (!canManage) {

      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message: "ليس لديك صلاحية حذف المشروع.",
      });


      return;
    }




    if (!project)
      return;



    const confirmed =
      window.confirm(
        `هل أنت متأكد من حذف مشروع "${project.title}" وجميع المهام؟`,
      );



    if (!confirmed)
      return;



    setBusy(true);



    try {


      await Promise.all([

        removeDocument(
          "teamProjects",
          project.id,
        ),


        ...projectTasks.map(
          (task) =>
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


      console.error(
        "Failed to delete project:",
        error,
      );



      showToast({

        type:
          "error",

        title:
          "حدث خطأ",

        message:
          "حصل خطأ أثناء حذف المشروع.",
      });



    } finally {

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
              h-44
              animate-pulse
              rounded-[28px]
              border
              border-ink/10
              bg-card
            "
          />


          <div
            className="
              h-96
              animate-pulse
              rounded-[28px]
              border
              border-ink/10
              bg-card
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
        className="space-y-6"
      >
        <Link
          href="/dashboard/team"
          className="
            inline-flex
            items-center
            gap-2
            text-xs
            font-bold
            text-ink/60
            transition
            hover:text-primary
          "
        >

          <ArrowRight
            className="h-4 w-4"
          />

          العودة إلى المشاريع

        </Link>

        {!isProjectMember ? (

          <div
            className="
              flex
              min-h-[320px]
              flex-col
              items-center
              justify-center
              rounded-[28px]
              border
              border-dashed
              border-ink/10
              bg-card
              text-center
              px-6
            "
          >

            <Lock
              className="
                h-9
                w-9
                text-ink/20
              "
            />


            <h2
              className="
                mt-4
                text-lg
                font-black
                text-ink
              "
            >
              لا يمكنك الوصول لهذا المشروع
            </h2>


            <p
              className="
                mt-2
                max-w-md
                text-sm
                text-ink/60
              "
            >
              هذا المشروع غير متاح ضمن صلاحيات حسابك.
            </p>


          </div>


        ) : !project ? (


          <div
            className="
              flex
              min-h-[320px]
              flex-col
              items-center
              justify-center
              rounded-[28px]
              border
              border-dashed
              border-ink/10
              bg-card
              text-center
            "
          >

            <ClipboardList
              className="
                h-9
                w-9
                text-ink/20
              "
            />


            <h2
              className="
                mt-4
                text-lg
                font-black
                text-ink
              "
            >
              المشروع غير موجود
            </h2>



            <Link
              href="/dashboard/team"
              className="
                mt-5
                rounded-xl
                bg-primary
                px-4
                py-2
                text-sm
                font-bold
                text-white
              "
            >
              العودة للمشاريع
            </Link>


          </div>


        ) : (
          <>
            <section
              className="
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-ink/[0.06]
                bg-card
                p-6
                shadow-[0_20px_60px_rgba(0,0,0,0.05)]
                sm:p-8
              "
            >

              {/* Ambient Glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-32
                  -top-32
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
                  space-y-8
                "
              >


                {/* Header */}
                <div
                  className="
                    flex
                    flex-col
                    gap-6
                    lg:flex-row
                    lg:items-start
                    lg:justify-between
                  "
                >


                  <div
                    className="
                      flex
                      items-start
                      gap-4
                    "
                  >


                    <div
                      className="
                        flex
                        h-16
                        w-16
                        shrink-0
                        items-center
                        justify-center
                        rounded-[22px]
                        bg-gradient-to-br
                        from-primary
                        to-primary/70
                        text-white
                        shadow-lg
                      "
                    >

                      <ProjectIcon
                        name={project.icon}
                        className="h-8 w-8"
                      />

                    </div>




                    <div
                      className="
                        min-w-0
                      "
                    >

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >

                        <WorkflowBadge
                          status={projectStatus}
                        />


                        <PriorityBadge
                          priority={project.priority}
                        />


                      </div>




                      <h1
                        className="
                          mt-3
                          text-2xl
                          font-black
                          tracking-tight
                          text-ink
                          sm:text-3xl
                        "
                      >
                        {project.title || "بدون عنوان"}
                      </h1>




                      {project.description && (

                        <p
                          className="
                            mt-3
                            max-w-2xl
                            text-sm
                            leading-7
                            text-ink/60
                          "
                        >
                          {project.description}
                        </p>

                      )}



                      <div
                        className="
                          mt-5
                          flex
                          flex-wrap
                          gap-x-5
                          gap-y-3
                          text-xs
                          font-bold
                          text-ink/60
                        "
                      >


                        <span
                          className="
                            inline-flex
                            items-center
                            gap-2
                          "
                        >

                          <Building2
                            className="
                              h-4
                              w-4
                              text-ink/60
                            "
                          />

                          {getClientName(
                            clientMap,
                            project.clientId,
                          )}

                        </span>




                        <span
                          className="
                            inline-flex
                            items-center
                            gap-2
                          "
                        >

                          <CalendarDays
                            className="
                              h-4
                              w-4
                              text-ink/60
                            "
                          />

                          {formatDeadline(
                            project.deadline,
                          )}

                        </span>




                        <span
                          className="
                            inline-flex
                            items-center
                            gap-2
                          "
                        >

                          <ClipboardList
                            className="
                              h-4
                              w-4
                              text-ink/60
                            "
                          />

                          {projectTasks.length} مهمة

                        </span>


                      </div>


                    </div>


                  </div>





                  {/* Actions */}
                  <div
                    className="
                      flex
                      flex-wrap
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
                        rounded-xl
                        border
                        border-ink/10
                        bg-card
                        px-4
                        py-2.5
                        text-xs
                        font-black
                        text-ink/70
                        transition
                        hover:border-ink/20
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
                        rounded-xl
                        bg-red-500
                        px-4
                        py-2.5
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
                        openCreateTask(
                          "backlog",
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-primary
                        px-4
                        py-2.5
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
                {/* Project Overview */}
                <div
                  className="
                    grid
                    gap-5
                    lg:grid-cols-3
                  "
                >


                  {/* Progress */}
                  <div
                    className="
                      rounded-[24px]
                      border
                      border-ink/[0.06]
                      bg-ink/[0.015]
                      p-5
                      lg:col-span-2
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >

                      <div>

                        <p
                          className="
                            text-sm
                            font-black
                            text-ink
                          "
                        >
                          تقدم المشروع
                        </p>


                        <p
                          className="
                            mt-1
                            text-xs
                            font-semibold
                            text-ink/60
                          "
                        >
                          نسبة الإنجاز الحالية
                        </p>

                      </div>



                      <span
                        className="
                          rounded-xl
                          bg-primary/10
                          px-3
                          py-1.5
                          text-sm
                          font-black
                          text-primary
                        "
                      >
                        {projectProgress}%
                      </span>


                    </div>




                    <div className="mt-5">

                      <ProgressBar
                        value={projectProgress}
                      />

                    </div>


                  </div>






                  {/* Workflow */}
                  <div
                    className="
                      rounded-[24px]
                      border
                      border-ink/[0.06]
                      bg-ink/[0.015]
                      p-5
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-black
                        text-ink
                      "
                    >
                      حالة المهام
                    </p>



                    <div
                      className="
                        mt-4
                        space-y-2.5
                      "
                    >

                      {workflowStats.map(
                        (status) => (

                          <div
                            key={status.value}
                            className="
                              flex
                              items-center
                              justify-between
                              rounded-xl
                              bg-card
                              px-3
                              py-2.5
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
                                  h-2
                                  w-2
                                  rounded-full
                                "
                                style={{
                                  backgroundColor:
                                    status.color,
                                }}
                              />

                              <span
                                className="
                                  text-xs
                                  font-bold
                                  text-ink/60
                                "
                              >
                                {status.labelAr}
                              </span>

                            </div>



                            <span
                              className="
                                text-xs
                                font-black
                                text-ink
                              "
                            >
                              {status.count}
                            </span>


                          </div>

                        ),
                      )}

                    </div>


                  </div>


                </div>






                {/* Team Members */}
                <div
                  className="
                    rounded-[24px]
                    border
                    border-ink/[0.06]
                    bg-ink/[0.015]
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
                        text-ink/60
                      "
                    />


                    <p
                      className="
                        text-sm
                        font-black
                        text-ink
                      "
                    >
                      فريق المشروع
                    </p>


                    <span
                      className="
                        rounded-lg
                        bg-ink/[0.05]
                        px-2
                        py-1
                        text-[10px]
                        font-black
                        text-ink/60
                      "
                    >
                      {projectMembers.length}
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

                    {projectMembers.length === 0 ? (

                      <p
                        className="
                          text-xs
                          font-bold
                          text-ink/60
                        "
                      >
                        لم يتم إضافة أعضاء بعد
                      </p>

                    ) : (

                      projectMembers.map(
                        (memberId) => (

                          <div
                            key={memberId}
                            className="
                              flex
                              items-center
                              gap-2
                              rounded-full
                              border
                              border-ink/[0.06]
                              bg-card
                              px-3
                              py-1.5
                            "
                          >

                            <Avatar
                              user={
                                userMap.get(
                                  memberId,
                                )
                              }
                              size={26}
                            />


                            <span
                              className="
                                text-xs
                                font-bold
                                text-ink/70
                              "
                            >
                              {getUserName(
                                userMap,
                                memberId,
                              )}
                            </span>


                          </div>

                        ),
                      )

                    )}

                  </div>


                </div>


              </div>


            </section>







            {/* Tasks Board */}

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
                openCreateTask(
                  status,
                )
              }
            />


          </>

        )}

      </div>



      <TaskModal
        open={taskModalOpen}
        onClose={() =>
          setTaskModalOpen(false)
        }
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
        onClose={() =>
          setProjectModalOpen(false)
        }
        editing={project}
        users={activeUsers}
        clients={clients}
      />


    </ProtectedRoute>

  );

}
