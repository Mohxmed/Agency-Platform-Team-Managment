"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Play,
  TrendingUp,
  Sparkles,
  Layers,
  Globe,
  Zap,
} from "lucide-react";

import {
  Container,
} from "@/features/landing";

import ScrollIndicator from "@/shared/ui/ScrollIndicator";
import HighlightText from "@/shared/ui/typography/HighlightText";

import {
  SITE,
  HERO,
} from "@/constants/content";

import {
  useSettings,
} from "@/contexts/SettingsContext";

import logoIcon from "@/assets/identity/logo-icon.png";
import roket from "@/assets/svg/rocket.webp";

/* =========================================================
   CONFIG & SLIDES
========================================================= */

const HERO_CONFIG = {
  stats: [
    { value: "+150", label: "عميل راضي" },
    { value: "+500", label: "مشروع ناجح" },
    { value: "4.9", label: "تقييم العملاء" },
  ],
  showcase: {
    title: "نمو العلامات",
    value: "+24%",
    description: "نساعد العلامات التجارية على بناء حضور رقمي مؤثر.",
  },
};

const HERO_SLIDES = [
  {
    id: 1,
    tag: "Creative Direction",
    title: "هوية بصرية استثنائية",
    value: "100%",
    metricLabel: "تفرد وعصرية",
    description: "نصنع هويات بصرية تنطق بشخصية علامتك وتترك أثراً لا ينسى في ذهن جمهورك.",
    badge: "Branding",
    icon: Sparkles,
  },
  {
    id: 2,
    tag: "Digital Growth",
    title: "نمو متسارع وأرقام حقيقية",
    value: "+240%",
    metricLabel: "متوسط نمو العملاء",
    description: "حملات استراتيجية موجهة بالبيانات لتحقيق أقصى عائد على الاستثمار.",
    badge: "Marketing",
    icon: TrendingUp,
  },
  {
    id: 3,
    tag: "UI/UX & Web Craft",
    title: "تجربة مستخدم ساحرة",
    value: "4.9/5",
    metricLabel: "تقييم الجودة والتجربة",
    description: "واجهات رقمية تجمع بين جمال التصميم الفائق وسلاسة الأداء البرمجي.",
    badge: "Development",
    icon: Globe,
  },
  {
    id: 4,
    tag: "Media & Production",
    title: "إنتاج إعلامي مبهر",
    value: "+500",
    metricLabel: "مشروع ناجح",
    description: "نحول رؤيتك إلى محتوى مرئي يخطف الأنظار ويقود التفاعل.",
    badge: "Production",
    icon: Zap,
  },
];

/* =========================================================
   MOTION VARIANTS
========================================================= */

const easing = [0.16, 1, 0.3, 1];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easing },
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
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-background" />

      {/* Brand Glow */}
      <motion.div
        style={{
          x: reduceMotion ? 0 : glowX,
          y: reduceMotion ? 0 : glowY,
        }}
        className="absolute -top-48 -right-48 h-[520px] w-[520px] rounded-full opacity-40"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(217,4,41,.18), transparent 70%)",
          }}
        />
      </motion.div>

      {/* Soft Grid */}
      <div className="absolute inset-0 opacity-[0.035]">
        <div
          className="h-full w-full bg-[linear-gradient(var(--color-ink)_1px,transparent_1px),linear-gradient(90deg,var(--color-ink)_1px,transparent_1px)] bg-[size:48px_48px]"
        />
      </div>

      {/* Rocket */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute right-[8%] top-[12%] hidden h-64 w-64 lg:block"
      >
        <Image src={roket} alt="" fill className="object-contain" />
      </motion.div>

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.04] bg-noise" />
    </div>
  );
}

/* =========================================================
   GLASS CARD
========================================================= */

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-black/10
        dark:border-white/10
        bg-white/70
        dark:bg-white/[0.06]
        backdrop-blur-2xl
        shadow-[0_30px_80px_rgba(0,0,0,.12)]
        ${className}
      `}
    >
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-white/40
          dark:from-white/10
          to-transparent
          pointer-events-none
        "
      />
      {children}
    </div>
  );
}

/* =========================================================
   LIGHTWEIGHT PREMIUM SLIDER (Hero Section)
========================================================= */

function HeroAgencySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  // Auto-advance slider if not hovered
  useEffect(() => {
    if (isHovered || reduceMotion) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, reduceMotion]);

  const slide = HERO_SLIDES[currentIndex];
  const IconComponent = slide.icon;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <motion.div
      variants={reveal}
      className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* =========================================================
         FLOATING CLOUD / FOG GLOW EFFECTS (Outside the Slider)
      ========================================================= */}
      <div
        className="
          pointer-events-none
          absolute
          -left-12
          top-1/2
          -translate-y-1/2
          h-[320px]
          w-[320px]
          rounded-full
          bg-primary-600/15
          blur-[90px]
          -z-10
          hidden
          md:block
        "
      />
      <div
        className="
          pointer-events-none
          absolute
          -right-12
          top-1/2
          -translate-y-1/2
          h-[320px]
          w-[320px]
          rounded-full
          bg-purple-600/15
          blur-[90px]
          -z-10
          hidden
          md:block
        "
      />

      <GlassCard className="p-8 sm:p-12 lg:p-14 overflow-hidden">
        {/* Ambient slide gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-60 transition-colors duration-700 pointer-events-none`}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          {/* Left Slide Content */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x < -50 || velocity.x < -500) {
                handleNext();
              } else if (offset.x > 50 || velocity.x > 500) {
                handlePrev();
              }
            }}
            className="cursor-grab active:cursor-grabbing select-none"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-600/10 dark:bg-primary-500/20 px-4 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-400">
                <IconComponent size={14} />
                {slide.tag}
              </span>
              <span className="text-xs font-medium text-muted">
                0{currentIndex + 1} / 0{HERO_SLIDES.length}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: easing }}
                className="mt-6"
              >
                <h3 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                  {slide.title}
                </h3>
                <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed max-w-xl">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation & Indicators */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentIndex === idx
                        ? "w-8 bg-primary-600"
                        : "w-2.5 bg-black/20 dark:bg-white/20 hover:bg-primary-600/50"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-ink hover:bg-primary-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm"
                  aria-label="Previous slide"
                >
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 text-ink hover:bg-primary-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm"
                  aria-label="Next slide"
                >
                  <ArrowLeft size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Slide Metric Card / Interactive Preview */}
          <div className="flex justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: easing }}
                className="w-full max-w-[340px] rounded-[28px] bg-white/80 dark:bg-white/[0.08] border border-black/10 dark:border-white/10 p-7 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted">أداء مميز</span>
                  <span className="rounded-full bg-primary-600/10 px-3 py-1 text-[11px] font-bold text-primary-600">
                    {slide.badge}
                  </span>
                </div>
                <div className="mt-6">
                  <p className="text-5xl font-black tracking-tight text-ink">
                    {slide.value}
                  </p>
                  <p className="mt-2 text-sm font-bold text-muted">
                    {slide.metricLabel}
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-muted">
                  <span>وكالة نقطة الإبداعية</span>
                  <span className="font-bold text-primary-600">مؤشر موثوق</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* =========================================================
   EYEBROW
========================================================= */

function Eyebrow({ text, variants }) {
  return (
    <motion.div
      variants={variants.item}
      className="mb-6 flex items-center justify-center gap-3 text-sm font-bold text-muted lg:justify-start"
    >
      <span className="h-[2px] w-10 rounded-full bg-primary-600" />
      {text}
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
        gap-5
        border-t
        border-black/10
        dark:border-white/10
        pt-8
      "
    >
      {stats.slice(0, 3).map((item) => (
        <div key={item.label} className="text-center lg:text-start">
          <p className="text-2xl font-black text-ink sm:text-3xl">
            {item.value}
          </p>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            {item.label}
          </p>
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
      <Eyebrow text={badge} variants={variants} />

      <motion.h1
        variants={variants.item}
        className="
          text-5xl
          font-black
          leading-[1.08]
          tracking-tight
          text-ink
          sm:text-6xl
        "
      >
        <span className="text-primary-600">{siteName}</span>{" "}
        تصنع
        <br />
        علامات
        <HighlightText>مؤثرة</HighlightText>
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
   ANALYTICS SHOWCASE CARD (Secondary right column)
========================================================= */

function AnalyticsShowcase() {
  const { settings } = useSettings();
  const hero = settings.content?.hero || {};

  const showcase = {
    title: hero.showcase?.title || HERO_CONFIG.showcase.title,
    value: hero.showcase?.value || HERO_CONFIG.showcase.value,
    description: hero.showcase?.description || HERO_CONFIG.showcase.description,
  };

  return (
    <motion.div variants={reveal} className="relative mx-auto w-full max-w-[380px]">
      <GlassCard className="p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-sm font-black text-ink">{showcase.title}</p>
              <p className="mt-1 text-[11px] text-muted">أداء العلامة التجارية</p>
            </div>
          </div>
          <span className="rounded-full bg-primary-600/10 px-3 py-1 text-[10px] font-bold text-primary-600">
            Growth
          </span>
        </div>

        <div className="mt-10">
          <p className="text-6xl font-black tracking-tight text-ink">
            {showcase.value}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {showcase.description}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { value: "+150", label: "عميل" },
            { value: "+500", label: "حملة" },
            { value: "4.9", label: "تقييم" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] p-3 text-center"
            >
              <p className="text-sm font-black text-ink">{item.value}</p>
              <p className="mt-1 text-[10px] text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </GlassCard>
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
      aria-labelledby="hero-heading"
      className="
        relative
        isolate
        flex
        flex-col
        justify-center
        min-h-[calc(100svh-72px)]
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
            gap-14
            lg:grid-cols-[1fr_.9fr]
            lg:gap-20
          "
        >
          {/* Content */}
          <HeroContent />

          {/* Desktop Showcase */}
          <div className="hidden lg:block">
            <AnalyticsShowcase />
          </div>
        </div>

        {/* Mobile Showcase */}
        <div className="mt-12 lg:hidden">
          <AnalyticsShowcase />
        </div>
      </Container>

      {/* Lightweight Premium Agency Slider extending outside standard container */}
      <HeroAgencySlider />

      {/* Scroll Indicator */}
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: easing }}
          className="mt-12 hidden justify-center sm:flex"
        >
          <ScrollIndicator className="h-14 w-9" />
        </motion.div>
      </Container>
    </section>
  );
}
