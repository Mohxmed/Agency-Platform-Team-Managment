"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpLeft,
  Globe,
  Mail,
  Phone,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Users,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

import { Container } from "@/features/landing";
import { useClientByLink } from "@/features/landing/hooks/useClientByLink";

export default function ClientProfilePage({ params }) {
  const [link, setLink] = useState(null);

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setLink(resolvedParams?.link || null);
    }
    getParams();
  }, [params]);

  const { client, loading } = useClientByLink(link);

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return <ProfileSkeleton />;
  }

  /* ============================================================
     NOT FOUND
  ============================================================ */

  if (!client) {
    return <NotFound />;
  }

  /* ============================================================
     STATS
  ============================================================ */

  const stats = Array.isArray(client.stats)
    ? client.stats.filter(
        (stat) =>
          stat &&
          typeof stat === "object" &&
          String(stat.label || "").trim() &&
          String(stat.value ?? "").trim(),
      )
    : [];

  /* ============================================================
     SOCIAL LINKS
  ============================================================ */

  const socialLinks = [
    {
      key: "facebook",
      label: "Facebook",
      value: client.facebook,
      icon: FaFacebook,
    },
    {
      key: "instagram",
      label: "Instagram",
      value: client.instagram,
      icon: FaInstagram,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      value: client.linkedin,
      icon: FaLinkedin,
    },
    {
      key: "youtube",
      label: "YouTube",
      value: client.youtube,
      icon: FaYoutube,
    },
    {
      key: "tiktok",
      label: "TikTok",
      value: client.tiktok,
      icon: FaTiktok,
    },
  ].filter((social) => typeof social.value === "string" && social.value.trim());

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <main dir="rtl" className="min-h-screen bg-[#fafafa] pb-20 sm:pb-28 dark:bg-background">
      {/* =====================================================
          COVER
      ===================================================== */}

      <section
        className="
          relative
          h-[280px]
          overflow-hidden
          sm:h-[360px]
          lg:h-[430px]
        "
      >
        {client.coverImage ? (
          <Image
            src={client.coverImage}
            alt={client.name || "Client cover"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
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
            "
          />
        )}

        {/* Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-black/20
            to-black/10
          "
        />

        <Container>
          <div className="relative z-10 pt-6">
            <Link
              href="/clients"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-black/20
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
                backdrop-blur-xl
                transition
                hover:bg-black/30
              "
            >
              <ArrowRight className="h-4 w-4" />
              العودة للعملاء
            </Link>
          </div>
        </Container>

        {/* Badge */}

        <div
          className="
            absolute
            bottom-7
            right-1/2
            z-10
            translate-x-1/2
            sm:right-8
            sm:translate-x-0
            lg:right-12
          "
        >
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/15
              bg-black/25
              px-4
              py-2
              text-xs
              font-bold
              text-white
              backdrop-blur-xl
            "
          >
            <Sparkles className="h-3.5 w-3.5" />
            شريك نفتخر به
          </div>
        </div>
      </section>

      {/* =====================================================
          PROFILE
      ===================================================== */}

      <Container>
        <section className="relative z-20 -mt-20 sm:-mt-24">
          <div
            className="
              rounded-[2rem]
              border
              border-black/[0.06]
              bg-white
              p-5
              shadow-[0_20px_70px_rgba(0,0,0,0.08)]
              sm:p-7
              lg:p-9
              dark:border-white/10
              dark:bg-card
            "
          >
            <div
              className="
                flex
                flex-col
                gap-7
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* Identity */}

              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-5
                  text-center
                  sm:flex-row
                  sm:text-right
                "
              >
                {/* Logo */}

                <div
                  className="
                    relative
                    h-28
                    w-28
                    shrink-0
                    overflow-hidden
                    rounded-[1.75rem]
                    border-[5px]
                    border-white
                    bg-white
                    shadow-[0_12px_35px_rgba(0,0,0,0.13)]
                    ring-1
                    ring-black/[0.05]
                    dark:border-card
                    dark:bg-card
                    dark:ring-white/10
                    sm:h-32
                    sm:w-32
                  "
                >
                  {client.logo ? (
                    <Image
                      src={client.logo}
                      alt={client.name || "Client logo"}
                      fill
                      sizes="128px"
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
                        bg-neutral-100
                        text-3xl
                        font-black
                        text-neutral-400
                        dark:bg-white/5
                        dark:text-white/40
                      "
                    >
                      {client.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>

                {/* Name */}

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
                        text-neutral-950
                        sm:text-3xl
                        lg:text-4xl
                        dark:text-white
                      "
                    >
                      {client.name || "بدون اسم"}
                    </h1>

                    <CheckCircle2
                      className="
                        h-5
                        w-5
                        fill-primary-600
                        text-white
                      "
                    />
                  </div>

                  {client.specialty && (
                    <p
                      className="
                        mt-2
                        text-sm
                        font-bold
                        text-primary-600
                        sm:text-base
                      "
                    >
                      {client.specialty}
                    </p>
                  )}

                  {client.Spe && (
                    <p
                      className="
                        mt-1
                        text-sm
                        font-medium
                        text-black/45
                        dark:text-white/60
                      "
                    >
                      {client.Spe}
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
                        bg-emerald-500/[0.07]
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        text-emerald-600
                      "
                    >
                      <span
                        className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-emerald-500
                        "
                      />
                      عميل موثوق
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
                          py-1.5
                          text-[10px]
                          font-bold
                          text-black/40
                          dark:bg-white/5
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

              {/* Website */}

              {client.website && (
                <a
                  href={normalizeUrl(client.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
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
                    transition
                    hover:-translate-y-0.5
                    hover:bg-primary-700
                  "
                >
                  زيارة الموقع
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        {stats.length > 0 && (
          <section className="mt-6">
            <div
              className="
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[1.5rem]
                    border
                    border-black/[0.06]
                    bg-white
                    p-5
                    shadow-[0_8px_30px_rgba(0,0,0,0.035)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_18px_45px_rgba(0,0,0,0.07)]
                    dark:border-white/10
                    dark:bg-card
                  "
                >
                  <div
                    className="
                      absolute
                      -left-8
                      -top-8
                      h-24
                      w-24
                      rounded-full
                      bg-primary-500/[0.07]
                      blur-2xl
                      transition-transform
                      duration-500
                      group-hover:scale-150
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >
                    <div>
                      <p className="text-xs font-bold text-black/35 dark:text-white/40">
                        {stat.label}
                      </p>

                      <p
                        className="
                          mt-2
                          text-2xl
                          font-black
                          tracking-tight
                          text-neutral-950
                          sm:text-3xl
                          dark:text-white
                        "
                      >
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-primary-500/[0.07]
                        text-primary-600
                      "
                    >
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            ABOUT + CONTACT
        ===================================================== */}

        <section
          className="
            mt-6
            grid
            gap-6
            lg:grid-cols-[1.35fr_0.65fr]
          "
        >
          {/* About */}

          <div
            className="
              rounded-[2rem]
              border
              border-black/[0.06]
              bg-white
              p-6
              shadow-[0_8px_30px_rgba(0,0,0,0.035)]
              sm:p-8
              dark:border-white/10
              dark:bg-card
            "
          >
            <SectionTitle
              eyebrow="ABOUT"
              title={`عن ${client.name || "العميل"}`}
            />

            <p
              className="
                mt-6
                text-sm
                leading-8
                text-black/55
                sm:text-base
                dark:text-white/70
              "
            >
              {client.description || "لا يوجد وصف متاح لهذا العميل حاليًا."}
            </p>
          </div>

          {/* Contact */}

          <div
            className="
              rounded-[2rem]
              border
              border-black/[0.06]
              bg-white
              p-6
              shadow-[0_8px_30px_rgba(0,0,0,0.035)]
              sm:p-8
              dark:border-white/10
              dark:bg-card
            "
          >
            <SectionTitle eyebrow="CONTACT" title="بيانات التواصل" />

            <div className="mt-6 space-y-3">
              {client.email && (
                <ContactItem
                  icon={Mail}
                  label="البريد الإلكتروني"
                  value={client.email}
                  href={`mailto:${client.email}`}
                />
              )}

              {client.phone && (
                <ContactItem
                  icon={Phone}
                  label="رقم الهاتف"
                  value={client.phone}
                  href={`tel:${client.phone}`}
                />
              )}

              {client.website && (
                <ContactItem
                  icon={Globe}
                  label="الموقع الإلكتروني"
                  value={cleanWebsite(client.website)}
                  href={normalizeUrl(client.website)}
                  external
                />
              )}

              {!client.email && !client.phone && !client.website && (
                <p className="text-sm text-black/35 dark:text-white/50">
                  لا توجد بيانات تواصل متاحة.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            SOCIAL
        ===================================================== */}

        {socialLinks.length > 0 && (
          <section
            className="
              mt-6
              rounded-[2rem]
              border
              border-black/[0.06]
              bg-white
              p-6
              shadow-[0_8px_30px_rgba(0,0,0,0.035)]
              sm:p-8
              dark:border-white/10
              dark:bg-card
            "
          >
            <SectionTitle eyebrow="SOCIAL" title="تابع العميل" />

            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-5
              "
            >
              {socialLinks.map(({ key, label, value, icon: Icon }) => (
                <a
                  key={key}
                  href={normalizeUrl(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                      group
                      flex
                      items-center
                      justify-between
                      gap-3
                      rounded-2xl
                      border
                      border-black/[0.06]
                      bg-[#fafafa]
                      p-4
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-primary-500/20
                      dark:border-white/10
                      dark:bg-white/5
                    "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-white
                          text-black/45
                          shadow-sm
                          ring-1
                          ring-black/[0.05]
                          transition-all
                          group-hover:bg-primary-600
                          group-hover:text-white
                          dark:bg-white/10
                          dark:text-white/70
                          dark:ring-white/10
                        "
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <span
                      className="
                          text-xs
                          font-bold
                          text-black/60
                          dark:text-white/70
                        "
                    >
                      {label}
                    </span>
                  </div>

                  <ExternalLink
                    className="
                        h-3.5
                        w-3.5
                        text-black/20
                        transition
                        group-hover:text-primary-600
                        dark:text-white/30
                      "
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            CTA
        ===================================================== */}

        <section
          className="
            relative
            mt-6
            overflow-hidden
            rounded-[2rem]
            bg-neutral-950
            p-7
            text-white
            sm:p-9
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-20
              h-64
              w-64
              rounded-full
              bg-primary-500/20
              blur-[80px]
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="text-xs font-bold text-white/35">CLIENT PROFILE</p>

              <h2 className="mt-2 text-xl font-black sm:text-2xl">
                سعيدين بوجود {client.name || "هذا العميل"} معنا
              </h2>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-7
                  text-white/45
                "
              >
                نعتز بثقة عملائنا ونسعى دائمًا لبناء علاقات طويلة المدى مبنية
                على الجودة والاحترافية.
              </p>
            </div>

            <Link
              href="/clients"
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-white
                px-5
                py-3.5
                text-sm
                font-black
                text-neutral-950
                transition
                hover:-translate-y-0.5
              "
            >
              كل العملاء
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}

/* ============================================================
   SECTION TITLE
============================================================ */

function SectionTitle({ eyebrow, title }) {
  return (
    <div>
      <p
        className="
          text-[10px]
          font-black
          uppercase
          tracking-[0.18em]
          text-primary-600
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
          text-neutral-950
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
   CONTACT ITEM
============================================================ */

function ContactItem({ icon: Icon, label, value, href, external = false }) {
  const content = (
    <>
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-black/[0.04]
          text-black/45
          transition
          group-hover:bg-primary-600
          group-hover:text-white
          dark:bg-white/5
          dark:text-white/60
        "
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold text-black/30 dark:text-white/40">{label}</p>

        <p className="mt-0.5 truncate text-xs font-bold text-black/65 dark:text-white/80">
          {value}
        </p>
      </div>

      {external && (
        <ExternalLink className="mr-auto h-3.5 w-3.5 text-black/20 dark:text-white/30" />
      )}
    </>
  );

  if (!href) {
    return (
      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-black/[0.05]
          bg-[#fafafa]
          p-3
          dark:border-white/10
          dark:bg-white/5
        "
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="
        group
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-black/[0.05]
        bg-[#fafafa]
        p-3
        transition
        hover:border-primary-500/15
        dark:border-white/10
        dark:bg-white/5
      "
    >
      {content}
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
    <main dir="rtl" className="min-h-screen bg-[#fafafa] py-20 dark:bg-background">
      <Container>
        <div
          className="
            flex
            min-h-[500px]
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
              bg-black/[0.04]
              text-black/25
              dark:bg-white/5
              dark:text-white/40
            "
          >
            <Users className="h-9 w-9" />
          </div>

          <h1 className="mt-6 text-2xl font-black text-neutral-950 dark:text-white">
            العميل غير موجود
          </h1>

          <p className="mt-3 max-w-md text-sm leading-7 text-black/40 dark:text-white/60">
            يبدو أن الملف الذي تبحث عنه غير موجود أو تم حذفه.
          </p>

          <Link
            href="/clients"
            className="
              mt-7
              inline-flex
              items-center
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
              transition
              hover:bg-primary-700
            "
          >
            العودة للعملاء
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
    <main dir="rtl" className="min-h-screen bg-[#fafafa] pb-20 dark:bg-background">
      {/* Cover */}

      <div
        className="
          h-[280px]
          animate-pulse
          bg-neutral-200
          sm:h-[360px]
          lg:h-[430px]
          dark:bg-neutral-800
        "
      />

      <Container>
        {/* Profile */}

        <div
          className="
            relative
            z-10
            -mt-20
            rounded-[2rem]
            bg-white
            p-6
            shadow-sm
            sm:-mt-24
            sm:p-8
            dark:bg-card
          "
        >
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div
              className="
                h-28
                w-28
                shrink-0
                animate-pulse
                rounded-[1.75rem]
                bg-neutral-200
                sm:h-32
                sm:w-32
                dark:bg-neutral-800
              "
            />

            <div className="w-full space-y-3">
              <div className="h-8 w-48 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />

              <div className="h-4 w-32 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />

              <div className="h-7 w-40 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-800" />
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                h-28
                animate-pulse
                rounded-[1.5rem]
                bg-neutral-100
                dark:bg-neutral-800
              "
            />
          ))}
        </div>

        {/* Content */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="h-72 animate-pulse rounded-[2rem] bg-neutral-100 dark:bg-neutral-800" />

          <div className="h-72 animate-pulse rounded-[2rem] bg-neutral-100 dark:bg-neutral-800" />
        </div>
      </Container>
    </main>
  );
}
