"use client";

import Link from "next/link";

import {
  Pencil,
  Trash2,
  CalendarDays,
  Building2,
  ArrowLeft,
  ClipboardList,
  Users,
} from "lucide-react";

import WorkflowBadge from "./WorkflowBadge";
import PriorityBadge from "./PriorityBadge";
import ProgressBar from "./ProgressBar";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";

import { ProjectIcon } from "@/constants/projectIcons";

import {
  formatDeadline,
  getClientName,
  calcProjectProgress,
  isDeadlineOverdue,
  getProjectMemberIds,
} from "../lib/teamUtils";

export default function ProjectCard({
  project,
  projectTasks = [],
  userMap,
  clientMap,
  onEdit,
  onDelete,
  canManage = true,
}) {
  const theme = usePageTheme();

  const progress = calcProjectProgress(projectTasks);

  const overdue = isDeadlineOverdue(project.deadline);

  const memberIds = getProjectMemberIds(project);

  const doneCount = projectTasks.filter(
    (task) => task.status === "done",
  ).length;

  return (
    <div className={`group relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-card shadow-[0_8px_30px_rgba(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] ${theme.hoverBorder}`}>
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

      <Link
        href={`/dashboard/team/projects/${project.id}`}
        className="absolute inset-0 z-0"
        aria-label={project.title}
      />

      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} ${theme.gradientText} shadow-md ring-4 ring-ink/[0.03] transition-transform duration-300 group-hover:scale-105`}>
              <ProjectIcon name={project.icon} className="h-5 w-5" />
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
              onClick={() => onEdit?.(project)}
              title="تعديل المشروع"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink/[0.045] text-ink/60 transition hover:bg-ink/[0.08] hover:text-ink"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            {canManage && (
              <button
                type="button"
                onClick={() => onDelete?.(project)}
                title="حذف المشروع"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-400 transition hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {project.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-ink/60">
            {project.description}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 rounded-xl bg-neutral-50/80 px-3 py-2 dark:bg-ink/[0.05]">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-ink/60" />

            <span className="truncate text-[11px] font-bold text-ink/60">
              {getClientName(clientMap, project.clientId)}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
              overdue ? "bg-red-50" : "bg-neutral-50/80 dark:bg-ink/[0.05]"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-ink/60" />

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
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/60">
              <ClipboardList className="h-3.5 w-3.5 text-ink/60" />
              {doneCount}/{projectTasks.length}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink/60">
              <Users className="h-3.5 w-3.5 text-ink/60" />
              {memberIds.length}
            </span>
          </div>

          <span className={`inline-flex items-center gap-1 text-[11px] font-bold transition-all duration-200 group-hover:gap-2 ${theme.text}`}>
            عرض المهام
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
