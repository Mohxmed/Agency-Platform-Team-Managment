"use client";



import Button from "@/shared/ui/buttons/Buttons";
import { OutlinedBadge } from "@/shared/ui/badges/OutlinedBadge";

import {
  GalleryVerticalEnd,
  MessageSquareHeart,
  BriefcaseBusiness,
} from "lucide-react";

import SectionTitle from "@/features/landing/layout/SectionTitle";
import { Container } from "@/features/landing";
import ProjectCard from "@/shared/ui/cards/ProjectCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

import "swiper/css";

import SwiperFadeEdges from "@/features/landing/components/SwiperFadeEdges";
import StatsBoard from "@/features/landing/components/StatsBoard";
import { ROUTES } from "@/constants/routes";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

import { useWorks } from "@/features/landing/hooks/useWorks";
import { HomeWorksSkeleton } from "@/shared/ui/skeletons/Skeletons";
import { useSettings } from "@/contexts/SettingsContext";

/* =========================================================
   CONSTANTS
========================================================= */

const PROJECTS_LIMIT = 8;

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* =========================================================
   WORKS SECTION
========================================================= */

export default function WorksSection() {
  const { works: allWorks, loading } = useWorks();
  const { settings } = useSettings();
  const content = settings.content?.works || {};

  const badge = content.badge || "محفظة أعمالنا";
  const title = content.title || "";
  const redTitle = content.redTitle || "أفكار بتتحول لأرقام";
  const description =
    content.description ||
    "كل مشروع بيعكس شغفنا للإبداع والتخطيط والأداء. بنصنع تجربة تربط الهوية بالجمهور وتحول الأفكار إلى نمو محسوب.";

  const projects = allWorks.slice(0, PROJECTS_LIMIT);

  return (
    <section
      id="works"
      className="
        relative
        overflow-hidden
        py-18
      "
    >
      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[15%]
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-primary-500/[0.035]
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-[35%]
          h-[350px]
          w-[350px]
          rounded-full
          bg-primary-600/[0.025]
          blur-[120px]
        "
      />

      <Container>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="mx-auto max-w-3xl text-center"
        >

          {/* Badge */}

          <motion.div
            variants={fadeUp}
            className="flex justify-center"
          >
            <OutlinedBadge>
              <GalleryVerticalEnd size={16} />
              {badge}
            </OutlinedBadge>
          </motion.div>

          {/* Title */}

          <motion.div variants={fadeUp}>
            <SectionTitle
              title={title}
              redTitle={redTitle}
            >
              {description}
            </SectionTitle>
          </motion.div>

        </motion.div>

        {/* =====================================================
            PROJECTS SLIDER
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 45,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 1,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          <SwiperFadeEdges variant="white">

            <div className="mt-4">

              {/* =================================================
                  LOADING
              ================================================= */}

              {loading ? (
                <HomeWorksSkeleton />
              ) : projects.length > 0 ? (

                <Swiper
                  modules={[
                    Autoplay,
                    FreeMode,
                  ]}
                  loop={projects.length > 2}
                  speed={3200}
                  spaceBetween={20}
                  slidesPerView={1.15}
                  grabCursor={false}
                  watchOverflow

                  freeMode={{
                    enabled: true,
                    momentum: false,
                  }}

                  autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}

                  breakpoints={{
                    640: {
                      slidesPerView: 1.4,
                    },

                    768: {
                      slidesPerView: 2.2,
                    },

                    1200: {
                      slidesPerView: 2.8,
                      spaceBetween: 24,
                    },
                  }}
                >

                  {projects.map((project, index) => (

                    <SwiperSlide
                      key={project.id}
                      className="h-auto px-3 py-8"
                    >

                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 25,
                          scale: 0.97,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        viewport={{
                          once: true,
                          amount: 0.15,
                        }}
                        transition={{
                          duration: 0.7,
                          delay: Math.min(
                            index * 0.08,
                            0.4
                          ),
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >

                        <ProjectCard
                          project={project}
                        />

                      </motion.div>

                    </SwiperSlide>

                  ))}

                </Swiper>

              ) : (

                /* =================================================
                   EMPTY
                ================================================= */

                <div
                  className="
                    flex
                    min-h-[420px]
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-primary-600/10
                      text-primary-600
                    "
                  >
                    <GalleryVerticalEnd size={26} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    مفيش أعمال متاحة حاليًا
                  </h3>

                  <p className="mt-2 text-sm text-black/40 dark:text-white/50">
                    هنضيف أعمال جديدة قريبًا.
                  </p>

                </div>

              )}

            </div>

          </SwiperFadeEdges>

        </motion.div>

        {/* =====================================================
            STATS
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <StatsBoard />
        </motion.div>

        {/* =====================================================
            CTA
        ====================================================== */}

        <CallToActionWorks />

      </Container>
    </section>
  );
}

/* =========================================================
   CTA
========================================================= */

function CallToActionWorks() {
  const { settings } = useSettings();
  const content = settings.content?.works || {};

  const reduceMotion = useReducedMotion();

  const ctaBadge = content.ctaBadge || "خطوات فعلية لنجاحات واقعية";
  const ctaHeading = content.ctaHeading || "مزيج بين البساطة";
  const ctaHeadingHighlight = content.ctaHeadingHighlight || "والإحترافية";
  const ctaDescription =
    content.ctaDescription ||
    "احنا بنقدم تجربة رقمية مزيج بين البساطة والإبداع والسرعة والتصميم عشان نضيف قيمة وأثر في كل عين.";
  const ctaPrimary = content.ctaPrimary || "عرض كل الأعمال";
  const ctaPrimaryLink = content.ctaPrimaryLink || ROUTES.PORTFOLIO;
  const ctaSecondary = content.ctaSecondary || "كلمنا دلوقتي";
  const ctaSecondaryLink = content.ctaSecondaryLink || ROUTES.CONTACT;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const springConfig = {
    stiffness: 120,
    damping: 16,
    mass: 0.6,
  };

  const rotateX = useSpring(
    useTransform(my, [0, 1], [5, -5]),
    springConfig,
  );

  const rotateY = useSpring(
    useTransform(mx, [0, 1], [-5, 5]),
    springConfig,
  );

  const glareX = useTransform(mx, [0, 1], ["20%", "80%"]);
  const glareY = useTransform(my, [0, 1], ["20%", "80%"]);

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
        y: 60,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        mt-12
        [perspective:1200px]
      "
    >
      <motion.div
        onMouseMove={reduceMotion ? undefined : handleMouseMove}
        onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
        whileHover={{
          scale: 1.01,
        }}
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="
          group
          relative
          overflow-hidden
          rounded-[40px]
          border
          border-black/[0.06]
          bg-gradient-to-b
          from-white
          via-white
          to-neutral-50
          px-8
          py-16
          text-center
          shadow-[0_30px_100px_rgba(0,0,0,0.07)]
          will-change-transform
          sm:px-16
          sm:py-24
          dark:border-white/10
          dark:from-card
          dark:via-card
          dark:to-card
        "
      >

      {/* AMBIENT GLOW */}

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[420px]
          w-[420px]
          -translate-x-1/2
          rounded-full
          bg-primary-500/10
          blur-[120px]
        "
      />

      {/* Bottom Glow */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-60
          w-[70%]
          -translate-x-1/2
          rounded-full
          bg-primary-500/[0.025]
          blur-[90px]
        "
      />

      {/* NOISE */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)]
          bg-[size:18px_18px]
        "
      />

      {/* MOVING SHINE */}

      <motion.div
        animate={{
          x: ["-120%", "350%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "linear",
        }}
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          w-1/4
          rotate-12
          bg-gradient-to-r
          from-transparent
          via-primary-500/[0.06]
          to-transparent
          blur-2xl
        "
      />

      {/* GLARE (cursor tracking) */}

      <motion.div
        className="
          pointer-events-none
          absolute
          inset-0
          z-20
        "
        style={{
          background: reduceMotion ? "none" : glareBackground,
        }}
      />

      {/* CONTENT */}

      <div
        style={{
          transform: "translateZ(40px)",
        }}
        className="
          relative
          z-10
          mx-auto
          max-w-3xl
        "
      >

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
        >

          <OutlinedBadge
            className="
              inline-flex
              rounded-full
              border
              border-neutral-200
              bg-white/80
              px-4
              py-1.5
              text-sm
              font-medium
              text-neutral-500
              backdrop-blur
              dark:border-white/10
              dark:bg-white/5
              dark:text-neutral-400
            "
          >
              {ctaBadge}
          </OutlinedBadge>

        </motion.div>

        {/* Heading */}

        <motion.h2
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-8
            text-4xl
            font-black
            leading-tight
            tracking-tight
            text-neutral-900
            sm:text-6xl
            dark:text-white
          "
        >
          {ctaHeading}
          <br />

          <span className="text-primary-600">
            {ctaHeadingHighlight}
          </span>

        </motion.h2>

        {/* Description */}

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className="
            mx-auto
            mt-6
            max-w-2xl
            text-lg
            leading-8
            text-neutral-500
            dark:text-neutral-400
          "
        >
          {ctaDescription}
        </motion.p>

        {/* Buttons */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
            delay: 0.3,
          }}
          className="
            mt-10
            flex
            flex-col
            justify-center
            gap-3
            md:flex-row
          "
        >

          <Button
            variant="primary"
            hasEffects={false}
            className="px-10 py-3"
            href={ctaPrimaryLink}
          >
            <BriefcaseBusiness />
            {ctaPrimary}
          </Button>

          <Button
            variant="secondary"
            hasEffects={false}
            className="px-10 py-3"
            href={ctaSecondaryLink}
          >
            <MessageSquareHeart />
            {ctaSecondary}
          </Button>

        </motion.div>

      </div>

      </motion.div>

    </motion.div>
  );
}
