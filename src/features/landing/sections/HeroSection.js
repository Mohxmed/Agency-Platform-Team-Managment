"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

import { ArrowLeft, Megaphone, Play, TrendingUp } from "lucide-react";

import { Container } from "@/features/landing";

import ScrollIndicator from "@/shared/ui/ScrollIndicator";
import HighlightText from "@/shared/ui/typography/HighlightText";
import { OutlinedBadge } from "@/shared/ui/badges/OutlinedBadge";

import { SITE, HERO } from "@/constants/content";

import { useSettings } from "@/contexts/SettingsContext";

import roket from "@/assets/svg/rocket.webp";

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

const CARD_BARS = [45, 65, 40, 75, 55, 85, 70];

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
   HERO CARD DATA
========================================================= */

function buildCard(hero) {
  const campaign = hero.campaign || {};
  const analytics = hero.analytics || {};
  const growth = hero.growth || {};

  return {
    icon: Megaphone,
    tag: "Campaign",
    title: campaign.title || "حملة تسويقية",
    valueLabel: "أداء الحملة",
    bigValue: campaign.likes || "2.4K",
    description:
      campaign.text ||
      "وصلنا لأكثر من 200 ألف متابع مستهدف خلال أسبوعين.",
    bars: CARD_BARS,
    stats: [
      { value: campaign.likes || "2.4K", label: "إعجاب" },
      { value: campaign.comments || "318", label: "تعليق" },
      { value: analytics.growth || "+24%", label: "نمو العلامة" },
    ],
    growth: growth.value || "+150K",
    growthLabel: growth.period || "نمو العلامة",
  };
}

/* =========================================================
   HERO CARD — single liquid-glass card with cloud edges
   and a rocket floating above it (higher z-index).
========================================================= */

function HeroCardFrame() {
  const { settings } = useSettings();
  const hero = settings.content?.hero || {};

  const card = buildCard(hero);
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
      className="hero-card-frame relative"
    >
      {/* Blurred brand halo behind the card */}
      <div aria-hidden className="hero-card-glow" />

      {/* Cloud puffs hugging the card edges */}
      <div aria-hidden className="hero-card-cloud hero-card-cloud--top" />
      <div aria-hidden className="hero-card-cloud hero-card-cloud--bottom" />

      {/* Rocket floating above the card */}
      <div aria-hidden className="hero-rocket">
        <div className="hero-rocket__flight">
          <Image
            src={roket}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 220px, 160px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Card */}
      <div className="glass-panel glass-panel--tint p-6 sm:p-7">
        {/* Header */}
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-600/30">
              <Icon size={20} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-black text-ink">{card.title}</p>
              <p className="mt-0.5 text-[11px] text-muted">{card.valueLabel}</p>
            </div>
          </div>

          <span className="rounded-full bg-primary-600/10 px-3 py-1 text-[10px] font-bold text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
            {card.tag}
          </span>
        </div>

        {/* Value + bars */}
        <div className="relative mt-7 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-5xl font-black tracking-tight text-ink sm:text-6xl">
              {card.bigValue}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {card.description}
            </p>
          </div>

          <div
            aria-hidden
            className="hidden h-20 shrink-0 items-end gap-1 sm:flex"
          >
            {card.bars.map((height, i) => (
              <motion.span
                key={i}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 24,
                  delay: 0.5 + i * 0.05,
                }}
                style={{ height: `${height}%` }}
                className="w-1.5 origin-bottom rounded-full bg-linear-to-t from-primary-700 to-primary-400"
              />
            ))}
          </div>
        </div>

        {/* Mini stats */}
        <div className="relative mt-7 grid grid-cols-3 gap-3">
          {card.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-black/[0.05] bg-white/50 p-2.5 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]"
            >
              <p className="text-sm font-black tracking-tight text-ink">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[10px] text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Growth strip */}
        <div className="relative mt-4 flex items-center justify-between rounded-2xl border border-primary-600/15 bg-primary-600/[0.06] px-4 py-3 dark:bg-primary-500/[0.08]">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-primary-600" />
            <span className="text-[11px] font-bold text-muted">
              {card.growthLabel}
            </span>
          </div>
          <span className="text-sm font-black text-primary-600">
            {card.growth}
          </span>
        </div>
      </div>
    </motion.div>
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

          {/* Single premium card — ~1/3 of the width */}
          <HeroCardFrame />
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
