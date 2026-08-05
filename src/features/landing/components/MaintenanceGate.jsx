"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/features/auth";
import MaintenancePage from "./MaintenancePage";

export default function MaintenanceGate({ children }) {
  const { settings, loading } = useSettings();
  const { profile, profileLoading } = useAuth();

  // Render content immediately so first paint isn't blocked on Firebase.
  // Only swap to the maintenance page once settings/auth have loaded.
  if (loading || profileLoading) return children;

  const isAdmin = profile?.role === "admin";
  const inMaintenance = settings?.system?.maintenanceMode === true;

  if (inMaintenance && !isAdmin) {
    return <MaintenancePage />;
  }

  return children;
}
