"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

import { OutlinedBadge } from "@/shared/ui/badges/OutlinedBadge";
import SectionTitle from "@/features/landing/layout/SectionTitle";

import { fadeUp, staggerContainer, viewportOnce } from "./sectionMotion";

/* =========================================================
   SectionHeading
   Shared animated header (badge + title + description) used
   by Clients / Works / Services sections — removes duplication.
========================================================= */

export default function SectionHeading({
  badge,
  badgeIcon,
  title,
  redTitle = "",
  variant = "dark",
  align = "center",
  className = "",
  children,
}) {
  const centered = align === "center";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce(0.35)}
      className={clsx("max-w-3xl", centered && "mx-auto text-center", className)}
    >
      {badge && (
        <motion.div
          variants={fadeUp}
          className={clsx("flex w-full", centered && "justify-center")}
        >
          <OutlinedBadge variant={variant === "light" ? "white" : "primary"}>
            {badgeIcon}
            {badge}
          </OutlinedBadge>
        </motion.div>
      )}

      <motion.div variants={fadeUp}>
        <SectionTitle title={title} redTitle={redTitle} variant={variant}>
          {children}
        </SectionTitle>
      </motion.div>
    </motion.div>
  );
}
