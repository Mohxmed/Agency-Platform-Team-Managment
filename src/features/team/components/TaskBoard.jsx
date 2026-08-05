import { Plus } from "lucide-react";

import { WORKFLOW_STATUSES } from "@/constants/workflow";

import TaskCard from "./TaskCard";

const columnStyles = {
  neutral: "border-gray-200 bg-gray-50/70",
  primary: "border-blue-200 bg-blue-50/40",
  warning: "border-amber-200 bg-amber-50/40",
  danger: "border-red-200 bg-red-50/40",
  success: "border-green-200 bg-green-50/40",
};

const headerTextStyles = {
  neutral: "text-gray-600",
  primary: "text-blue-700",
  warning: "text-amber-700",
  danger: "text-red-600",
  success: "text-green-700",
};

export default function TaskBoard({
  tasks,
  userMap,
  onMoveForward,
  onMoveBackward,
  onEdit,
  onDelete,
  onAddTask,
}) {
  return (
    <div
      dir="rtl"
      className="flex gap-4 overflow-x-auto pb-4 pt-1"
    >
      {WORKFLOW_STATUSES.map((status) => {
        const columnTasks = tasks.filter(
          (task) => task.status === status.value,
        );

        return (
          <div
            key={status.value}
            className={`flex w-[280px] shrink-0 flex-col rounded-2xl border ${columnStyles[status.variant] || columnStyles.neutral}`}
          >
            <div className="flex items-center justify-between gap-2 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black ${headerTextStyles[status.variant] || "text-gray-600"}`}
                >
                  {status.labelAr}
                </span>

                <span className="text-[10px] font-bold text-ink/60">
                  {status.label}
                </span>
              </div>

              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-card px-1.5 text-[11px] font-black text-ink/60 ring-1 ring-ink/[0.06]">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex-1 space-y-3 px-3 pb-3">
              {columnTasks.length === 0 ? (
                <button
                  type="button"
                  onClick={() => onAddTask?.(status.value)}
                  className="flex min-h-[90px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink/[0.08] text-[11px] font-bold text-ink/60 transition hover:border-primary/30 hover:text-primary"
                >
                  <Plus className="h-3.5 w-3.5" />
                  إضافة مهمة
                </button>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    userMap={userMap}
                    onMoveForward={onMoveForward}
                    onMoveBackward={onMoveBackward}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>

            <div className="px-3 pb-3">
              <button
                type="button"
                onClick={() => onAddTask?.(status.value)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink/[0.12] bg-card/70 py-2 text-[11px] font-bold text-ink/60 transition hover:border-primary/40 hover:text-primary"
              >
                <Plus className="h-3.5 w-3.5" />
                مهمة جديدة
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
