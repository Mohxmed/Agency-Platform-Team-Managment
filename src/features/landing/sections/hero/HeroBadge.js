"use client";

import { motion } from "framer-motion";
import { BadgeQuestionMark } from "lucide-react";

import { OutlinedBadge } from "@/shared/ui/badges/OutlinedBadge";
import { HERO } from "@/constants/content";
import { useSettings } from "@/contexts/SettingsContext";

import { itemReveal } from "@/shared/motions";

export default function HeroBadge() {
  const { settings } = useSettings();
  const badge = settings.content?.hero?.badge || HERO.badge;

  return (
    <motion.div variants={itemReveal} initial="hidden" animate="visible">
      <OutlinedBadge>
        <BadgeQuestionMark size={24} />
        {badge}
      </OutlinedBadge>
    </motion.div>
  );
}
