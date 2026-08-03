"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";

import logo from "@/assets/identity/logo-icon.png";
import SocialMediaLinks from "@/features/landing/components/SocialMediaLinks";
import { useSettings } from "@/contexts/SettingsContext";
import { SOCIAL_SECTION } from "@/constants/content";

/* =========================================================
   VARIANTS
========================================================= */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SocialMediaSection() {
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const { settings } = useSettings();

  const content = settings.content?.social || {};
  const socialTitle = content.title || SOCIAL_SECTION.title;
  const socialRedTitle = content.redTitle || SOCIAL_SECTION.redTitle;
  const socialDescription = content.description || SOCIAL_SECTION.description;
  const bottomText = content.bottomText || "كن جزءًا من مجتمع نقطة";

  /* =======================================================
     MOUSE PARALLAX
  ======================================================= */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [10, -10]),
    {
      stiffness: 120,
      damping: 18,
      mass: 0.5,
    }
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
    {
      stiffness: 120,
      damping: 18,
      mass: 0.5,
    }
  );

  const logoX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-12, 12]),
    {
      stiffness: 100,
      damping: 20,
    }
  );

  const logoY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-12, 12]),
    {
      stiffness: 100,
      damping: 20,
    }
  );

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHoveringLogo(false);
  };

  return (
    <section
      className="
        relative
        mx-auto
        flex
        min-h-[700px]
        w-full
        max-w-[1920px]
        items-center
        justify-center
        overflow-hidden
        px-6
        py-24
        text-center
        sm:min-h-[800px]
        sm:py-32
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main ambient glow */}

        <motion.div
          className="
            absolute
            left-1/2
            top-1/2
            h-[280px]
            w-[280px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-primary-600/15
            blur-[120px]
            sm:h-[450px]
            sm:w-[450px]
          "
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Large orbital glow */}

        <motion.div
          className="
            absolute
            left-1/2
            top-1/2
            h-[500px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-primary-600/[0.025]
          "
          animate={{
            scale: [0.95, 1.08, 0.95],
            rotate: [0, 180, 360],
          }}
          transition={{
            scale: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />

        {/* Secondary glow */}

        <motion.div
          className="
            absolute
            left-[18%]
            top-[25%]
            h-36
            w-36
            rounded-full
            bg-primary-400/10
            blur-[90px]
          "
          animate={{
            x: [0, 70, 0],
            y: [0, -45, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="
            absolute
            bottom-[20%]
            right-[18%]
            h-44
            w-44
            rounded-full
            bg-primary-700/10
            blur-[100px]
          "
          animate={{
            x: [0, -60, 0],
            y: [0, 35, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}

        <FloatingParticle
          className="left-[12%] top-[28%]"
          delay={0}
          size="small"
        />

        <FloatingParticle
          className="left-[24%] bottom-[23%]"
          delay={1.2}
          size="tiny"
        />

        <FloatingParticle
          className="right-[16%] top-[25%]"
          delay={2}
          size="small"
        />

        <FloatingParticle
          className="right-[25%] bottom-[22%]"
          delay={0.8}
          size="tiny"
        />

        <FloatingParticle
          className="left-[35%] top-[18%]"
          delay={1.7}
          size="tiny"
        />

        <FloatingParticle
          className="right-[35%] bottom-[15%]"
          delay={2.5}
          size="small"
        />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <motion.div
        className="relative z-10 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
      >
        {/* =================================================
            PREMIUM LOGO STAGE
        ================================================== */}

        <motion.div
          variants={itemVariants}
          className="
            relative
            flex
            h-[280px]
            w-[280px]
            items-center
            justify-center
            sm:h-[340px]
            sm:w-[340px]
          "
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* ===============================================
              OUTER ORBIT
          ================================================ */}

          <motion.div
            className="
              pointer-events-none
              absolute
              inset-[10px]
              rounded-full
              border
              border-primary-600/[0.08]
            "
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Orbit dot */}

            <motion.span
              className="
                absolute
                left-1/2
                top-0
                h-2
                w-2
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-primary-500
                shadow-[0_0_20px_rgba(0,0,0,0.15)]
              "
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>

          {/* ===============================================
              SECOND ORBIT
          ================================================ */}

          <motion.div
            className="
              pointer-events-none
              absolute
              inset-[32px]
              rounded-full
              border
              border-dashed
              border-primary-600/[0.10]
            "
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span
              className="
                absolute
                right-[12%]
                top-[10%]
                h-1.5
                w-1.5
                rounded-full
                bg-primary-400/60
                shadow-[0_0_15px_rgba(0,0,0,0.1)]
              "
            />
          </motion.div>

          {/* ===============================================
              THIRD ORBIT
          ================================================ */}

          <motion.div
            className="
              pointer-events-none
              absolute
              inset-[52px]
              rounded-full
              border
              border-primary-500/[0.05]
            "
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 34,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span
              className="
                absolute
                bottom-[5%]
                left-[20%]
                h-1
                w-1
                rounded-full
                bg-primary-600/50
              "
            />
          </motion.div>

          {/* ===============================================
              ROTATING LIGHT ARC
          ================================================ */}

          <motion.div
            className="
              pointer-events-none
              absolute
              -inset-1
              rounded-full
              bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,0,0,0.08)_55deg,transparent_100deg,transparent_360deg)]
              dark:bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.08)_55deg,transparent_100deg,transparent_360deg)]
            "
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* ===============================================
              INNER LIGHT
          ================================================ */}

          <motion.div
            className="
              pointer-events-none
              absolute
              inset-[65px]
              rounded-full
              bg-primary-600/10
              blur-[55px]
            "
            animate={{
              scale: [0.85, 1.2, 0.85],
              opacity: [0.25, 0.6, 0.25],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* ===============================================
              LOGO 3D CONTAINER
          ================================================ */}

          <motion.div
            style={{
              rotateX,
              rotateY,
              x: logoX,
              y: logoY,
              transformPerspective: 900,
            }}
            animate={{
              y: [0, -7, 0],
            }}
            transition={{
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            whileHover={{
              scale: 1.08,
              transition: {
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            onHoverStart={() => setIsHoveringLogo(true)}
            onHoverEnd={() => setIsHoveringLogo(false)}
            className="
              relative
              z-20
              flex
              cursor-pointer
              items-center
              justify-center
              rounded-full
            "
          >
            {/* Logo aura */}

            <motion.div
              className="
                absolute
                inset-[-20px]
                rounded-full
                bg-primary-600/15
                blur-2xl
              "
              animate={{
                scale: isHoveringLogo
                  ? [1, 1.25, 1]
                  : [0.9, 1.12, 0.9],
                opacity: isHoveringLogo
                  ? [0.45, 0.8, 0.45]
                  : [0.25, 0.5, 0.25],
              }}
              transition={{
                duration: isHoveringLogo ? 1.8 : 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Logo shadow platform */}

            <motion.div
              className="
                absolute
                bottom-[-18px]
                left-1/2
                h-8
                w-32
                -translate-x-1/2
                rounded-full
                bg-black/10
                blur-xl
              "
              animate={{
                scaleX: [1, 0.8, 1],
                opacity: [0.25, 0.12, 0.25],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Logo */}

            <Image
              src={logo}
              alt="No2ta Logo"
              width={210}
              priority
              className="
                relative
                z-10
                mx-auto
                object-contain
                drop-shadow-[0_25px_50px_rgba(0,0,0,0.16)]
                sm:w-[240px]
              "
            />

            {/* Hover shine */}

            <motion.div
              className="
                pointer-events-none
                absolute
                inset-0
                z-20
                rounded-full
                bg-gradient-to-tr
                from-transparent
                via-white/20
                to-transparent
              "
              initial={{
                opacity: 0,
                x: "-100%",
              }}
              animate={
                isHoveringLogo
                  ? {
                      opacity: [0, 1, 0],
                      x: ["-100%", "100%"],
                    }
                  : {
                      opacity: 0,
                    }
              }
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>

        {/* =================================================
            TITLE
        ================================================== */}

        <motion.div
          variants={itemVariants}
          className="mt-8"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <motion.span
              className="h-px bg-primary-600/40"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{
                width: 42,
                opacity: 1,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
            />

            <motion.span
              className="
                text-[10px]
                font-bold
                tracking-[0.3em]
                text-primary-600
              "
              initial={{
                opacity: 0,
                letterSpacing: "0.1em",
              }}
              whileInView={{
                opacity: 1,
                letterSpacing: "0.3em",
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
              }}
            >
              {socialTitle}
              </motion.span>
            <motion.span
              className="h-px bg-primary-600/40"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{
                width: 42,
                opacity: 1,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
            />
          </div>

          <motion.h3
            className="
              text-3xl
              font-black
              tracking-tight
              text-black
              sm:text-4xl
              lg:text-5xl
              dark:text-white
            "
            whileInView={{
              opacity: [0, 1],
              y: [15, 0],
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
                        {socialRedTitle}
            </motion.h3>
        </motion.div>

        {/* =================================================
            DESCRIPTION
        ================================================== */}

        <motion.p
          variants={itemVariants}
          className="
            mt-6
            max-w-xl
            text-sm
            leading-8
            text-black/45
            sm:text-base
            dark:text-white/55
          "
        >
          {socialDescription}
        </motion.p>

        {/* =================================================
            SOCIAL MEDIA
        ================================================== */}

        <motion.div
          variants={itemVariants}
          className="mt-10"
        >
          <motion.div
            whileHover={{
              y: -6,
              scale: 1.015,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-black/[0.04]
              bg-white/60
              px-5
              py-4
              shadow-[0_25px_80px_rgba(0,0,0,0.07)]
              backdrop-blur-xl
              sm:px-7
              sm:py-5
              dark:border-white/10
              dark:bg-white/5
            "
          >
            {/* Card shine */}

            <motion.div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-r
                from-transparent
                via-white/40
                to-transparent
              "
              animate={{
                x: ["-120%", "120%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10">
              <SocialMediaLinks
                Facebook={settings.social?.facebook || ""}
                Instagram={settings.social?.instagram || ""}
                Twitter={settings.social?.twitter || ""}
                LinkedIn={settings.social?.linkedin || ""}
                Youtube={settings.social?.youtube || ""}
                TikTok={settings.social?.tiktok || ""}
                Whatsapp={settings.whatsapp || ""}
                size="lg"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* =================================================
            BOTTOM TEXT
        ================================================== */}

        <motion.div
          variants={itemVariants}
          className="
            mt-8
            flex
            items-center
            gap-2
            text-[11px]
            font-medium
            text-black/25
            dark:text-white/40
          "
        >
          <motion.span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-primary-600
            "
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.4, 1, 0.4],
              boxShadow: [
                "0 0 0 rgba(0,0,0,0)",
                "0 0 12px rgba(0,0,0,0.15)",
                "0 0 0 rgba(0,0,0,0)",
              ],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
          />

          <span>{bottomText}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* =========================================================
   FLOATING PARTICLE
========================================================= */

function FloatingParticle({
  className,
  delay = 0,
  size = "small",
}) {
  const sizeClass =
    size === "tiny"
      ? "h-1 w-1"
      : "h-1.5 w-1.5";

  return (
    <motion.span
      className={`
        absolute
        ${sizeClass}
        rounded-full
        bg-primary-500/30
        shadow-[0_0_18px_rgba(0,0,0,0.08)]
        ${className}
      `}
      animate={{
        y: [0, -28, 0],
        x: [0, 12, 0],
        opacity: [0.15, 0.8, 0.15],
        scale: [0.7, 1.5, 0.7],
      }}
      transition={{
        duration: 4.5 + delay,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
