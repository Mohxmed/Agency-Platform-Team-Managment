"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { AuthGuard } from "@/features/auth";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/config/nav";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const active = sidebarItems.find((item) => item.href === pathname);

  return (
    <AuthGuard>
      <div className="dashboard-shell flex h-screen overflow-hidden bg-gray-50 text-ink">
        <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <DashboardHeader />
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
