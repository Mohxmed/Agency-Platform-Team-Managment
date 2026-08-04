"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  FolderOpen,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import { Container } from "@/features/landing";
import PageGridCardView from "@/features/landing/pages/PageGridCardView";
import ProjectCard from "@/shared/ui/cards/ProjectCard";
import IconButton from "@/shared/ui/buttons/IconButtons";

import { useWorks } from "@/features/landing/hooks/useWorks";
import { PortfolioSkeleton } from "@/shared/ui/skeletons/Skeletons";

/* =========================================================
   CONSTANTS
========================================================= */

const CARD_PER_PAGE = 6;

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const pageVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const revealUp = {
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

const projectVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.97,
    filter: "blur(8px)",
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      delay: index * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),

  exit: {
    opacity: 0,
    y: -15,
    scale: 0.97,
    filter: "blur(6px)",
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function PortfolioPage() {
  const { works: projects, categories, categoryMap, loading } = useWorks();

  const [activeFilter, setActiveFilter] = useState("الكل");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  /* =========================================================
     CATEGORIES FILTERS
  ========================================================= */

  const filters = useMemo(() => {
    const usedCategoryIds = [
      ...new Set(projects.map((project) => project.categoryId).filter(Boolean)),
    ];

    const categoryNames = usedCategoryIds
      .map((categoryId) => categoryMap[categoryId]?.name)
      .filter(Boolean);

    return ["الكل", ...categoryNames];
  }, [projects, categoryMap]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    const usedCategoryIds = new Set(
      projects.map((project) => project.categoryId).filter(Boolean),
    );

    return {
      total: projects.length,
      categories: usedCategoryIds.size,
    };
  }, [projects]);

  /* =========================================================
     FILTER + SEARCH + SORT
  ========================================================= */

  const processedProjects = useMemo(() => {
    let result = [...projects];

    /* =======================================================
       FILTER BY CATEGORY NAME
    ======================================================= */

    if (activeFilter !== "الكل") {
      result = result.filter((project) => {
        const category = categoryMap[project.categoryId];

        return category?.name === activeFilter;
      });
    }

    /* =======================================================
       SEARCH
    ======================================================= */

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((project) => {
        const title = project.title?.toLowerCase() || "";

        const description = project.description?.toLowerCase() || "";

        const categoryName =
          categoryMap[project.categoryId]?.name?.toLowerCase() || "";

        return (
          title.includes(query) ||
          description.includes(query) ||
          categoryName.includes(query)
        );
      });
    }

    /* =======================================================
       SORT
    ======================================================= */

    if (sort === "newest") {
      result.sort((a, b) => {
        const yearA = Number(a.year || 0);
        const yearB = Number(b.year || 0);

        return yearB - yearA;
      });
    }

    if (sort === "oldest") {
      result.sort((a, b) => {
        const yearA = Number(a.year || 0);
        const yearB = Number(b.year || 0);

        return yearA - yearB;
      });
    }

    return result;
  }, [projects, categoryMap, activeFilter, search, sort]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.ceil(processedProjects.length / CARD_PER_PAGE);

  const currentPageClamped = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const currentProjects = useMemo(() => {
    const startIndex = (currentPageClamped - 1) * CARD_PER_PAGE;

    return processedProjects.slice(startIndex, startIndex + CARD_PER_PAGE);
  }, [processedProjects, currentPageClamped]);

  /* =========================================================
     HANDLERS
  ========================================================= */

  function handleFilterChange(filter) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setCurrentPage(1);
  }

  function handleSortChange(event) {
    setSort(event.target.value);
    setCurrentPage(1);
  }

  function handlePagination(page) {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function clearSearch() {
    setSearch("");
    setCurrentPage(1);
  }

  function clearAllFilters() {
    setActiveFilter("الكل");
    setSearch("");
    setSort("newest");
    setCurrentPage(1);
  }

  const hasActiveFilters =
    activeFilter !== "الكل" || search.trim() !== "" || sort !== "newest";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <motion.main
      dir="rtl"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="
        min-h-screen
        overflow-hidden
        bg-white
        py-8
        sm:py-10
        lg:py-12
        dark:bg-background
      "
    >
      <Container>
        {/* =====================================================
            HERO
        ====================================================== */}

        <motion.section
          variants={revealUp}
          className="
            group
            relative
            overflow-hidden
            rounded-[1.75rem]
            bg-primary-600
            px-5
            py-7
            text-white
            shadow-sm
            sm:px-8
            sm:py-8
            lg:px-10
          "
        >
          {/* Glow */}

          <div
            style={{ animation: "pf-glow 7s ease-in-out infinite" }}
            className="
              pointer-events-none
              absolute
              -left-20
              -top-20
              h-56
              w-56
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            style={{ animation: "pf-glow-rev 8s ease-in-out infinite" }}
            className="
              pointer-events-none
              absolute
              -bottom-24
              right-0
              h-60
              w-60
              rounded-full
              bg-black/10
              blur-3xl
            "
          />

          {/* Giant Plus */}

          <div
            style={{ animation: "pf-wobble 8s ease-in-out infinite" }}
            className="
              pointer-events-none
              absolute
              left-5
              top-2
              select-none
              text-[100px]
              font-black
              leading-none
              text-white/[0.05]
              sm:text-[130px]
            "
          >
            +
          </div>

          <HeroParticle className="left-[38%] top-[20%]" delay={0} />

          <HeroParticle className="left-[55%] bottom-[20%]" delay={1.5} />

          <HeroParticle className="right-[12%] top-[25%]" delay={2} />

          <div className="relative z-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Text */}

              <div className="max-w-2xl">
                <motion.div
                  variants={revealUp}
                  className="
                    mb-3
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    backdrop-blur-sm
                  "
                >
                  <span
                    style={{ animation: "pf-wobble 2.5s ease-in-out infinite" }}
                  >
                    <Sparkles size={13} />
                  </span>

                  <span>أعمالنا ومشاريعنا</span>
                </motion.div>

                <motion.h1
                  variants={revealUp}
                  className="
                    text-2xl
                    font-black
                    leading-tight
                    tracking-tight
                    sm:text-3xl
                  "
                >
                  محفظة أعمال نقطة
                </motion.h1>

                <motion.p
                  variants={revealUp}
                  className="
                    mt-2
                    max-w-xl
                    text-xs
                    leading-6
                    text-white/70
                    sm:text-sm
                    sm:leading-7
                  "
                >
                  استكشف مجموعة من المشاريع والأعمال التي نفذناها بشغف واهتمام
                  بالتفاصيل.
                </motion.p>
              </div>

              {/* Stats */}

              <motion.div variants={revealUp} className="flex shrink-0 gap-2">
                <AnimatedStat value={`${stats.total}+`} label="مشروع" />

                <AnimatedStat value={stats.categories} label="تصنيفات" />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* =====================================================
            FILTERS
        ====================================================== */}

        <motion.section
          variants={revealUp}
          className="
            mt-7
            overflow-hidden
            rounded-[1.75rem]
            border
            border-black/5
            bg-neutral-50
            p-4
            sm:p-6
            dark:border-white/10
            dark:bg-card
          "
        >
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-black dark:text-white">استكشف الأعمال</h2>

              <p className="mt-1 text-xs text-black/45 sm:text-sm dark:text-white/50">
                ابحث أو اختر تصنيف للوصول للمشروع المناسب
              </p>
            </div>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  type="button"
                  onClick={clearAllFilters}
                  initial={{
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 10,
                  }}
                  whileHover={{
                    x: -3,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="
                    flex
                    w-fit
                    items-center
                    gap-1.5
                    text-xs
                    font-medium
                    text-black/45
                    transition
                    hover:text-primary-600
                    dark:text-white/50
                    dark:hover:text-primary-400
                  "
                >
                  <X size={14} />
                  مسح الكل
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Search + Sort */}

          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}

            <motion.div
              whileHover={{
                y: -2,
              }}
              className="relative flex-1"
            >
              <Search
                size={18}
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-primary-600
                "
              />

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="ابحث باسم المشروع أو التصنيف..."
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-black/5
                  bg-white
                  pl-11
                  pr-11
                  text-sm
                  text-black
                  shadow-sm
                  outline-none
                  transition
                  placeholder:text-black/35
                  hover:border-black/10
                  focus:border-primary-600/30
                  focus:ring-4
                  focus:ring-primary-600/10
                  dark:border-white/10
                  dark:bg-black/40
                  dark:text-white
                  dark:placeholder:text-white/30
                  dark:hover:border-white/20
                "
              />

              <AnimatePresence>
                {search && (
                  <motion.button
                    type="button"
                    onClick={clearSearch}
                    aria-label="مسح البحث"
                    initial={{
                      opacity: 0,
                      scale: 0.5,
                      rotate: -90,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      rotate: 90,
                    }}
                    whileHover={{
                      scale: 1.12,
                      rotate: 90,
                    }}
                    whileTap={{
                      scale: 0.85,
                    }}
                    className="
                      absolute
                      left-3
                      top-1/2
                      flex
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      p-1.5
                      text-black/35
                      transition
                      hover:bg-black/5
                      hover:text-black
                      dark:text-white/35
                      dark:hover:bg-white/10
                      dark:hover:text-white
                    "
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Sort */}

            <motion.div
              whileHover={{
                y: -2,
              }}
              className="relative lg:w-52"
            >
              <SlidersHorizontal
                size={17}
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-black/35
                  dark:text-white/35
                "
              />

              <select
                value={sort}
                onChange={handleSortChange}
                className="
                  h-12
                  w-full
                  appearance-none
                  rounded-2xl
                  border
                  border-black/5
                  bg-white
                  px-4
                  pr-11
                  text-sm
                  text-black
                  shadow-sm
                  outline-none
                  transition
                  hover:border-black/10
                  focus:border-primary-600/30
                  focus:ring-4
                  focus:ring-primary-600/10
                  dark:border-white/10
                  dark:bg-black/40
                  dark:text-white
                  dark:hover:border-white/20
                "
              >
                <option value="newest">الأحدث</option>

                <option value="oldest">الأقدم</option>
              </select>
            </motion.div>
          </div>

          {/* Categories */}

          <motion.div
            variants={pageVariants}
            className="mt-5 flex flex-wrap gap-2"
          >
            {loading ? (
              <div className="text-xs text-black/40 dark:text-white/50">بنحمل التصنيفات...</div>
            ) : (
              filters.map((filter, index) => {
                const isActive = filter === activeFilter;

                return (
                  <motion.button
                    key={filter}
                    type="button"
                    onClick={() => handleFilterChange(filter)}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.4,
                    }}
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.94,
                    }}
                    className={`
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      px-4
                      py-2.5
                      text-xs
                      font-medium
                      transition-all
                      sm:px-5
                      sm:text-sm

                      ${
                        isActive
                          ? "bg-black text-white shadow-lg shadow-black/10"
                          : "border border-black/5 bg-white text-black/55 hover:border-black/10 hover:bg-black/[0.03] hover:text-black dark:border-white/10 dark:bg-card dark:text-white/60 dark:hover:border-white/25 dark:hover:bg-white/5 dark:hover:text-white"
                      }
                    `}
                  >
                    <AnimatePresence mode="popLayout">
                      {isActive && (
                        <motion.span
                          initial={{
                            opacity: 0,
                            scale: 0,
                            rotate: -90,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0,
                            rotate: 90,
                          }}
                        >
                          <Check size={14} />
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {filter}
                  </motion.button>
                );
              })
            )}
          </motion.div>
        </motion.section>

        {/* =====================================================
            RESULTS HEADER
        ====================================================== */}

        <motion.section
          variants={revealUp}
          className="
            mt-8
            flex
            flex-col
            gap-4
            border-b
            border-black/5
            pb-5
            sm:flex-row
            dark:border-white/10
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{
                  rotate: -8,
                  scale: 1.08,
                }}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary-600/10
                  text-primary-600
                "
              >
                <FolderOpen size={17} />
              </motion.div>

              <div>
                <h2 className="text-base font-bold text-black sm:text-lg dark:text-white">
                  المشاريع
                </h2>

                <p className="mt-0.5 text-xs text-black/40 dark:text-white/50">
                  عرض{" "}
                  <motion.span
                    key={processedProjects.length}
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="font-semibold text-black/70 dark:text-white/80"
                  >
                    {processedProjects.length}
                  </motion.span>{" "}
                  مشروع
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {search && (
                <motion.p
                  key={search}
                  initial={{
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -5,
                  }}
                  className="mt-3 text-xs text-black/45 dark:text-white/50"
                >
                  نتائج البحث عن:
                  <span className="mr-1 font-semibold text-black/70 dark:text-white/80">
                    {search}
                  </span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {activeFilter !== "الكل" && (
              <motion.div
                key={activeFilter}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  x: 10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  x: -10,
                }}
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  bg-black/[0.03]
                  px-3
                  py-2
                  text-xs
                  text-black/50
                  dark:bg-white/5
                  dark:text-white/60
                "
              >
                <span>التصنيف:</span>

                <span className="font-semibold text-black dark:text-white">{activeFilter}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* =====================================================
            PROJECTS
        ====================================================== */}

        <section className="mt-7">
          {loading ? (
            <PortfolioSkeleton />
          ) : (
            <AnimatePresence mode="wait">
              {currentProjects.length > 0 ? (
                <motion.div
                  key={`${activeFilter}-${search}-${sort}-${currentPage}`}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: {},

                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                      },
                    },

                    exit: {
                      transition: {
                        staggerChildren: 0.03,
                        staggerDirection: -1,
                      },
                    },
                  }}
                >
                  <PageGridCardView>
                    {currentProjects.map((project, index) => {
                      const category = categoryMap[project.categoryId];

                      return (
                        <motion.div
                          key={project.id}
                          custom={index}
                          variants={projectVariants}
                          whileHover={{
                            y: -5,
                          }}
                        >
                          <ProjectCard
                            project={{
                              ...project,

                              /* ==========================
                                   CATEGORY
                                ========================== */

                              category: category?.name || "",

                              categoryId: project.categoryId || "",

                              /* ==========================
                                   IMAGE
                                ========================== */

                              image: project.image || project.coverImage || "",

                              /* ==========================
                                   GALLERY
                                ========================== */

                              gallery: project.gallery || [],

                              /* ==========================
                                   STATS
                                ========================== */

                              stats: project.stats || [],

                              /* ==========================
                                   YEAR
                                ========================== */

                              year: project.year || "",
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </PageGridCardView>
                </motion.div>
              ) : (
                /* EMPTY */

                <motion.div
                  key="empty"
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  className="
                    flex
                    min-h-[330px]
                    flex-col
                    items-center
                    justify-center
                    rounded-[1.75rem]
                    border
                    border-dashed
                    border-black/10
                    bg-neutral-50
                    px-6
                    text-center
                    dark:border-white/10
                    dark:bg-card
                  "
                >
                  <div
                    style={{
                      animation:
                        "pf-float 4s ease-in-out infinite, pf-wobble 4s ease-in-out infinite",
                    }}
                    className="
                      mb-5
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
                    <Search size={26} />
                  </div>

                  <h3 className="text-lg font-bold text-black dark:text-white">
                    مفيش مشاريع مطابقة
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-7 text-black/45 dark:text-white/50">
                    جرب تغير التصنيف أو تستخدم كلمة بحث مختلفة عشان تلاقي
                    المشروع اللي بتدور عليه.
                  </p>

                  <motion.button
                    type="button"
                    onClick={clearAllFilters}
                    whileHover={{
                      y: -3,
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    className="
                      mt-6
                      rounded-full
                      bg-primary-600
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-primary-700
                      hover:shadow-lg
                    "
                  >
                    عرض كل المشاريع
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>

        {/* =====================================================
            PAGINATION
        ====================================================== */}

        <AnimatePresence>
          {totalPages > 1 && !loading && (
            <motion.nav
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="
                mt-10
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <IconButton
                variant="outline"
                rounded="full"
                onClick={() => handlePagination(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="الصفحة السابقة"
              >
                <ArrowRight size={18} />
              </IconButton>

              <div className="flex items-center gap-1.5">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <IconButton
                    key={page}
                    variant={page === currentPage ? "primary" : "outline"}
                    rounded="full"
                    onClick={() => handlePagination(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </IconButton>
                ))}
              </div>

              <IconButton
                variant="outline"
                rounded="full"
                onClick={() => handlePagination(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="الصفحة التالية"
              >
                <ArrowLeft size={18} />
              </IconButton>
            </motion.nav>
          )}
        </AnimatePresence>

        <div className="h-6 sm:h-10" />
      </Container>
    </motion.main>
  );
}

/* =========================================================
   ANIMATED STAT
========================================================= */

function AnimatedStat({ value, label }) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.03,
      }}
      className="
        relative
        min-w-[105px]
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/10
        px-4
        py-3
        text-center
        backdrop-blur-sm
      "
    >
      <div
        className="
          anim-shine
          pointer-events-none
          absolute
          inset-y-0
          w-1/3
          skew-x-[-20deg]
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
        "
      />

      <div className="relative z-10 text-xl font-black sm:text-2xl">
        {value}
      </div>

      <div className="relative z-10 mt-0.5 text-[11px] text-white/60">
        {label}
      </div>
    </motion.div>
  );
}

/* =========================================================
   HERO PARTICLE
========================================================= */

function HeroParticle({ className, delay = 0 }) {
  return (
    <span
      className={`
        pointer-events-none
        absolute
        h-1
        w-1
        rounded-full
        bg-white/50
        ${className}
      `}
      style={{
        animation: "pf-rise 4.5s ease-in-out infinite",
        animationDelay: `${delay}s`,
      }}
    />
  );
}
