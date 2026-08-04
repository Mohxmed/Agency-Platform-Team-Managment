import Link from "next/link";
import Image from "next/image";
import { ArrowUpLeft, Sparkles } from "lucide-react";

import SocialMediaLinks from "@/features/landing/components/SocialMediaLinks";

export default function ClientCard({ teacher }) {
  /*
   * =========================================================
   * NORMALIZE STATS FROM FIRESTORE
   * =========================================================
   */

  const stats = Array.isArray(teacher?.stats)
    ? teacher.stats.filter(
        (stat) =>
          stat &&
          typeof stat === "object" &&
          String(stat.label || "").trim() &&
          stat.value !== undefined &&
          stat.value !== null &&
          String(stat.value).trim(),
      )
    : [];

  /*
   * =========================================================
   * IMAGES
   * =========================================================
   */

  const logo = teacher?.logo || "";
  const coverImage = teacher?.coverImage || "";

  /*
   * =========================================================
   * SOCIAL MEDIA
   * =========================================================
   */

  const hasSocialMedia =
    teacher?.facebook ||
    teacher?.instagram ||
    teacher?.youtube ||
    teacher?.linkedin ||
    teacher?.tiktok;

  return (
    <article
      className="
        group
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
        hover:-translate-y-2
        hover:shadow-[0_24px_70px_rgba(0,0,0,0.11)]
        dark:border-white/10
        dark:bg-card
      "
    >
      {/* =====================================================
          DECORATIVE GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          z-0
          h-48
          w-48
          rounded-full
          [background:radial-gradient(circle_at_center,rgba(217,4,41,0.25),transparent_62%)]
          transition-opacity
          duration-700
          group-hover:opacity-100
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-20
          bottom-20
          z-0
          h-40
          w-40
          rounded-full
          [background:radial-gradient(circle_at_center,rgba(217,4,41,0.15),transparent_62%)]
          transition-opacity
          duration-700
          group-hover:opacity-100
        "
      />

      {/* =====================================================
          COVER
      ====================================================== */}

      <div className="relative h-40 overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`${teacher?.name || "Client"} cover`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-neutral-100
              via-neutral-50
              to-primary-50
              dark:from-neutral-800
              dark:via-neutral-900
              dark:to-neutral-900
            "
          />
        )}

        {/* Cover Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/50
            via-black/10
            to-transparent
          "
        />

        {/* Badge */}

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
            bg-black/40
            px-3
            py-1.5
            text-[11px]
            font-semibold
            text-white
          "
        >
          <Sparkles size={12} />
          شريك نفتخر به
        </div>
      </div>

      {/* =====================================================
          LOGO / AVATAR
      ====================================================== */}

      <div className="relative -mt-14 flex justify-center">
        <div
          className="
            relative
            h-28
            w-28
            overflow-hidden
            rounded-full
            border-[4px]
            border-white
            bg-white
            shadow-[0_8px_30px_rgba(0,0,0,0.15)]
            dark:border-card
            dark:bg-card
          "
        >
          {logo ? (
            <Image
              src={logo}
              alt={teacher?.name || "Client"}
              fill
              sizes="112px"
              className="
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                bg-neutral-100
                text-2xl
                font-black
                text-neutral-400
                dark:bg-ink/10
                dark:text-neutral-500
              "
            >
              {teacher?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          CLIENT INFO
      ====================================================== */}

      <div className="px-5 text-center">
        <h3
          className="
            mt-4
            text-lg
            font-black
            tracking-tight
            text-neutral-950
            sm:text-xl
            dark:text-white
          "
        >
          {teacher?.name || "بدون اسم"}
        </h3>

        {teacher?.specialty && (
          <p
            className="
              mt-1
              text-sm
              font-medium
              text-primary-600
            "
          >
            {teacher.specialty}
          </p>
        )}

        {teacher?.description && (
          <p
            className="
              mx-auto
              mt-2
              line-clamp-2
              max-w-sm
              text-xs
              leading-6
              text-black/40
              dark:text-white/50
            "
          >
            {teacher.description}
          </p>
        )}
      </div>

      {/* =====================================================
          SOCIAL MEDIA
      ====================================================== */}

      {hasSocialMedia && (
        <div className="mt-4">
          <SocialMediaLinks
            Facebook={teacher?.facebook || false}
            Instagram={teacher?.instagram || false}
            Youtube={teacher?.youtube || false}
            LinkedIn={teacher?.linkedin || false}
            TikTok={teacher?.tiktok || false}
          />
        </div>
      )}

      {/* =====================================================
          DYNAMIC STATS
      ====================================================== */}

      {stats.length > 0 && (
        <div className="px-5">
          <div
            className="
              mt-5
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-8
              gap-y-4
              rounded-2xl
              border
              border-black/[0.05]
              bg-neutral-50/80
              px-4
              py-4
              dark:border-white/10
              dark:bg-white/[0.04]
            "
          >
            {stats.slice(0, 4).map((stat, index) => (
              <Stat
                key={`${stat.label}-${index}`}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </div>
        </div>
      )}

      {/* =====================================================
          CTA
      ====================================================== */}

      <div className="mt-auto p-5">
        <Link
          href={`/clients/${teacher?.link}`}
          className="
            group/button
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-primary-600
            px-5
            py-3.5
            text-sm
            font-bold
            text-white
            shadow-lg
            shadow-primary-600/20
            transition-all
            duration-300
            hover:bg-primary-700
            hover:shadow-xl
            hover:shadow-primary-600/25
            active:scale-[0.98]
          "
        >
          عرض الملف
          <ArrowUpLeft
            size={17}
            className="
              transition-transform
              duration-300
              group-hover/button:-translate-y-0.5
              group-hover/button:-translate-x-0.5
            "
          />
        </Link>
      </div>
    </article>
  );
}

/* =========================================================
   STAT
========================================================= */

function Stat({ label, value }) {
  return (
    <div
      className="
        flex
        min-w-[80px]
        flex-col
        items-center
        justify-center
        text-center
        transition-all
        duration-300
        group-hover:scale-[1.03]
      "
    >
      {/* VALUE */}

      <span
        className="
          max-w-full
          truncate
          text-sm
          font-black
          tracking-tight
          text-neutral-900
          sm:text-base
          dark:text-white
        "
      >
        {value}
      </span>

      {/* LABEL */}

      <span
        className="
          mt-0.5
          max-w-full
          truncate
          text-[10px]
          font-medium
          text-black/35
          sm:text-[11px]
          dark:text-white/40
        "
      >
        {label}
      </span>
    </div>
  );
}
