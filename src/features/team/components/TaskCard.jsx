import Link from "next/link";

import {
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  Clock,
  ListChecks,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";

import PriorityBadge from "./PriorityBadge";
import Avatar from "@/features/dashboard/ui/Avatar";

import {
  formatDeadline,
  getUserName,
  getAssigneeId,
} from "../lib/teamUtils";

export default function TaskCard({
  task,
  userMap,
  onMoveForward,
  onMoveBackward,
  onEdit,
  onDelete,
}) {
  const doneChecklist =
    task.checklist?.filter((item) => item.done)?.length || 0;

  const assigneeId = getAssigneeId(task);

  return (
    <div className="group relative rounded-2xl border border-ink/[0.06] bg-card p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            title="تعديل المهمة"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink/[0.04] text-ink/50 transition hover:bg-ink/[0.08] hover:text-ink"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(task)}
            title="حذف المهمة"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-400 transition hover:bg-red-600 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <Link
        href={`/dashboard/team/tasks/${task.id || ""}`}
        className="block text-sm font-black leading-6 text-ink transition-colors hover:text-primary"
      >
        {task.title || "بدون عنوان"}
      </Link>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Avatar
            user={userMap.get(assigneeId)}
            size={24}
          />

          <span className="max-w-[90px] truncate text-[10px] font-bold text-ink/45">
            {getUserName(userMap, assigneeId)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-ink/[0.06] pt-2.5">
        {task.deadline && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ink/40">
            <CalendarDays className="h-3 w-3" />
            {formatDeadline(task.deadline)}
          </span>
        )}

        {(task.spentHours > 0 || task.estimatedHours > 0) && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ink/40">
            <Clock className="h-3 w-3" />
            {task.spentHours || 0}/{task.estimatedHours || 0}
          </span>
        )}

        {task.checklist?.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ink/40">
            <ListChecks className="h-3 w-3" />
            {doneChecklist}/{task.checklist.length}
          </span>
        )}

        {task.comments?.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ink/40">
            <MessageSquare className="h-3 w-3" />
            {task.comments.length}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMoveBackward?.(task)}
          disabled={!onMoveBackward || task.status === "backlog"}
          title="التراجع في مراحل العمل"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink/[0.04] text-ink/40 transition hover:bg-ink/[0.08] hover:text-ink disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onMoveForward?.(task)}
          disabled={!onMoveForward || task.status === "done"}
          title="تقديم في مراحل العمل"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary transition hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
