"use client";

import { createElement, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowLeft,
  Play,
  Heart,
  MessageCircle,
  TrendingUp,
  BarChart2,
} from "lucide-react";

import { Container } from "@/features/landing";
import ScrollIndicator from "@/shared/ui/ScrollIndicator";
import HighlightText from "@/shared/ui/typography/HighlightText";

import { SITE, HERO } from "@/constants/content";
import { useSettings } from "@/contexts/SettingsContext";
import { resolveIcon } from "@/shared/ui/icons/resolveIcon";

import logoIcon from "@/assets/identity/logo-icon.png";
import roket from "@/assets/svg/rocket.webp";
import Link from "next/link";


/* =========================================================
   CONFIG
========================================================= */

const HERO_CONFIG = {
  stats: [
    {
      value: "+150",
      label: "عميل راضي",
    },
    {
      value: "+500",
      label: "حملة ناجحة",
    },
    {
      value: "4.9",
      label: "تقييم العملاء",
    },
  ],

  showcase: {
    campaign: {
      title: "حملة تسويقية",
      text: "وصلنا لأكثر من 200 ألف متابع مستهدف خلال أسبوعين.",
      likes: "2.4K",
      comments: "318",
    },

    analytics: {
      title: "محتوى أسبوعي",
      growth: "+24%",
      text: "تفاعل أعلى من المتوسط بثلاث أضعاف",
    },

    growth: {
      value: "+150K",
      label: "متابع جديد",
      period: "هذا الشهر",
    },

    score: 86,
    scoreLabel: "مؤشر النمو",
    bars: [42, 58, 50, 72, 64, 88, 96],
    barsLabel: "الوصول الأسبوعي",
    barTrend: "+18%",
  },

  rocket: {
    float: 6,
  },
};


/* =========================================================
   MOTION SYSTEM
========================================================= */

const easing = [
  0.16,
  1,
  0.3,
  1,
];


const heroMotion = {
  container: {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  },


  item: {
    hidden: {
      opacity: 0,
      y: 24,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.7,
        ease: easing,
      },
    },
  },
};



const reducedMotion = {
  container: {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
    },
  },


  item: {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
    },
  },
};



/* =========================================================
   BACKGROUND
========================================================= */

const PARTICLES = [
  { left: "8%", top: "22%", size: 3, duration: 9, delay: 0 },
  { left: "16%", top: "68%", size: 2, duration: 11, delay: 1.2 },
  { left: "26%", top: "14%", size: 2, duration: 8, delay: 0.6 },
  { left: "42%", top: "78%", size: 3, duration: 12, delay: 2.1 },
  { left: "58%", top: "30%", size: 2, duration: 10, delay: 0.9 },
  { left: "71%", top: "82%", size: 2, duration: 9, delay: 1.8 },
  { left: "84%", top: "18%", size: 3, duration: 13, delay: 0.4 },
  { left: "90%", top: "58%", size: 2, duration: 10, delay: 2.6 },
];

function HeroBackground() {

  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, {
    stiffness: 45,
    damping: 22,
    mass: 0.9,
  });

  const sy = useSpring(my, {
    stiffness: 45,
    damping: 22,
    mass: 0.9,
  });

  useEffect(() => {
    if (reduceMotion) return undefined;

    function handleMouseMove(event) {
      mx.set((event.clientX / window.innerWidth - 0.5) * 2);
      my.set((event.clientY / window.innerHeight - 0.5) * 2);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mx, my, reduceMotion]);

  const orbRedX = useTransform(sx, (v) => v * -28);
  const orbRedY = useTransform(sy, (v) => v * -20);
  const orbVioletX = useTransform(sx, (v) => v * 24);
  const orbVioletY = useTransform(sy, (v) => v * 16);
  const orbAmberX = useTransform(sx, (v) => v * 14);
  const orbAmberY = useTransform(sy, (v) => v * -10);
  const beamX = useTransform(sx, (v) => v * 12);
  const gridX = useTransform(sx, (v) => v * -8);
  const gridY = useTransform(sy, (v) => v * -6);

  const spotX = useTransform(sx, (v) => `${50 + v * 18}%`);
  const spotY = useTransform(sy, (v) => `${50 + v * 18}%`);

  const spotBackground =
    useMotionTemplate`radial-gradient(circle 320px at ${spotX} ${spotY}, rgba(255,255,255,0.08), transparent 70%)`;

  return (

    <div
      className="
        absolute inset-0
        -z-10
        overflow-hidden
        pointer-events-none
      "
    >


      {/* Base wash */}

      <div
        className="
          hero-bg-base
          absolute
          inset-0
        "
      />


      {/* Aurora orb — red (parallax) */}

      <motion.div

        style={{
          x: reduceMotion ? 0 : orbRedX,
          y: reduceMotion ? 0 : orbRedY,
        }}

        className="
          hero-orb-red
          absolute
          -top-32
          -start-40
          h-[34rem]
          w-[34rem]
          rounded-full
        "
      />


      {/* Aurora orb — ink (black, parallax) */}

      <motion.div

        style={{
          x: reduceMotion ? 0 : orbVioletX,
          y: reduceMotion ? 0 : orbVioletY,
        }}

        className="
          hero-orb-ink
          absolute
          -bottom-40
          -end-40
          h-[36rem]
          w-[36rem]
          rounded-full
        "
      />


      {/* Aurora orb — deep crimson (parallax) */}

      <motion.div

        style={{
          x: reduceMotion ? 0 : orbAmberX,
          y: reduceMotion ? 0 : orbAmberY,
        }}

        className="
          hero-orb-deep
          absolute
          top-[40%]
          start-[38%]
          h-[26rem]
          w-[26rem]
          rounded-full
        "
      />


      {/* Cinematic beams */}

      <motion.div

        style={{
          x: reduceMotion ? 0 : beamX,
        }}

        className="
          hero-beam-a
          absolute
          top-[-10%]
          h-[60%]
          w-[45%]
          rotate-[18deg]
        "
      />

      <div
        className="
          hero-beam-b
          absolute
          bottom-[-14%]
          start-[8%]
          h-[55%]
          w-[38%]
          -rotate-[14deg]
        "
      />


      {/* Dot grid (parallax) */}

      <motion.div

        style={{
          x: reduceMotion ? 0 : gridX,
          y: reduceMotion ? 0 : gridY,
        }}

        className="
          hero-bg-grid
          absolute
          inset-0
        "
      />


      {/* Cursor spotlight */}

      <motion.div
        className="
          absolute
          inset-0
        "
        style={{
          background: reduceMotion ? "none" : spotBackground,
        }}
      />


      {/* Rocket glow */}

      <div
        className="
          hero-rocket-glow
          absolute
          top-[6%]
          end-[6%]
          h-72
          w-72
          rounded-full
        "
      />


      {/* Rocket — in-place float */}

      <motion.div

        initial={{
          opacity: 0,
        }}

        animate={{
          opacity: 0.14,
        }}

        transition={{
          duration: 2,
        }}

        className="
          absolute
          top-[2%]
          end-[2%]
          w-44
          h-44
          md:w-56
          md:h-56
          lg:w-64
          lg:h-64
        "
      >


        <div
          className={`relative w-full h-full ${reduceMotion ? "" : "anim-rocket"}`}
        >

          <Image
            src={roket}
            alt=""
            fill
            className="object-contain"
          />

        </div>


      </motion.div>


      {/* Floating particles */}

      {!reduceMotion && PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="
            anim-particle
            absolute
            rounded-full
            bg-primary-500
          "
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}


      {/* Film grain */}

      <div
        className="
          hero-bg-noise
          absolute
          inset-0
        "
      />


      {/* Vignette */}

      <div
        className="
          hero-bg-vignette
          absolute
          inset-0
        "
      />


    </div>
  );
}

/* =========================================================
   GLASS SHOWCASE
========================================================= */

function GlassCard({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/40
        bg-white/85
        shadow-[0_30px_80px_rgba(0,0,0,0.08)]
        ${className}
      `}
    >
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-white/70
          via-transparent
          to-transparent
          pointer-events-none
        "
      />

      {children}
    </div>
  );
}



/* =========================================================
   SHOWCASE GLOW ORBS
========================================================= */

function ShowcaseGlow() {
  return (
    <>
      <div
        className="absolute -start-16 top-24 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(232,33,37,.34) 0%,rgba(232,33,37,.14) 40%,transparent 72%)",
        }}
      />

      <div
        className="absolute -end-10 bottom-16 h-96 w-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(17,24,39,.26) 0%,rgba(17,24,39,.1) 42%,transparent 74%)",
        }}
      />
    </>
  );
}

/* =========================================================
   TILT RESULTS PANEL (Interactive 3D)
========================================================= */

function TiltResultsPanel() {

  const reduceMotion = useReducedMotion();

  const { settings } = useSettings();
  const heroContent = settings.content?.hero || {};
  const showcaseDefaults = HERO_CONFIG.showcase;

  const analytics = {
    title: heroContent.analytics?.title || showcaseDefaults.analytics.title,
    growth: heroContent.analytics?.growth || showcaseDefaults.analytics.growth,
    text: heroContent.analytics?.text || showcaseDefaults.analytics.text,
  };

  const campaign = {
    likes: heroContent.campaign?.likes || showcaseDefaults.campaign.likes,
    comments: heroContent.campaign?.comments || showcaseDefaults.campaign.comments,
  };

  const score = showcaseDefaults.score;
  const bars = showcaseDefaults.bars;

  const R = 46;
  const C = 2 * Math.PI * R;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const springConfig = {
    stiffness: 140,
    damping: 18,
    mass: 0.6,
  };

  const rotateX = useSpring(
    useTransform(my, [0, 1], [9, -9]),
    springConfig,
  );

  const rotateY = useSpring(
    useTransform(mx, [0, 1], [-9, 9]),
    springConfig,
  );

  const glareX = useTransform(mx, [0, 1], ["15%", "85%"]);
  const glareY = useTransform(my, [0, 1], ["15%", "85%"]);

  const glareBackground =
    useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.22), transparent 55%)`;

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width);
    my.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.9,
        ease: easing,
        delay: 0.2,
      }}
      className="
        relative
        w-[340px]
        [perspective:1200px]
      "
    >
      <motion.div
        onMouseMove={reduceMotion ? undefined : handleMouseMove}
        onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
        whileHover={{
          scale: 1.02,
        }}
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="
          relative
          will-change-transform
        "
      >
        <GlassCard className="relative z-10 p-6">
          {/* Glare */}
          <motion.div
            className="
              pointer-events-none
              absolute
              inset-0
              z-20
            "
            style={{
              background: glareBackground,
            }}
          />

          {/* Header */}
          <div
            className="
              relative
              flex
              items-center
              justify-between
              gap-3
              z-10
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-primary-400
                  to-primary-700
                  text-white
                  shadow-[0_10px_25px_rgba(232,33,37,.25)]
                "
              >
                <BarChart2 size={20} />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-black
                    text-ink
                  "
                >
                  {analytics.title}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    font-bold
                    text-muted
                  "
                >
                  لوحة الأداء اللحظية
                </p>
              </div>
            </div>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-red-500/10
                px-2.5
                py-1
                text-[10px]
                font-black
                text-red-500
              "
            >
              <span
                className="
                  relative
                  flex
                  h-1.5
                  w-1.5
                "
              >
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-red-500
                    opacity-75
                  "
                />
                <span
                  className="
                    relative
                    inline-flex
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-red-500
                  "
                />
              </span>
              LIVE
            </span>
          </div>

          {/* Ring */}
          <div
            className="
              relative
              mx-auto
              mt-6
              flex
              h-[132px]
              w-[132px]
              items-center
              justify-center
              z-10
            "
          >
            <svg
              width="132"
              height="132"
              viewBox="0 0 120 120"
              className="-rotate-90"
            >
              <defs>
                <linearGradient
                  id="ringGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#ff6b6e" />
                  <stop offset="100%" stopColor="#e82125" />
                </linearGradient>
              </defs>

              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="9"
              />

              <motion.circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{
                  strokeDashoffset: C,
                }}
                animate={{
                  strokeDashoffset: C * (1 - score / 100),
                }}
                transition={{
                  duration: 1.6,
                  ease: easing,
                  delay: 0.6,
                }}
              />
            </svg>

            <div
              className="
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <p
                className="
                  text-2xl
                  font-black
                  text-ink
                "
              >
                {analytics.growth}
              </p>

              <p
                className="
                  text-[10px]
                  font-bold
                  text-muted
                "
              >
                {showcaseDefaults.scoreLabel}
              </p>
            </div>
          </div>

          <p
            className="
              relative
              z-10
              mx-auto
              mt-4
              max-w-[240px]
              text-center
              text-xs
              leading-relaxed
              text-muted
            "
          >
            {analytics.text}
          </p>

          {/* Weekly bars */}
          <div
            className="
              relative
              z-10
              mt-6
              rounded-2xl
              border
              border-ink/[0.05]
              bg-white/40
              p-4
            "
          >
            <div
              className="
                mb-3
                flex
                items-center
                justify-between
              "
            >
              <p
                className="
                  text-[11px]
                  font-bold
                  text-ink
                "
              >
                {showcaseDefaults.barsLabel}
              </p>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-green-500/10
                  px-2
                  py-0.5
                  text-[10px]
                  font-black
                  text-green-600
                "
              >
                <TrendingUp size={12} />
                {showcaseDefaults.barTrend}
              </span>
            </div>

            <div
              className="
                flex
                h-16
                items-end
                gap-1.5
              "
            >
              {bars.map((height, index) => (
                <motion.span
                  key={index}
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: `${height}%`,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.9,
                    ease: easing,
                    delay: 0.8 + index * 0.07,
                  }}
                  className="
                    flex-1
                    rounded-full
                    bg-gradient-to-t
                    from-primary-600/50
                    to-primary-400
                  "
                />
              ))}
            </div>
          </div>

          {/* Footer stats */}
          <div
            className="
              relative
              z-10
              mt-5
              flex
              items-center
              justify-between
              border-t
              border-ink/[0.05]
              pt-4
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                font-bold
                text-ink/70
              "
            >
              <Heart size={14} className="text-rose-500" />
              {campaign.likes}
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                font-bold
                text-ink/70
              "
            >
              <MessageCircle size={14} className="text-sky-500" />
              {campaign.comments}
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-primary-600/10
                px-2.5
                py-1
                text-[10px]
                font-black
                text-primary-600
              "
            >
              <TrendingUp size={12} />
              {analytics.growth}
            </span>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   SHOWCASE CONTENT
========================================================= */

function GlassShowcase() {

  const { settings } = useSettings();
  const heroContent = settings.content?.hero || {};
  const showcaseDefaults = HERO_CONFIG.showcase;

  const campaign = {
    title: heroContent.campaign?.title || showcaseDefaults.campaign.title,
    text: heroContent.campaign?.text || showcaseDefaults.campaign.text,
  };

  const growth = {
    value: heroContent.growth?.value || showcaseDefaults.growth.value,
    label: heroContent.growth?.label || showcaseDefaults.growth.label,
    period: heroContent.growth?.period || showcaseDefaults.growth.period,
  };

  return (

    <div
      className="
        relative
        w-full
        min-h-[560px]
        hidden
        lg:block
      "
    >

      <ShowcaseGlow />

      {/* Center interactive panel */}

      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
        "
      >
        <TiltResultsPanel />
      </div>

      {/* Dark social chip */}

      <motion.div

        initial={{
          opacity: 0,
          y: 40,
          scale: 0.9,
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}

        transition={{
          duration: 0.8,
          ease: easing,
          delay: 0.5,
        }}

        className="
          absolute
          top-4
          start-0
          z-10
        "
      >

        <div
          className="anim-float w-[230px] rotate-[-5deg]"
        >

        <div
          className="
            rounded-[24px]
            bg-[#121826]
            text-white
            p-4
            shadow-[0_35px_80px_rgba(0,0,0,.2)]
          "
        >

          <div
            className="
              flex
              items-center
              gap-2.5
              mb-3
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white/10
                p-1.5
              "
            >

              <Image
                src={logoIcon}
                alt=""
                className="h-6 w-6"
              />

            </div>

            <span
              className="
                text-xs
                font-bold
              "
            >
              {campaign.title}
            </span>

          </div>

          <p
            className="
              text-[11px]
              leading-relaxed
              text-white/70
            "
          >
            {campaign.text}
          </p>

        </div>

        </div>

      </motion.div>

      {/* Growth badge */}

      <motion.div

        initial={{
          opacity: 0,
          y: 40,
          scale: 0.9,
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}

        transition={{
          duration: 0.8,
          ease: easing,
          delay: 0.7,
        }}

        className="
          absolute
          bottom-8
          end-0
          z-10
        "
      >

        <div
          className="anim-float-slow rotate-[3deg]"
          style={{ animationDelay: "1s" }}
        >

        <div
          className="
            rounded-[24px]
            px-6
            py-4
            text-white
            shadow-[0_25px_70px_rgba(232,33,37,.3)]
          "

          style={{
            background:
              "linear-gradient(135deg,#e82125,#b51418)"
          }}
        >

          <div
            className="
              text-[10px]
              opacity-80
              mb-1
            "
          >
            {growth.period}
          </div>

          <div
            className="
              text-2xl
              font-black
            "
          >
            {growth.value}
          </div>

          <div
            className="
              text-[10px]
              opacity-90
            "
          >
            {growth.label}
          </div>

        </div>

        </div>

      </motion.div>

    </div>

  );

}
/* =========================================================
   EYEBROW
========================================================= */

function Eyebrow({ text, variants }) {

  return (

    <motion.div
      variants={variants.item}

      className="
        flex
        items-center
        gap-3
        mb-6
        text-sm
        font-semibold
        text-muted
      "
    >

      <span
        className="
          w-8
          h-[2px]
          rounded-full
          bg-primary-600
        "
      />

      {text}

    </motion.div>

  );

}



/* =========================================================
   STATS
========================================================= */

function HeroStats({
  stats,
  variants,
}) {

  const colsClass =
    stats.length >= 4
      ? "grid-cols-2 md:grid-cols-4"
      : stats.length === 3
        ? "grid-cols-3"
        : stats.length === 2
          ? "grid-cols-2"
          : "grid-cols-1";

  return (

    <motion.div

      variants={variants.item}

      className={`
        grid
        ${colsClass}
        gap-5
        w-full
        mt-10
        pt-8
        border-t
      `}

      style={{
        borderColor:
        "var(--color-border)"
      }}

    >

      {
        stats.map((item)=> (

          <div
            key={item.label}
            className="
              text-center
              lg:text-start
            "
          >

            <div
              className="
                text-2xl
                sm:text-3xl
                font-black
                text-ink
              "
            >
              {item.value}
            </div>


            <div
              className="
                text-xs
                sm:text-sm
                text-muted
                mt-1
              "
            >
              {item.label}
            </div>


          </div>


        ))
      }


    </motion.div>

  );

}





/* =========================================================
   ACTIONS
========================================================= */


function HeroActions(){

  const {
    settings
  } = useSettings();

  const hero =
    settings.content?.hero
    || {};


  const primary =
    hero.ctaPrimary
    ||
    HERO.ctaPrimary;

  const primaryLink =
    hero.ctaPrimaryLink
    ||
    "/contact";

  const primaryIcon =
    createElement(
      resolveIcon(hero.ctaPrimaryIcon, ArrowLeft),
      {
        size: 18,
        className:
          "transition-transform duration-300 group-hover:-translate-x-1",
      },
    );


  const secondary =
    hero.ctaSecondary
    ||
    HERO.ctaSecondary;

  const secondaryLink =
    hero.ctaSecondaryLink
    ||
    "/portfolio";

  const secondaryIcon =
    createElement(
      resolveIcon(hero.ctaSecondaryIcon, Play),
      { size: 17 },
    );



  return (

    <div
      className="
        flex
        flex-col
        sm:flex-row
        gap-4
        w-full
        sm:w-auto
      "
    >


      <Link href={primaryLink}

        className="
          group
          flex
          items-center
          justify-center
          gap-3
          rounded-2xl
          px-8
          py-4
          font-bold
          text-white
          transition-all
          duration-300
          hover:-translate-y-1
          active:translate-y-0
        "

        style={{
          background:
          "var(--color-primary-600)",

          boxShadow:
          "0 20px 40px rgba(232,33,37,.25)"
        }}

      >

        {primary}


        {primaryIcon}


      </Link>

      <Link href={secondaryLink}

        className="
          flex
          items-center
          justify-center
          gap-3
          rounded-2xl
          px-8
          py-4
          font-bold
          text-ink
          border
          bg-white/25
          transition-all
          duration-300
          hover:bg-white/35
        "

        style={{
          borderColor:
          "var(--color-border)"
        }}

      >

        {secondaryIcon}

        {secondary}


      </Link>


    </div>


  );

}




/* =========================================================
   HERO CONTENT
========================================================= */


function HeroContent(){


  const reduceMotion =
    useReducedMotion();


  const variants =
    reduceMotion
    ? reducedMotion
    : heroMotion;



  const {
    settings
  } = useSettings();



  const siteName =
    settings.siteName
    ||
    SITE.name;


  const description =
    settings.description
    ||
    SITE.description;



  const badge =
    settings.content?.hero?.badge
    ||
    HERO.badge;

  const titlePrefix =
    settings.content?.hero?.titlePrefix
    ||
    "ومن";

  const titleHighlight =
    settings.content?.hero?.titleHighlight
    ||
    "أول السطر،";

  const titleSuffix =
    settings.content?.hero?.titleSuffix
    ||
    "هنبدأ حكايات جديدة..";


  const stats =
    settings.stats?.length
    ? settings.stats
    : HERO_CONFIG.stats;



  return (

    <motion.div

      variants={variants.container}

      initial="hidden"

      animate="visible"


      className="
        flex
        flex-col
        items-center
        text-center

        lg:items-start
        lg:text-start

        max-w-xl
        w-full
      "

    >



      <Eyebrow
        text={badge}
        variants={variants}
      />





      <motion.h1

        variants={variants.item}

        className="
          font-black
          tracking-tight
          leading-[1.15]
          text-ink
        "

        style={{
          fontSize:
          "clamp(2.2rem,5vw,4rem)"
        }}

      >

        <span
          className="
            text-primary-600
          "
        >
          {siteName}
        </span>


        {" "}
        {titlePrefix}
        {" "}


        <HighlightText>
          {titleHighlight}
        </HighlightText>


        <br/>


        <span
          className="
            text-ink/90
          "
        >
          {titleSuffix}
        </span>



      </motion.h1>





      <motion.p

        variants={variants.item}

        className="
          mt-6
          max-w-lg
          text-muted
          text-base
          sm:text-lg
          leading-relaxed
        "

      >

        {description}


      </motion.p>





      <motion.div

        variants={variants.item}

        className="
          mt-8
        "

      >

        <HeroActions/>


      </motion.div>





      <HeroStats

        stats={
          stats
        }

        variants={variants}

      />



    </motion.div>

  );

}
/* =========================================================
   MOBILE SHOWCASE
========================================================= */

function MobileShowcase() {

  const { settings } = useSettings();
  const heroContent = settings.content?.hero || {};
  const showcaseDefaults = HERO_CONFIG.showcase;

  const campaign = {
    title: heroContent.campaign?.title || showcaseDefaults.campaign.title,
    text: heroContent.campaign?.text || showcaseDefaults.campaign.text,
    likes: heroContent.campaign?.likes || showcaseDefaults.campaign.likes,
    comments: heroContent.campaign?.comments || showcaseDefaults.campaign.comments,
  };

  const analytics = {
    title: heroContent.analytics?.title || showcaseDefaults.analytics.title,
    growth: heroContent.analytics?.growth || showcaseDefaults.analytics.growth,
    text: heroContent.analytics?.text || showcaseDefaults.analytics.text,
  };

  const growth = {
    value: heroContent.growth?.value || showcaseDefaults.growth.value,
    label: heroContent.growth?.label || showcaseDefaults.growth.label,
    period: heroContent.growth?.period || showcaseDefaults.growth.period,
  };


  return (

    <div
      className="
        lg:hidden
        grid
        grid-cols-3
        gap-3
        w-full
      "
    >


      {/* Social */}

      <div
        className="
          rounded-3xl
          bg-[#121826]
          p-4
          text-white
        "
      >

        <Image
          src={logoIcon}
          alt=""
          className="
            w-7
            h-7
            mb-3
          "
        />


        <p
          className="
            text-[11px]
            leading-relaxed
            text-white/70
            line-clamp-3
          "
        >
          {campaign.text}
        </p>


        <div
          className="
            flex
            gap-2
            mt-3
            text-[10px]
            text-white/50
          "
        >

          <span>
            ♥ {campaign.likes}
          </span>


          <span>
            ◯ {campaign.comments}
          </span>

        </div>


      </div>





      {/* Analytics */}

      <div
        className="
          rounded-3xl
          border
          bg-white/80
          p-4
        "

        style={{
          borderColor:
          "var(--color-border)"
        }}

      >


        <div

          className="
            h-16
            rounded-2xl
            mb-3
          "

          style={{
            background:
            "linear-gradient(135deg,#ff6b6e,#e82125)"
          }}

        />


        <p
          className="
            text-xs
            font-bold
          "
        >

          {analytics.growth}

        </p>


        <p
          className="
            text-[10px]
            text-muted
          "
        >
          {analytics.title}
        </p>


      </div>






      {/* Growth */}

      <div

        className="
          rounded-3xl
          p-4
          text-white
        "

        style={{
          background:
          "var(--color-primary-600)"
        }}

      >

        <TrendingUp
          size={16}
          className="mb-3"
        />


        <p
          className="
            text-xl
            font-black
          "
        >

          {growth.value}

        </p>


        <p
          className="
            text-[10px]
            opacity-80
          "
        >

          {growth.label}

        </p>


      </div>


    </div>


  );

}



/* =========================================================
   HERO SECTION
========================================================= */


export default function HeroSection(){


  return (

    <section

      id="hero"

      className="
        relative
        isolate
        flex
        items-center
        min-h-[calc(100svh-64px)]
        overflow-hidden
        py-12
        sm:py-20
      "

      aria-labelledby="hero-heading"

    >



      <HeroBackground/>





      <Container

        className="
          relative
          z-10
          w-full
        "

      >



        <div

          className="
            grid

            grid-cols-1

            lg:grid-cols-[1fr_.9fr]

            items-center

            gap-12
            lg:gap-20

          "

        >



          {/* Content */}

          <HeroContent/>




          {/* Desktop */}

          <GlassShowcase/>




        </div>





        {/* Mobile */}

        <div
          className="
            mt-10
          "
        >

          <MobileShowcase/>


        </div>





        {/* Scroll */}

        <motion.div

          initial={{
            opacity:0,
            y:20,
          }}

          animate={{
            opacity:1,
            y:0,
          }}

          transition={{
            delay:.7
          }}

          className="
            hidden
            sm:flex
            justify-center
            mt-14
          "

        >

          <ScrollIndicator
            className="
              w-10
              h-16
            "
          />


        </motion.div>



      </Container>



    </section>


  );

}