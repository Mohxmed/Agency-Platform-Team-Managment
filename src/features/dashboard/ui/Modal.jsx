"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, FolderPlus, Pencil } from "lucide-react";

export default function Modal({ open, onClose, title, children, footer }) {
  /* =========================================================
     ESCAPE
  ========================================================= */

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/60
            p-3
            backdrop-blur-md
            sm:p-5
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose?.();
            }
          }}
        >
          {/* =================================================
              MODAL
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 15,
              scale: 0.97,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseDown={(event) => event.stopPropagation()}
            className="
              relative
              flex
              max-h-[92vh]
              w-full
              max-w-3xl
              flex-col
              overflow-hidden
              rounded-[1.5rem]
              border
              border-ink/[0.06]
              bg-card
              shadow-[0_30px_100px_rgba(0,0,0,0.22)]
              sm:rounded-[1.75rem]
            "
          >
            {/* =================================================
                HEADER
            ================================================== */}

            <div
              className="
                relative
                shrink-0
                overflow-hidden
                border-b
                border-ink/[0.06]
                bg-card
                px-5
                py-5
                sm:px-7
                sm:py-6
              "
            >
              {/* Decorative glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-16
                  h-32
                  w-32
                  rounded-full
                  bg-primary/10
                  blur-3xl
                "
              />

              <div className="relative flex items-center justify-between gap-4">
                {/* Title */}

                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary/10
                      text-primary
                      ring-1
                      ring-primary/10
                    "
                  >
                    {title?.includes("تعديل") ? (
                      <Pencil className="h-5 w-5" />
                    ) : (
                      <FolderPlus className="h-5 w-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2
                      className="
                        truncate
                        text-base
                        font-bold
                        tracking-tight
                        text-ink
                        sm:text-lg
                      "
                    >
                      {title}
                    </h2>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        leading-5
                        text-ink/60
                      "
                    >
                      {title?.includes("تعديل")
                        ? "عدّل بيانات المشروع واحفظ التغييرات"
                        : "أضف مشروعًا جديدًا إلى محفظة الأعمال"}
                    </p>
                  </div>
                </div>

                {/* Close */}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="إغلاق"
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-ink/[0.06]
                    bg-ink/[0.02]
                    text-ink/60
                    transition-all
                    duration-200
                    hover:border-danger/20
                    hover:bg-danger/10
                    hover:text-danger
                    active:scale-95
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* =================================================
                BODY
            ================================================== */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                bg-neutral-50/60
                dark:bg-ink/[0.03]
                px-4
                py-5
                sm:px-7
                sm:py-6
              "
            >
              <div
                className="
                  rounded-2xl
                  border
                  border-ink/[0.05]
                  bg-card
                  p-4
                  sm:p-6
                "
              >
                {children}
              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            {footer && (
              <div
                className="
                  shrink-0
                  border-t
                  border-ink/[0.06]
                  bg-card
                  px-4
                  py-4
                  sm:px-7
                  sm:py-5
                "
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
