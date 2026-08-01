"use client";

import { motion } from "framer-motion";
import { Container } from "@/features/landing";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CircleHelp,
  Sparkles,
} from "lucide-react";

import PageGridCardView from "@/features/landing/pages/PageGridCardView";
import ServiceCard from "@/shared/ui/cards/ServiceCard";
import Button from "@/shared/ui/buttons/Buttons";

import { ServicesSkeleton } from "@/shared/ui/skeletons/Skeletons";
import { useServices } from "@/features/landing/hooks/useServices";
import { resolveIcon } from "@/shared/ui/icons/resolveIcon";

/* =========================================================
   ANIMATION
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const heroContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardsContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardItem = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.96,
    filter: "blur(7px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",

    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   PAGE
========================================================= */

export default function ServicesPage() {
  const { services, loading } = useServices();

  return (
    <main
      dir="rtl"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-white
        py-6
        sm:py-8
        lg:py-10
        dark:bg-background
      "
    >
      {/* =====================================================
          GLOBAL BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top glow */}

        <motion.div
          className="
            absolute
            -top-72
            left-1/2
            h-[800px]
            w-[1000px]
            -translate-x-1/2
            rounded-full
            bg-primary-500/[0.065]
            blur-[170px]
          "
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.45, 0.7, 0.45],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Right glow */}

        <motion.div
          className="
            absolute
            -right-72
            top-[35%]
            h-[650px]
            w-[650px]
            rounded-full
            bg-primary-600/[0.035]
            blur-[160px]
          "
          animate={{
            x: [0, -40, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Left glow */}

        <motion.div
          className="
            absolute
            -left-72
            bottom-[8%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-primary-400/[0.035]
            blur-[160px]
          "
          animate={{
            x: [0, 35, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(0,0,0,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.3)_1px,transparent_1px)]
            [background-size:80px_80px]
            [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]
          "
        />

        {/* Floating dots */}

        <FloatingDot className="right-[12%] top-[18%]" delay={0} />

        <FloatingDot className="left-[10%] top-[32%]" delay={1.5} />

        <FloatingDot className="right-[18%] bottom-[24%]" delay={2} />

        <FloatingDot className="left-[20%] bottom-[12%]" delay={0.7} />
      </div>

      <Container className="relative z-10">
        {/* =====================================================
            HERO
        ====================================================== */}

        <motion.section
          variants={heroContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border
            border-black/[0.05]
            bg-neutral-950
            px-6
            py-14
            text-white
            shadow-[0_35px_100px_rgba(0,0,0,0.12)]
            sm:px-10
            sm:py-16
            lg:px-16
            lg:py-20
          "
        >
          {/* Hero ambient */}

          <motion.div
            className="
              pointer-events-none
              absolute
              -right-32
              -top-32
              h-[450px]
              w-[450px]
              rounded-full
              bg-primary-500/20
              blur-[110px]
            "
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="
              pointer-events-none
              absolute
              -bottom-48
              left-[25%]
              h-[400px]
              w-[400px]
              rounded-full
              bg-primary-700/10
              blur-[110px]
            "
            animate={{
              x: [0, 80, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Giant number */}

          <motion.div
            className="
              pointer-events-none
              absolute
              -left-5
              top-1/2
              -translate-y-1/2
              select-none
              text-[180px]
              font-black
              leading-none
              text-white/[0.025]
              sm:text-[250px]
            "
            animate={{
              x: [0, 15, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {String(services.length).padStart(2, "0")}
          </motion.div>

          {/* Hero content */}

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
            {/* Badge */}

            <motion.div
              variants={fadeUp}
              whileHover={{
                y: -3,
                scale: 1.03,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 22,
              }}
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-primary-400/20
                bg-primary-400/[0.07]
                px-4
                py-2
                text-xs
                font-medium
                text-primary-300
                backdrop-blur-xl
              "
            >
              <motion.span
                animate={{
                  rotate: [0, 12, -12, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles size={14} />
              </motion.span>
              حلول مصممة لعلامتك التجارية
            </motion.div>

            {/* Heading */}

            <motion.h1
              variants={fadeUp}
              className="
                mt-6
                text-3xl
                font-black
                leading-[1.2]
                tracking-tight
                sm:text-4xl
                lg:text-6xl
              "
            >
              مش مجرد خدمات،
              <motion.span
                className="
                  block
                  text-primary-400
                "
                animate={{
                  textShadow: [
                    "0 0 0px rgba(250,204,21,0)",
                    "0 0 35px rgba(250,204,21,0.2)",
                    "0 0 0px rgba(250,204,21,0)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                بنبني حضورك.
              </motion.span>
            </motion.h1>

            {/* Description */}

            <motion.p
              variants={fadeUp}
              className="
                mt-6
                max-w-2xl
                text-sm
                leading-8
                text-white/45
                sm:text-base
              "
            >
              من أول فكرة لحد ظهور علامتك التجارية بالشكل اللي تستحقه، بنجمع بين
              الإبداع والاستراتيجية والتنفيذ عشان نطلع بنتيجة تليق بيك.
            </motion.p>

            {/* Stats */}

            <motion.div
              variants={fadeUp}
              className="
                mt-10
                flex
                flex-wrap
                justify-center
                gap-3
              "
            >
              <MiniStat
                value={`${services.length.toString().padStart(2, "0")}+`}
                label="خدمات رئيسية"
              />

              <MiniStat value="120+" label="مشروع مكتمل" />

              <MiniStat value="99%" label="رضا العملاء" />
            </motion.div>
          </div>

          {/* Bottom line */}

          <motion.div
            className="
              absolute
              bottom-0
              left-1/2
              h-px
              w-[55%]
              -translate-x-1/2
              bg-gradient-to-r
              from-transparent
              via-primary-500/50
              to-transparent
            "
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleX: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.section>

        {/* =====================================================
            SECTION INTRO
        ====================================================== */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="
            mx-auto
            mt-16
            max-w-2xl
            text-center
            sm:mt-20
          "
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary-500/50" />

            <span className="text-[10px] font-bold tracking-[0.3em] text-primary-600">
              WHAT WE DO
            </span>

            <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary-500/50" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-black sm:text-3xl dark:text-white">
            كل اللي محتاجه عشان تظهر بشكل أقوى
          </h2>

          <p className="mt-3 text-sm leading-7 text-black/40 sm:text-base dark:text-white/60">
            خدمات متكاملة، مترابطة، ومصممة عشان تشتغل مع بعض وتوصل علامتك
            التجارية للمكان الصح.
          </p>
        </motion.section>

        {/* =====================================================
            SERVICES
        ====================================================== */}

        <section className="mt-10 sm:mt-12">
          {/* Loading */}

          {loading && <ServicesSkeleton />}

          {/* Empty */}

          {!loading && services.length === 0 && (
            <div
              className="
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                rounded-[2rem]
                border
                border-black/[0.05]
                bg-neutral-50
                text-center
                dark:border-white/10
                dark:bg-card
              "
            >
              <CircleHelp size={42} className="text-black/20 dark:text-white/20" />

              <h3 className="mt-4 text-lg font-bold text-black dark:text-white">
                مفيش خدمات متاحة حاليًا
              </h3>

              <p className="mt-2 text-sm text-black/40 dark:text-white/50">
                هنضيف الخدمات قريبًا.
              </p>
            </div>
          )}

          {/* Services */}

          {!loading && services.length > 0 && (
            <motion.div
              variants={cardsContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.08,
              }}
            >
              <PageGridCardView>
                {services.map((service) => {
                  const Icon = resolveIcon(service.icon, BriefcaseBusiness);

                  const serviceWithIcon = {
                    ...service,
                    icon: Icon,
                  };

                  return (
                    <motion.div
                      key={service.id}
                      variants={cardItem}
                      className="h-full"
                    >
                      <motion.div
                        className="h-full"
                        whileHover={{
                          y: -6,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 24,
                        }}
                      >
                        <ServiceCard
                          service={serviceWithIcon}
                          requestHref={`/request-service?service=${encodeURIComponent(
                            service.id,
                          )}`}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </PageGridCardView>
            </motion.div>
          )}
        </section>

        {/* =====================================================
            PROCESS STRIP
        ====================================================== */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="mt-16 sm:mt-20"
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-black/[0.05]
              bg-neutral-50
              px-6
              py-8
              sm:px-10
              sm:py-10
              dark:border-white/10
              dark:bg-card
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-48
                w-48
                rounded-full
                bg-primary-500/[0.07]
                blur-3xl
              "
            />

            <div className="relative z-10">
              <div
                className="
                  mb-7
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                  sm:items-end
                  sm:justify-between
                "
              >
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-primary-600">
                    OUR PROCESS
                  </span>

                  <h2 className="mt-2 text-xl font-black text-black sm:text-2xl dark:text-white">
                    بنحوّل الفكرة لنتيجة
                  </h2>
                </div>

                <p className="max-w-md text-xs leading-6 text-black/40 sm:text-sm dark:text-white/60">
                  من أول جلسة لحد التنفيذ، كل خطوة محسوبة عشان نوصل للنتيجة اللي
                  تستحقها.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <ProcessStep
                  number="01"
                  title="نفهم"
                  description="نفهم فكرتك، جمهورك، وأهدافك."
                />

                <ProcessStep
                  number="02"
                  title="نخطط"
                  description="نحدد الاتجاه والاستراتيجية المناسبة."
                />

                <ProcessStep
                  number="03"
                  title="ننّفذ"
                  description="نحوّل الخطة لشغل حقيقي ونتيجة ملموسة."
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* =====================================================
            CTA
        ====================================================== */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="mt-10 sm:mt-14"
        >
          <div
            className="
              group
              relative
              overflow-hidden
              rounded-[2.25rem]
              bg-gradient-to-br
              from-primary-600
              via-primary-700
              to-primary-900
              px-6
              py-10
              text-white
              shadow-[0_30px_90px_rgba(234,179,8,0.15)]
              sm:px-10
              sm:py-12
              lg:px-14
            "
          >
            {/* Glow */}

            <motion.div
              className="
                pointer-events-none
                absolute
                -left-24
                -top-24
                h-72
                w-72
                rounded-full
                bg-white/10
                blur-[90px]
              "
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.06]
                [background-image:linear-gradient(45deg,rgba(255,255,255,.5)_1px,transparent_1px)]
                [background-size:30px_30px]
              "
            />

            <div
              className="
                relative
                z-10
                flex
                flex-col
                items-center
                justify-between
                gap-7
                text-center
                md:flex-row
                md:text-right
              "
            >
              <div>
                <div className="mb-3 flex items-center justify-center gap-2 md:justify-start">
                  <Sparkles size={16} />

                  <span className="text-xs font-medium text-white/65">
                    عندك مشروع مختلف؟
                  </span>
                </div>

                <h2 className="text-2xl font-black sm:text-3xl">
                  خلينا نحكي عن فكرتك.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-7 text-white/60">
                  لو مش لاقي الخدمة اللي محتاجها، كلمنا ونشوف مع بعض أنسب حل
                  لمشروعك.
                </p>
              </div>

              <Button
                href="/contact"
                variant="outline"
                hasEffects={false}
                rounded="full"
                className="
                  shrink-0
                  !border-white/30
                  !bg-white
                  !text-neutral-900
                  shadow-xl
                  transition-all
                  duration-300
                  hover:!bg-white/90
                  hover:!text-primary-700
                  hover:-translate-y-1
                  hover:shadow-2xl
                "
              >
                تواصل معانا
                <ArrowLeft size={17} />
              </Button>
            </div>
          </div>
        </motion.section>

        <div className="h-8 sm:h-12" />
      </Container>
    </main>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({ value, label }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.03,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 22,
      }}
      className="
        flex
        min-w-[105px]
        flex-col
        items-center
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        px-5
        py-3
        backdrop-blur-xl
      "
    >
      <motion.span
        className="text-lg font-black text-primary-300"
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {value}
      </motion.span>

      <span className="mt-0.5 text-[10px] text-white/35">{label}</span>
    </motion.div>
  );
}

/* =========================================================
   PROCESS STEP
========================================================= */

function ProcessStep({ number, title, description }) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 24,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-black/[0.05]
        bg-white
        p-5
        shadow-[0_10px_30px_rgba(0,0,0,0.025)]
        dark:border-white/10
        dark:bg-card
        dark:shadow-none
      "
    >
      <div className="flex items-start gap-4">
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-primary-600/10
            text-xs
            font-black
            text-primary-600
            transition-all
            duration-300
            group-hover:bg-primary-600
            group-hover:text-white
          "
        >
          {number}
        </div>

        <div>
          <h3 className="font-bold text-black dark:text-white">{title}</h3>

          <p className="mt-1 text-xs leading-6 text-black/40 dark:text-white/60">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   FLOATING DOT
========================================================= */

function FloatingDot({ className, delay = 0 }) {
  return (
    <motion.span
      className={`
        absolute
        h-1
        w-1
        rounded-full
        bg-primary-500/30
        ${className}
      `}
      animate={{
        y: [0, -20, 0],
        x: [0, 8, 0],
        opacity: [0.2, 0.7, 0.2],
        scale: [0.8, 1.3, 0.8],
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
