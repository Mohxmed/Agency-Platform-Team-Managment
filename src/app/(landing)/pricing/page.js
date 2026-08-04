"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, Loader2, ArrowLeft } from "lucide-react";

import { Container } from "@/features/landing";
import { OutlinedBadge } from "@/shared/ui/badges/OutlinedBadge";
import PricingCard from "@/shared/ui/cards/PricingCard";
import { PricingSkeleton } from "@/shared/ui/skeletons/Skeletons";
import { usePricing } from "@/features/landing/hooks/usePricing";
import { getDocumentById } from "@/lib/firestoreService";

/* =========================================================
   ANIMATION
========================================================= */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(7px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.97,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   PAGE
========================================================= */

export default function PricingPage() {
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const { plans, loading } = usePricing();

  useEffect(() => {
    getDocumentById("settings", "site").then(() => {
      setSettingsLoaded(true);
    }).catch(() => {
      setSettingsLoaded(true);
    });
  }, []);

  const processedPlans = useMemo(() => {
    return plans.map((plan) => ({
      ...plan,
      features: typeof plan.features === "string"
        ? plan.features.split("\n").filter(Boolean)
        : Array.isArray(plan.features) ? plan.features : [],
      popular: plan.popular === true || plan.popular === "true",
    }));
  }, [plans]);

  if (!settingsLoaded) {
    return (
      <main dir="rtl" className="relative min-h-screen bg-white flex items-center justify-center dark:bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-white
        py-8
        sm:py-12
        lg:py-16
        dark:bg-background
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main Glow */}

        <div
          style={{ animation: "pf-pulse 9s ease-in-out infinite" }}
          className="
            absolute
            -right-40
            -top-40
            h-[550px]
            w-[550px]
            rounded-full
            bg-primary-600/[0.07]
            blur-[140px]
          "
        />

        {/* Bottom Glow */}

        <div
          style={{ animation: "pf-drift 11s ease-in-out infinite" }}
          className="
            absolute
            -bottom-60
            -left-40
            h-[550px]
            w-[550px]
            rounded-full
            bg-primary-900/[0.055]
            blur-[140px]
          "
        />

        {/* Center Glow */}

        <div
          className="
            absolute
            left-1/2
            top-[35%]
            h-80
            w-80
            -translate-x-1/2
            rounded-full
            bg-primary-500/[0.025]
            blur-[120px]
          "
        />

        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
            [background-image:linear-gradient(rgba(0,0,0,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.5)_1px,transparent_1px)]
            [background-size:80px_80px]
            [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]
          "
        />
      </div>

      <Container className="relative z-10">
        {/* =====================================================
            HERO
        ====================================================== */}

        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-4xl text-center flex flex-col items-center gap-8"
        >
          {/* Badge */}

          <OutlinedBadge>
            <Zap size={14} />
            باقات مصممة على احتياجك
          </OutlinedBadge>
          {/* Heading */}

          <motion.h1
            variants={itemVariants}
            className="
            text-3xl
            font-black
            leading-[1.25]
            tracking-[-0.04em]
            text-neutral-950
            sm:text-4xl
            lg:text-6xl
            dark:text-white
            "
          >
            اختار الباقة المناسبة
            <span className="block text-primary-600">وخلينا نبدأ.</span>
          </motion.h1>

          {/* Description */}

          <motion.p
            variants={itemVariants}
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-8
              text-neutral-500
              sm:text-base
              dark:text-neutral-400
            "
          >
            حلول مرنة تناسب حجم مشروعك واحتياجاتك، من بداية بسيطة لحد إدارة
            متكاملة لكل تفاصيل حضورك الرقمي.
          </motion.p>
        </motion.section>

        {/* =====================================================
            PRICING GRID
        ====================================================== */}

        {loading ? (
          <PricingSkeleton />
        ) : processedPlans.length === 0 ? (
          <div className="mt-12 flex min-h-[300px] flex-col items-center justify-center rounded-[2rem] border border-black/[0.06] bg-neutral-50 text-center dark:border-white/10 dark:bg-card">
            <Sparkles size={42} className="text-black/20 dark:text-white/20" />
            <h3 className="mt-4 text-lg font-bold text-black dark:text-white">لا توجد باقات متاحة حاليًا</h3>
            <p className="mt-2 text-sm text-black/40 dark:text-white/50">سنضيف الباقات قريبًا.</p>
          </div>
        ) : (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="mt-12 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            {processedPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
              />
            ))}
          </motion.section>
        )}

        {/* =====================================================
            CUSTOM PACKAGE CTA
        ====================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 35,
            filter: "blur(7px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            mt-8
            overflow-hidden
            rounded-[2rem]
            border
            border-black/[0.06]
            bg-neutral-50
            px-6
            py-8
            sm:px-9
            sm:py-9
            dark:border-white/10
            dark:bg-card
          "
        >
          {/* Glow */}

          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-24
              h-64
              w-64
              rounded-full
              bg-primary-600/[0.07]
              blur-[80px]
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
            gap-6
            text-center
            md:flex-row
            md:text-right
          "
          >
            <div>
              <div
                className="
                mb-2
                flex
                items-center
                justify-center
                gap-2
                md:justify-start
              "
              >
                <Sparkles size={15} className="text-primary-600" />

                <span
                  className="
                  text-[10px]
                  font-bold
                  tracking-[0.15em]
                  text-primary-600
                "
                >
                  CUSTOM PACKAGE
                </span>
              </div>

              <h2
                className="
                text-xl
                font-black
                text-neutral-950
                sm:text-2xl
                dark:text-white
              "
              >
                محتاج حاجة متفصلة على مشروعك؟
              </h2>

              <p
                className="
                mt-2
                max-w-xl
                text-xs
                leading-6
                text-neutral-500
                sm:text-sm
                dark:text-neutral-400
              "
              >
                مش لازم تختار باقة ثابتة. نقدر نبني لك باقة مناسبة بالضبط
                لاحتياجات مشروعك.
              </p>
            </div>

            <motion.a
              href="/contact"
              whileHover={{
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="
                group
                flex
                shrink-0
                items-center
                gap-2
                rounded-full
                bg-neutral-950
                px-6
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:bg-primary-600
                hover:shadow-xl
                hover:shadow-primary-600/20
              "
            >
              كلمنا عن مشروعك
              <ArrowLeft
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-x-1
                "
              />
            </motion.a>
          </div>
        </motion.section>

        <div className="h-6" />
      </Container>
    </main>
  );
}
