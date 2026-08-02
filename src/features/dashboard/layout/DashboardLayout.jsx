"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { AuthGuard } from "@/features/auth";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/config/nav";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const active = sidebarItems.find((item) => item.href === pathname);

  return (
    <AuthGuard>
      <div className="dashboard-shell flex h-screen overflow-hidden bg-gray-50 text-ink">
        <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-gray-200/80 bg-card/90 px-4 backdrop-blur-md sm:px-5 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/60 hover:bg-gray-100 hover:text-ink"
              aria-label="فتح القائمة"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-bold text-ink">لوحة التحكم</span>
            <div className="w-9" />
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <DashboardHeader />
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
