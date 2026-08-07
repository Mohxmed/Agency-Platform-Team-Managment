"use client";

import Link from "next/link";

import {
  Building2,
  CalendarDays,
  ClipboardList,
  ArrowLeft,
  Pencil,
  Trash2,
  Users,
  Timer,
  ChevronLeft,
} from "lucide-react";

import WorkflowBadge from "./WorkflowBadge";
import PriorityBadge from "./PriorityBadge";
import ProgressBar from "./ProgressBar";

import Avatar from "@/features/dashboard/ui/Avatar";

import { ProjectIcon } from "@/constants/projectIcons";

import {
  calcProjectProgress,
  deriveProjectStatus,
  formatDeadline,
  getClientName,
  getProjectMemberIds,
  isDeadlineOverdue,
} from "@/features/team/lib/teamUtils";

const MAX_VISIBLE_MEMBERS = 4;

const STATUS_ACCENTS = {
  done: {
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-500/10 dark:bg-emerald-500/15 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  revision: {
    icon: "bg-red-50 text-red-600 ring-red-500/10 dark:bg-red-500/15 dark:text-red-400",
    bar: "bg-red-500",
  },
  review: {
    icon: "bg-violet-50 text-violet-600 ring-violet-500/10 dark:bg-violet-500/15 dark:text-violet-400",
    bar: "bg-violet-500",
  },
  "in-progress": {
    icon: "bg-amber-50 text-amber-600 ring-amber-500/10 dark:bg-amber-500/15 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  backlog: {
    icon: "bg-gray-100 text-gray-500 ring-gray-500/10 dark:bg-white/[0.08] dark:text-ink/50",
    bar: "bg-gray-400",
  },
};

export default function ProjectCard({
  project,
  tasks = [],
  userMap,
  clientMap,
  theme,
  canManage = false,
  onEdit,
  onDelete,
  showActions = true,
  variant = "grid",
}) {
  const progress = calcProjectProgress(tasks);

  const status = deriveProjectStatus(tasks, project.status);

  const statusAccent = STATUS_ACCENTS[status] || STATUS_ACCENTS.backlog;

  const overdue = isDeadlineOverdue(project.deadline) && status !== "done";

  const memberIds = getProjectMemberIds(project);

  const members = memberIds.map((id) => userMap?.get(id)).filter(Boolean);

  const hiddenCount = Math.max(0, members.length - MAX_VISIBLE_MEMBERS);

  const doneCount = tasks.filter((task) => task.status === "done").length;

  const progressBarColor =
    progress >= 100
      ? "bg-green-500"
      : progress >= 60
        ? "bg-emerald-500"
        : progress >= 30
          ? "bg-amber-500"
          : "bg-red-500";

  if (variant === "row") {
    return (
      <Link
        href={`/dashboard/team/projects/${project.id}`}
        className={`group relative flex flex-wrap items-center gap-x-4 gap-y-3 overflow-hidden rounded-2xl border border-gray-200/80 bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.18)] dark:border-white/[0.08] ${theme.hoverBorder}`}
      >
        <span className={`absolute inset-y-0 right-0 w-1.5 ${statusAccent.bar}`} />

        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105 ${statusAccent.icon}`}
        >
          <ProjectIcon name={project.icon} className="h-5 w-5" />
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1 basis-48">
          <h3
            className={`truncate text-sm font-black tracking-tight text-ink transition-colors ${theme.groupHoverText}`}
          >
            {project.title || "بدون عنوان"}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <WorkflowBadge status={status} />
            <PriorityBadge priority={project.priority} />
          </div>
        </div>

        {/* Progress */}
        <div className="hidden min-w-40 max-w-48 flex-1 basis-40 md:block">
          <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold">
            <span className="text-ink/60">التقدم</span>
            <span
              className={
                progress >= 100
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-ink"
              }
            >
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Members + count */}
        <div className="flex shrink-0 items-center gap-3">
          {members.length > 0 ? (
            <div className="flex items-center -space-x-2 rtl:space-x-reverse">
              {members.slice(0, MAX_VISIBLE_MEMBERS).map((member) => (
                <Avatar
                  key={member.id}
                  user={member}
                  size={28}
                  className="ring-2 ring-card"
                />
              ))}

              {hiddenCount > 0 && (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/[0.06] text-[10px] font-black text-ink/60 ring-2 ring-card dark:bg-white/[0.08]">
                  +{hiddenCount}
                </span>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/40">
              <Users className="h-3.5 w-3.5" />
              بدون أعضاء
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/60">
            <ClipboardList className="h-3.5 w-3.5" />
            {doneCount}/{tasks.length}
          </span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onEdit?.(project);
              }}
              title="تعديل المشروع"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink/[0.045] text-ink/60 transition hover:bg-ink/[0.08] hover:text-ink"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            {canManage && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onDelete?.(project);
                }}
                title="حذف المشروع"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-400 transition hover:bg-red-600 hover:text-white dark:hover:bg-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        <ChevronLeft className="h-4 w-4 shrink-0 text-gray-400 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:text-red-500 dark:text-ink/40 dark:group-hover:text-red-400" />
      </Link>
    );
  }

  return (
    <Link
      href={`/dashboard/team/projects/${project.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)] dark:border-white/[0.08] dark:hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] ${theme.hoverBorder}`}
    >
      {/* Status accent strip */}
      <div className={`h-1.5 w-full shrink-0 ${statusAccent.bar}`} />

      <div className="relative flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-4 transition-transform duration-300 group-hover:scale-105 ${statusAccent.icon}`}
            >
              <ProjectIcon name={project.icon} className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <WorkflowBadge status={status} />
                <PriorityBadge priority={project.priority} />
              </div>

              <h3
                className={`mt-1.5 truncate text-sm font-black tracking-tight text-ink transition-colors ${theme.groupHoverText}`}
              >
                {project.title || "بدون عنوان"}
              </h3>
            </div>
          </div>

          {showActions && (
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onEdit?.(project);
                }}
                title="تعديل المشروع"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink/[0.045] text-ink/60 transition hover:bg-ink/[0.08] hover:text-ink"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              {canManage && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onDelete?.(project);
                  }}
                  title="حذف المشروع"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-400 transition hover:bg-red-600 hover:text-white dark:hover:bg-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {project.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-ink/60">
            {project.description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.05] px-2.5 py-1 text-[11px] font-bold text-ink/60 dark:bg-white/[0.06]">
            <Building2 className="h-3 w-3" />
            {getClientName(clientMap, project.clientId)}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              overdue
                ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                : "bg-ink/[0.05] text-ink/60 dark:bg-white/[0.06]"
            }`}
          >
            {overdue ? (
              <Timer className="h-3 w-3" />
            ) : (
              <CalendarDays className="h-3 w-3" />
            )}
            {formatDeadline(project.deadline)}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold">
            <span className="text-ink/60">التقدم</span>
            <span className={progress >= 100 ? "text-emerald-600 dark:text-emerald-400" : "text-ink"}>
              {progress}%
            </span>
          </div>

          <ProgressBar value={progress} showLabel={false} />
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink/[0.07] pt-3.5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/60">
              <ClipboardList className="h-3.5 w-3.5 text-ink/60" />
              {doneCount}/{tasks.length}
            </span>

            {members.length > 0 ? (
              <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                {members.slice(0, MAX_VISIBLE_MEMBERS).map((member) => (
                  <Avatar
                    key={member.id}
                    user={member}
                    size={26}
                    className="ring-2 ring-card"
                  />
                ))}

                {hiddenCount > 0 && (
                  <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-ink/[0.06] text-[10px] font-black text-ink/60 ring-2 ring-card dark:bg-white/[0.08]">
                    +{hiddenCount}
                  </span>
                )}
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/40">
                <Users className="h-3.5 w-3.5" />
                بدون أعضاء
              </span>
            )}
          </div>

          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold transition-all duration-200 group-hover:gap-2 ${theme.text}`}
          >
            عرض المشروع
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
