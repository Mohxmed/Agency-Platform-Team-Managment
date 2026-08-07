"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpLeft,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mail,
  Phone,
  Sparkles,
  User,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

import { Container } from "@/features/landing";
import { useProfile } from "@/features/landing/hooks/useProfile";
import { roleConfig } from "@/constants/permissions";

export default function UserProfilePage({ params }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let active = true;

    async function resolveParams() {
      const resolved = await params;
      if (active) setUsername(resolved?.username || null);
    }

    resolveParams();
    return () => {
      active = false;
    };
  }, [params]);

  const { profile, loading } = useProfile(username);

  /* ============================================================
     LOADING / NOT FOUND
  ============================================================ */

  if (!username || loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return <NotFound />;
  }

  /* ============================================================
     DATA NORMALIZATION
  ============================================================ */

  const name = profile.name || "بدون اسم";

  const role = roleConfig[profile.role] || roleConfig.default;

  const stats = (Array.isArray(profile.stats) ? profile.stats : [])
    .filter(
      (stat) =>
        stat &&
        typeof stat === "object" &&
        String(stat.label || "").trim() &&
        String(stat.value ?? "").trim(),
    )
    .slice(0, 4);

  const contactItems = [
    {
      key: "email",
      label: "البريد الإلكتروني",
      value: profile.email,
      Icon: Mail,
      href: profile.email ? `mailto:${profile.email}` : null,
    },
    {
      key: "phone",
      label: "رقم الهاتف",
      value: profile.phone,
      Icon: Phone,
      href: profile.phone ? `tel:${profile.phone}` : null,
    },
    {
      key: "website",
      label: "الموقع الإلكتروني",
      value: profile.website ? cleanWebsite(profile.website) : null,
      Icon: Globe,
      href: profile.website ? normalizeUrl(profile.website) : null,
      external: true,
    },
  ].filter((item) => item.value);

  const socials = [
    { key: "facebook", label: "فيسبوك", value: profile.facebook, Icon: FaFacebook },
    { key: "instagram", label: "إنستجرام", value: profile.instagram, Icon: FaInstagram },
    { key: "linkedin", label: "لينكدإن", value: profile.linkedin, Icon: FaLinkedin },
    { key: "youtube", label: "يوتيوب", value: profile.youtube, Icon: FaYoutube },
    { key: "tiktok", label: "تيك توك", value: profile.tiktok, Icon: FaTiktok },
  ].filter((social) => String(social.value || "").trim());

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <main dir="rtl" className="min-h-screen bg-background pb-16 sm:pb-24">
      {/* =====================================================
          COVER
      ===================================================== */}

      <header className="relative overflow-hidden">
        <div className="relative h-44 sm:h-56 lg:h-64">
          {profile.coverImage ? (
            <Image
              src={profile.coverImage}
              alt={name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-red-600" />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/60" />

          <Container className="relative z-10 pt-6">
            <Link
              href="/"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/25
                bg-black/35
                px-4
                py-2
                text-xs
                font-bold
                text-white
                transition
                hover:bg-black/50
              "
            >
              <ArrowRight className="h-4 w-4" />
              العودة للرئيسية
            </Link>
          </Container>

          <div
            className="
              absolute
              bottom-20
              right-1/2
              z-20
              translate-x-1/2
              sm:bottom-24
              sm:right-8
              sm:translate-x-0
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-white/25
                bg-black/35
                px-4
                py-1.5
                text-xs
                font-bold
                text-white
              "
            >
              <Sparkles className="h-3.5 w-3.5" />
              عضو في نقطة
            </span>
          </div>
        </div>
      </header>

      {/* =====================================================
          PROFILE CARD
      ===================================================== */}

      <Container>
        <section className="relative z-10 -mt-14 sm:-mt-16">
          <Card className="p-6 sm:p-8">
            <div
              className="
                flex
                flex-col
                items-center
                gap-6
                text-center
                lg:flex-row
                lg:items-center
                lg:justify-between
                lg:text-right
              "
            >
              {/* Identity */}

              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-5
                  sm:flex-row
                  sm:items-center
                "
              >
                <Avatar name={name} logo={profile.logo || profile.photoURL} />

                <div>
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      justify-center
                      gap-2
                      sm:justify-start
                    "
                  >
                    <h1
                      className="
                        text-2xl
                        font-black
                        tracking-tight
                        text-ink
                        sm:text-3xl
                        dark:text-white
                      "
                    >
                      {name}
                    </h1>

                    <CheckCircle2 className="h-5 w-5 fill-red-600 text-white" />
                  </div>

                  {profile.specialty && (
                    <p className="mt-1.5 text-sm font-bold text-red-600 sm:text-base">
                      {profile.specialty}
                    </p>
                  )}

                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      items-center
                      justify-center
                      gap-2
                      sm:justify-start
                    "
                  >
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-red-600/10
                        px-3
                        py-1
                        text-[10px]
                        font-bold
                        text-red-600
                      "
                    >
                      <User className="h-3 w-3" />
                      {role.label}
                    </span>

                    {stats.length > 0 && (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-black/[0.04]
                          px-3
                          py-1
                          text-[10px]
                          font-bold
                          text-black/40
                          dark:bg-white/10
                          dark:text-white/60
                        "
                      >
                        <Sparkles className="h-3 w-3" />
                        {stats.length} مؤشرات
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile CTA */}

              {profile.website && (
                <a
                  href={normalizeUrl(profile.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-red-600
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-red-600/25
                    transition
                    hover:-translate-y-0.5
                    hover:bg-red-700
                  "
                >
                  زيارة الموقع
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </Card>
        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        {stats.length > 0 && (
          <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={`${stat.label}-${index}`} label={stat.label} value={stat.value} />
            ))}
          </section>
        )}

        {/* =====================================================
            ABOUT + CONTACT
        ===================================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="p-6 sm:p-8">
            <SectionHeading eyebrow="نبذة" title={`عن ${name}`} />

            <p
              className="
                mt-4
                text-sm
                leading-8
                text-muted
                sm:text-base
              "
            >
              {profile.description || "لا يوجد وصف متاح لهذا العضو حاليًا."}
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <SectionHeading eyebrow="التواصل" title="بيانات التواصل" />

            <div className="mt-5 space-y-3">
              {contactItems.length > 0 ? (
                contactItems.map((item) => (
                  <ContactItem
                    key={item.key}
                    icon={item.Icon}
                    label={item.label}
                    value={item.value}
                    href={item.href}
                    external={item.external}
                  />
                ))
              ) : (
                <p className="text-sm text-muted">لا توجد بيانات تواصل متاحة.</p>
              )}
            </div>
          </Card>
        </section>

        {/* =====================================================
            SOCIAL
        ===================================================== */}

        {socials.length > 0 && (
          <section className="mt-6">
            <Card className="p-6 sm:p-8">
              <SectionHeading eyebrow="تابعنا" title="تابع العضو" />

              <div className="mt-5 flex flex-wrap gap-3">
                {socials.map(({ key, label, value, Icon }) => (
                  <a
                    key={key}
                    href={normalizeUrl(value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className="
                      group
                      flex
                      items-center
                      gap-2.5
                      rounded-2xl
                      border
                      border-black/[0.06]
                      bg-black/[0.02]
                      px-4
                      py-3
                      transition-all
                      hover:-translate-y-0.5
                      hover:border-red-500/25
                      dark:border-white/10
                      dark:bg-white/5
                    "
                  >
                    <Icon
                      className="
                        h-5
                        w-5
                        text-black/45
                        transition-colors
                        group-hover:text-red-600
                        dark:text-white/60
                      "
                    />
                    <span
                      className="
                        text-xs
                        font-bold
                        text-black/60
                        group-hover:text-red-600
                        dark:text-white/70
                      "
                    >
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </Card>
          </section>
        )}
      </Container>
    </main>
  );
}

/* ============================================================
   CARD
============================================================ */

function Card({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-[2rem]
        border
        border-black/[0.06]
        bg-white
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        dark:border-white/10
        dark:bg-card
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* ============================================================
   AVATAR
============================================================ */

function Avatar({ name, logo }) {
  const initial = (name || "؟").charAt(0);

  return (
    <div
      className="
        relative
        h-24
        w-24
        shrink-0
        overflow-hidden
        rounded-3xl
        border-4
        border-white
        bg-white
        shadow-lg
        ring-1
        ring-black/5
        dark:border-card
        dark:bg-card
        dark:ring-white/10
        sm:h-28
        sm:w-28
      "
    >
      {logo ? (
        <Image
          src={logo}
          alt={name || "الصورة الشخصية"}
          fill
          sizes="112px"
          className="object-cover"
        />
      ) : (
        <div
          className="
            flex
            h-full
            w-full
            items-center
            justify-center
            bg-red-600
            text-3xl
            font-black
            text-white
          "
        >
          {initial}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SECTION HEADING
============================================================ */

function SectionHeading({ eyebrow, title }) {
  return (
    <div>
      <p
        className="
          text-[10px]
          font-black
          uppercase
          tracking-[0.18em]
          text-red-600
        "
      >
        {eyebrow}
      </p>

      <h2
        className="
          mt-1.5
          text-xl
          font-black
          tracking-tight
          text-ink
          sm:text-2xl
          dark:text-white
        "
      >
        {title}
      </h2>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({ label, value }) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-black/[0.06]
        bg-white
        p-6
        text-center
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]
        dark:border-white/10
        dark:bg-card
      "
    >
      <p className="relative text-xs font-bold text-muted">{label}</p>

      <p
        className="
          relative
          mt-2
          text-2xl
          font-black
          tracking-tight
          text-ink
          sm:text-3xl
          dark:text-white
        "
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   CONTACT ITEM
============================================================ */

function ContactItem({ icon: Icon, label, value, href, external = false }) {
  const inner = (
    <>
      <span
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-red-600/10
          text-red-600
          transition-colors
          group-hover:bg-red-600
          group-hover:text-white
        "
      >
        <Icon className="h-4 w-4" />
      </span>

      <span className="min-w-0">
        <span className="block text-[10px] font-bold text-muted">{label}</span>
        <span className="mt-0.5 block truncate text-xs font-bold text-ink dark:text-white/80">
          {value}
        </span>
      </span>
    </>
  );

  const cls = `
    group
    flex
    items-center
    gap-3
    rounded-2xl
    border
    border-black/[0.05]
    bg-black/[0.02]
    p-3
    transition
    hover:border-red-500/20
    dark:border-white/10
    dark:bg-white/5
  `;

  if (!href) {
    return <div className={cls}>{inner}</div>;
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cls}
    >
      {inner}

      {external && (
        <ExternalLink
          className="
            mr-auto
            h-3.5
            w-3.5
            text-muted
            transition
            group-hover:text-red-600
          "
        />
      )}
    </a>
  );
}

/* ============================================================
   URL HELPERS
============================================================ */

function normalizeUrl(url) {
  if (!url) return "#";

  const value = String(url).trim();

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  ) {
    return value;
  }

  return `https://${value}`;
}

function cleanWebsite(url) {
  if (!url) return "";

  return String(url)
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

/* ============================================================
   NOT FOUND
============================================================ */

function NotFound() {
  return (
    <main dir="rtl" className="min-h-screen bg-background py-20">
      <Container>
        <div
          className="
            flex
            min-h-[480px]
            flex-col
            items-center
            justify-center
            rounded-[2rem]
            border
            border-black/[0.06]
            bg-white
            px-6
            text-center
            dark:border-white/10
            dark:bg-card
          "
        >
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-[1.5rem]
              bg-red-600/10
              text-red-600
            "
          >
            <User className="h-9 w-9" />
          </div>

          <h1 className="mt-6 text-2xl font-black text-ink dark:text-white">
            البروفايل غير موجود
          </h1>

          <p className="mt-3 max-w-md text-sm leading-7 text-muted">
            يبدو أن الملف الذي تبحث عنه غير موجود أو تم حذفه.
          </p>

          <Link
            href="/"
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-2xl
              bg-red-600
              px-5
              py-3.5
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-red-600/20
              transition
              hover:bg-red-700
            "
          >
            العودة للرئيسية
            <ArrowUpLeft className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </main>
  );
}

/* ============================================================
   LOADING SKELETON
============================================================ */

function ProfileSkeleton() {
  return (
    <main dir="rtl" className="min-h-screen bg-background pb-16">
      {/* Cover */}

      <div className="h-44 animate-pulse bg-neutral-200 sm:h-56 lg:h-64 dark:bg-neutral-800" />

      <Container>
        {/* Profile card */}

        <div className="relative z-10 -mt-14 rounded-[2rem] bg-white p-6 shadow-sm sm:-mt-16 sm:p-8 dark:bg-card">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="h-24 w-24 shrink-0 animate-pulse rounded-3xl bg-neutral-200 sm:h-28 sm:w-28 dark:bg-neutral-800" />

            <div className="w-full space-y-3">
              <div className="h-7 w-44 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-4 w-28 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-6 w-36 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-3xl bg-neutral-200 dark:bg-neutral-800"
            />
          ))}
        </div>

        {/* Content */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="h-64 animate-pulse rounded-[2rem] bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-64 animate-pulse rounded-[2rem] bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </Container>
    </main>
  );
}
