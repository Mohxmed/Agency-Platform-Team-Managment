import {
  Header,
  Footer,
  SectionsNavigator,
} from "@/features/landing";
import MaintenanceGate from "@/features/landing/components/MaintenanceGate";
import HomeSections from "@/features/landing/components/HomeSections";

export default function HomePage() {
  return (
    <div className="landing-shell min-h-full bg-background text-ink">
      <MaintenanceGate>
        <Header />
        <SectionsNavigator />
        <HomeSections />
        <Footer />
      </MaintenanceGate>
    </div>
  );
}
