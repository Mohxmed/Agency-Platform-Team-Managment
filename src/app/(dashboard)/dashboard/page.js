import { Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/features/auth";
import PageHero from "@/features/dashboard/components/PageHero";
import StatsGrid from "@/features/dashboard/components/StatsGrid";
import QuickActions from "@/features/dashboard/components/QuickActions";
import SystemStatus from "@/features/dashboard/components/SystemStatus";
import RecentWorks from "@/features/dashboard/components/RecentWorks";
import PendingTasks from "@/features/dashboard/components/PendingTasks";

export default function DashboardOverview() {
  return (
    <ProtectedRoute permission="dashboard">
      <div className="space-y-6">
        <PageHero
          icon="LayoutDashboard"
          eyebrow="لوحة التحكم"
          title="مرحبًا بك في لوحة التحكم"
          subtitle="نظرة عامة على الموقع وأحدث النشاطات في مكان واحد."
          badge="CMS"
          accent="red"
        >
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-400 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-red-700 hover:to-red-800 dark:hover:from-red-400 dark:hover:to-red-300 sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            معاينة الموقع
          </a>
        </PageHero>

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
      </div>
    </ProtectedRoute>
  );
}
