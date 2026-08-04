"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@/features/landing";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

import IconButton from "@/shared/ui/buttons/IconButtons";
import ClientCard from "@/shared/ui/cards/ClientCard";
import PageGridCardView from "@/features/landing/pages/PageGridCardView";

import { useClients } from "@/features/landing/hooks/useClients";
import { ClientsSkeleton } from "@/shared/ui/skeletons/Skeletons";

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const headerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const cardItem = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const paginationVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   CONSTANTS
========================================================= */

const ITEMS_PER_PAGE = 6;

/* =========================================================
   PAGE
========================================================= */

export default function ClientsPage() {
  const { clients, loading } = useClients();
  const [currentPage, setCurrentPage] = useState(1);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(1, Math.ceil(clients.length / ITEMS_PER_PAGE));

  const currentPageClamped = Math.min(currentPage, totalPages);

  const currentClients = useMemo(() => {
    const startIndex = (currentPageClamped - 1) * ITEMS_PER_PAGE;

    return clients.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [clients, currentPageClamped]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToPrevious = () => {
    goToPage(currentPage - 1);
  };

  const goToNext = () => {
    goToPage(currentPage + 1);
  };

  /* =========================================================
     PAGE NUMBERS
  ========================================================= */

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-white dark:bg-background">
        <Container>
          <ClientsSkeleton />
        </Container>
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
        py-12
        sm:py-16
        lg:py-20
        dark:bg-background
      "
    >
      {/* =====================================================
          PAGE AMBIENT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[420px]
          w-[420px]
          -translate-x-1/2
          rounded-full
          [background:radial-gradient(circle_at_center,rgba(217,4,41,0.035),transparent_62%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-180px]
          top-[25%]
          h-[350px]
          w-[350px]
          rounded-full
          [background:radial-gradient(circle_at_center,rgba(217,4,41,0.025),transparent_62%)]
        "
      />

      <Container>
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <motion.div
          className="
            relative
            mx-auto
            mb-12
            max-w-2xl
            text-center
            sm:mb-16
          "
          variants={headerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.4,
          }}
        >
          {/* Golden Glow (static gradient — no filter) */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-32
              w-32
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              [background:radial-gradient(circle_at_center,rgba(251,191,36,0.10),transparent_62%)]
            "
          />

          {/* Small Label */}

          <motion.div
            variants={fadeUp}
            className="
              relative
              mb-5
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <motion.span
              className="
                h-px
                w-8
                bg-gradient-to-r
                from-transparent
                to-amber-400/60
              "
              initial={{
                width: 0,
                opacity: 0,
              }}
              whileInView={{
                width: 32,
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: 0.25,
              }}
            />

            {/* Star */}

            <motion.div
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-amber-400/30
                bg-amber-50
                text-amber-500
                shadow-[0_0_30px_rgba(245,158,11,0.15)]
                dark:bg-amber-500/10
              "
              whileHover={{
                scale: 1.08,
                rotate: 8,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
            >
              <span
                className="
                  absolute
                  inset-0
                  rounded-full
                  [background:radial-gradient(circle_at_center,rgba(251,191,36,0.20),transparent_65%)]
                "
              />

              <div
                style={{ animation: "pf-wobble 4s ease-in-out infinite" }}
              >
                <Star
                  size={17}
                  fill="currentColor"
                  strokeWidth={1.5}
                  className="relative"
                />
              </div>
            </motion.div>

            <motion.span
              className="
                h-px
                w-8
                bg-gradient-to-l
                from-transparent
                to-amber-400/60
              "
              initial={{
                width: 0,
                opacity: 0,
              }}
              whileInView={{
                width: 32,
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: 0.25,
              }}
            />
          </motion.div>

          {/* Eyebrow */}

          <motion.p
            variants={fadeUp}
            className="
              relative
              text-[9px]
              font-bold
              uppercase
              tracking-[0.3em]
              text-amber-500/80
              sm:text-[10px]
            "
          >
            Featured Partners
          </motion.p>

          {/* Title */}

          <motion.h1
            variants={fadeUp}
            className="
              relative
              mt-3
              text-3xl
              font-black
              tracking-[-0.035em]
              text-black
              sm:text-4xl
              lg:text-5xl
              dark:text-white
            "
          >
            شركاء نفتخر بهم
          </motion.h1>

          {/* Description */}

          <motion.p
            variants={fadeUp}
            className="
              relative
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-black/40
              sm:text-base
              sm:leading-8
              dark:text-white/60
            "
          >
            رحلة طويلة خضناها مع نخبة من أقوى المعلمين وصنّاع المحتوى
          </motion.p>
        </motion.div>

        {/* =====================================================
            CLIENTS
        ====================================================== */}

        <section className="mt-12 sm:mt-16 lg:mt-20">
          {/* Section Header */}

          <motion.div
            className="
              mb-6
              flex
              items-center
              justify-between
            "
            initial={{
              opacity: 0,
              y: 12,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.5,
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-center gap-2.5">
              <motion.span
                key={currentPage}
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  text-[10px]
                  font-bold
                  tracking-[0.2em]
                  text-primary-600
                "
              >
                {String(currentPage).padStart(2, "0")}
              </motion.span>

              <span className="h-px w-7 bg-primary-600/30" />

              <span
                className="
                  text-[10px]
                  font-semibold
                  tracking-[0.14em]
                  text-black/30
                  dark:text-white/40
                "
              >
                OUR CLIENTS
              </span>
            </div>

            <span
              className="
                text-[10px]
                font-medium
                text-black/25
                dark:text-white/40
              "
            >
              {clients.length} شركاء
            </span>
          </motion.div>

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {clients.length === 0 ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                rounded-[2rem]
                bg-neutral-50
                text-center
                dark:bg-card
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  text-amber-500
                  shadow-sm
                  dark:bg-white/5
                "
              >
                <Star size={22} fill="currentColor" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-black dark:text-white">
                لا يوجد عملاء حتى الآن
              </h2>

              <p className="mt-2 text-sm text-black/35 dark:text-white/50">
                سيتم عرض العملاء هنا بمجرد إضافتهم.
              </p>
            </motion.div>
          ) : (
            <>
              {/* =================================================
                  CARDS
              ================================================== */}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  variants={cardContainer}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <PageGridCardView>
                    {currentClients.map((client, index) => (
                      <motion.div key={client.id ?? index} variants={cardItem}>
                        <motion.div
                          whileHover={{
                            y: -5,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 25,
                          }}
                        >
                          <ClientCard teacher={client} />
                        </motion.div>
                      </motion.div>
                    ))}
                  </PageGridCardView>
                </motion.div>
              </AnimatePresence>

              {/* =================================================
                  PAGINATION
              ================================================== */}

              {totalPages > 1 && (
                <motion.div
                  className="
                    mt-10
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    sm:mt-12
                  "
                  variants={paginationVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.5,
                  }}
                >
                  {/* Previous */}

                  <motion.div
                    whileHover={
                      currentPage !== 1
                        ? {
                            scale: 1.06,
                            x: 2,
                          }
                        : undefined
                    }
                    whileTap={{
                      scale: 0.92,
                    }}
                  >
                    <IconButton
                      variant="outline"
                      rounded="full"
                      disabled={currentPage === 1}
                      onClick={goToPrevious}
                      aria-label="الصفحة السابقة"
                      className={`
                        border-black/10
                        transition
                        ${
                          currentPage === 1
                            ? "cursor-not-allowed opacity-30"
                            : "text-black/50 hover:border-black hover:bg-black hover:text-white dark:border-white/15 dark:text-white/60 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                        }
                      `}
                    >
                      <ArrowRight size={16} />
                    </IconButton>
                  </motion.div>

                  {/* Page Numbers */}

                  <div className="flex items-center gap-1.5">
                    {pageNumbers.map((page) => {
                      const isActive = currentPage === page;

                      return (
                        <motion.div
                          key={page}
                          whileHover={{
                            scale: isActive ? 1.04 : 1.08,
                          }}
                          whileTap={{
                            scale: 0.9,
                          }}
                        >
                          <IconButton
                            variant={isActive ? "primary" : "outline"}
                            rounded="full"
                            onClick={() => goToPage(page)}
                            aria-label={`الصفحة ${page}`}
                            aria-current={isActive ? "page" : undefined}
                            className={`
                              transition
                              ${
                                isActive
                                  ? "shadow-sm"
                                  : "border-black/10 text-black/45 hover:border-black hover:bg-black hover:text-white dark:border-white/15 dark:text-white/50 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                              }
                            `}
                          >
                            {page}
                          </IconButton>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Next */}

                  <motion.div
                    whileHover={
                      currentPage !== totalPages
                        ? {
                            scale: 1.06,
                            x: -2,
                          }
                        : undefined
                    }
                    whileTap={{
                      scale: 0.92,
                    }}
                  >
                    <IconButton
                      variant="outline"
                      rounded="full"
                      disabled={currentPage === totalPages}
                      onClick={goToNext}
                      aria-label="الصفحة التالية"
                      className={`
                        border-black/10
                        transition
                        ${
                          currentPage === totalPages
                            ? "cursor-not-allowed opacity-30"
                            : "text-black/50 hover:border-black hover:bg-black hover:text-white dark:border-white/15 dark:text-white/60 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                        }
                      `}
                    >
                      <ArrowLeft size={16} />
                    </IconButton>
                  </motion.div>
                </motion.div>
              )}
            </>
          )}
        </section>
      </Container>
    </main>
  );
}

/* =========================================================
   FIRESTORE TIMESTAMP HELPER
========================================================= */

function getTimestampValue(timestamp) {
  if (!timestamp) return 0;

  // Firebase Timestamp
  if (typeof timestamp?.toMillis === "function") {
    return timestamp.toMillis();
  }

  // JS Date
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }

  // Serialized timestamp
  if (typeof timestamp === "object" && typeof timestamp.seconds === "number") {
    return (
      timestamp.seconds * 1000 +
      Math.floor((timestamp.nanoseconds || 0) / 1000000)
    );
  }

  // String / number
  const value = new Date(timestamp).getTime();

  return Number.isNaN(value) ? 0 : value;
}
