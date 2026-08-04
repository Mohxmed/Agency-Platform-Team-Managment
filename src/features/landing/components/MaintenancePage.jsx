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
          <div
            className="absolute inset-0 rounded-full border border-primary-500/[0.08]"
            style={{ animation: "pf-pulse 2.2s ease-in-out infinite" }}
          />
          <div
            className="absolute inset-6 rounded-full border border-dashed border-primary-500/[0.12]"
            style={{ animation: "pf-spin 7s linear infinite" }}
          />
          <div
            className="anim-float relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/[0.06] bg-white/[0.03] text-primary-400 backdrop-blur-md"
          >
            <Wrench size={32} />
          </div>
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
            <span
              key={dot}
              className="h-1.5 w-1.5 rounded-full bg-primary-500"
              style={{
                animation: "pf-pulse 1.2s ease-in-out infinite",
                animationDelay: `${dot * 0.18}s`,
              }}
            />
          ))}
        </motion.div>
      </div>
    </main>
  );
}
