"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/features/auth";
import MaintenancePage from "./MaintenancePage";

export default function MaintenanceGate({ children }) {
  const { settings, loading } = useSettings();
  const { profile, profileLoading } = useAuth();

  if (loading || profileLoading) return null;

  const isAdmin = profile?.role === "admin";
  const inMaintenance = settings?.system?.maintenanceMode === true;

  if (inMaintenance && !isAdmin) {
    return <MaintenancePage />;
  }

  return children;
}
