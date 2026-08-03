"use client";

import Image from "next/image";
import Button from "@/shared/ui/buttons/Buttons";

import { ArrowUpLeft, CalendarDays, Sparkles } from "lucide-react";

export default function ProjectCard({ project }) {
  const image = project?.image || "/images/project-placeholder.jpg";

  const categoryName = project?.categoryName || project?.category?.name || "";

  return (
    <div className="group relative h-full">
      {/* =====================================================
          OUTER GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -inset-1
          -z-10
          rounded-[2.1rem]
          bg-primary-600/0
          blur-2xl
          transition-all
          duration-700
          group-hover:bg-primary-600/15
        "
      />

      {/* =====================================================
          CARD
      ====================================================== */}

      <article
        className="
          relative
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-[2rem]
          border
          border-black/[0.06]
          bg-white
          shadow-[0_12px_40px_rgba(0,0,0,0.06)]
          transition-all
          duration-500
          group-hover:-translate-y-2
          group-hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)]
          dark:border-white/10
          dark:bg-card
        "
      >
        {/* =====================================================
            INTERNAL GLOW
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            z-0
            h-52
            w-52
            rounded-full
            bg-primary-500/10
            blur-[70px]
            transition-all
            duration-700
            group-hover:scale-125
            group-hover:bg-primary-500/20
          "
        />

        {/* =====================================================
            IMAGE
        ====================================================== */}

        <div
          className="
            relative
            h-[260px]
            overflow-hidden
            sm:h-[280px]
          "
        >
          <Image
            src={image}
            alt={project?.title || "Project"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-105
            "
          />

          {/* IMAGE OVERLAY */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/90
              via-black/20
              to-transparent
            "
          />

          {/* =================================================
              CATEGORY
          ================================================== */}

          {categoryName && (
            <div
              className="
                absolute
                right-4
                top-4
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-white/20
                bg-black/25
                px-3.5
                py-2
                text-[11px]
                font-semibold
                text-white
                backdrop-blur-md
              "
            >
              <Sparkles size={12} />

              {categoryName}
            </div>
          )}

          {/* =================================================
              PROJECT INDEX
          ================================================== */}

          <div
            className="
              absolute
              left-4
              top-4
              flex
              h-9
              min-w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/20
              px-2
              text-[11px]
              font-bold
              text-white/80
              backdrop-blur-md
            "
          >
            {project?.index ? String(project.index).padStart(2, "0") : "01"}
          </div>

          {/* =================================================
              TITLE
          ================================================== */}

          <div className="absolute bottom-5 right-5 left-5">
            <h3
              className="
                text-xl
                font-black
                leading-tight
                tracking-tight
                text-white
                sm:text-2xl
              "
            >
              {project?.title || "مشروع بدون عنوان"}
            </h3>
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div
          className="
            relative
            z-10
            flex
            flex-1
            flex-col
            p-5
            sm:p-6
          "
        >
          {/* =================================================
              PROJECT META
          ================================================== */}

          <div className="mb-5 flex items-center justify-between">
            {/* YEAR */}

            {project?.year ? (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-black/40
                  dark:text-white/50
                "
              >
                <CalendarDays size={15} className="text-primary-600" />

                <span>{project.year}</span>
              </div>
            ) : (
              <div />
            )}

            {/* GALLERY COUNT */}

            {Array.isArray(project?.gallery) && project.gallery.length > 0 && (
              <div
                className="
                    rounded-full
                    bg-neutral-100
                    px-3
                    py-1.5
                    text-[11px]
                    font-medium
                    text-black/45
                    dark:bg-white/10
                    dark:text-white/60
                  "
              >
                {project.gallery.length} صور
              </div>
            )}
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          {project?.description && (
            <p
              className="
                mb-5
                line-clamp-2
                text-sm
                leading-7
                text-black/45
                dark:text-white/55
              "
            >
              {project.description}
            </p>
          )}

          {/* =================================================
              CTA
          ================================================== */}

          <div className="mt-auto pt-2">
            {project?.link ? (
              <Button
                href={`/portfolio/${project.link}`}
                hasEffects={false}
                rounded="full"
                className="
                  group/button
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  border
                  border-black/[0.06]
                  transition-all
                  duration-300
                  hover:border-primary-600
                  dark:border-white/10
                "
              >
                <span>عرض تفاصيل المشروع</span>

                <ArrowUpLeft
                  size={16}
                  className="
                    transition-transform
                    duration-300
                    group-hover/button:-translate-x-0.5
                    group-hover/button:-translate-y-0.5
                  "
                />
              </Button>
            ) : (
              <Button
                href="#"
                hasEffects={false}
                rounded="full"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  border
                  border-black/[0.06]
                  dark:border-white/10
                "
              >
                عرض المشروع
              </Button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
