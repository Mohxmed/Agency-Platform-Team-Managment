import { Header, Footer } from "@/features/landing";
import FloatingShare from "@/shared/ui/share/FloatingShare";
import MaintenanceGate from "@/features/landing/components/MaintenanceGate";

function layout({ children }) {
  return (
    <div className="landing-shell min-h-full bg-background text-ink">
      <MaintenanceGate>
        <Header />
        {children}
        <Footer />
        <FloatingShare />
      </MaintenanceGate>
    </div>
  );
}

export default layout;
