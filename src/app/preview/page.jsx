"use client";

import { motion } from "framer-motion";

export default function LoadingPreview() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#fafafa]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(circle_at_center,rgba(220,38,38,0.045),transparent_62%)]" />
        <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(circle_at_center,rgba(220,38,38,0.035),transparent_62%)]" />
      </div>
      <div className="relative flex flex-col items-center">
        <div className="relative flex h-44 w-44 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border border-red-600/[0.08]"
            style={{ animation: "pf-pulse 2.2s ease-in-out infinite" }}
          />
          <div
            className="absolute inset-5 rounded-full border border-red-600/[0.12]"
            style={{ animation: "pf-spin 5s linear infinite" }}
          />
          <div
            className="absolute inset-8 rounded-full border border-dashed border-red-600/[0.14]"
            style={{ animation: "pf-spin-rev 7s linear infinite" }}
          />
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="text-3xl font-black tracking-[0.22em] text-gray-900"
              style={{ animation: "pf-scale 2s ease-in-out infinite" }}
            >
              N
            </div>
          </div>
          <span
            className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.45)]"
            style={{
              animation: "pf-spin 2.8s linear infinite",
              transformOrigin: "50% 88px",
            }}
          />
        </div>
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          <h1 className="text-xl font-black tracking-[0.22em] text-gray-900">NO2TA</h1>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-xs font-medium text-gray-400">جاري التحميل</span>
            <span className="flex gap-1">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-1 w-1 rounded-full bg-red-600"
                  style={{
                    animation: "pf-pulse 1s ease-in-out infinite",
                    animationDelay: `${dot * 0.15}s`,
                  }}
                />
              ))}
            </span>
          </div>
        </motion.div>
        <motion.div
          className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-black/[0.05]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="h-full w-1/2 rounded-full bg-red-600"
            style={{ animation: "pf-shine 1.4s ease-in-out infinite" }}
          />
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold tracking-[0.18em] text-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        NOKTA • Media Agency
      </motion.div>
    </main>
  );
}
