"use client";

import { useAuth } from "@/features/auth";
import { getPermissionsForRole } from "@/constants/permissions";

import StatsGrid from "./StatsGrid";
import QuickActions from "./QuickActions";
import SystemStatus from "./SystemStatus";
import RecentWorks from "./RecentWorks";
import PendingTasks from "./PendingTasks";

export default function CmsOverview() {
  const { profile } = useAuth();

  const permissions = profile ? getPermissionsForRole(profile.role) : {};

  // Site-management sections stay relevant for roles that can actually manage
  // the website (admin/manager). Members and viewers only get the team view.
  const hasCms = permissions.content === true || permissions.clients === true;

  if (!hasCms) return null;

  return (
    <>
      <StatsGrid />

      <div className="grid items-start gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <QuickActions />
        </div>

        <SystemStatus />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <RecentWorks />
        <PendingTasks />
      </div>
    </>
  );
}