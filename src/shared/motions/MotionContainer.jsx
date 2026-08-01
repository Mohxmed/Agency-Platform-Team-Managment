"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "./variants";

export default function MotionContainer({ children, className = "" }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}
