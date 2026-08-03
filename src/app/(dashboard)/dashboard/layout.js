import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import { SidebarProvider } from "@/providers/SidebarProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: {
    default: "لوحة التحكم",
    template: "%s | نقطة",
  },
  description: "لوحة تحكم إدارة موقع نقطة: المحتوى، الأعمال، الباقات، الفريق والإعدادات.",
  keywords: ["لوحة التحكم", "إدارة الموقع", "نقطة"],
  path: "/dashboard",
  noindex: true,
});

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <ToastProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </ToastProvider>
    </SidebarProvider>
  );
}
