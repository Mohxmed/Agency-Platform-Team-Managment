"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, MessageCircle, TrendingUp } from "lucide-react";

const float = (delay = 0) => ({
  y: [0, -12, 0],
  transition: { duration: 7, repeat: Infinity, ease: "easeInOut", delay },
});

export default function ContentShowcase({ className = "" }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const floatAnim = (delay: number) => (prefersReducedMotion ? {} : float(delay));

  return (
    <div className={`relative h-[420px] sm:h-[460px] ${className}`} aria-hidden="true">
      {/* Dark card — a client result, sits furthest back */}
      <motion.div
        animate={floatAnim(0)}
        className="absolute top-2 end-6 w-[210px] rounded-2xl p-4 shadow-[0_12px_32px_-8px_rgba(17,24,39,0.16)]"
        style={{ background: "#131927", transform: "rotate(6deg)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-full"
            style={{ background: "linear-gradient(135deg,#e82125,#ff595c)" }}
          />
          <span className="text-white text-xs font-semibold">حملة تسويقية</span>
        </div>
        <p className="text-[11px] leading-relaxed text-secondary-400">
          وصلنا لأكتر من 200 ألف متابع مستهدف في أسبوعين بس.
        </p>
        <div className="flex items-center gap-3 mt-3 text-[11px] text-secondary-300">
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" /> 2.4K
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" /> 318
          </span>
        </div>
      </motion.div>

      {/* Main card — the featured piece, sits in front */}
      <motion.div
        animate={floatAnim(0.6)}
        className="absolute top-20 end-40 w-[230px] rounded-2xl border p-3.5 bg-white shadow-[0_12px_32px_-8px_rgba(17,24,39,0.14)]"
        style={{ borderColor: "var(--color-border)", transform: "rotate(-4deg)" }}
      >
        <div
          className="w-full h-36 rounded-xl mb-3"
          style={{ background: "linear-gradient(135deg,#ff595c 0%,#e82125 60%,#b2171a 100%)" }}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-ink">محتوى أسبوعي</span>
          <span className="text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
            +24%
          </span>
        </div>
        <p className="text-[11px] text-muted mt-1">تفاعل أعلى من المتوسط بـ 3 أضعاف</p>
      </motion.div>

      {/* Stat chip — small callout, floats lowest and closest */}
      <motion.div
        animate={floatAnim(1.1)}
        className="absolute bottom-6 end-56 w-[140px] rounded-2xl p-4 text-white shadow-[0_12px_32px_-8px_rgba(232,33,37,0.35)]"
        style={{ background: "var(--color-primary-600)", transform: "rotate(3deg)" }}
      >
        <div className="flex items-center gap-1 text-[11px] opacity-90 mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>الشهر ده</span>
        </div>
        <div className="text-xl font-extrabold">+150K</div>
        <div className="text-[11px] opacity-90">متابع جديد</div>
      </motion.div>
    </div>
  );
}
