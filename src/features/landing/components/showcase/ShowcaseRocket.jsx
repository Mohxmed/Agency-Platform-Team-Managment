"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import roket from "@/assets/svg/rocket.webp";

import useParallax from "./useParallax";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toNum(value, fallback) {
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

/* =========================================================
   SHOWCASE ROCKET — cinematic elliptical orbit around the
   cards, rendered BEHIND them (z-0). Slow, eased, with a
   subtle up/down drift, motion-tilt and breathing scale,
   plus a red glow beneath.
========================================================= */

const ROCKET_PATH = {
  top: ["70%", "16%", "44%", "88%", "70%"],
  left: ["6%", "48%", "86%", "40%", "6%"],
  rotate: [-14, 18, -6, 8, -14],
  scale: [1, 0.92, 1, 0.96, 1],
};

export default function ShowcaseRocket({
  config = {},
  parallax = { x: null, y: null },
}) {
  const reduceMotion = useReducedMotion();

  const visible = config.visible !== false;
  const speed = clamp(toNum(config.speed, 20), 18, 25);
  const size = clamp(toNum(config.size, 170), 120, 260);
  const opacity = clamp(toNum(config.opacity, 0.8), 0, 1);
  const glow = clamp(toNum(config.glow, 0.35), 0, 1);
  const src = config.image || roket;

  /* Mouse parallax — the rocket follows the cursor lightly */
  const rocketX = useParallax(parallax.x, 9);
  const rocketY = useParallax(parallax.y, 6);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden
      className="showcase-rocket absolute z-30"
      style={{ width: size, height: size, opacity, x: rocketX, y: rocketY }}
      initial={{ top: ROCKET_PATH.top[0], left: ROCKET_PATH.left[0], rotate: ROCKET_PATH.rotate[0] }}
      animate={
        reduceMotion
          ? {}
          : {
              top: ROCKET_PATH.top,
              left: ROCKET_PATH.left,
              rotate: ROCKET_PATH.rotate,
              scale: ROCKET_PATH.scale,
            }
      }
      transition={{ duration: speed, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={
          reduceMotion
            ? {}
            : {
                y: [0, -10, 0],
                x: [0, 6, 0],
              }
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
