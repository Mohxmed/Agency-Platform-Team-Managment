"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import logoIcon from "@/assets/identity/logo-icon.png";
import roket from "@/assets/svg/roket.svg";

export default function HeroBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
      {/* Brand watermark — the "dot" mark, oversized and faint, scales down on mobile */}
      <div className="absolute -top-[10%] -end-[15%] w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] lg:-top-[12%] lg:-end-[10%] lg:w-[640px] lg:h-[640px] opacity-[0.05] pointer-events-none">
        <Image src={logoIcon} alt="" fill className="object-contain" priority />
      </div>

      <div className="hidden sm:block absolute -bottom-[18%] -start-[8%] w-[300px] h-[300px] lg:w-[420px] lg:h-[420px] opacity-[0.035] pointer-events-none rotate-12">
        <Image src={logoIcon} alt="" fill className="object-contain" />
      </div>

      {/* Soft brand-red spotlight behind the headline */}
      <div
        className="absolute -top-1/4 -end-1/6 h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] lg:h-[560px] lg:w-[560px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(232,33,37,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Faint dot grid for texture, masked so it fades toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 70% 30%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 70% 30%, black 0%, transparent 75%)",
          opacity: 0.6,
        }}
      />

      {/* Rocket — flies a slow diagonal loop, banking into its own heading */}
      <motion.div
        className="absolute w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 opacity-[0.55] pointer-events-none"
        style={{ filter: "drop-shadow(0 8px 16px rgba(232,33,37,0.18))" }}
        initial={{ top: "72%", left: "6%", rotate: -18 }}
        animate={
          prefersReducedMotion
            ? { opacity: 0.4 }
            : {
                top: ["72%", "18%", "40%", "72%"],
                left: ["6%", "48%", "82%", "6%"],
                rotate: [-18, 22, -8, -18],
              }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.6 }
            : {
                duration: 26,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 0.72, 1],
              }
        }
      >
        <motion.div
          className="relative w-full h-full"
          animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
          transition={
            prefersReducedMotion
              ? {}
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Image src={roket} alt="" fill className="object-contain" />

          {/* Exhaust trail, fades in the rocket's wake */}
          <motion.span
            className="absolute top-1/2 start-full -translate-y-1/2 w-6 sm:w-8 h-0.5 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(232,33,37,0.35), transparent)",
            }}
            animate={
              prefersReducedMotion
                ? {}
                : { opacity: [0.2, 0.5, 0.2], scaleX: [0.7, 1, 0.7] }
            }
            transition={
              prefersReducedMotion
                ? {}
                : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </motion.div>
      </motion.div>
    </div>
  );
}