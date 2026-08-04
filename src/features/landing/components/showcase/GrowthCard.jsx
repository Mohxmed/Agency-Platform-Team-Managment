"use client";

import { motion, useReducedMotion } from "framer-motion";

import { TrendingUp } from "lucide-react";

import useParallax from "./useParallax";

/* =========================================================
   GROWTH CARD — floating red gradient card (period, value,
   label). Sits below the main analytics card.
========================================================= */

export default function GrowthCard({
  growth = {},
  parallax = { x: null, y: null },
  static: isStatic = false,
}) {
  const reduceMotion = useReducedMotion();

  const value = growth.value || "+150K";
  const label = growth.label || "متابع جديد";
  const period = growth.period || "هذا الشهر";
  const color = growth.color || "#e82125";

  /* Mouse parallax — card drifts slightly (10-20px max) */
  const cardX = useParallax(parallax.x, 18);
  const cardY = useParallax(parallax.y, 13);

  const float = reduceMotion || isStatic
    ? {}
    : {
        y: [0, -11, 0],
        transition: { duration: 7, repeat: Infinity, delay: 1.2, ease: "easeInOut" },
      };

  return (
    <motion.div
      style={{ x: cardX, y: cardY }}
      className={
        isStatic
          ? "relative"
          : "showcase-card absolute bottom-10 end-[60px] z-10"
      }
    >
      <motion.div animate={float}>
        <div
          className="rounded-[26px] px-6 py-5 text-white shadow-[0_25px_70px_rgba(232,33,37,0.3)]"
          style={{
            background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 55%, #000))`,
          }}
        >
          <div className="mb-1 flex items-center gap-1.5 text-xs opacity-80">
            <TrendingUp size={13} />
            {period}
          </div>
          <div className="text-3xl font-black tracking-tight">{value}</div>
          <div className="mt-1 text-xs opacity-90">{label}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
