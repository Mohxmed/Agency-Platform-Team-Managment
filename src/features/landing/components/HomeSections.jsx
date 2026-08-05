"use client";

import { lazy, Suspense } from "react";

import { useSettings } from "@/contexts/SettingsContext";
import HeroSection from "@/features/landing/sections/HeroSection";

const ClientsSection = lazy(() =>
  import("@/features/landing/sections/ClientsSection").then((m) => ({
    default: m.default,
  }))
);

const WorksSection = lazy(() =>
  import("@/features/landing/sections/WorksSection").then((m) => ({
    default: m.default,
  }))
);

const ServicesSection = lazy(() =>
  import("@/features/landing/sections/ServicesSection").then((m) => ({
    default: m.default,
  }))
);

const ContactSection = lazy(() =>
  import("@/features/landing/sections/ContactSection").then((m) => ({
    default: m.default,
  }))
);

const SocialMediaSection = lazy(() =>
  import("@/features/landing/sections/SocialMediaSection").then((m) => ({
    default: m.default,
  }))
);

export default function HomeSections() {
  const { settings } = useSettings();
  const sections = settings.sections || {};

  return (
    <>
      {sections.hero !== false && <HeroSection />}

      {sections.clients !== false && (
        <Suspense fallback={<SectionFallback className="min-h-[600px]" />}>
          <ClientsSection />
        </Suspense>
      )}

      {sections.works !== false && (
        <Suspense fallback={<SectionFallback className="min-h-[1300px]" />}>
          <WorksSection />
        </Suspense>
      )}

      {sections.services !== false && (
        <Suspense fallback={<SectionFallback className="min-h-[1000px]" />}>
          <ServicesSection />
        </Suspense>
      )}

      {sections.contact !== false && (
        <Suspense fallback={<SectionFallback className="min-h-[calc(100vh-64px)]" />}>
          <ContactSection />
        </Suspense>
      )}

      {sections.social !== false && (
        <Suspense fallback={<SectionFallback className="min-h-[700px] sm:min-h-[800px]" />}>
          <SocialMediaSection />
        </Suspense>
      )}
    </>
  );
}

/* Invisible placeholder that reserves the section's height while its
   lazy chunk loads — prevents the layout jump / pop-in glitch. */
function SectionFallback({ className = "" }) {
  return <div aria-hidden className={className} />;
}
