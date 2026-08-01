"use client";

import { Plus } from "lucide-react";
import Button from "@/features/dashboard/ui/Button";

export default function ProjectsHeader({ total, onCreate }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>

        <p className="mt-2 text-gray-500">
          Manage all projects, campaigns and client work.
        </p>
      </div>

      <Button icon={Plus} onClick={onCreate} className="h-11 px-6">
        New Project
      </Button>
    </div>
  );
}
