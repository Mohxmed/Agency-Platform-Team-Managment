"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

import { Activity, Heart, MessageCircle } from "lucide-react";

import { EASE } from "@/features/landing/components/sectionMotion";
import useParallax from "./useParallax";

const DEFAULT_BARS = [45, 65, 40, 75, 55, 85, 70];

function parseChart(value) {
  if (Array.isArray(value)) {
    const nums = value.map((n) => Number(n)).filter((n) => !Number.isNaN(n));
    return nums.length ? nums : DEFAULT_BARS;
  }
  const nums = String(value || "")
    .split(",")
    .map((n) => Number(n.trim()))
    .filter((n) => !Number.isNaN(n));
  return nums.length ? nums : DEFAULT_BARS;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/* =========================================================
   ANALYTICS PANEL — the main showcase card (glass, tilt,
   chart bars, progress ring, LIVE badge, likes/comments).
========================================================= */

export default function AnalyticsPanel({
  campaign = {},
  analytics = {},
  parallax = { x: null, y: null },
  static: isStatic = false,
}) {
  const reduceMotion = useReducedMotion();

  const title = analytics.title || "محتوى أسبوعي";
  const growth = analytics.growth || "+24%";
  const text = analytics.text || "تفاعل أعلى من المتوسط بثلاث أضعاف";
  const likes = campaign.likes || "2.4K";
  const comments = campaign.comments || "318";
  const live = analytics.live !== false;
  const ringValue = clamp(Number(analytics.ring ?? 82) || 0, 0, 100);
  const bars = parseChart(analytics.chart);

  /* Mouse parallax — cards drift slightly (10-20px max) */
  const cardX = useParallax(parallax.x, 16);
  const cardY = useParallax(parallax.y, 12);

  /* 3D hover tilt (desktop only) */
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const tiltX = useSpring(pointerX, { stiffness: 160, damping: 20 });
  const tiltY = useSpring(pointerY, { stiffness: 160, damping: 20 });
  const rotateX = useTransform(tiltY, [0, 1], [6, -6]);
  const rotateY = useTransform(tiltX, [0, 1], [-6, 6]);
  const glareX = useTransform(tiltX, [0, 1], [20, 80]);
  const glareY = useTransform(tiltY, [0, 1], [20, 80]);
  const glare = useMotionTemplate`radial-gradient(320px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.16), transparent 55%)`;

  const float = reduceMotion || isStatic
    ? {}
    : {
        y: [0, -12, 0],
        transition: { duration: 8, repeat: Infinity, delay: 0.4, ease: "easeInOut" },
      };

  const tiltProps = reduceMotion || isStatic
    ? {}
    : {
        onPointerMove: (e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          pointerX.set((e.clientX - rect.left) / rect.width);
          pointerY.set((e.clientY - rect.top) / rect.height);
        },
        onPointerLeave: () => {
          pointerX.set(0.5);
          pointerY.set(0.5);
        },
      };

  const ringRadius = 26;
  const ringLength = 2 * Math.PI * ringRadius;

  return (
    <motion.div
      style={{ x: cardX, y: cardY }}
      className={
        isStatic
          ? "relative w-full"
          : "showcase-card absolute top-16 end-8 z-10 w-[300px] rotate-[-4deg]"
      }
    >
      <motion.div animate={float}>
        <motion.div
          {...tiltProps}
          style={{
            rotateX: isStatic ? 0 : rotateX,
            rotateY: isStatic ? 0 : rotateY,
            transformPerspective: 1000,
          }}
          className="relative"
        >
          <div className="glass-panel glass-panel--tint p-5 sm:p-6">
            {/* Header — title + LIVE badge */}
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-600/30">
                  <Activity size={20} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-ink">{title}</p>
                  <p className="mt-0.5 text-[11px] text-muted">أداء الحملة</p>
                </div>
              </div>

              <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-600">
                {live && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                  </span>
                )}
                {growth}
              </span>
            </div>

            <p className="relative mt-3 text-xs leading-5 text-muted">{text}</p>

            {/* Chart bars + progress ring */}
            <div className="relative mt-5 flex items-end justify-between gap-4">
              <div aria-hidden className="flex h-20 shrink-0 items-end gap-1">
                {bars.slice(0, 7).map((height, i) => (
                  <motion.span
                    key={i}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 24,
                      delay: 0.4 + i * 0.05,
                    }}
                    style={{ height: `${clamp(height, 8, 100)}%` }}
                    className="w-1.5 origin-bottom rounded-full bg-linear-to-t from-primary-700 to-primary-400"
                  />
                ))}
              </div>

              <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center">
                <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r={ringRadius}
                    fill="none"
                    strokeWidth="6"
                    className="stroke-ink/[0.08] dark:stroke-white/10"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r={ringRadius}
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="stroke-primary-600"
                    strokeDasharray={ringLength}
                    initial={{ strokeDashoffset: ringLength }}
                    animate={{ strokeDashoffset: ringLength - (ringLength * ringValue) / 100 }}
                    transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
                  />
                </svg>
                <span className="absolute text-sm font-black text-ink">
                  {ringValue}%
                </span>
              </div>
            </div>

            {/* Likes / comments */}
            <div className="relative mt-5 grid grid-cols-2 gap-3">
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-black/[0.05] bg-white/50 py-2.5 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]">
                <Heart size={14} className="text-primary-600" />
                <span className="text-sm font-black tracking-tight text-ink">
                  {likes}
                </span>
                <span className="text-[10px] text-muted">إعجاب</span>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-black/[0.05] bg-white/50 py-2.5 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]">
                <MessageCircle size={14} className="text-primary-600" />
                <span className="text-sm font-black tracking-tight text-ink">
                  {comments}
                </span>
                <span className="text-[10px] text-muted">تعليق</span>
              </div>
            </div>
          </div>

          {/* Glare overlay (tilt only) */}
          {!isStatic && (
            <motion.div
              aria-hidden
              style={{ background: glare }}
              className="pointer-events-none absolute inset-0 rounded-[2rem]"
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
