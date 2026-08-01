"use client";

import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";

import IconButton from "../ui/buttons/IconButtons";

export default function Modal({ isOpen, setIsOpen, children }) {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            overflow-hidden
            p-4
            sm:p-6
          "
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          onMouseDown={handleClose}
        >
          {/* =====================================================
              BACKDROP
          ====================================================== */}

          <motion.div
            className="
              absolute
              inset-0
              bg-black/60
              backdrop-blur-md
            "
            initial={{
              opacity: 0,
              backdropFilter: "blur(0px)",
            }}
            animate={{
              opacity: 1,
              backdropFilter: "blur(8px)",
            }}
            exit={{
              opacity: 0,
              backdropFilter: "blur(0px)",
            }}
            transition={{
              duration: 0.35,
            }}
          />

          {/* =====================================================
              AMBIENT GLOW
          ====================================================== */}

          <motion.div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[500px]
              w-[500px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-primary-600/10
              blur-[120px]
            "
            initial={{
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.7,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* =====================================================
              MODAL
          ====================================================== */}

          <motion.div
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
            initial={{
              opacity: 0,
              y: 35,
              scale: 0.94,
              filter: "blur(8px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
              filter: "blur(6px)",
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              z-10
              flex
              w-full
              max-w-3xl
              flex-col
              overflow-hidden
              rounded-[1.75rem]
              border
              border-black/[0.06]
              bg-white
              shadow-[0_30px_100px_rgba(0,0,0,0.25)]
              max-h-[90dvh]
              dark:border-white/10
              dark:bg-card
            "
          >
            {/* =================================================
                TOP GLOW
            ================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-48
                w-48
                rounded-full
                bg-primary-600/10
                blur-[80px]
              "
            />

            {/* =================================================
                CLOSE BUTTON
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
                rotate: -20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              transition={{
                delay: 0.15,
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="
                absolute
                right-4
                top-4
                z-30
              "
            >
              <IconButton
                variant="ghost"
                rounded="full"
                onClick={handleClose}
                aria-label="إغلاق"
                className="
                  border
                  border-black/[0.06]
                  bg-white/80
                  p-3
                  text-black/50
                  shadow-sm
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:rotate-90
                  hover:border-black/10
                  hover:bg-black
                  hover:text-white
                  hover:shadow-lg
                  dark:border-white/10
                  dark:bg-white/10
                  dark:text-white/70
                  dark:hover:bg-white
                  dark:hover:text-black
                "
              >
                <XIcon size={20} strokeWidth={2} />
              </IconButton>
            </motion.div>

            {/* =================================================
                CONTENT
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.08,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                min-h-0
                overflow-y-auto
                px-5
                pb-6
                pt-16
                sm:px-7
                sm:pb-7
                sm:pt-16
              "
            >
              {children}
            </motion.div>

            {/* =================================================
                BOTTOM ACCENT
            ================================================== */}

            <motion.div
              className="
                absolute
                bottom-0
                left-1/2
                h-px
                -translate-x-1/2
                bg-primary-600
              "
              initial={{
                width: 0,
                opacity: 0,
              }}
              animate={{
                width: "35%",
                opacity: 0.35,
              }}
              exit={{
                width: 0,
                opacity: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.6,
                ease: "easeOut",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
