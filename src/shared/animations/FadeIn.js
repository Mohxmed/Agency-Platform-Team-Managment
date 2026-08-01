"use client";

// FadeIn — reusable entrance animation wrapper.
// A single, deliberate page-load moment (fade + slight rise/scale) rather
// than scattered effects. Framer Motion respects prefers-reduced-motion
// automatically when paired with useReducedMotion, so we opt in here.

import { motion, useReducedMotion } from "framer-motion";

export function FadeIn({ children, delay = 0, className }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
