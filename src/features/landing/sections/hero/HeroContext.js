"use client";

import { motion } from "framer-motion";
import { SITE } from "@/constants/content";
import { useSettings } from "@/contexts/SettingsContext";
import HighlightText from "@/shared/ui/typography/HighlightText";
import HeroBadge from "./HeroBadge";
import HeroActions from "./HeroActions";
import { staggerContainer, itemReveal } from "@/shared/motions";

export default function HeroContent() {
  const { settings } = useSettings();

  const siteName = settings.siteName || SITE.name;
  const description = settings.description || SITE.description;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex grow flex-col items-center justify-center text-center"
    >
      <HeroBadge />

      <motion.h1
        variants={itemReveal}
        className="mt-4 text-2xl font-bold leading-[1.4] sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl"
      >
        <span className="text-primary-600">{siteName}</span>
        {" ومن "}
        <HighlightText>أول السطر،</HighlightText>
        <br />
        <span>هنبدأ حكايات جديدة!</span>
      </motion.h1>

      <motion.p
        variants={itemReveal}
        className="mt-4 max-w-lg text-sm leading-7 text-text-muted sm:text-base sm:leading-8 lg:max-w-3xl lg:text-xl"
      >
        {description}
      </motion.p>

      <HeroActions />
    </motion.div>
  );
}
