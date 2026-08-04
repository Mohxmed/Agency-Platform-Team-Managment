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
    let active = true;

    async function resolveParams() {
      const resolved = await params;
      if (active) setLink(resolved?.link || null);
    }

    resolveParams();
    return () => {
      active = false;
    };
  }, [params]);

  const { client, loading } = useClientByLink(link);

  /* ============================================================
     LOADING / NOT FOUND
  ============================================================ */

  if (!link || loading) {
    return <ProfileSkeleton />;
  }

  if (!client) {
    return <NotFound />;
  }

  /* ============================================================
     DATA NORMALIZATION
  ============================================================ */

  const name = client.name || "بدون اسم";

  const stats = (Array.isArray(client.stats) ? client.stats : [])
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
      value: client.email,
      Icon: Mail,
      href: client.email ? `mailto:${client.email}` : null,
    },
    {
      key: "phone",
      label: "رقم الهاتف",
      value: client.phone,
      Icon: Phone,
      href: client.phone ? `tel:${client.phone}` : null,
    },
    {
      key: "website",
      label: "الموقع الإلكتروني",
      value: client.website ? cleanWebsite(client.website) : null,
      Icon: Globe,
      href: client.website ? normalizeUrl(client.website) : null,
      external: true,
    },
  ].filter((item) => item.value);

  const socials = [
    { key: "facebook", label: "فيسبوك", value: client.facebook, Icon: FaFacebook },
    { key: "instagram", label: "إنستجرام", value: client.instagram, Icon: FaInstagram },
    { key: "linkedin", label: "لينكدإن", value: client.linkedin, Icon: FaLinkedin },
    { key: "youtube", label: "يوتيوب", value: client.youtube, Icon: FaYoutube },
    { key: "tiktok", label: "تيك توك", value: client.tiktok, Icon: FaTiktok },
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
          {client.coverImage ? (
            <Image
              src={client.coverImage}
              alt={name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400" />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/60" />

          <Container className="relative z-10 pt-6">
            <Link
              href="/clients"
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
              العودة للعملاء
            </Link>
          </Container>

          <div
            className="
              absolute
              bottom-4
              right-1/2
              z-10
              translate-x-1/2
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
              شريك نفتخر به
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
                <Avatar name={name} logo={client.logo} />

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

                    <CheckCircle2 className="h-5 w-5 fill-primary-600 text-white" />
                  </div>

                  {client.specialty && (
                    <p className="mt-1.5 text-sm font-bold text-primary-600 sm:text-base">
                      {client.specialty}
                    </p>
                  )}

                  {client.Spe && (
                    <p className="mt-1 text-xs font-medium text-muted">{client.Spe}</p>
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
                        bg-emerald-500/10
                        px-3
                        py-1
                        text-[10px]
                        font-bold
                        text-emerald-600
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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

              {/* Website CTA */}

              {client.website && (
                <a
                  href={normalizeUrl(client.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-primary-600
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-primary-600/25
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
            <SectionHeading eyebrow="عن العميل" title={`عن ${name}`} />

            <p
              className="
                mt-4
                text-sm
                leading-8
                text-muted
                sm:text-base
              "
            >
              {client.description || "لا يوجد وصف متاح لهذا العميل حاليًا."}
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
              <SectionHeading eyebrow="تابعنا" title="تابع العميل" />

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
                      hover:border-primary-500/25
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
                        group-hover:text-primary-600
                        dark:text-white/60
                      "
                    />
                    <span
                      className="
                        text-xs
                        font-bold
                        text-black/60
                        group-hover:text-primary-600
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
            dark:bg-neutral-900
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
              [background:radial-gradient(circle_at_center,rgba(217,4,41,0.20),transparent_62%)]
            "
          />
          <div
            className="
              pointer-events-none
              absolute
              -bottom-16
              -right-16
              h-56
              w-56
              rounded-full
              [background:radial-gradient(circle_at_center,rgba(217,4,41,0.10),transparent_62%)]
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                CLIENT PROFILE
              </p>

              <h2 className="mt-2 text-xl font-black sm:text-2xl">
                سعيدين بوجود {name} معنا
              </h2>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-7
                  text-white/50
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
          alt={name || "شعار العميل"}
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
            bg-gradient-to-br
            from-primary-600
            to-primary-400
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
      <div
        className="
          pointer-events-none
          absolute
          -top-10
          left-1/2
          h-20
          w-32
          -translate-x-1/2
          rounded-full
          [background:radial-gradient(ellipse_at_center,rgba(217,4,41,0.10),transparent_65%)]
          transition-all
          duration-500
          group-hover:opacity-100
        "
      />

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
          bg-primary-600/10
          text-primary-600
          transition-colors
          group-hover:bg-primary-600
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
    hover:border-primary-500/20
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
            group-hover:text-primary-600
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
              bg-primary-600/10
              text-primary-600
            "
          >
            <Users className="h-9 w-9" />
          </div>

          <h1 className="mt-6 text-2xl font-black text-ink dark:text-white">
            العميل غير موجود
          </h1>

          <p className="mt-3 max-w-md text-sm leading-7 text-muted">
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
