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
        <Suspense fallback={null}>
          <ClientsSection />
        </Suspense>
      )}

      {sections.works !== false && (
        <Suspense fallback={null}>
          <WorksSection />
        </Suspense>
      )}

      {sections.services !== false && (
        <Suspense fallback={null}>
          <ServicesSection />
        </Suspense>
      )}

      {sections.contact !== false && (
        <Suspense fallback={null}>
          <ContactSection />
        </Suspense>
      )}

      {sections.social !== false && (
        <Suspense fallback={null}>
          <SocialMediaSection />
        </Suspense>
      )}
    </>
  );
}
