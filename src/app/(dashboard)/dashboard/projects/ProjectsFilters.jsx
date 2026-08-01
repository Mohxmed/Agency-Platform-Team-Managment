"use client";

import { Search } from "lucide-react";

import { usePageTheme } from "@/features/dashboard/hooks/usePageTheme";

export default function ProjectsFilters({
  search,
  onSearch,
  status,
  onStatusChange,
}) {
  const theme = usePageTheme();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className={`w-full rounded-xl border py-2 pl-10 pr-4 outline-none ${theme.focus}`}
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className={`rounded-xl border px-4 py-2 outline-none ${theme.focus}`}
      >
        <option value="all">All</option>
        <option value="planning">Planning</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}
