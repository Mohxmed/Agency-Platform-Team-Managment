import { Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/features/auth";
import PageHero from "@/features/dashboard/components/PageHero";
import TeamOverview from "@/features/dashboard/components/TeamOverview";
import CmsOverview from "@/features/dashboard/components/CmsOverview";

export default function DashboardOverview() {
  return (
    <ProtectedRoute permission="dashboard">
      <div className="space-y-6">
        <PageHero
          icon="LayoutDashboard"
          eyebrow="لوحة التحكم"
          title="مرحبًا بك في لوحة التحكم"
          subtitle="تابع مهام فريقك وأحدث نشاطات الأعمال في مكان واحد."
          badge="CMS"
        >
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-red-700 shadow-md transition-all hover:-translate-y-0.5 hover:bg-red-50 dark:bg-black dark:text-white dark:hover:bg-black/80 sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            معاينة الموقع
          </a>
        </PageHero>

        <TeamOverview />

        <CmsOverview />
      </div>
    </ProtectedRoute>
  );
}
