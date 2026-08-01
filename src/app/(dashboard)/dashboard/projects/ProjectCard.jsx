"use client";

import Image from "next/image";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  Building2,
} from "lucide-react";

import Badge from "@/features/dashboard/ui/Badge";

const statusVariant = {
  planning: "neutral",
  "in-progress": "warning",
  completed: "success",
};

export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Cover */}

      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        <div className="absolute right-3 top-3">
          <Badge variant={statusVariant[project.status]}>
            {project.status}
          </Badge>
        </div>
      </div>

      {/* Content */}

      <div className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
            {project.title}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Building2 size={16} />

            {project.client || "Unknown Client"}
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-gray-500">
          {project.description || "No description"}
        </p>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={15} />

            {project.createdAt || "—"}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(project)}
              className="rounded-xl p-2 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={() => onDelete(project)}
              className="rounded-xl p-2 transition hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
