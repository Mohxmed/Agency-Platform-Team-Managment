"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
  },
  visible: {
    opacity: 1,
    y: 0,
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
        {/* Main ambient glow (static gradient — no filter) */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[280px]
            w-[280px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            [background:radial-gradient(circle_at_center,rgba(217,4,41,0.15),transparent_62%)]
            sm:h-[450px]
            sm:w-[450px]
          "
        />

        {/* Large orbital glow */}

        <div
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
          style={{
            animation:
              "pf-spin 45s linear infinite, pf-scale 8s ease-in-out infinite",
          }}
        />

        {/* Secondary glow (static gradient) */}

        <div
          className="
            absolute
            left-[18%]
            top-[25%]
            h-36
            w-36
            rounded-full
            [background:radial-gradient(circle_at_center,rgba(217,4,41,0.10),transparent_62%)]
          "
        />

        <div
          className="
            absolute
            bottom-[20%]
            right-[18%]
            h-44
            w-44
            rounded-full
            [background:radial-gradient(circle_at_center,rgba(190,18,60,0.10),transparent_62%)]
          "
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
        >
          {/* ===============================================
              OUTER ORBIT
          ================================================ */}

          <div
            className="
              pointer-events-none
              absolute
              inset-[10px]
              rounded-full
              border
              border-primary-600/[0.08]
            "
            style={{ animation: "pf-spin 22s linear infinite" }}
          >
            {/* Orbit dot */}

            <span
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
              style={{ animation: "pf-scale 2s ease-in-out infinite" }}
            />
          </div>

          {/* ===============================================
              SECOND ORBIT
          ================================================ */}

          <div
            className="
              pointer-events-none
              absolute
              inset-[32px]
              rounded-full
              border
              border-dashed
              border-primary-600/[0.10]
            "
            style={{ animation: "pf-spin-rev 28s linear infinite" }}
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
          </div>

          {/* ===============================================
              THIRD ORBIT
          ================================================ */}

          <div
            className="
              pointer-events-none
              absolute
              inset-[52px]
              rounded-full
              border
              border-primary-500/[0.05]
            "
            style={{ animation: "pf-spin 34s linear infinite" }}
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
          </div>

          {/* ===============================================
              ROTATING LIGHT ARC
          ================================================ */}

          <div
            className="
              anim-spin-fast
              pointer-events-none
              absolute
              -inset-1
              rounded-full
              bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,0,0,0.08)_55deg,transparent_100deg,transparent_360deg)]
              dark:bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.08)_55deg,transparent_100deg,transparent_360deg)]
            "
          />

          {/* ===============================================
              INNER LIGHT
          ================================================ */}

          <div
            className="
              pointer-events-none
              absolute
              inset-[65px]
              rounded-full
              [background:radial-gradient(circle_at_center,rgba(217,4,41,0.10),transparent_62%)]
            "
          />

          {/* ===============================================
              LOGO 3D CONTAINER
          ================================================ */}

          <motion.div
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
            {/* Logo aura (static gradient — no filter) */}

            <div
              className="
                absolute
                inset-[-20px]
                rounded-full
                [background:radial-gradient(circle_at_center,rgba(217,4,41,0.15),transparent_62%)]
              "
            />

            {/* Logo shadow platform */}

            <div
              className="
                absolute
                bottom-[-18px]
                left-1/2
                h-8
                w-32
                -translate-x-1/2
                rounded-full
                [background:radial-gradient(ellipse_at_center,rgba(0,0,0,0.12),transparent_70%)]
              "
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
              bg-white/85
              px-5
              py-4
              shadow-[0_25px_80px_rgba(0,0,0,0.07)]
              sm:px-7
              sm:py-5
              dark:border-white/10
              dark:bg-white/5
            "
          >
            {/* Card shine */}

            <div
              className="
                anim-shine-slower
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-r
                from-transparent
                via-white/40
                to-transparent
              "
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
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-primary-600
            "
            style={{ animation: "pf-pulse 1.8s ease-in-out infinite" }}
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
    <span
      className={`
        anim-particle
        absolute
        ${sizeClass}
        rounded-full
        bg-primary-500/30
        shadow-[0_0_18px_rgba(0,0,0,0.08)]
        ${className}
      `}
      style={{
        animationDuration: `${4.5 + delay}s`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}
