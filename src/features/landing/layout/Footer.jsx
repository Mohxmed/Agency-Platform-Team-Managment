"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

import logo from "@/assets/identity/no2ta-logo-light.png";
import logoDark from "@/assets/identity/no2ta-logo.png";
import { Container } from "@/features/landing";

import { useSettings } from "@/contexts/SettingsContext";
import { FOOTER, SITE } from "@/constants/content";
/* =========================================================
   ANIMATION CONFIG
========================================================= */

const reveal = {
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

const stagger = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/* =========================================================
   MAIN FOOTER
========================================================= */

export default function Footer() {
  const footerRef = useRef(null);
  const { settings } = useSettings();

  const footerDescription = settings.content?.footer?.description || FOOTER.description;
  const copyright = settings.copyright || FOOTER.copyright.replace("{year}", new Date().getFullYear().toString());

  /* =======================================================
     MOUSE PARALLAX
  ======================================================= */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useSpring(mouseX, {
    stiffness: 40,
    damping: 20,
  });

  const glowY = useSpring(mouseY, {
    stiffness: 40,
    damping: 20,
  });

  const translateX = useTransform(glowX, [-0.5, 0.5], [-40, 40]);
  const translateY = useTransform(glowY, [-0.5, 0.5], [-30, 30]);

  const handleMouseMove = (event) => {
    if (!footerRef.current) return;

    const rect = footerRef.current.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;

    const y = (event.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const links = {
    company: FOOTER.columns[0].links.map((l) => l.label),
    services: FOOTER.columns[1].links.map((l) => l.label),
  };

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      ref={footerRef}
      dir="rtl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.12,
      }}
      className="
        group/footer
        relative
        w-full
        overflow-hidden
        border-t
        border-primary-500/10
        bg-white
        text-neutral-900
        dark:bg-background
        dark:text-neutral-100
      "
    >
      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      {/* Main atmosphere */}

      <motion.div
        style={{
          x: translateX,
          y: translateY,
        }}
        className="
          pointer-events-none
          absolute
          -top-[320px]
          left-1/2
          h-[700px]
          w-[1000px]
          -translate-x-1/2
          rounded-full
          bg-primary-500/[0.07]
          blur-[170px]
        "
      />

      {/* Right ambient */}

      <motion.div
        animate={{
          x: [0, 35, 0],
          y: [0, -25, 0],
          scale: [1, 1.1, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -right-[220px]
          top-[60px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-primary-600/[0.055]
          blur-[150px]
        "
      />

      {/* Left ambient */}

      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 1.08, 1],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -left-[250px]
          bottom-[50px]
          h-[450px]
          w-[450px]
          rounded-full
          bg-primary-500/[0.05]
          blur-[150px]
        "
      />

      {/* =====================================================
          GRID
      ====================================================== */}

      <motion.div
        animate={{
          backgroundPosition: ["0px 0px", "80px 80px"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(rgba(0,0,0,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.25)_1px,transparent_1px)]
          [background-size:80px_80px]
          [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]
        "
      />

      {/* =====================================================
          TOP GOLDEN LINE
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-px
          w-[65%]
          -translate-x-1/2
          overflow-hidden
          bg-gradient-to-r
          from-transparent
          via-primary-500/40
          to-transparent
        "
      >
        <motion.div
          animate={{
            x: ["-120%", "120%"],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
          className="
            h-full
            w-1/3
            bg-gradient-to-r
            from-transparent
            via-primary-400
            to-transparent
            shadow-[0_0_20px_rgba(234,179,8,0.8)]
          "
        />
      </div>

      {/* =====================================================
          FLOATING PARTICLES
      ====================================================== */}

      <FloatingParticle className="right-[13%] top-[22%]" delay={0} />

      <FloatingParticle className="right-[30%] top-[35%]" delay={1.2} />

      <FloatingParticle className="left-[15%] top-[30%]" delay={2} />

      <FloatingParticle className="left-[28%] bottom-[25%]" delay={0.8} />

      <FloatingParticle className="right-[42%] bottom-[18%]" delay={2.5} />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <Container className="relative z-10">
        {/* ===================================================
            MAIN FOOTER
        ==================================================== */}

        <motion.section
          variants={stagger}
          className="
            grid
            grid-cols-1
            gap-12
            py-16
            sm:py-20
            md:grid-cols-2
            lg:grid-cols-4
            lg:gap-14
          "
        >
          {/* =================================================
              BRAND
          ================================================== */}

          <motion.div variants={reveal} className="lg:col-span-1">
            {/* Logo */}

            <motion.div
              whileHover={{
                y: -5,
                scale: 1.02,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 18,
              }}
              className="
                group/logo
                relative
                inline-flex
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                border
                border-black/[0.05]
                bg-white/70
                px-4
                py-2
                shadow-[0_15px_40px_rgba(0,0,0,0.05)]
                backdrop-blur-xl
                dark:border-white/10
                dark:bg-white/5
              "
            >
              {/* Shine */}

              <motion.span
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  -left-full
                  w-1/2
                  skew-x-[-20deg]
                  bg-gradient-to-r
                  from-transparent
                  via-white/70
                  to-transparent
                "
                whileHover={{
                  left: "150%",
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeInOut",
                }}
              />

              <Image
                src={logo}
                alt="No2ta Logo"
                width={145}
                height={50}
                className="
                  relative
                  z-10
                  object-contain
                  transition-transform
                  duration-500
                  group-hover/logo:scale-[1.04]
                  dark:hidden
                "
              />

              <Image
                src={logoDark}
                alt="No2ta Logo"
                width={145}
                height={50}
                className="
                  relative
                  z-10
                  hidden
                  object-contain
                  transition-transform
                  duration-500
                  group-hover/logo:scale-[1.04]
                  dark:block
                "
              />
            </motion.div>

            {/* Accent */}

            <div className="mt-6 flex items-center gap-2">
              <motion.span
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: 40,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.25,
                }}
                className="
                  h-1
                  rounded-full
                  bg-gradient-to-r
                  from-primary-300
                  to-primary-700
                  shadow-[0_0_15px_rgba(234,179,8,0.20)]
                "
              />

              <span
                className="
                  text-[10px]
                  font-medium
                  tracking-[0.25em]
                  text-primary-600/60
                "
              >
                NO2TA
              </span>
            </div>

            {/* Description */}

            <p
              className="
                mt-6
                max-w-sm
                text-sm
                leading-8
                text-neutral-500
                dark:text-neutral-400
              "
            >
              {footerDescription}
            </p>
          </motion.div>

          {/* =================================================
              COMPANY
          ================================================== */}

          <motion.div variants={reveal}>
            <FooterColumn title={FOOTER.columns[0].title} items={links.company} />
          </motion.div>

          {/* =================================================
              SERVICES
          ================================================== */}

          <motion.div variants={reveal}>
            <FooterColumn title={FOOTER.columns[1].title} items={links.services} />
          </motion.div>

          {/* =================================================
              CONTACT
          ================================================== */}

          <motion.div variants={reveal}>
            <FooterTitle title="اوصلنا" />

            <div className="space-y-4">
              <ContactCard
                href="mailto:hello@nokta.com"
                icon={<Mail size={16} />}
              >
                hello@nokta.com
              </ContactCard>

              <ContactCard href="tel:+201000000000" icon={<Phone size={16} />}>
                +20 100 000 0000
              </ContactCard>

              <ContactCard icon={<MapPin size={16} />} href="#" disabled>
                طلخا، الدقهلية - مصر
              </ContactCard>
            </div>
          </motion.div>
        </motion.section>

        {/* ===================================================
            BOTTOM BAR
        ==================================================== */}

        <motion.div
          variants={reveal}
          className="
            relative
            border-t
            border-black/[0.06]
            py-6
            dark:border-white/10
          "
        >
          {/* Moving line */}

          <motion.div
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
            className="
              absolute
              right-0
              top-0
              h-px
              w-full
              origin-right
              bg-gradient-to-l
              from-primary-500/50
              via-primary-400/20
              to-transparent
            "
          />

          <div
            className="
              flex
              flex-col
              items-center
              justify-between
              gap-5
              md:flex-row
            "
          >
            {/* Copyright */}

            <motion.p
              whileHover={{
                x: -3,
              }}
              className="
                text-center
                text-xs
                text-neutral-400
                transition-colors
                hover:text-neutral-600
                md:text-right
                dark:text-neutral-500
                dark:hover:text-neutral-300
              "
            >
              {copyright}
            </motion.p>
          </div>
        </motion.div>
      </Container>

      {/* =====================================================
          BOTTOM FADE
      ====================================================== */}

      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-[100px]
          w-[60%]
          -translate-x-1/2
          rounded-full
          bg-primary-500/[0.06]
          blur-[80px]
        "
      />
    </motion.footer>
  );
}

/* =========================================================
   FOOTER TITLE
========================================================= */

function FooterTitle({ title }) {
  return (
    <motion.div
      whileHover={{
        x: -3,
      }}
      className="mb-6 flex items-center gap-3"
    >
      <span
        className="
          relative
          flex
          h-5
          w-5
          items-center
          justify-center
        "
      >
        {/* Core */}

        <motion.span
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="
            absolute
            h-2
            w-2
            rounded-full
            bg-primary-500
            shadow-[0_0_15px_rgba(234,179,8,0.30)]
          "
        />

        {/* Ring */}

        <motion.span
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="
            absolute
            h-5
            w-5
            rounded-full
            border
            border-primary-500/20
          "
        />
      </span>

      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{title}</h3>
    </motion.div>
  );
}

/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({ title, items }) {
  return (
    <div>
      <FooterTitle title={title} />

      <ul className="space-y-4">
        {items.map((item, index) => (
          <motion.li
            key={item}
            initial={{
              opacity: 0,
              x: 10,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
            }}
          >
            <a
              href="#"
              className="
                group
                relative
                inline-flex
                items-center
                gap-2
                text-sm
                text-neutral-500
                transition-all
                duration-300
                hover:text-primary-600
                dark:text-neutral-400
              "
            >
              <motion.span
                className="
                  h-px
                  bg-primary-500
                  shadow-[0_0_8px_rgba(234,179,8,0.25)]
                "
                initial={{
                  width: 0,
                }}
                whileHover={{
                  width: 12,
                }}
              />

              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                {item}
              </span>
            </a>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================
   CONTACT CARD
========================================================= */

function ContactCard({ children, icon, href = "#", disabled = false }) {
  return (
    <motion.a
      href={href}
      onClick={(e) => disabled && e.preventDefault()}
      whileHover={
        disabled
          ? {}
          : {
              y: -4,
              x: -3,
            }
      }
      whileTap={
        disabled
          ? {}
          : {
              scale: 0.98,
            }
      }
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 22,
      }}
      className="
        group
        relative
        flex
        items-center
        gap-3
        overflow-hidden
        rounded-2xl
        border
        border-black/[0.05]
        bg-white/70
        px-4
        py-3
        shadow-[0_8px_25px_rgba(0,0,0,0.025)]
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-primary-500/20
        hover:bg-primary-500/[0.03]
        hover:shadow-[0_15px_35px_rgba(234,179,8,0.08)]
        dark:border-white/10
        dark:bg-white/5
        dark:hover:border-primary-500/30
        dark:hover:bg-primary-500/10
      "
    >
      {/* Hover light */}

      <motion.span
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-full
          w-1/3
          skew-x-[-20deg]
          bg-gradient-to-r
          from-transparent
          via-white/70
          to-transparent
        "
        whileHover={{
          left: "140%",
        }}
        transition={{
          duration: 0.7,
        }}
      />

      <ContactIcon>{icon}</ContactIcon>

      <span className="relative z-10 text-xs text-neutral-500 transition-colors group-hover:text-primary-600 dark:text-neutral-400">
        {children}
      </span>
    </motion.a>
  );
}

/* =========================================================
   CONTACT ICON
========================================================= */

function ContactIcon({ children }) {
  return (
    <motion.span
      whileHover={{
        rotate: [0, -8, 8, 0],
        scale: 1.08,
      }}
      transition={{
        duration: 0.4,
      }}
      className="
        relative
        flex
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-xl
        border
        border-primary-500/10
        bg-primary-500/[0.05]
        text-primary-600/80
        transition-all
        duration-300
        group-hover:border-primary-500/20
        group-hover:bg-primary-500/10
        group-hover:text-primary-600
      "
    >
      {children}
    </motion.span>
  );
}

/* =========================================================
   FLOATING PARTICLE
========================================================= */

function FloatingParticle({ className, delay = 0 }) {
  return (
    <motion.span
      className={`
        pointer-events-none
        absolute
        h-1
        w-1
        rounded-full
        bg-primary-500/40
        shadow-[0_0_15px_rgba(234,179,8,0.25)]
        ${className}
      `}
      animate={{
        y: [0, -25, 0],
        x: [0, 12, 0],
        scale: [0.7, 1.4, 0.7],
        opacity: [0.15, 0.8, 0.15],
      }}
      transition={{
        duration: 4 + delay,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
