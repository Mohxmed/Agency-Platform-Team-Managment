import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import { SidebarProvider } from "@/providers/SidebarProvider";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SidebarProvider>
  );
}
