"use client";

import { motion } from "framer-motion";
import { heroVariants, reducedMotionVariants } from "./motionVariants";
import { useReducedMotion } from "framer-motion";

const GLASS_CARD_STYLE = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 1px 0 rgba(255,255,255,0.2) inset",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
};

const GLASS_CARD_HOVER = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)",
  border: "1px solid rgba(255,255,255,0.28)",
  boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.15) inset, 0 2px 0 rgba(255,255,255,0.25) inset",
};

export default function FloatingVisual() {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : heroVariants;

  return (
    <motion.div
      className="relative pointer-events-none"
      initial="hidden"
      animate="visible"
      variants={variants.visual}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={variants.visualFloat}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        className="relative"
      >
        <div
          className="relative w-full aspect-[4/3] max-w-[520px] mx-auto"
          style={{
            borderRadius: "28px",
            ...GLASS_CARD_STYLE,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "28px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(ellipse at 30% 20%, rgba(232,33,37,0.08) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          <div className="absolute inset-0 p-6" style={{ borderRadius: "28px" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/60 shadow-[0_0_8px_rgba(232,33,37,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm font-medium">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">Overview</span>
                <span className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/5">Analytics</span>
                <span className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/5">Growth</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="relative p-4 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                    }}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/50 text-xs font-medium tracking-wide uppercase">Metric {i}</span>
                      <div className="w-2 h-2 rounded-full bg-primary-400/60" />
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight">{[2.4, 1.8, 3.1][i - 1]}<span className="text-xl font-normal text-white/40">M</span></div>
                    <div className="flex items-center gap-1 text-green-400 text-xs mt-2">
                      <span>+12.5%</span>
                      <span className="text-white/30">vs last month</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="relative h-32 rounded-2xl overflow-hidden" style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 128" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(232,33,37,0.6)" />
                      <stop offset="100%" stopColor="rgba(232,33,37,0)" />
                    </linearGradient>
                    <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(232,33,37,0.8)" />
                      <stop offset="100%" stopColor="rgba(255,89,92,0.9)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20,100 Q60,60 100,75 Q140,90 180,55 Q220,20 260,45 Q300,70 340,40 Q380,10 400,25"
                    fill="none"
                    stroke="url(#chartStroke)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: "drop-shadow(0 4px 12px rgba(232,33,37,0.3))" }}
                  />
                  <path
                    d="M20,100 Q60,60 100,75 Q140,90 180,55 Q220,20 260,45 Q300,70 340,40 Q380,10 400,25 L400,128 L20,128 Z"
                    fill="url(#chartGradient)"
                    opacity="0.4"
                  />
                  <circle cx="260" cy="45" r="5" fill="#e82125" style={{ filter: "drop-shadow(0 0 8px rgba(232,33,37,0.8))" }} />
                  <circle cx="340" cy="40" r="4" fill="#ff595c" style={{ filter: "drop-shadow(0 0 6px rgba(255,89,92,0.6))" }} />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  className="relative p-4 rounded-2xl flex items-center justify-between"
                  style={{
                    background: "linear-gradient(135deg, rgba(232,33,37,0.15) 0%, rgba(232,33,37,0.05) 100%)",
                    border: "1px solid rgba(232,33,37,0.2)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div>
                    <span className="text-white/60 text-xs font-medium tracking-wide uppercase">Total Reach</span>
                    <div className="text-2xl font-bold text-white tracking-tight mt-1">1.2M+</div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{
                    background: "linear-gradient(135deg, rgba(232,33,37,0.3) 0%, rgba(232,33,37,0.1) 100%)",
                    border: "1px solid rgba(232,33,37,0.3)",
                  }}>
                    <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </motion.div>

                <motion.div
                  className="relative p-4 rounded-2xl flex items-center justify-between"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="text-right">
                    <span className="text-white/60 text-xs font-medium tracking-wide uppercase">Engagement</span>
                    <div className="text-2xl font-bold text-white tracking-tight mt-1">8.4%</div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}>
                    <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{
                  background: "linear-gradient(135deg, rgba(232,33,37,0.25) 0%, rgba(232,33,37,0.1) 100%)",
                  border: "1px solid rgba(232,33,37,0.3)",
                }}>
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Live Campaign</div>
                  <div className="text-white/40 text-xs">Running for 14 days</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <span className="relative flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live
                </span>
                <span className="px-3 py-1.5 rounded-xl text-white/70 border border-white/10 bg-white/5 backdrop-blur-sm">View Details</span>
              </div>
            </div>
          </div>

          <div className="absolute -inset-4 rounded-[36px] pointer-events-none" style={{
            background: "linear-gradient(135deg, rgba(232,33,37,0.08) 0%, transparent 40%, rgba(255,89,92,0.05) 100%)",
            filter: "blur(60px)",
            zIndex: -1,
            opacity: 0.5,
          }} />

          <div className="absolute -inset-8 rounded-[40px] pointer-events-none" style={{
            background: "radial-gradient(ellipse at 30% 20%, rgba(232,33,37,0.06) 0%, transparent 60%)",
            filter: "blur(80px)",
            zIndex: -1,
            opacity: 0.3,
          }} />
        </div>

        <motion.div
          className="absolute -bottom-8 -left-8 w-24 h-24 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(232,33,37,0.15) 0%, rgba(232,33,37,0.03) 100%)",
            border: "1px solid rgba(232,33,37,0.2)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            filter: "blur(40px)",
            zIndex: -1,
            opacity: 0.6,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
            rotate: [0, 3, 0],
            transition: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <motion.div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,89,92,0.12) 0%, rgba(255,89,92,0.02) 100%)",
            border: "1px solid rgba(255,89,92,0.15)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            filter: "blur(40px)",
            zIndex: -1,
            opacity: 0.5,
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, -2, 0],
            transition: { duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 },
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            filter: "blur(30px)",
            zIndex: -1,
            opacity: 0.4,
          }}
          animate={{
            x: [-20, 20, -20],
            y: [-15, 15, -15],
            opacity: [0.2, 0.5, 0.2],
            transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </motion.div>
    </motion.div>
  );
}