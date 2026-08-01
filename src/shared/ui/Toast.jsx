"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const variants = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    title: "تم بنجاح",
  },

  error: {
    icon: XCircle,
    iconClass: "text-red-500",
    iconBg: "bg-red-500/10",
    title: "حدث خطأ",
  },

  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    iconBg: "bg-amber-500/10",
    title: "تنبيه",
  },

  info: {
    icon: Info,
    iconClass: "text-blue-500",
    iconBg: "bg-blue-500/10",
    title: "معلومة",
  },
};

export default function Toast({
  show,
  type = "success",
  title,
  message,
  onClose,
  duration = 3000,
}) {
  const config = variants[type] || variants.success;
  const Icon = config.icon;

  useEffect(() => {
    if (!show || !duration) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
            scale: 0.96,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -15,
            scale: 0.96,
            filter: "blur(6px)",
          }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          dir="rtl"
          className="
            fixed
            left-5
            bottom-5
            z-[9999]
            w-[calc(100%-2.5rem)]
            max-w-sm
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-black/[0.07]
              bg-white
              p-4
              shadow-[0_20px_60px_rgba(0,0,0,0.14)]
            "
          >
            {/* Progress */}

            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{
                duration: duration / 1000,
                ease: "linear",
              }}
              className="
                absolute
                bottom-0
                right-0
                h-[2px]
                w-full
                origin-right
                bg-primary-600
              "
            />

            <div className="flex items-start gap-3">
              {/* Icon */}

              <div
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ${config.iconBg}
                `}
              >
                <Icon
                  className={`
                    h-5
                    w-5
                    ${config.iconClass}
                  `}
                />
              </div>

              {/* Content */}

              <div className="min-w-0 flex-1">
                <p
                  className="
                    text-sm
                    font-black
                    text-neutral-950
                  "
                >
                  {title || config.title}
                </p>

                {message && (
                  <p
                    className="
                      mt-1
                      text-xs
                      font-medium
                      leading-5
                      text-black/45
                    "
                  >
                    {message}
                  </p>
                )}
              </div>

              {/* Close */}

              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-black/25
                  transition
                  hover:bg-black/[0.04]
                  hover:text-black/60
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
