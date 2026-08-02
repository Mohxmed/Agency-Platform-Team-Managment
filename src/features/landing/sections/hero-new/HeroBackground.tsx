"use client";

import { motion } from "framer-motion";
import { heroVariants, reducedMotionVariants } from "./motionVariants";
import { useReducedMotion } from "framer-motion";

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E`;

export default function HeroBackground() {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : heroVariants;

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary-500)_0%,_transparent_70%)] opacity-[0.04]" />

      <motion.div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: `url("${NOISE_SVG}")`, backgroundSize: "256px" }}
        animate={variants.noise || { opacity: 0.04 }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute -top-1/2 -right-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary-500/20 via-primary-400/10 to-transparent blur-[120px]"
          animate={variants.gradientOrb}
          style={{ filter: "blur(120px)" }}
        />

        <motion.div
          className="absolute -bottom-1/2 -left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-primary-400/15 via-primary-500/10 to-transparent blur-[100px]"
          animate={variants.gradientOrbSlow}
          style={{ filter: "blur(100px)" }}
        />

        <motion.div
          className="absolute top-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary-300/20 to-transparent blur-[80px]"
          animate={variants.floatingLight}
          style={{ filter: "blur(80px)" }}
        />

        <motion.div
          className="absolute bottom-1/3 right-1/3 h-[250px] w-[250px] rounded-full bg-gradient-to-tl from-primary-400/15 to-transparent blur-[80px]"
          animate={{
            ...variants.floatingLight,
            transition: { ...variants.floatingLight.transition, duration: 12, delay: 2 },
          }}
          style={{ filter: "blur(80px)" }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-primary-500/10 via-transparent to-primary-400/10 blur-[150px]"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
            transition: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ filter: "blur(150px)" }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 20% 30%, rgba(232, 33, 37, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 70%, rgba(255, 89, 92, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse 40% 60% at 50% 50%, rgba(232, 33, 37, 0.03) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 100%),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 60px 60px, 60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}