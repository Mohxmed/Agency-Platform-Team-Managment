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
h-[420px]
w-[420px]
-translate-x-1/2
-translate-y-1/2
rounded-full
bg-primary-500/[0.06]
blur-[90px]
sm:h-[550px]
sm:w-[550px]
"
    />
  );
}
