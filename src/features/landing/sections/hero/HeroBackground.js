"use client";

import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.7,
      }}

      animate={{
        opacity: 1,
        scale: 1,
      }}

      transition={{
        duration: 1.2,
      }}

      className="
        pointer-events-none
        absolute
        left-1/2
        top-1/2
        -z-10
        h-[300px]
        w-[300px]
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-primary-500/[0.06]
        blur-[80px]
        sm:h-[400px]
        sm:w-[400px]
        sm:blur-[90px]
        md:h-[550px]
        md:w-[550px]
      "
    />
  );
}
