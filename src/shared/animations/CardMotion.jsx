"use client";

import { motion } from "framer-motion";

export default function CardMotion({ children, className = "" }) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
      }}
      className={className}
    >
      {children}
    </motion.article>
  );
}
