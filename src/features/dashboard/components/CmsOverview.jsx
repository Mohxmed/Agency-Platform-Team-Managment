"use client";

import { useAuth } from "@/features/auth";
import { getPermissionsForProfile } from "@/constants/permissions";

import StatsGrid from "./StatsGrid";
import SystemStatus from "./SystemStatus";

export default function CmsOverview() {
  const { profile } = useAuth();

  const permissions = profile ? getPermissionsForProfile(profile) : {};

  // Site-management sections stay relevant for roles that can actually manage
  // the website (admin/manager). Members and viewers only get the team view.
  const hasCms = permissions.content === true || permissions.clients === true;

  if (!hasCms) return null;

  return (
    <>
      <StatsGrid />

      <SystemStatus />
    </>
  );
}