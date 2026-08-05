"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import logoIcon from "@/assets/identity/logo-icon.png";

const MIN_DISPLAY = 1200;
const MAX_DISPLAY = 2600;

/* Lightweight branded boot loader for the landing page.
   Shows the logo icon with a soft ring animation, then fades out
   once the DOM is parsed and the minimum display time has passed —
   without waiting for the full window load (heavy JS/images). */
export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let ready = false;
    let minPassed = false;
    let done = false;

    const tryHide = () => {
      if (done) return;
      if (ready && minPassed) {
        done = true;
        setVisible(false);
      }
    };

    const onReady = () => {
      ready = true;
      tryHide();
    };

    if (document.readyState !== "loading") {
      ready = true;
    } else {
      document.addEventListener("DOMContentLoaded", onReady);
    }

    const minTimer = setTimeout(() => {
      minPassed = true;
      tryHide();
    }, MIN_DISPLAY);

    const maxTimer = setTimeout(() => {
      done = true;
      setVisible(false);
    }, MAX_DISPLAY);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      document.removeEventListener("DOMContentLoaded", onReady);
    };
  }, []);

  // Lock scroll only while the loader is on screen. Keyed on `visible`
  // so the lock is always released as soon as the loader fades out —
  // PageLoader itself stays mounted, so an unmount cleanup would leak.
  useEffect(() => {
    if (!visible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(circle_at_center,rgba(232,33,37,0.06),transparent_62%)]" />
            <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(circle_at_center,rgba(232,33,37,0.04),transparent_62%)]" />
          </div>

          <div className="relative flex flex-col items-center">
            <div className="relative flex h-44 w-44 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border border-primary-600/10"
                style={{ animation: "pf-pulse 2.2s ease-in-out infinite" }}
              />
              <div
                className="absolute inset-5 rounded-full border border-primary-600/15"
                style={{ animation: "pf-spin 5s linear infinite" }}
              />
              <div
                className="absolute inset-8 rounded-full border border-dashed border-primary-600/20"
                style={{ animation: "pf-spin-rev 7s linear infinite" }}
              />
              <div
                className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                style={{ animation: "pf-scale 2s ease-in-out infinite" }}
              >
                <Image
                  src={logoIcon}
                  alt="نقطة"
                  width={64}
                  height={68}
                  className="h-16 w-auto object-contain"
                  priority
                />
              </div>
              <span
                className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary-600 shadow-[0_0_20px_rgba(232,33,37,0.45)]"
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
              <h1 className="text-xl font-black tracking-[0.22em] text-ink">نقطة</h1>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-xs font-medium text-muted">جاري التحميل</span>
                <span className="flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1 w-1 rounded-full bg-primary-600"
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
              className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-ink/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div
                className="h-full w-1/2 rounded-full bg-primary-600"
                style={{ animation: "pf-shine 1.4s ease-in-out infinite" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
