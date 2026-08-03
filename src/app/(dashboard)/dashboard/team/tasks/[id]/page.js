"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  ExternalLink,
  ListChecks,
  MessageSquare,
  Pencil,
  Plus,
  Tag,
  Trash2,
  Users,
} from "lucide-react";

import { ProtectedRoute, useAuth } from "@/features/auth";

import { useTeamData } from "@/features/team/hooks/useTeamData";

import WorkflowBadge from "@/features/team/components/WorkflowBadge";
import PriorityBadge from "@/features/team/components/PriorityBadge";
import TaskModal from "@/features/team/components/TaskModal";

import Avatar from "@/features/dashboard/ui/Avatar";
import Button from "@/features/dashboard/ui/Button";

import { ProjectIcon } from "@/constants/projectIcons";

import { WORKFLOW_STATUSES } from "@/constants/workflow";

import {
  formatDateTime,
  formatDeadline,
  getUserName,
  getAssigneeId,
  getReviewerId,
  getReporterId,
  getWorkflowMeta,
  isDeadlineOverdue,
  nextWorkflowStatus,
  prevWorkflowStatus,
  canManageTeam,
  canMemberAdvance,
  uid,
} from "@/features/team/lib/teamUtils";

import { updateDocument, removeDocument } from "@/lib/firestoreService";

import { notifyMany, getTaskRecipientUserIds } from "@/lib/notificationService";

import { useToast } from "@/hooks/useToast";

export default function TaskDetailPage() {
  const params = useParams();

  const router = useRouter();

  const { showToast } = useToast();

  const { user: currentUser, profile } = useAuth();

  const canManage = canManageTeam(profile?.role);

  const { tasks, projects, users, activeUsers, userMap, loading } =
    useTeamData();

  const taskId = params?.id;

  const task = tasks.find((item) => item.id === taskId);

  const project = projects.find((item) => item.id === task?.projectId);

  const [editOpen, setEditOpen] = useState(false);

  const [comment, setComment] = useState("");

  const [busy, setBusy] = useState(false);

  const currentAuthorName =
    userMap.get(currentUser?.uid)?.name ||
    currentUser?.displayName ||
    "مستخدم";

  const assigneeId = getAssigneeId(task);
  const reviewerId = getReviewerId(task);
  const reporterId = getReporterId(task);

  const doneChecklist = task?.checklist?.filter((item) => item.done)?.length || 0;

  const overdue =
    task && !(task.status === "done") && isDeadlineOverdue(task.deadline);

  function addActivity(taskToUpdate, type, text) {
    const activity = Array.isArray(taskToUpdate.activity) ? taskToUpdate.activity : [];

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

  async function handleMove(direction) {
    if (!task || busy) return;

    const isAssignee = getAssigneeId(task) === currentUser?.uid;

    if (!canManage && !isAssignee) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message: "ليس لديك صلاحية تعديل حالة هذه المهمة.",
      });
      return;
    }

    const role = profile?.role;

    // Members may only advance the workflow (never move backward).
    if (direction === "backward" && !canManage) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message: "لا يمكنك التراجع في مراحل المهمة.",
      });
      return;
    }

    const fromMeta = getWorkflowMeta(task.status);

    const nextStatus =
      direction === "forward"
        ? nextWorkflowStatus(task.status)
        : prevWorkflowStatus(task.status);

    if (nextStatus === task.status) return;

    // Members cannot move past "review" (no revision / done) — admin/manager
    // are the ones who decide revision or completion.
    if (direction === "forward" && !canManage && !canMemberAdvance(task.status)) {
      showToast({
        type: "warning",
        title: "انتهت مراحل العضو",
        message: "بعد الإرسال للمراجعة، يتولى المسؤول قرار التعديلات أو التسليم.",
      });
      return;
    }

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

      notifyMany(
        getTaskRecipientUserIds(task, users, currentUser?.uid || ""),
        {
          title: "تم تحديث حالة المهمة",
          message: `تم نقل المهمة "${task.title}" من "${fromMeta.labelAr}" إلى "${toMeta.labelAr}".`,
          type: "task",
          link: `/dashboard/team/tasks/${task.id}`,
          projectId: task.projectId,
          projectTitle: project?.title || "",
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
    } finally {
      setBusy(false);
    }
  }

  async function toggleChecklist(itemId) {
    if (!task || busy) return;

    const checklist = (task.checklist || []).map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item,
    );

    setBusy(true);

    try {
      await updateDocument("tasks", task.id, {
        checklist,
        activity: addActivity(task, "checklist", "تم تحديث قائمة التحقق"),
      });

      notifyMany(
        getTaskRecipientUserIds(task, users, currentUser?.uid || ""),
        {
          title: "تم تحديث قائمة التحقق",
          message: `تم تحديث قائمة تحقق المهمة "${task.title}".`,
          type: "task",
          link: `/dashboard/team/tasks/${task.id}`,
          projectId: task.projectId,
          projectTitle: project?.title || "",
          eventKey: "tasks",
        },
      );
    } catch (error) {
      console.error("Failed to update checklist:", error);
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء تحديث قائمة التحقق.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleAddComment(event) {
    event?.preventDefault();

    const text = comment.trim();

    if (!task || !text || busy) return;

    const comments = Array.isArray(task.comments) ? task.comments : [];

    setBusy(true);

    try {
      await updateDocument("tasks", task.id, {
        comments: [
          ...comments,
          {
            id: uid(),
            text,
            authorId: currentUser?.uid || "",
            authorName: currentAuthorName,
            createdAt: new Date().toISOString(),
          },
        ],
        activity: addActivity(task, "comment", "تمت إضافة تعليق"),
      });

      notifyMany(
        getTaskRecipientUserIds(task, users, currentUser?.uid || ""),
        {
          title: "تعليق جديد على مهمة",
          message: `علّق ${currentAuthorName} على مهمة "${task.title}".`,
          type: "comment",
          link: `/dashboard/team/tasks/${task.id}`,
          projectId: task.projectId,
          projectTitle: project?.title || "",
          eventKey: "tasks",
        },
      );

      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء إضافة التعليق.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!task) return;

    if (!canManage) {
      showToast({
        type: "warning",
        title: "صلاحيات غير كافية",
        message: "ليس لديك صلاحية حذف المهام.",
      });
      return;
    }

    const confirmed = window.confirm(`هل أنت متأكد من حذف مهمة "${task.title}"؟`);

    if (!confirmed) return;

    try {
      await removeDocument("tasks", task.id);
      router.push(
        task.projectId
          ? `/dashboard/team/projects/${task.projectId}`
          : "/dashboard/team",
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: "حصل خطأ أثناء حذف المهمة.",
      });
    }
  }

  if (loading) {
    return (
      <ProtectedRoute permission="tasks">
        <div dir="rtl" className="space-y-6">
          <div className="h-10 w-64 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-40 animate-pulse rounded-[28px] border border-gray-100 bg-gray-50" />
          <div className="h-72 animate-pulse rounded-3xl border border-gray-100 bg-gray-50" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute permission="tasks">
      <div dir="rtl" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={project ? `/dashboard/team/projects/${project.id}` : "/dashboard/team"}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/45 transition hover:text-red-600"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            {project ? `العودة إلى ${project.title}` : "العودة إلى المشاريع"}
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleMove("backward")}
              disabled={busy || !canManage || !task || task.status === "backlog"}
              title="التراجع في مراحل العمل"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/[0.08] bg-card text-ink/50 transition hover:border-ink/[0.16] hover:text-ink disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => handleMove("forward")}
              disabled={
                busy ||
                !task ||
                task.status === "done" ||
                (!canManage && !canMemberAdvance(task.status))
              }
              title="تقديم في مراحل العمل"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700 dark:bg-red-400 dark:hover:bg-red-300 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setEditOpen(true)}
              disabled={!task}
              className="inline-flex items-center gap-1.5 rounded-xl border border-ink/[0.08] bg-card px-3.5 py-2 text-xs font-bold text-ink/70 transition hover:border-ink/[0.16] hover:text-ink disabled:pointer-events-none disabled:opacity-40"
            >
              <Pencil className="h-3.5 w-3.5" />
              تعديل
            </button>

            {canManage && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={!task}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white dark:hover:bg-red-400 disabled:pointer-events-none disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                حذف
              </button>
            )}
          </div>
        </div>

        {!task ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[24px] border border-dashed border-red-200 bg-red-50/30 px-6 text-center">
            <ClipboardList className="h-8 w-8 text-red-300" />
            <h2 className="mt-4 text-lg font-black text-ink">المهمة غير موجودة</h2>
            <Link
              href="/dashboard/team"
              className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 dark:bg-red-400 dark:hover:bg-red-300"
            >
              العودة للمشاريع
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <section className="rounded-[28px] border border-gray-200/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <WorkflowBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />

                  {overdue && (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
                      متأخرة
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-2xl font-black tracking-tight text-ink sm:text-3xl">
                  {task.title || "بدون عنوان"}
                </h1>

                {project && (
                  <Link
                    href={`/dashboard/team/projects/${project.id}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-ink/[0.06] bg-surface/60 px-3 py-2 text-xs font-bold text-ink/60 transition hover:border-red-200 hover:text-red-600"
                  >
                    <ProjectIcon name={project?.icon} className="h-4 w-4" />
                    {project.title}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}

                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-ink/60">
                  {task.description || "لا يوجد وصف لهذه المهمة."}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-ink/[0.06] bg-surface/60 p-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-ink/35">
                      <CalendarDays className="h-3.5 w-3.5" />
                      الاستحقاق
                    </div>
                    <p className={`mt-1.5 text-xs font-bold ${overdue ? "text-red-600" : "text-ink/70"}`}>
                      {formatDeadline(task.deadline)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-ink/[0.06] bg-surface/60 p-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-ink/35">
                      <Clock className="h-3.5 w-3.5" />
                      الساعات
                    </div>
                    <p className="mt-1.5 text-xs font-bold text-ink/70">
                      {task.spentHours || 0}/{task.estimatedHours || 0} س
                    </p>
                  </div>

                  <div className="rounded-2xl border border-ink/[0.06] bg-surface/60 p-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-ink/35">
                      <ListChecks className="h-3.5 w-3.5" />
                      قائمة التحقق
                    </div>
                    <p className="mt-1.5 text-xs font-bold text-ink/70">
                      {doneChecklist}/{task.checklist?.length || 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-ink/[0.06] bg-surface/60 p-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-ink/35">
                      <MessageSquare className="h-3.5 w-3.5" />
                      التعليقات
                    </div>
                    <p className="mt-1.5 text-xs font-bold text-ink/70">
                      {task.comments?.length || 0}
                    </p>
                  </div>
                </div>
              </section>

              {task.checklist?.length > 0 && (
                <section className="rounded-[24px] border border-gray-200/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-black text-ink">
                      <ListChecks className="h-4 w-4 text-ink/35" />
                      قائمة التحقق
                    </h3>

                    <span className="rounded-lg bg-black px-2 py-1 text-[11px] font-black text-white dark:bg-white dark:text-black">
                      {doneChecklist}/{task.checklist.length}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {task.checklist.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => toggleChecklist(item.id)}
                          disabled={busy}
                          className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-start transition disabled:opacity-60 ${
                            item.done
                              ? "border-green-200 bg-green-50/60"
                              : "border-ink/[0.06] bg-card hover:border-ink/[0.12]"
                          }`}
                        >
                          <CheckCircle2
                            className={`h-5 w-5 shrink-0 ${
                              item.done ? "text-green-600" : "text-ink/20"
                            }`}
                          />
                          <span
                            className={`text-sm font-bold ${
                              item.done ? "text-ink/40 line-through" : "text-ink"
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="rounded-[24px] border border-gray-200/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-ink">
                  <MessageSquare className="h-4 w-4 text-ink/35" />
                  التعليقات ({task.comments?.length || 0})
                </h3>

                <form onSubmit={handleAddComment} className="flex flex-col items-start gap-3">
                  <Avatar user={userMap.get(currentUser?.uid)} size={36} />

                  <div className="min-w-0 flex-1">
                    <textarea
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      rows={2}
                      placeholder="أضف تعليقًا..."
                      className="w-full resize-none rounded-xl border border-ink/[0.08] bg-surface/60 p-3 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-red-300 focus:ring-4 focus:ring-red-500/10"
                    />

                    <div className="mt-2 flex justify-end">
                      <Button type="submit" loading={busy} icon={Plus} disabled={!comment.trim()}>
                        إضافة تعليق
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="mt-5 space-y-3">
                  {(task.comments || []).length === 0 && (
                    <p className="py-3 text-center text-xs text-ink/35">
                      لا توجد تعليقات بعد.
                    </p>
                  )}

                  {(task.comments || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl border border-ink/[0.05] bg-surface/50 p-3.5"
                    >
                      <Avatar
                        user={userMap.get(item.authorId)}
                        size={32}
                        name={item.authorName}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black text-ink">
                            {item.authorName || "مستخدم"}
                          </span>
                          <span className="text-[10px] font-medium text-ink/35">
                            {formatDateTime(item.createdAt)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-6 text-ink/60">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-[24px] border border-gray-200/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-ink">
                  <Users className="h-4 w-4 text-ink/35" />
                  الأفراد
                </h3>

                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar user={userMap.get(assigneeId)} size={40} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-ink/35">المسؤول (Assignee)</p>
                      <p className="mt-0.5 truncate text-sm font-bold text-ink">
                        {getUserName(userMap, assigneeId)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar user={userMap.get(reviewerId)} size={40} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-ink/35">المراجع (Reviewer)</p>
                      <p className="mt-0.5 truncate text-sm font-bold text-ink">
                        {getUserName(userMap, reviewerId)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar user={userMap.get(reporterId)} size={40} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-ink/35">المنشئ (Reporter)</p>
                      <p className="mt-0.5 truncate text-sm font-bold text-ink">
                        {getUserName(userMap, reporterId)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {task.labels?.length > 0 && (
                <section className="rounded-[24px] border border-gray-200/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-ink">
                    <Tag className="h-4 w-4 text-ink/35" />
                    التصنيفات
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {task.labels.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-600"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {task.attachments?.length > 0 && (
                <section className="rounded-[24px] border border-gray-200/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-ink">
                    <ExternalLink className="h-4 w-4 text-ink/35" />
                    المرفقات
                  </h3>

                  <ul className="space-y-2">
                    {task.attachments.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-ink/[0.06] bg-surface/60 px-3 py-2.5 text-xs font-bold text-ink/60 transition hover:border-red-200 hover:text-red-600"
                        >
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                          <span className="min-w-0 flex-1 truncate">{url}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="rounded-[24px] border border-gray-200/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-ink">
                  <ClipboardList className="h-4 w-4 text-ink/35" />
                  مراحل العمل
                </h3>

                <div className="space-y-1">
                  {WORKFLOW_STATUSES.map((status, index) => {
                    const currentIndex = WORKFLOW_STATUSES.findIndex(
                      (item) => item.value === task.status,
                    );

                    const reached = index <= currentIndex;

                    return (
                      <div
                        key={status.value}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 transition"
                        style={reached ? { backgroundColor: `${status.color}14` } : undefined}
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: reached ? status.color : "#d4d4d4",
                          }}
                        />

                        <span
                          className={`text-xs font-bold ${
                            status.value === task.status
                              ? "text-ink"
                              : reached
                                ? "text-ink/60"
                                : "text-ink/30"
                          }`}
                        >
                          {status.labelAr}
                        </span>

                        {status.value === task.status && (
                          <span className="mr-auto rounded-md bg-black px-2 py-0.5 text-[10px] font-black text-white dark:bg-white dark:text-black">
                            الحالية
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      <TaskModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        editing={task}
        projects={projects}
        users={activeUsers}
        defaultProjectId={task?.projectId}
        defaultStatus={task?.status}
        currentUser={currentUser}
        onSaved={() => {}}
      />
    </ProtectedRoute>
  );
}
