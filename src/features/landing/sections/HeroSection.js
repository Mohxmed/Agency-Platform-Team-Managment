"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Play, Heart, MessageCircle, TrendingUp } from "lucide-react";

import { Container } from "@/features/landing";
import ScrollIndicator from "@/shared/ui/ScrollIndicator";
import HighlightText from "@/shared/ui/typography/HighlightText";
import { SITE, HERO } from "@/constants/content";
import { useSettings } from "@/contexts/SettingsContext";

import logoIcon from "@/assets/identity/logo-icon.png";
import roket from "@/assets/svg/roket.svg";

/* ============================================================================
   HERO SECTION — "نقطة" landing hero
   ----------------------------------------------------------------------------
   Single-file, config-driven. Everything a content editor is likely to touch
   (copy, stats, showcase cards, rocket flight path, timings) lives in the
   CONFIG block below — the JSX underneath should rarely need edits.

   Structure of this file:
     1. CONFIG        – content, numbers, card copy, animation tuning
     2. VARIANTS       – framer-motion variants shared by the section
     3. Background      – watermark, dot grid, spotlight, animated rocket
     4. Eyebrow / Stats  – small presentational pieces
     5. CTAButtons       – primary + secondary actions
     6. ContentShowcase  – mobile compact row + desktop floating cards
     7. HeroContent      – headline, description, CTAs, stats
     8. HeroSection      – default export, composes everything above
============================================================================ */

/* ----------------------------------------------------------------------
   1. CONFIG — edit copy, numbers and timings here, not in the JSX below
---------------------------------------------------------------------- */
const CONFIG = {
  // Trust-building numbers under the CTAs.
  // TODO: replace with real numbers once available, or move this array to
  // src/constants/content.js as `HERO_STATS` and import it from there.
  stats: [
    { value: "+150", label: "عميل راضي" },
    { value: "+500", label: "حملة ناجحة" },
    { value: "4.9", label: "تقييم العملاء" },
  ],

  // The three showcase cards (dark result card / main content card / stat chip).
  // Copy lives here so it can be swapped for real campaign data later.
  showcase: {
    dark: {
      title: "حملة تسويقية",
      caption: "وصلنا لأكتر من 200 ألف متابع مستهدف في أسبوعين بس.",
      likes: "2.4K",
      comments: "318",
    },
    main: {
      title: "محتوى أسبوعي",
      growth: "+24%",
      caption: "تفاعل أعلى من المتوسط بـ 3 أضعاف",
    },
    chip: {
      period: "الشهر ده",
      value: "+150K",
      label: "متابع جديد",
    },
  },

  // Rocket flight path — percentage-based keyframes so it scales with any
  // section height. Add/remove points in `top`/`left`/`rotate` together
  // (same length, same order) to change the route.
  rocket: {
    top: ["72%", "18%", "40%", "72%"],
    left: ["6%", "48%", "82%", "6%"],
    rotate: [-18, 22, -8, -18],
    times: [0, 0.4, 0.72, 1],
    durationSeconds: 26,
    bobDurationSeconds: 2.4,
  },
};

/* ----------------------------------------------------------------------
   2. VARIANTS — shared entrance animation for the text column
---------------------------------------------------------------------- */
const heroVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  },
  headline: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
  },
  description: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  },
  cta: {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  },
};

const reducedMotionVariants = {
  container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } },
  headline: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } },
  description: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } },
  cta: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } },
};

/* ----------------------------------------------------------------------
   3. Background — brand watermark, dot grid, spotlight, animated rocket
---------------------------------------------------------------------- */
function HeroBackground() {
  const prefersReducedMotion = useReducedMotion();
  const { rocket } = CONFIG;

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
      {/* Brand watermark — the "dot" mark, oversized and faint, scales down on mobile */}
      <div className="absolute -top-[10%] -end-[15%] w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] lg:-top-[12%] lg:-end-[10%] lg:w-[640px] lg:h-[640px] opacity-[0.05] pointer-events-none">
        <Image src={logoIcon} alt="" fill className="object-contain" priority />
      </div>

      <div className="hidden sm:block absolute -bottom-[18%] -start-[8%] w-[300px] h-[300px] lg:w-[420px] lg:h-[420px] opacity-[0.035] pointer-events-none rotate-12">
        <Image src={logoIcon} alt="" fill className="object-contain" />
      </div>

      {/* Soft brand-red spotlight behind the headline */}
      <div
        className="absolute -top-1/4 -end-1/6 h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] lg:h-[560px] lg:w-[560px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(232,33,37,0.06) 0%, transparent 70%)" }}
      />

      {/* Faint dot grid for texture, masked so it fades toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 70% 60% at 70% 30%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 70% 30%, black 0%, transparent 75%)",
          opacity: 0.6,
        }}
      />

      {/* Rocket — slow diagonal loop, banks into its own heading, gentle bob + exhaust trail */}
      <motion.div
        className="absolute w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 opacity-[0.55] pointer-events-none"
        style={{ filter: "drop-shadow(0 8px 16px rgba(232,33,37,0.18))" }}
        initial={{ top: rocket.top[0], left: rocket.left[0], rotate: rocket.rotate[0] }}
        animate={
          prefersReducedMotion
            ? { opacity: 0.4 }
            : { top: rocket.top, left: rocket.left, rotate: rocket.rotate }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.6 }
            : {
                duration: rocket.durationSeconds,
                repeat: Infinity,
                ease: "easeInOut",
                times: rocket.times,
              }
        }
      >
        <motion.div
          className="relative w-full h-full"
          animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
          transition={
            prefersReducedMotion
              ? {}
              : { duration: rocket.bobDurationSeconds, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Image src={roket} alt="" fill className="object-contain" />

          {/* Exhaust trail, fades in the rocket's wake */}
          <motion.span
            className="absolute top-1/2 start-full -translate-y-1/2 w-6 sm:w-8 h-0.5 rounded-full"
            style={{ background: "linear-gradient(90deg, rgba(232,33,37,0.35), transparent)" }}
            animate={prefersReducedMotion ? {} : { opacity: [0.2, 0.5, 0.2], scaleX: [0.7, 1, 0.7] }}
            transition={prefersReducedMotion ? {} : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------------------
   4. Eyebrow / Stats — small presentational pieces used inside HeroContent
---------------------------------------------------------------------- */
function Eyebrow({ text, variants }) {
  return (
    <motion.div
      variants={variants.item}
      className="flex items-center gap-2 mb-4 sm:mb-5 text-muted text-xs sm:text-sm font-medium"
    >
      <span className="w-5 h-0.5 rounded-full bg-primary-600 shrink-0" />
      {text}
    </motion.div>
  );
}

function StatsRow({ stats, variants }) {
  return (
    <motion.div
      variants={variants.item}
      className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 mt-8 sm:mt-10 pt-6 sm:pt-8 w-full"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="text-center lg:text-start">
          <div className="text-xl sm:text-2xl font-extrabold text-ink">{stat.value}</div>
          <div className="text-xs sm:text-sm text-muted mt-0.5">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------
   5. CTAButtons — primary (filled) + secondary (outline) actions
---------------------------------------------------------------------- */
function CTAButtons() {
  const { settings } = useSettings();
  const ctaPrimary = settings.content?.hero?.ctaPrimary || HERO.ctaPrimary;
  const ctaSecondary = settings.content?.hero?.ctaSecondary || HERO.ctaSecondary;

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 w-full sm:w-auto">
      <button
        className="group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl font-bold text-white text-[15px] w-full sm:w-auto
          transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        style={{ background: "var(--color-primary-600)", boxShadow: "0 6px 16px -4px rgba(232,33,37,0.35)" }}
        aria-label={ctaPrimary}
      >
        {ctaPrimary}
        <ArrowLeft className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
      </button>

      <button
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-ink text-[15px] border w-full sm:w-auto
          transition-colors duration-200 hover:bg-surface active:bg-surface
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        style={{ borderColor: "var(--color-border)" }}
        aria-label={ctaSecondary}
      >
        <Play className="w-4 h-4 shrink-0" />
        {ctaSecondary}
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------------
   6. ContentShowcase — compact static row on mobile, floating cards on lg+
---------------------------------------------------------------------- */
function ContentShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const { dark, main, chip } = CONFIG.showcase;

  const float = (delay = 0) => ({
    y: [0, -12, 0],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut", delay },
  });
  const floatAnim = (delay) => (prefersReducedMotion ? {} : float(delay));

  return (
    <>
      {/* Mobile / tablet — compact static row, no overlap, no fixed px offsets */}
      <div className="flex lg:hidden gap-3 w-full max-w-md mx-auto px-4 sm:px-0">
        <div className="flex-1 rounded-2xl p-3.5 min-w-0" style={{ background: "#131927" }}>
          <div className="w-7 h-7 rounded-full bg-white/10 p-1.5 mb-2">
            <Image src={logoIcon} alt="" className="w-full h-full object-contain" />
          </div>
          <p className="text-[11px] leading-relaxed text-secondary-400 line-clamp-2">{dark.caption}</p>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-secondary-300">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 shrink-0" /> {dark.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3 shrink-0" /> {dark.comments}
            </span>
          </div>
        </div>

        <div className="flex-1 rounded-2xl p-3.5 min-w-0 border bg-white" style={{ borderColor: "var(--color-border)" }}>
          <div
            className="relative w-full h-16 rounded-lg mb-2 overflow-hidden"
            style={{ background: "linear-gradient(135deg,#ff595c 0%,#e82125 60%,#b2171a 100%)" }}
          >
            <Image src={logoIcon} alt="" className="absolute -bottom-2 -end-2 w-8 h-8 object-contain opacity-25" />
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-ink truncate">{main.title}</span>
            <span className="text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded-full shrink-0">
              {main.growth}
            </span>
          </div>
        </div>

        <div className="flex-1 rounded-2xl p-3.5 min-w-0 text-white" style={{ background: "var(--color-primary-600)" }}>
          <TrendingUp className="w-3.5 h-3.5 mb-2 opacity-90" />
          <div className="text-base font-extrabold leading-tight">{chip.value}</div>
          <div className="text-[10px] opacity-90 mt-0.5">{chip.label}</div>
        </div>
      </div>

      {/* Desktop — floating overlapping composition */}
      <div className="hidden lg:block relative h-[420px] sm:h-[460px]" aria-hidden="true">
        <motion.div
          animate={floatAnim(0)}
          className="absolute top-2 end-6 w-[210px] rounded-2xl p-4 shadow-[0_12px_32px_-8px_rgba(17,24,39,0.16)]"
          style={{ background: "#131927", transform: "rotate(6deg)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-white/10 p-1.5">
              <Image src={logoIcon} alt="" className="w-full h-full object-contain" />
            </div>
            <span className="text-white text-xs font-semibold">{dark.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-secondary-400">{dark.caption}</p>
          <div className="flex items-center gap-3 mt-3 text-[11px] text-secondary-300">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" /> {dark.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" /> {dark.comments}
            </span>
          </div>
        </motion.div>

        <motion.div
          animate={floatAnim(0.6)}
          className="absolute top-20 end-40 w-[230px] rounded-2xl border p-3.5 bg-white shadow-[0_12px_32px_-8px_rgba(17,24,39,0.14)]"
          style={{ borderColor: "var(--color-border)", transform: "rotate(-4deg)" }}
        >
          <div
            className="relative w-full h-36 rounded-xl mb-3 overflow-hidden"
            style={{ background: "linear-gradient(135deg,#ff595c 0%,#e82125 60%,#b2171a 100%)" }}
          >
            <Image src={logoIcon} alt="" className="absolute -bottom-4 -end-4 w-16 h-16 object-contain opacity-25" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink">{main.title}</span>
            <span className="text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
              {main.growth}
            </span>
          </div>
          <p className="text-[11px] text-muted mt-1">{main.caption}</p>
        </motion.div>

        <motion.div
          animate={floatAnim(1.1)}
          className="absolute bottom-6 end-56 w-[140px] rounded-2xl p-4 text-white shadow-[0_12px_32px_-8px_rgba(232,33,37,0.35)]"
          style={{ background: "var(--color-primary-600)", transform: "rotate(3deg)" }}
        >
          <div className="flex items-center gap-1 text-[11px] opacity-90 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{chip.period}</span>
          </div>
          <div className="text-xl font-extrabold">{chip.value}</div>
          <div className="text-[11px] opacity-90">{chip.label}</div>
        </motion.div>
      </div>
    </>
  );
}

/* ----------------------------------------------------------------------
   7. HeroContent — eyebrow, headline, description, CTAs, stats
---------------------------------------------------------------------- */
function HeroContent() {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : heroVariants;
  const { settings } = useSettings();

  const siteName = settings.siteName || SITE.name;
  const description = settings.description || SITE.description;
  const eyebrowText = settings.content?.hero?.badge || HERO.badge;

  return (
    <motion.div
      variants={variants.container}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center lg:items-start lg:text-start w-full max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0"
    >
      <Eyebrow text={eyebrowText} variants={variants} />

      <motion.h1
        variants={variants.headline}
        className="font-extrabold leading-[1.18] sm:leading-[1.15] tracking-tight text-ink"
        style={{ fontSize: "clamp(1.9rem, 6vw, 3.6rem)", letterSpacing: "-0.02em" }}
      >
        <span className="text-primary-600">{siteName}</span>
        {" ومن "}
        <HighlightText className="relative">أول السطر،</HighlightText>
        <br />
        <span className="text-ink/90">هنبدأ حكايات جديدة</span>
      </motion.h1>

      <motion.p
        variants={variants.description}
        className="mt-4 sm:mt-5 max-w-[22rem] sm:max-w-md text-muted leading-relaxed text-base sm:text-lg"
        style={{ lineHeight: 1.75 }}
      >
        {description}
      </motion.p>

      <motion.div variants={variants.cta} className="mt-7 sm:mt-8 w-full sm:w-auto">
        <CTAButtons />
      </motion.div>

      <StatsRow stats={CONFIG.stats} variants={variants} />
    </motion.div>
  );
}

/* ----------------------------------------------------------------------
   8. HeroSection — default export, composes everything above
---------------------------------------------------------------------- */
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative mx-auto flex min-h-[calc(100svh-64px)] w-full max-w-[1400px] items-center overflow-hidden py-8 sm:py-14 lg:py-20"
      aria-labelledby="hero-heading"
    >
      <HeroBackground />

      <Container className="relative z-10 flex flex-col gap-8 sm:gap-10 lg:gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-10 lg:gap-14 items-center">
          <HeroContent />
          <ContentShowcase />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="hidden sm:flex w-full justify-center"
        >
          <ScrollIndicator className="w-10 h-16" />
        </motion.div>
      </Container>
    </section>
  );
}