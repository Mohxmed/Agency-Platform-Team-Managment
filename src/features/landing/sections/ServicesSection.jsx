"use client";

import { motion } from "framer-motion";
import { ROUTES } from "@/constants/routes";

// ICONS
import { Sparkles } from "lucide-react";

// Components
import { Container } from "@/features/landing";
import ServiceCard from "@/shared/ui/cards/ServiceCard";
import SectionHeading from "@/features/landing/components/SectionHeading";
import { ServicesSkeleton } from "@/shared/ui/skeletons/Skeletons";
import { resolveIcon } from "@/shared/ui/icons/resolveIcon";
import { useServices } from "@/features/landing/hooks/useServices";
import { useSettings } from "@/contexts/SettingsContext";

const moreCardDefaults = {
  more: "true",
  title: "المزيد..",
  description:
    "وغيرها من الخدمات والحلول اللي بنقدمها، تقدر تشوف أكتر في صفحة خدماتنا",
  icon: Sparkles,
};

/* =========================================================
   CARD ANIMATION
========================================================= */

const cardsContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 70,
    scale: 0.92,
    rotateX: 8,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,

    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   SECTION
========================================================= */

export default function ServicesSection() {
  const { services, loading } = useServices();
  const { settings } = useSettings();
  const content = settings.content?.services || {};

  const badge = content.badge || "خدماتنا";
  const title = content.title || "كل شئ انت محتاجه";
  const redTitle = content.redTitle || "";
  const description =
    content.description ||
    "احنا بندمج الابداع والتخطيط والتكنولوجيا عشان نقدم حلول تسويقية تساعد المشاريع تبني براندات قوية تحقق ارقام قياسية ونمو ملحوظ على مدى زمني قصير";

  const moreCard = {
    ...moreCardDefaults,
    title: content.moreTitle || moreCardDefaults.title,
    description: content.moreDescription || moreCardDefaults.description,
    moreLink: content.moreLink || ROUTES.SERVICES,
  };

  const featured = services
    .filter(
      (svc) =>
        (svc.active === true || svc.active === "true") &&
        (svc.featured === true || svc.featured === "true"),
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 2)
    .map((svc) => ({
      ...svc,
      icon: resolveIcon(svc.icon),
    }));

  const displayServices = loading ? [] : [...featured, moreCard];

  return (
    <section
      id="services"
      className="relative isolate overflow-hidden py-18 pb-24"
    >
      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-bg-base absolute inset-0" />

        <div className="hero-orb-red absolute -start-32 -top-24 h-[30rem] w-[30rem] rounded-full opacity-70" />

        <div className="hero-orb-violet absolute -bottom-32 -end-40 h-[32rem] w-[32rem] rounded-full opacity-70" />

        <div className="hero-bg-grid absolute inset-0 opacity-60" />

        <div className="hero-bg-noise absolute inset-0" />

        <div className="hero-bg-vignette absolute inset-0" />
      </div>

      <Container>
        {/* =====================================================
            HEADER
        ====================================================== */}

        <SectionHeading
          badge={badge}
          badgeIcon={<Sparkles />}
          title={title}
          redTitle={redTitle}
        >
          {description}
        </SectionHeading>

        {/* =====================================================
            SERVICES GRID
        ====================================================== */}

        {loading ? (
          <div className="mt-12">
            <ServicesSkeleton />
          </div>
        ) : (
          <motion.div
            variants={cardsContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            style={{ perspective: 1200 }}
            className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {displayServices.map((service, i) => (
              <motion.div
                key={service.id || "more"}
                variants={cardAnimation}
                whileHover={{
                  y: -10,
                  scale: 1.015,
                  rotateZ: i === 1 ? -0.5 : 0.5,
                  transition: { duration: 0.35, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <ServiceCard
                  varient={service.more ? "black" : "default"}
                  service={service}
                  moreHref={service.moreLink}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
