"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import roket from "@/assets/svg/rocket.webp";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toNum(value, fallback) {
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

/* =========================================================
   SHOWCASE ROCKET — stationary rocket with a very subtle
   idle hover (tight up/down, slight tilt and a faint scale
   breathing). No large path/orbit/translate motion, so it
   quietly hovers in place above the cards.
========================================================= */

export default function ShowcaseRocket({ config = {} }) {
  const reduceMotion = useReducedMotion();

  const visible = config.visible !== false;
  /* Idle hover duration (3-5s). The `speed` setting now drives it. */
  const duration = clamp(toNum(config.speed, 4), 3, 5);
  const size = clamp(toNum(config.size, 170), 120, 260);
  const opacity = clamp(toNum(config.opacity, 0.8), 0, 1);
  const glow = clamp(toNum(config.glow, 0.35), 0, 1);
  const src = config.image || roket;

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden
      className="showcase-rocket absolute z-30"
      style={{
        top: "70%",
        left: "6%",
        width: size,
        height: size,
        opacity,
      }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={
          reduceMotion
            ? {}
            : {
                y: [0, -7, 0], // subtle up/down (4-8px)
                rotate: [-2, 2, -2], // slight tilt (±2°)
                scale: [1, 1.02, 1], // faint breathing
              }
        }
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          sizes="260px"
          className="object-contain"
        />

        {/* Red glow beneath the rocket */}
        <div
          className="hero-rocket-glow absolute -bottom-10 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full blur-xl"
          style={{ opacity: glow }}
        />
      </motion.div>
    </motion.div>
  );
}