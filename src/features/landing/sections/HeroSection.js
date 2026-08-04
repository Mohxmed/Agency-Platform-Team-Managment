"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Play,
  Rocket,
  TrendingUp,
} from "lucide-react";

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

const SLIDE_BARS = [
  [45, 65, 40, 75, 55, 85, 70],
  [40, 55, 70, 50, 80, 65, 90],
  [35, 50, 45, 70, 85, 60, 75],
];

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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/* =========================================================
   PREMIUM BACKGROUND
   Theme-aware layers (tokens flip in dark) + moving rocket.
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

      {/* Animated rocket */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={
          reduceMotion
            ? { opacity: 0.35, scale: 1, y: 0 }
            : {
                opacity: 0.45,
                scale: 1,
                y: [-12, 14, -12],
                x: [-6, 6, -6],
                rotate: [-3, 3, -3],
              }
        }
        transition={
          reduceMotion
            ? { duration: 1 }
            : {
                opacity: { duration: 1 },
                scale: { duration: 1 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }
        }
        className="pointer-events-none absolute left-[5%] top-[8%] z-0 hidden h-80 w-80 lg:block"
      >
        <Image
          src={roket}
          alt="Rocket Animation"
          fill
          priority
          className="object-contain drop-shadow-[0_25px_60px_rgba(217,4,41,0.35)]"
        />
      </motion.div>

      {/* Noise + vignette */}
      <div className="hero-bg-noise absolute inset-0" />
      <div className="hero-bg-vignette absolute inset-0" />
    </div>
  );
}

/* =========================================================
   FOG / CLOUD EDGE GLOWS
   Float outside the slider edges → depth + reveal.
========================================================= */

function HeroClouds() {
  return (
    <>
      <div
        aria-hidden
        className="hero-cloud-left"
        style={{ top: "46%" }}
      />
      <div
        aria-hidden
        className="hero-cloud-right"
        style={{ top: "74%" }}
      />
    </>
  );
}

/* =========================================================
   HERO SLIDE DATA
========================================================= */

function buildSlides(hero) {
  const campaign = hero.campaign || {};
  const analytics = hero.analytics || {};
  const growth = hero.growth || {};

  return [
    {
      key: "campaign",
      icon: Megaphone,
      tag: "Campaign",
      title: campaign.title || "حملة تسويقية",
      valueLabel: "أداء الحملة",
      bigValue: campaign.likes || "2.4K",
      description:
        campaign.text ||
        "وصلنا لأكثر من 200 ألف متابع مستهدف خلال أسبوعين.",
      bars: SLIDE_BARS[0],
      stats: [
        { value: campaign.likes || "2.4K", label: "إعجاب" },
        { value: campaign.comments || "318", label: "تعليق" },
        { value: "×3", label: "متوسط التفاعل" },
      ],
    },
    {
      key: "analytics",
      icon: TrendingUp,
      tag: "Analytics",
      title: analytics.title || "محتوى أسبوعي",
      valueLabel: "نمو العلامة",
      bigValue: analytics.growth || "+24%",
      description:
        analytics.text || "تفاعل أعلى من المتوسط بثلاث أضعاف.",
      bars: SLIDE_BARS[1],
      stats: [
        { value: analytics.growth || "+24%", label: "نمو" },
        { value: "3×", label: "متوسط التفاعل" },
        { value: "52", label: "أسبوع" },
      ],
    },
    {
      key: "growth",
      icon: Rocket,
      tag: "Growth",
      title: "نمو العلامة",
      valueLabel: growth.period || "هذا الشهر",
      bigValue: growth.value || "+150K",
      description:
        "نساعد العلامات التجارية على بناء حضور رقمي مؤثر ينمو باستمرار.",
      bars: SLIDE_BARS[2],
      stats: [
        { value: growth.value || "+150K", label: "متابع جديد" },
        { value: "200K+", label: "مستهدف" },
        { value: "4.9", label: "تقييم" },
      ],
    },
  ];
}

/* =========================================================
   SLIDE CARD — Liquid glass
========================================================= */

function HeroSlideCard({ slide, active }) {
  const Icon = slide.icon;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="glass-panel glass-panel--tint p-7 pb-16 sm:p-9"
    >
      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-600/30">
            <Icon size={22} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-black text-ink">{slide.title}</p>
            <p className="mt-0.5 text-[11px] text-muted">{slide.valueLabel}</p>
          </div>
        </div>

        <span className="rounded-full bg-primary-600/10 px-3 py-1 text-[10px] font-bold text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
          {slide.tag}
        </span>
      </div>

      {/* Value + bars */}
      <div className="relative mt-9 flex items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="text-6xl font-black tracking-tight text-ink sm:text-7xl">
            {slide.bigValue}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-7 text-muted">
            {slide.description}
          </p>
        </div>

        <div
          aria-hidden
          className="hidden h-24 shrink-0 items-end gap-1.5 sm:flex"
        >
          {slide.bars.map((height, i) => (
            <motion.span
              key={i}
              animate={
                active
                  ? { scaleY: 1, opacity: 1 }
                  : { scaleY: 0.35, opacity: 0.4 }
              }
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 22,
                delay: i * 0.05,
              }}
              style={{ height: `${height}%` }}
              className="w-2 origin-bottom rounded-full bg-linear-to-t from-primary-700 to-primary-400"
            />
          ))}
        </div>
      </div>

      {/* Mini stats */}
      <div className="relative mt-8 grid grid-cols-3 gap-3">
        {slide.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-black/[0.05] bg-white/50 p-3 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]"
          >
            <p className="text-sm font-black tracking-tight text-ink sm:text-base">
              {stat.value}
            </p>
            <p className="mt-1 text-[10px] text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* =========================================================
   HERO SLIDER
   Fades between premium glass slides with autoplay,
   custom pagination, arrows and native touch gestures.
========================================================= */

function HeroSlider() {
  const { settings } = useSettings();
  const hero = settings.content?.hero || {};
  const reduceMotion = useReducedMotion();

  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = buildSlides(hero);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
      className="relative"
    >
      <Swiper
        modules={[EffectFade, Autoplay, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={reduceMotion ? 0 : 900}
        loop
        grabCursor
        touchReleaseOnEdges
        autoplay={
          reduceMotion
            ? false
            : {
                delay: 5200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
        }
        pagination={{ clickable: true, el: ".hero-slider-pagination" }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.realIndex || 0);
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        dir="rtl"
        className="hero-slider"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.key}>
            <HeroSlideCard slide={slide} active={slide.key === slides[activeIndex]?.key} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom pagination */}
      <div className="hero-slider-pagination" />

      {/* Arrows */}
      <button
        type="button"
        aria-label="السابق"
        onClick={() => swiperRef.current?.slidePrev()}
        className="hero-slider-arrow hero-slider-arrow--prev"
      >
        <ChevronRight size={18} />
      </button>

      <button
        type="button"
        aria-label="التالي"
        onClick={() => swiperRef.current?.slideNext()}
        className="hero-slider-arrow hero-slider-arrow--next"
      >
        <ChevronLeft size={18} />
      </button>
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
      className="max-w-xl text-center lg:text-start"
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
        className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
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

      {/* Fog / cloud edges — outside the slider for depth */}
      <HeroClouds />

      <Container className="relative z-10 w-full">
        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-16
            lg:grid-cols-[1fr_0.95fr]
            lg:gap-10
          "
        >
          {/* Content */}
          <HeroContent />

          {/* Premium slider — bleeds past the container edge */}
          <div className="hero-slider-frame">
            <HeroSlider />
          </div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: EASE }}
          className="mt-12 hidden justify-center sm:flex"
        >
          <ScrollIndicator className="h-14 w-9" />
        </motion.div>
      </Container>
    </section>
  );
}
