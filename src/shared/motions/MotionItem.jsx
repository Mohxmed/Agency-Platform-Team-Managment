"use client";

import { motion } from "framer-motion";
import { itemReveal } from "./variants";
export default function MotionItem({ children, className = "" }) {
  return (
    <motion.div variants={itemReveal} className={className}>
      {children}
    </motion.div>
  );
}
