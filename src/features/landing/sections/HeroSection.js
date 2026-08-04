"use client";

import { useEffect } from "react";
import Link from "next/link";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

import { ArrowLeft, Play } from "lucide-react";

import { Container } from "@/features/landing";

import ScrollIndicator from "@/shared/ui/ScrollIndicator";
import HighlightText from "@/shared/ui/typography/HighlightText";
import { OutlinedBadge } from "@/shared/ui/badges/OutlinedBadge";

import { SITE, HERO } from "@/constants/content";

import { useSettings } from "@/contexts/SettingsContext";

import ShowcaseScene from "@/features/landing/components/showcase/ShowcaseScene";

import { EASE } from "@/features/landing/components/sectionMotion";

/* =========================================================
   CONFIG
========================================================= */

const HERO_CONFIG = {
  stats: [
    { value: "+150", label: "عميل راضي" },
    { value: "+500", label: "مشروع ناجح" },
    { value: "4.9", label: "تقييم العملاء" },
  ],
};

/* =========================================================
   MOTION VARIANTS
========================================================= */

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

/* =========================================================
   PREMIUM BACKGROUND
   Theme-aware layers (tokens flip in dark) + mouse parallax.
========================================================= */

function HeroBackground() {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const y = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    if (reduceMotion) return;
    const move = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY, reduceMotion]);

  const glowX = useTransform(x, (v) => v * 25);
  const glowY = useTransform(y, (v) => v * 20);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="hero-bg-base absolute inset-0" />

      {/* Brand glow (mouse parallax) */}
      <motion.div
        style={{
          x: reduceMotion ? 0 : glowX,
          y: reduceMotion ? 0 : glowY,
        }}
        className="absolute -start-48 -top-48 h-[520px] w-[520px] rounded-full opacity-40"
      >
        <div className="hero-orb-red h-full w-full rounded-full" />
      </motion.div>

      {/* Deep crimson accent */}
      <div className="hero-orb-deep absolute -end-40 -bottom-32 h-[540px] w-[540px] rounded-full opacity-50" />

      {/* Soft grid */}
      <div className="hero-bg-grid absolute inset-0" />

      {/* Noise + vignette */}
      <div className="hero-bg-noise absolute inset-0" />
      <div className="hero-bg-vignette absolute inset-0" />
    </div>
  );
}

/* =========================================================
   ACTIONS
========================================================= */

function HeroActions() {
  const { settings } = useSettings();
  const hero = settings.content?.hero || {};

  const primary = hero.ctaPrimary || HERO.ctaPrimary || "ابدأ مشروعك";
  const secondary = hero.ctaSecondary || HERO.ctaSecondary || "شاهد أعمالنا";
  const primaryLink = hero.ctaPrimaryLink || "/contact";
  const secondaryLink = hero.ctaSecondaryLink || "/works";

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Link
        href={primaryLink}
        className="
          group
          flex
          items-center
          justify-center
          gap-3
          rounded-2xl
          bg-primary-600
          px-8
          py-4
          font-bold
          text-white
          shadow-[0_20px_45px_rgba(217,4,41,.25)]
          transition-all
          duration-300
          hover:-translate-y-1
        "
      >
        {primary}
        <ArrowLeft
          size={18}
          className="transition-transform group-hover:-translate-x-1"
        />
      </Link>

      <Link
        href={secondaryLink}
        className="
          flex
          items-center
          justify-center
          gap-3
          rounded-2xl
          border
          border-black/10
          dark:border-white/10
          bg-white/40
          dark:bg-white/5
          px-8
          py-4
          font-bold
          text-ink
          backdrop-blur
          transition
          hover:bg-black/5
          dark:hover:bg-white/10
        "
      >
        <Play size={16} fill="currentColor" />
        {secondary}
      </Link>
    </div>
  );
}

/* =========================================================
   STATS
========================================================= */

function HeroStats({ stats, variants }) {
  return (
    <motion.div
      variants={variants.item}
      className="
        mt-12
        grid
        grid-cols-3
        gap-4
        border-t
        border-black/10
        pt-8
        dark:border-white/10
      "
    >
      {stats.slice(0, 3).map((item) => (
        <div key={item.label} className="text-center lg:text-start">
          <p className="text-2xl font-black text-ink sm:text-3xl">
            {item.value}
          </p>
          <p className="mt-1 text-xs text-muted sm:text-sm">{item.label}</p>
        </div>
      ))}
    </motion.div>
  );
}

/* =========================================================
   HERO CONTENT
   Text column sized at ~2/3 of the hero width.
========================================================= */

function HeroContent() {
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion
    ? { container, item: { hidden: { opacity: 0 }, visible: { opacity: 1 } } }
    : { container, item: reveal };

  const { settings } = useSettings();
  const siteName = settings.siteName || SITE.name;
  const description =
    settings.description ||
    "نصنع محتوى، نبني هوية، ونقود علامتك نحو نمو حقيقي من خلال حلول إعلامية وتسويقية مبتكرة.";

  const hero = settings.content?.hero || {};
  const badge = hero.badge || "Media & Creative Agency Studio";
  const stats = settings.stats?.length ? settings.stats : HERO_CONFIG.stats;

  return (
    <motion.div
      variants={variants.container}
      initial="hidden"
      animate="visible"
      className="max-w-2xl text-center lg:text-start"
    >
      <motion.div
        variants={variants.item}
        className="mb-6 flex items-center justify-center gap-3 lg:justify-start"
      >
        <OutlinedBadge>
          <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
          {badge}
        </OutlinedBadge>
      </motion.div>

      <motion.h1
        variants={variants.item}
        className="
          text-5xl
          font-black
          leading-[1.3]
          tracking-tight
          text-ink
          sm:text-6xl
        "
      >
        <span className="text-primary-600">{siteName}</span> تصنع
        <br />
        علامات <HighlightText>مؤثرة</HighlightText>
      </motion.h1>

      <motion.p
        variants={variants.item}
        className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
      >
        {description}
      </motion.p>

      <motion.div variants={variants.item} className="mt-8">
        <HeroActions />
      </motion.div>

      <HeroStats stats={stats} variants={variants} />
    </motion.div>
  );
}

/* =========================================================
   HERO SECTION
========================================================= */

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero section"
      className="
        relative
        isolate
        flex
        min-h-[calc(100svh-72px)]
        flex-col
        justify-center
        overflow-hidden
        py-16
        sm:py-20
      "
    >
      {/* Background */}
      <HeroBackground />

      <Container className="relative z-10 w-full">
        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-16
            lg:grid-cols-[1.5fr_1fr]
            lg:gap-14
          "
        >
          {/* Content — ~2/3 of the width */}
          <HeroContent />

          {/* Floating showcase — ~1/3 of the width */}
          <ShowcaseScene />
        </div>
      </Container>

      {/* Scroll indicator */}
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
          className="mt-12 hidden justify-center sm:flex"
        >
          <ScrollIndicator className="h-14 w-9" />
        </motion.div>
      </Container>
    </section>
  );
}
