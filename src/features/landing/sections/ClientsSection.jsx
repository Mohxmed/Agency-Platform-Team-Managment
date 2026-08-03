"use client";

import { motion } from "framer-motion";

import { useClients } from "@/features/landing/hooks/useClients";

// UI
import Button from "@/shared/ui/buttons/Buttons";
import ClientCard from "@/shared/ui/cards/ClientCard";
import SwiperFadeEdges from "@/features/landing/components/SwiperFadeEdges";
import Marquee from "@/features/landing/components/Marquee";
import { OutlinedBadge } from "@/shared/ui/badges/OutlinedBadge";
import SectionTitle from "@/features/landing/layout/SectionTitle";
import { Container } from "@/features/landing";

// Icons
import {
  Star,
  Users,
} from "lucide-react";

import { HomeClientsSkeleton } from "@/shared/ui/skeletons/Skeletons";

import { ROUTES } from "@/constants/routes";
import { useSettings } from "@/contexts/SettingsContext";

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const sectionVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const sliderVariants = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   CLIENTS SECTION
========================================================= */

export default function ClientsSection() {
  const { clients, loading, error } = useClients();
  const { settings } = useSettings();
  const content = settings.content?.clients || {};

  const badge = content.badge || "شركاء النجاح";
  const title = content.title || "ابرز";
  const redTitle = content.redTitle || "شركائنا";
  const description =
    content.description ||
    "خلف كل نجاح قصة، وخلف كل قصة شراكة حقيقية. نفخر بأننا كنا جزءًا من رحلة العديد من المعلمين وصناع المحتوى، وساهمنا في تحويل أفكارهم إلى تأثير يصل إلى الآلاف والملايين.";
  const ctaPrimary = content.ctaPrimary || "تصفح جميع العملاء";
  const ctaPrimaryLink = content.ctaPrimaryLink || ROUTES.CLIENTS;
  const ctaSecondary = content.ctaSecondary || "انضم الينا";
  const ctaSecondaryLink = content.ctaSecondaryLink || ROUTES.CONTACT;

  return (
    <section
      id="clients"
      className="
        relative
        isolate
        overflow-hidden
        bg-linear-to-bl
        from-primary-600
        to-primary-900
        py-18
      "
    >
      {/* =====================================================
          PREMIUM BACKGROUND
      ====================================================== */}

      {/* Main Glow */}

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
          top-1/2
          -z-10
          h-[500px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-primary-300/10
          blur-[140px]
        "
      />

      {/* Top Glow */}

      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -right-40
          -top-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-white/10
          blur-[130px]
        "
      />

      {/* Bottom Glow */}

      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -bottom-48
          -left-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-black/20
          blur-[130px]
        "
      />

      {/* Decorative Star */}

      <motion.div
        animate={{
          rotate: [0, 8, 0],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          right-[8%]
          top-[18%]
          text-white/20
        "
      >
        <Star
          size={24}
          fill="currentColor"
        />
      </motion.div>

      {/* Decorative Star */}

      <motion.div
        animate={{
          rotate: [0, -10, 0],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          bottom-[18%]
          left-[8%]
          text-white/15
        "
      >
        <Star
          size={18}
          fill="currentColor"
        />
      </motion.div>

      <Container>
        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="
            mx-auto
            max-w-3xl
            text-center
          "
        >
          {/* Badge */}

          <motion.div
            variants={fadeUp}
            className="
              flex
              w-full
              justify-center
            "
          >
            <motion.div
              whileHover={{
                scale: 1.04,
                y: -2,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <OutlinedBadge variant="white">
                <motion.span
                  animate={{
                    rotate: [0, -8, 8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut",
                  }}
                >
                  <Users size={16} />
                </motion.span>

                {badge}
              </OutlinedBadge>
            </motion.div>
          </motion.div>

          {/* Title */}

          <motion.div variants={fadeUp}>
            <SectionTitle
              variant="light"
              title={title}
              redTitle={redTitle}
            >
              {description}
            </SectionTitle>
          </motion.div>
        </motion.div>

        {/* =====================================================
            CLIENTS SLIDER
        ====================================================== */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          variants={sliderVariants}
          className="mt-4"
        >
          {/* ===================================================
              LOADING
          =================================================== */}

          {loading && <HomeClientsSkeleton />}

          {/* ===================================================
              ERROR
          =================================================== */}

          {!loading && error && (
            <div
              className="
                flex
                min-h-[260px]
                items-center
                justify-center
                text-center
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-bold
                    text-white/70
                  "
                >
                  تعذر تحميل بيانات العملاء حاليًا.
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    text-white/40
                  "
                >
                  حاول تحديث الصفحة مرة أخرى.
                </p>
              </div>
            </div>
          )}

          {/* ===================================================
              EMPTY
          =================================================== */}

          {!loading &&
            !error &&
            clients.length === 0 && (
              <div
                className="
                  flex
                  min-h-[260px]
                  items-center
                  justify-center
                  text-center
                "
              >
                <div>
                  <Users
                    className="
                      mx-auto
                      h-10
                      w-10
                      text-white/30
                    "
                  />

                  <p
                    className="
                      mt-4
                      text-sm
                      font-bold
                      text-white/60
                    "
                  >
                    لا يوجد عملاء حتى الآن.
                  </p>
                </div>
              </div>
            )}

          {/* ===================================================
              INFINITE CLIENTS MARQUEE
          =================================================== */}

          {!loading &&
            !error &&
            clients.length > 0 && (
              <SwiperFadeEdges>
                <Marquee slideClassName="h-full px-4 py-8">
                  {clients.map((client) => (
                    <motion.div
                      key={client.id}
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
                        amount: 0.1,
                      }}
                      transition={{
                        duration: 0.7,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                      className="h-full"
                    >
                      <ClientCard
                        teacher={client}
                      />
                    </motion.div>
                  ))}
                </Marquee>
              </SwiperFadeEdges>
            )}
        </motion.div>

        {/* =====================================================
            CTA
        ====================================================== */}

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
            amount: 0.4,
          }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-8
            flex
            flex-col
            items-center
            justify-center
            gap-3
            sm:flex-row
            sm:gap-4
          "
        >
          {/* All Clients */}

          <motion.div
            whileHover={{
              y: -3,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Button
              variant="outline"
              href={ctaPrimaryLink}
            >
              <motion.span
                whileHover={{
                  scale: 1.1,
                }}
              >
                <Users />
              </motion.span>

              {ctaPrimary}
            </Button>
          </motion.div>

          {/* Join */}

          <motion.div
            whileHover={{
              y: -3,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Button href={ctaSecondaryLink}>
              <motion.span
                animate={{
                  rotate: [0, -8, 8, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              >
                <Star />
              </motion.span>

              {ctaSecondary}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
