"use client";

import { ArrowLeft, MailCheck, Play } from "lucide-react";
import { HERO } from "@/constants/content";
import { useSettings } from "@/contexts/SettingsContext";
import Button from "@/features/dashboard/ui/Button";

export default function CTAButtons() {
  const { settings } = useSettings();

  const ctaPrimary = settings.content?.hero?.ctaPrimary || HERO.ctaPrimary;
  const ctaSecondary = settings.content?.hero?.ctaSecondary || HERO.ctaSecondary;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-[15px]
          transition-all duration-200 ease-out hover:-translate-y-0.5
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        style={{
          background: "var(--color-primary-600)",
          boxShadow: "0 6px 16px -4px rgba(232,33,37,0.35)",
        }}
        aria-label={ctaPrimary}
      >
        {ctaPrimary}
        <MailCheck />
      </Button>

      <Button
      variant="outline"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-ink text-[15px] border
          transition-colors duration-200 hover:bg-surface
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        style={{ borderColor: "var(--color-border)" }}
        aria-label={ctaSecondary}
      >
        <Play className="w-4 h-4" />
        {ctaSecondary}
      </Button>
    </div>
  );
}
