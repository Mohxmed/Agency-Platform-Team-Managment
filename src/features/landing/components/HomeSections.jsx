"use client";

import { useSettings } from "@/contexts/SettingsContext";
import {
  HeroSection,
  ClientsSection,
  WorksSection,
  ServicesSection,
  ContactSection,
  SocialMediaSection,
} from "@/features/landing";

export default function HomeSections() {
  const { settings } = useSettings();
  const sections = settings.sections || {};

  return (
    <>
      {sections.hero !== false && <HeroSection />}
      {sections.clients !== false && <ClientsSection />}
      {sections.works !== false && <WorksSection />}
      {sections.services !== false && <ServicesSection />}
      {sections.contact !== false && <ContactSection />}
      {sections.social !== false && <SocialMediaSection />}
    </>
  );
}
