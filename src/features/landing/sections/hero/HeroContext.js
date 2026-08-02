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
        className="mt-6 text-4xl font-bold leading-[1.4] sm:text-5xl lg:text-6xl xl:text-7xl"
      >
        <span className="text-primary-600">{siteName}</span>
        {" ومن "}
        <HighlightText>أول السطر،</HighlightText>
        <br />
        <span>هنبدأ حكايات جديدة!</span>
      </motion.h1>

      <motion.p
        variants={itemReveal}
        className="mt-6 max-w-xl text-base leading-8 text-text-muted sm:text-lg lg:max-w-3xl lg:text-xl"
      >
        {description}
      </motion.p>

      <HeroActions />
    </motion.div>
  );
}
