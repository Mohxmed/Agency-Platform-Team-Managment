"use client";

import { motion } from "framer-motion";
import { heroVariants, reducedMotionVariants } from "./motionVariants";
import { useReducedMotion } from "framer-motion";
import { SITE, HERO } from "@/constants/content";
import { useSettings } from "@/contexts/SettingsContext";
import HighlightText from "@/shared/ui/typography/HighlightText";
import CTAButtons from "./CTAButtons";

export default function HeroContent() {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : heroVariants;
  const { settings } = useSettings();

  const siteName = settings.siteName || SITE.name;
  const description = settings.description || SITE.description;
  const badgeText = settings.content?.hero?.badge || HERO.badge;

  return (
    <motion.div
      variants={variants.container}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={variants.badge}
        className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
        style={{
          background: "linear-gradient(135deg, rgba(232,33,37,0.12) 0%, rgba(232,33,37,0.06) 100%)",
          border: "1px solid rgba(232,33,37,0.2)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-primary-500"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-primary-600 text-sm font-medium tracking-wide">{badgeText}</span>
      </motion.div>

      <motion.h1
        variants={variants.headline}
        className="font-bold leading-[1.1] tracking-tight text-ink max-w-4xl mx-auto"
        style={{
          fontSize: "clamp(2.25rem, 6vw, 5.5rem)",
          lineHeight: "clamp(2.5rem, 6.5vw, 6rem)",
          letterSpacing: "-0.03em",
        }}
      >
        <span className="text-primary-600">{siteName}</span>
        {" ومن "}
        <HighlightText className="relative">
          أول السطر،
        </HighlightText>
        <br />
        <span className="text-ink/90">هنبدأ حكايات جديدة!</span>
      </motion.h1>

      <motion.p
        variants={variants.description}
        className="mt-6 max-w-2xl mx-auto text-text-muted leading-relaxed"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          lineHeight: "clamp(1.6, 2.5vw, 1.8)",
          fontWeight: 400,
        }}
      >
        {description}
      </motion.p>

      <motion.div variants={variants.cta} className="mt-10 w-full">
        <CTAButtons />
      </motion.div>
    </motion.div>
  );
}