"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ROUTES } from "@/constants/routes";

// ICONS
import { Sparkles } from "lucide-react";

// Components
import { Container } from "@/features/landing";
import SectionTitle from "@/features/landing/layout/SectionTitle";
import ServiceCard from "@/shared/ui/cards/ServiceCard";
import { OutlinedBadge } from "@/shared/ui/badges/OutlinedBadge";
import { ServicesSkeleton } from "@/shared/ui/skeletons/Skeletons";
import { resolveIcon } from "@/shared/ui/icons/resolveIcon";
import { collection, query, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const moreCard = {
  more: "true",
  title: "المزيد..",
  description:
    "وغيرها من الخدمات والحلول اللي بنقدمها، تقدر تشوف أكتر في صفحة خدماتنا",
  icon: Sparkles,
};

/* =========================================================
   HEADER ANIMATION
========================================================= */

const headerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const headerItem = {
  hidden: {
    opacity: 0,
    y: 25,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
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
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchFeatured() {
      try {
        const q = query(
          collection(db, "services"),
          limit(50),
        );
        const snapshot = await getDocs(q);
        const allServices = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const featuredServices = allServices
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
        if (!cancelled) {
          setFeatured(featuredServices);
        }
      } catch (err) {
        console.error("Failed to load featured services:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFeatured();
    return () => { cancelled = true; };
  }, []);

  const displayServices = loading
    ? []
    : [...featured, moreCard];

  return (
    <section
      id="services"
      className="
        relative
        overflow-hidden
        py-18
        pb-24
      "
    >

      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[20%]
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-primary-500/[0.035]
          blur-[140px]
        "
      />

      <Container>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.div
          variants={headerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.35,
          }}
          className="
            mx-auto
            max-w-3xl
            text-center
          "
        >

          {/* Badge */}

          <motion.div
            variants={headerItem}
            className="
              flex
              w-full
              justify-center
            "
          >
            <OutlinedBadge>
              <Sparkles />
              خدماتنا
            </OutlinedBadge>
          </motion.div>

          {/* Title */}

          <motion.div variants={headerItem}>
            <SectionTitle title="كل شئ انت محتاجه">
              احنا بندمج الابداع والتخطيط والتكنولوجيا عشان نقدم حلول تسويقية
              تساعد المشاريع تبني براندات قوية تحقق ارقام قياسية ونمو ملحوظ على
              مدى زمني قصير
            </SectionTitle>
          </motion.div>

        </motion.div>

        {/* =====================================================
            SERVICES GRID
        ====================================================== */}

        {loading ? (
          <div className="mt-12"><ServicesSkeleton /></div>
        ) : (
          <motion.div
            variants={cardsContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.18,
            }}
            style={{
              perspective: 1200,
            }}
            className="
              mt-12
              grid
              gap-8
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {displayServices.map((service, i) => (

              <motion.div
                key={service.id || "more"}
                variants={cardAnimation}
                whileHover={{
                  y: -10,
                  scale: 1.015,
                  rotateZ: i === 1 ? -0.5 : 0.5,
                  transition: {
                    duration: 0.35,
                    ease: "easeOut",
                  },
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="h-full"
              >

                <ServiceCard
                  varient={service.more ? "black" : "default"}
                  service={service}
                />

              </motion.div>

            ))}

          </motion.div>
        )}

      </Container>
    </section>
  );
}
