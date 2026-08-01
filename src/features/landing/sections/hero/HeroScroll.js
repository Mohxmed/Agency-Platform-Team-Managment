"use client";

import { motion } from "framer-motion";
import ScrollIndicator from "@/shared/ui/ScrollIndicator";
import { fadeInUp, floating } from "@/shared/motions";

export default function HeroScroll() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex w-full justify-center"
    >
      <motion.div animate={floating.animate}>
        <ScrollIndicator />
      </motion.div>
    </motion.div>
  );
}