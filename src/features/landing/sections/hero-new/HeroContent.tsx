"use client";

import { motion, useReducedMotion } from "framer-motion";
import { heroVariants, reducedMotionVariants } from "./motionVariants";
import { SITE, HERO } from "@/constants/content";
import { useSettings } from "@/contexts/SettingsContext";
import HighlightText from "@/shared/ui/typography/HighlightText";
import CTAButtons from "./CTAButtons";

// TODO: move to src/constants/content.js as HERO_STATS and wire real numbers
// (client count, campaigns delivered, rating) once you have them.
const STATS = [
  { value: "+150", label: "عميل راضي" },
  { value: "+500", label: "حملة ناجحة" },
  { value: "4.9", label: "تقييم العملاء" },
];

export default function HeroContent() {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : heroVariants;
  const { settings } = useSettings();

  const siteName = settings.siteName || SITE.name;
  const description = settings.description || SITE.description;
  const eyebrowText = settings.content?.hero?.badge || HERO.badge;

  return (
    <motion.div
      variants={variants.container}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-start text-start w-full max-w-2xl"
    >
      <motion.div
        variants={variants.item}
        className="flex items-center gap-2 mb-5 text-muted text-sm font-medium"
      >
        <span className="w-5 h-0.5 rounded-full bg-primary-600" />
        {eyebrowText}
      </motion.div>

      <motion.h1
        variants={variants.headline}
        className="font-extrabold leading-[1.15] tracking-tight text-ink"
        style={{
          fontSize: "clamp(2.1rem, 4.2vw, 3.6rem)",
          letterSpacing: "-0.02em",
        }}
      >
        <span className="text-primary-600">{siteName}</span>
        {" ومن "}
        <HighlightText className="relative">أول السطر،</HighlightText>
        <br />
        <span className="text-ink/90">هنبدأ حكايات جديدة</span>
      </motion.h1>

      <motion.p
        variants={variants.description}
        className="mt-5 max-w-md text-muted leading-relaxed"
        style={{ fontSize: "1.125rem", lineHeight: 1.75 }}
      >
        {description}
      </motion.p>

      <motion.div variants={variants.cta} className="mt-8">
        <CTAButtons />
      </motion.div>

      <motion.div
        variants={variants.item}
        className="flex flex-wrap gap-8 mt-10 pt-8"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {STATS.map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl font-extrabold text-ink">{stat.value}</div>
            <div className="text-sm text-muted mt-0.5">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
