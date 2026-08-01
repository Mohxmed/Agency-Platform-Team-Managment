"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { ArrowLeft, ArrowRight, Sparkles, MoveUpLeft } from "lucide-react";

import { Container } from "@/features/landing";
import ProjectGallery from "@/features/landing/components/ProjectGallery";

import { useWorks } from "@/features/landing/hooks/useWorks";
import { ProjectDetailSkeleton } from "@/shared/ui/skeletons/Skeletons";

export default function ProjectPage({ params }) {
  const [projectId, setProjectId] = useState(null);

  const { works, categories, loading } = useWorks();

  /*
   * =========================================================
   * GET PARAM
   * =========================================================
   */

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;

      setProjectId(resolvedParams?.projectId || null);
    }

    getParams();
  }, [params]);

  /*
   * =========================================================
   * FIND PROJECT
   * =========================================================
   */

  const project = useMemo(() => {
    if (!projectId || !Array.isArray(works)) {
      return null;
    }

    return works.find(
      (item) => String(item.link || "").trim() === String(projectId).trim(),
    );
  }, [works, projectId]);

  /*
   * =========================================================
   * RESOLVE CATEGORY
   * =========================================================
   *
   * Handles:
   *
   * category: "abc123"
   *
   * category: {
   *   id: "abc123",
   *   name: "Web Design"
   * }
   *
   * category: "Web Design"
   *
   * categoryId: "abc123"
   *
   * categoryName: "Web Design"
   * =========================================================
   */

  const categoryName = useMemo(() => {
    if (!project) {
      return "PROJECT";
    }

    const projectCategory = project.category;

    /*
     * -------------------------------------------------------
     * CATEGORY OBJECT
     * -------------------------------------------------------
     */

    if (projectCategory && typeof projectCategory === "object") {
      return (
        projectCategory.name ||
        projectCategory.title ||
        projectCategory.label ||
        "PROJECT"
      );
    }

    /*
     * -------------------------------------------------------
     * CATEGORY NAME DIRECTLY ON PROJECT
     * -------------------------------------------------------
     */

    if (project.categoryName && typeof project.categoryName === "string") {
      return project.categoryName;
    }

    /*
     * -------------------------------------------------------
     * CATEGORY ID
     * -------------------------------------------------------
     */

    if (projectCategory && Array.isArray(categories)) {
      const foundCategory = categories.find((category) => {
        const categoryId =
          category.id || category.categoryId || category.uid || category._id;

        return String(categoryId || "") === String(projectCategory);
      });

      if (foundCategory) {
        return (
          foundCategory.name ||
          foundCategory.title ||
          foundCategory.label ||
          "PROJECT"
        );
      }
    }

    /*
     * -------------------------------------------------------
     * categoryId
     * -------------------------------------------------------
     */

    if (project.categoryId && Array.isArray(categories)) {
      const foundCategory = categories.find((category) => {
        const categoryId =
          category.id || category.categoryId || category.uid || category._id;

        return String(categoryId || "") === String(project.categoryId);
      });

      if (foundCategory) {
        return (
          foundCategory.name ||
          foundCategory.title ||
          foundCategory.label ||
          "PROJECT"
        );
      }
    }

    /*
     * -------------------------------------------------------
     * CATEGORY ALREADY STORED AS TEXT
     * -------------------------------------------------------
     */

    if (typeof projectCategory === "string" && projectCategory.trim()) {
      return projectCategory;
    }

    return "PROJECT";
  }, [project, categories]);

  /*
   * =========================================================
   * GALLERY
   * =========================================================
   */

  const gallery = useMemo(() => {
    if (!project) {
      return [];
    }

    if (Array.isArray(project.gallery) && project.gallery.length > 0) {
      return project.gallery.filter(Boolean);
    }

    if (project.image) {
      return [project.image];
    }

    return [];
  }, [project]);

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-white dark:bg-background">
        <Container>
          <ProjectDetailSkeleton />
        </Container>
      </main>
    );
  }

  /*
   * =========================================================
   * PROJECT NOT FOUND
   * =========================================================
   */

  if (!project) {
    return (
      <main dir="rtl" className="min-h-screen bg-white py-16 dark:bg-background">
        <Container>
          <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
            <div
              className="
                mb-6
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-primary-600/10
                text-primary-600
              "
            >
              <Sparkles size={26} />
            </div>

            <h1 className="text-3xl font-black text-black dark:text-white">
              المشروع غير موجود
            </h1>

            <p className="mt-3 max-w-md text-sm leading-7 text-black/45 dark:text-white/60">
              يبدو أن المشروع الذي تبحث عنه غير متاح حاليًا أو أن الرابط غير
              صحيح.
            </p>

            <Link
              href="/portfolio"
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-black
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-primary-600
              "
            >
              <ArrowRight size={17} />
              العودة إلى الأعمال
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        overflow-hidden
        bg-white
        pb-24
        dark:bg-background
      "
    >
      {/* =====================================================
          HEADER / BREADCRUMB
      ====================================================== */}

      <section className="pt-5 sm:pt-8">
        <Container>
          <div className="flex items-center justify-between">
            <Link
              href="/portfolio"
              className="
                group
                inline-flex
                items-center
                gap-2
                text-xs
                font-medium
                text-black/45
                transition
                hover:text-black
                sm:text-sm
                dark:text-white/50
                dark:hover:text-white
              "
            >
              <ArrowRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
              العودة إلى الأعمال
            </Link>

            <div
              className="
                hidden
                items-center
                gap-2
                text-xs
                text-black/30
                sm:flex
                dark:text-white/40
              "
            >
              <Link href="/" className="transition hover:text-black/70 dark:hover:text-white/70">
                الرئيسية
              </Link>

              <span>/</span>

              <Link
                href="/portfolio"
                className="transition hover:text-black/70 dark:hover:text-white/70"
              >
                الأعمال
              </Link>

              <span>/</span>

              <span className="max-w-[180px] truncate text-black/50 dark:text-white/50">
                {project.title}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="pt-12 sm:pt-16 lg:pt-20">
        <Container>
          <div className="relative">
            {/* Decorative Number */}

            <div
              className="
                pointer-events-none
                absolute
                -right-2
                -top-10
                select-none
                text-[7rem]
                font-black
                leading-none
                tracking-[-0.08em]
                text-black/[0.025]
                dark:text-white/[0.03]
                sm:-right-4
                sm:-top-14
                sm:text-[10rem]
              "
            >
              {String(project.id || "")
                .slice(-2)
                .padStart(2, "0")}
            </div>

            <div
              className="
                relative
                grid
                gap-9
                lg:grid-cols-[1fr_180px]
                lg:items-end
                lg:gap-14
              "
            >
              {/* =================================================
                  MAIN CONTENT
              ================================================= */}

              <div className="max-w-4xl">
                {/* Category */}

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-black/10
                    bg-black/[0.025]
                    px-3
                    py-1.5
                    text-[10px]
                    font-bold
                    tracking-[0.16em]
                    text-black/55
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-white/60
                  "
                >
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span
                      className="
                        absolute
                        h-3.5
                        w-3.5
                        rounded-full
                        border
                        border-primary-600/40
                      "
                    />

                    <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                  </span>

                  <span>{categoryName}</span>
                </div>

                {/* Title */}

                <h1
                  className="
                    mt-5
                    max-w-4xl
                    text-[2.6rem]
                    font-extrabold
                    leading-[1.02]
                    tracking-[-0.04em]
                    text-black
                    sm:text-5xl
                    md:text-6xl
                    lg:text-[4.5rem]
                    dark:text-white
                  "
                >
                  {project.title}
                </h1>

                {/* Description */}

                {project.description && (
                  <div className="mt-7 flex max-w-2xl items-start gap-4 sm:mt-8">
                    <span
                      className="
                        mt-2
                        h-8
                        w-[2px]
                        shrink-0
                        bg-primary-600
                      "
                    />

                    <p
                      className="
                        text-sm
                        leading-7
                        text-black/45
                        sm:text-[15px]
                        sm:leading-8
                        dark:text-white/60
                      "
                    >
                      {project.description}
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                  PROJECT INFO
              ================================================= */}

              <div
                className="
                  relative
                  grid
                  grid-cols-2
                  gap-7
                  border-t
                  border-black/10
                  pt-5
                  lg:block
                  lg:border-r
                  lg:border-t-0
                  lg:pr-7
                  dark:border-white/10
                "
              >
                {/* Year */}

                {project.year && (
                  <div>
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-black/30
                        dark:text-white/40
                      "
                    >
                      السنة
                    </p>

                    <p className="mt-1.5 text-sm font-bold text-black dark:text-white">
                      {project.year}
                    </p>
                  </div>
                )}

                {/* Category */}

                <div className={project.year ? "lg:mt-6" : ""}>
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-black/30
                      dark:text-white/40
                    "
                  >
                    التصنيف
                  </p>

                  <p className="mt-1.5 text-sm font-bold text-black dark:text-white">
                    {categoryName || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          MAIN COVER
      ====================================================== */}

      {project.image && (
        <section className="mt-12 sm:mt-16 lg:mt-20">
          <Container>
            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[1.75rem]
                bg-neutral-100
                sm:rounded-[2.5rem]
                dark:bg-card
              "
            >
              <div
                className="
                  relative
                  aspect-[16/10]
                  w-full
                  sm:aspect-[16/8.5]
                "
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  priority
                  sizes="100vw"
                  className="
                    object-cover
                    transition-transform
                    duration-1000
                    ease-out
                    group-hover:scale-[1.015]
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/30
                    via-transparent
                    to-transparent
                  "
                />
              </div>

              <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/15
                    bg-black/45
                    px-4
                    py-2.5
                    text-xs
                    font-medium
                    text-white
                    backdrop-blur-md
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                  عرض المشروع
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* =====================================================
          GALLERY
      ====================================================== */}

      {gallery.length > 0 && (
        <section className="mt-16 sm:mt-20 lg:mt-24">
          <Container>
            <div className="mb-7 flex items-end justify-between gap-5 sm:mb-9">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-[0.2em] text-primary-600">
                    01
                  </span>

                  <span className="h-px w-10 bg-primary-600/30" />

                  <span className="text-xs font-medium text-black/35 dark:text-white/40">
                    معرض المشروع
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-black tracking-tight text-black sm:text-4xl dark:text-white">
                  لمحة من تفاصيل المشروع.
                </h2>
              </div>
            </div>

            <ProjectGallery images={gallery} title={project.title} />

            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                text-[11px]
                font-medium
                text-black/30
                dark:text-white/40
              "
            >
              <span>اضغط على الصورة لعرضها بحجم أكبر</span>

              <span className="hidden sm:block">{gallery.length} صور</span>
            </div>
          </Container>
        </section>
      )}

      {/* =====================================================
          PROJECT OVERVIEW
      ====================================================== */}

      <Container>
        <section
          className="
            mt-10
            border-y
            border-black/10
            py-7
            sm:mt-12
            sm:py-9
            dark:border-white/10
          "
        >
          <div className="grid grid-cols-2 gap-7 sm:grid-cols-3 sm:gap-0">
            {/* Category */}

            <div className="sm:border-l sm:border-black/10 sm:pl-8 dark:sm:border-white/10">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-black/30
                  dark:text-white/40
                "
              >
                التصنيف
              </p>

              <p className="mt-2 text-sm font-bold text-black sm:text-base dark:text-white">
                {categoryName || "—"}
              </p>
            </div>

            {/* Year */}

            {project.year && (
              <div className="sm:border-l sm:border-black/10 sm:px-8 dark:sm:border-white/10">
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-black/30
                    dark:text-white/40
                  "
                >
                  سنة التنفيذ
                </p>

                <p className="mt-2 text-sm font-bold text-black sm:text-base dark:text-white">
                  {project.year}
                </p>
              </div>
            )}

            {/* Images */}

            <div className="col-span-2 sm:col-span-1 sm:px-8">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-black/30
                  dark:text-white/40
                "
              >
                الصور
              </p>

              <p className="mt-2 text-sm font-bold text-black sm:text-base dark:text-white">
                {gallery.length} صور
              </p>
            </div>
          </div>
        </section>
      </Container>

      {/* =====================================================
          PROJECT STORY
      ====================================================== */}

      <Container>
        <section className="mt-20 sm:mt-28 lg:mt-32">
          <div
            className="
              grid
              gap-10
              lg:grid-cols-[0.7fr_1.3fr]
              lg:gap-20
            "
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest text-primary-600">
                  02
                </span>

                <span className="h-px w-10 bg-primary-600/30" />

                <span className="text-xs font-medium text-black/35 dark:text-white/40">
                  عن المشروع
                </span>
              </div>

              <h2 className="mt-5 max-w-sm text-2xl font-black leading-tight sm:text-3xl">
                الفكرة تبدأ من التفاصيل.
              </h2>
            </div>

            <div>
              {project.description && (
                <p
                  className="
                    max-w-3xl
                    text-base
                    leading-8
                    text-black/55
                    sm:text-lg
                    sm:leading-9
                    dark:text-white/70
                  "
                >
                  {project.description}
                </p>
              )}

              <p
                className="
                  mt-6
                  max-w-3xl
                  text-sm
                  leading-8
                  text-black/40
                  sm:text-base
                  dark:text-white/60
                "
              >
                كل مشروع هو فرصة لصناعة تجربة مختلفة تجمع بين الفكرة، الهوية،
                والتفاصيل التي تجعل العمل أكثر وضوحًا وتأثيرًا.
              </p>
            </div>
          </div>
        </section>
      </Container>

      {/* =====================================================
          CTA
      ====================================================== */}

      <Container>
        <section className="mt-20 sm:mt-28">
          <div
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              bg-primary-600
              px-6
              py-10
              sm:rounded-[2.5rem]
              sm:px-12
              sm:py-14
            "
          >
            <div
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
              className="
                pointer-events-none
                absolute
                -bottom-20
                right-0
                h-64
                w-64
                rounded-full
                bg-black/10
                blur-3xl
              "
            />

            <div
              className="
                relative
                z-10
                flex
                flex-col
                items-start
                justify-between
                gap-7
                sm:flex-row
                sm:items-center
              "
            >
              <div>
                <p className="text-xs font-medium text-white/55">من أعمالنا</p>

                <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  نصنع أفكارًا تستحق أن تُرى.
                </h3>
              </div>

              <Link
                href="/portfolio"
                className="
                  group
                  inline-flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-black
                  transition
                  hover:bg-black
                  hover:text-white
                "
              >
                كل الأعمال
                <ArrowLeft
                  size={17}
                  className="
                    transition-transform
                    group-hover:-translate-x-1
                  "
                />
              </Link>
            </div>
          </div>
        </section>
      </Container>

      {/* =====================================================
          FOOTER NAVIGATION
      ====================================================== */}

      <Container>
        <section
          className="
            mt-16
            border-t
            border-black/10
            pt-8
            sm:mt-20
            sm:pt-10
            dark:border-white/10
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="text-xs font-medium text-black/35 dark:text-white/40">استكشف المزيد</p>

              <h3 className="mt-1 text-xl font-black text-black dark:text-white">
                شاهد باقي أعمالنا
              </h3>
            </div>

            <Link
              href="/portfolio"
              className="
                group
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-black/10
                px-5
                py-3
                text-sm
                font-semibold
                text-black
                transition
                hover:border-black
                hover:bg-black
                hover:text-white
                dark:border-white/10
                dark:text-white
                dark:hover:border-white
                dark:hover:bg-white
                dark:hover:text-black
              "
            >
              الذهاب إلى الأعمال
              <MoveUpLeft
                size={16}
                className="
                  transition-transform
                  group-hover:-translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
