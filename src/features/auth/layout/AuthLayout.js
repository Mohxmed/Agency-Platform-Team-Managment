"use client";

import { motion } from "framer-motion";

export function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <main
      id="main-content"
      className="
        relative
        flex
        min-h-[calc(100vh-64px)]
        max-h-[1080px]
        w-full
        flex-row-reverse
        overflow-hidden
        bg-background
      "
    >
      {/* =====================================================
          AMBIENT BACKGROUND (static gradients — no filter)
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          -top-40
          h-[500px]
          w-[500px]
          rounded-full
          [background:radial-gradient(circle_at_center,rgba(217,4,41,0.10),transparent_62%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-48
          -left-40
          h-[500px]
          w-[500px]
          rounded-full
          [background:radial-gradient(circle_at_center,rgba(190,18,60,0.10),transparent_62%)]
        "
      />

      {/* =====================================================
          BRANDING PANEL
          LEFT → RIGHT
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          x: "-12%",
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="
          relative
          hidden
          w-1/2
          flex-col
          justify-between
          overflow-hidden
          bg-primary-600
          p-12
          text-white
          md:flex
        "
      >
        {/* =================================================
            PANEL GLOWS (static gradients)
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-[500px]
            w-[500px]
            rounded-full
            [background:radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_62%)]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            left-10
            h-[400px]
            w-[400px]
            rounded-full
            [background:radial-gradient(circle_at_center,rgba(0,0,0,0.14),transparent_62%)]
          "
        />

        {/* =================================================
            DECORATIVE RINGS
        ================================================== */}

        <motion.div
          className="
            pointer-events-none
            absolute
            -right-24
            top-1/2
            h-72
            w-72
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.08]
          "
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="
            pointer-events-none
            absolute
            -right-12
            top-1/2
            h-48
            w-48
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.06]
          "
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* =================================================
            TOP LABEL
        ================================================== */}

        <motion.span
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.45,
            duration: 0.6,
          }}
          className="
            relative
            z-10
            font-display
            text-sm
            text-white/70
          "
        >
          صلاحيات الدخول حالياً للمشرف والفريق فقط
        </motion.span>

        {/* =================================================
            BRAND CONTENT
        ================================================== */}

        <div className="relative z-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.25,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p
              className="
                font-display
                text-6xl
                font-bold
                leading-[1.15]
                tracking-tight
                lg:text-7xl
              "
            >
              فريق نقطة،
            </p>

            <p
              className="
                mt-5
                max-w-md
                text-sm
                leading-7
                text-white/65
              "
            >
              مكان واحد — للمدرسين والمصممين والمبدعين كلهم
            </p>
          </motion.div>

          {/* Animated Accent Line */}

          <motion.div
            initial={{
              width: 0,
              opacity: 0,
            }}
            animate={{
              width: 80,
              opacity: 1,
            }}
            transition={{
              delay: 0.85,
              duration: 0.7,
              ease: "easeOut",
            }}
            className="
              mt-8
              h-px
              bg-white/30
            "
          />
        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        <motion.span
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.9,
            duration: 0.6,
          }}
          className="
            relative
            z-10
            text-left
            text-xs
            text-white/45
          "
        >
          نقطة © {new Date().getFullYear()}
        </motion.span>
      </motion.div>

      {/* =====================================================
          FORM PANEL
      ====================================================== */}

      <div
        className="
          relative
          flex
          w-full
          flex-1
          items-center
          justify-center
          overflow-hidden
          p-6
          md:w-1/2
          md:p-10
        "
      >
        {/* Mobile Glow (static gradient) */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-96
            w-96
            rounded-full
            [background:radial-gradient(circle_at_center,rgba(217,4,41,0.10),transparent_62%)]
            md:hidden
          "
        />

        {/* =================================================
            LOGIN CARD
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: 50,
            y: 15,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }}
          transition={{
            delay: 0.2,
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            z-10
            w-full
            max-w-lg
          "
        >
          <motion.div
            whileHover={{
              y: -2,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="
              glass-card
              relative
              overflow-hidden
              rounded-[2rem]
              p-7
              sm:p-9
            "
          >
            {/* Card Glow (static gradient) */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-48
                w-48
                rounded-full
                [background:radial-gradient(circle_at_center,rgba(217,4,41,0.10),transparent_62%)]
              "
            />

            <div className="relative z-10">
              {/* =================================================
                  MOBILE BRAND
              ================================================== */}

              <motion.span
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                  duration: 0.5,
                }}
                className="
                  mb-8
                  block
                  font-display
                  text-base
                  font-semibold
                  text-hi
                  md:hidden
                "
              >
                نقطة
              </motion.span>

              {/* =================================================
                  EYEBROW
              ================================================== */}

              {eyebrow ? (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.4,
                    duration: 0.5,
                  }}
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-primary-600
                    dark:text-primary-400
                  "
                >
                  {eyebrow}
                </motion.p>
              ) : null}

              {/* =================================================
                  TITLE
              ================================================== */}

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.48,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  font-display
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-hi
                  sm:text-3xl
                "
              >
                {title}
              </motion.h1>

              {/* =================================================
                  SUBTITLE
              ================================================== */}

              {subtitle ? (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.55,
                    duration: 0.55,
                  }}
                  className="
                    mt-2
                    text-sm
                    leading-7
                    text-lo
                  "
                >
                  {subtitle}
                </motion.p>
              ) : null}

              {/* =================================================
                  FORM
              ================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.62,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-8"
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
