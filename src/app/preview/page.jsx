"use client";

import { motion } from "framer-motion";

export default function LoadingPreview() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#fafafa]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/[0.045] blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/[0.035] blur-[60px]" />
      </div>
      <div className="relative flex flex-col items-center">
        <div className="relative flex h-44 w-44 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border border-red-600/[0.08]"
            animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-5 rounded-full border border-red-600/[0.12]"
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-8 rounded-full border border-dashed border-red-600/[0.14]"
            animate={{ rotate: -360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-3xl font-black tracking-[0.22em] text-gray-900"
            >
              N
            </motion.div>
          </motion.div>
          <motion.span
            className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.45)]"
            animate={{ rotate: 360 }}
            style={{ transformOrigin: "50% 88px" }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
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
            <motion.span className="flex gap-1">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-1 w-1 rounded-full bg-red-600"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.25, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: dot * 0.15, ease: "easeInOut" }}
                />
              ))}
            </motion.span>
          </div>
        </motion.div>
        <motion.div
          className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-black/[0.05]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full w-1/2 rounded-full bg-red-600"
            animate={{ x: ["-100%", "220%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
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
