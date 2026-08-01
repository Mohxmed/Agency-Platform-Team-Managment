"use client";

import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export default function MaintenancePage() {
  const { settings } = useSettings();
  const title = settings.system?.maintenanceTitle || "الموقع في الصيانة حاليًا";
  const message =
    settings.system?.maintenanceMessage || "نرجع قريبًا! جاري العمل على تحسين الموقع وتجربتك.";

  return (
    <main dir="rtl" className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#080706]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-600/[0.09] blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/[0.07] blur-[70px]" />
      </div>

      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border border-primary-500/[0.08]"
            animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-6 rounded-full border border-dashed border-primary-500/[0.12]"
            animate={{ rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/[0.06] bg-white/[0.03] text-primary-400 backdrop-blur-md"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wrench size={32} />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-8 text-3xl font-black tracking-tight text-white sm:text-4xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 max-w-md text-sm leading-7 text-white/45"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center gap-2"
        >
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-1.5 w-1.5 rounded-full bg-primary-500"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.25, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.18, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </div>
    </main>
  );
}
