import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import { SidebarProvider } from "@/providers/SidebarProvider";
import { ToastProvider } from "@/providers/ToastProvider";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <ToastProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </ToastProvider>
    </SidebarProvider>
  );
}
