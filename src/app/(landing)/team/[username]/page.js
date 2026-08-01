"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  MapPin,
  Sparkles,
  BarChart3,
} from "lucide-react";

import { Container } from "@/features/landing";
import { useProfile } from "@/features/landing/hooks/useProfile";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

/* =========================================================
   SOCIAL CONFIG
========================================================= */

const SOCIALS = [
  {
    key: "facebook",
    label: "Facebook",
    icon: FaFacebook,
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: FaInstagram,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: FaYoutube,
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function TeamProfilePage() {
  const params = useParams();

  const username = params?.username;

  const { profile, loading, error } = useProfile(username);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <ProfileSkeleton />;
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!profile) {
    return (
      <main
        dir="rtl"
        className="
          min-h-screen
          bg-[#fafafa]
          py-20
          dark:bg-background
        "
      >
        <Container>
          <div
            className="
              flex
              min-h-[500px]
              items-center
              justify-center
              rounded-[2rem]
              border
              border-black/[0.06]
              bg-white
              text-center
              shadow-sm
              dark:border-white/10
              dark:bg-card
            "
          >
            <div>
              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-black/[0.04]
                  dark:bg-white/5
                "
              >
                <Sparkles className="h-7 w-7 text-black/20 dark:text-white/30" />
              </div>

              <h1
                className="
                  mt-5
                  text-2xl
                  font-black
                  text-neutral-950
                  dark:text-white
                "
              >
                البروفايل غير موجود
              </h1>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  leading-6
                  text-black/40
                  dark:text-white/60
                "
              >
                {error ||
                  "الرابط الذي تحاول الوصول إليه غير صحيح أو أن البروفايل لم يعد متاحًا."}
              </p>

              <Link
                href="/"
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-primary-600
                  px-5
                  py-3
                  text-sm
                  font-black
                  text-white
                  transition
                  hover:bg-primary-700
                "
              >
                العودة للرئيسية
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const name = profile.name || "بدون اسم";

  const specialty = profile.specialty || "";

  const description = profile.description || "";

  const email = profile.email || "";

  const phone = profile.phone || "";

  const website = profile.website || "";

  const logo = profile.logo || "";

  const coverImage = profile.coverImage || "";

  const stats = Array.isArray(profile.stats) ? profile.stats : [];

  const activeSocials = SOCIALS.filter(
    (social) => profile[social.key] && String(profile[social.key]).trim(),
  );

  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        bg-[#fafafa]
        pb-20
        dark:bg-background
      "
    >
      {/* ===================================================
          HERO / COVER
      =================================================== */}

      <section className="relative">
        {/* COVER */}

        <div
          className="
            relative
            h-[260px]
            overflow-hidden
            bg-neutral-950
            sm:h-[340px]
            lg:h-[400px]
          "
        >
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt={`غلاف ${name}`}
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-black/35
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/60
                  via-transparent
                  to-black/10
                "
              />
            </>
          ) : (
            <>
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-primary-600
                  via-primary-700
                  to-neutral-950
                "
              />

              <div
                className="
                  absolute
                  -right-20
                  -top-32
                  h-80
                  w-80
                  rounded-full
                  bg-white/[0.08]
                  blur-3xl
                "
              />

              <div
                className="
                  absolute
                  -bottom-40
                  -left-20
                  h-96
                  w-96
                  rounded-full
                  bg-white/[0.06]
                  blur-3xl
                "
              />
            </>
          )}
        </div>

        {/* PROFILE CONTENT */}

        <Container>
          <div
            className="
              relative
              -mt-20
              sm:-mt-24
            "
          >
            <div
              className="
                rounded-[2rem]
                border
                border-black/[0.06]
                bg-white
                px-5
                pb-6
                pt-5
                shadow-[0_20px_70px_rgba(0,0,0,0.08)]
                sm:px-8
                sm:pb-8
                sm:pt-6
                dark:border-white/10
                dark:bg-card
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-6
                  lg:flex-row
                  lg:items-end
                  lg:justify-between
                "
              >
                {/* PROFILE IDENTITY */}

                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-end
                  "
                >
                  {/* LOGO */}

                  <div
                    className="
                      relative
                      h-28
                      w-28
                      shrink-0
                      sm:h-36
                      sm:w-36
                    "
                  >
                    <div
                      className="
                        h-full
                        w-full
                        overflow-hidden
                        rounded-[2rem]
                        border-[6px]
                        border-white
                        bg-neutral-100
                        shadow-xl
                        dark:border-card
                        dark:bg-white/5
                      "
                    >
                      {logo ? (
                        <img
                          src={logo}
                          alt={name}
                          className="
                            h-full
                            w-full
                            object-cover
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
                            bg-primary-600
                            text-3xl
                            font-black
                            text-white
                          "
                        >
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* NAME */}

                  <div className="pb-1">
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >
                      <h1
                        className="
                          text-3xl
                          font-black
                          tracking-tight
                          text-neutral-950
                          sm:text-4xl
                          dark:text-white
                        "
                      >
                        {name}
                      </h1>
                    </div>

                    {specialty && (
                      <p
                        className="
                          mt-2
                          text-sm
                          font-bold
                          text-primary-600
                        "
                      >
                        {specialty}
                      </p>
                    )}

                      <p
                        className="
                          mt-1
                          text-xs
                          text-black/30
                          dark:text-white/40
                        "
                      >
                        @{profile.link}
                      </p>
                  </div>
                </div>

                {/* ACTIONS */}

                <div
                  className="
                    flex
                    flex-wrap
                    gap-3
                  "
                >
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        border
                        border-black/[0.08]
                        bg-white
                        px-5
                        py-3
                        text-sm
                        font-black
                        text-neutral-800
                        transition
                        hover:border-primary-600/20
                        hover:bg-primary-600/[0.04]
                        hover:text-primary-600
                        dark:border-white/15
                        dark:bg-white/5
                        dark:text-white
                      "
                    >
                      <Mail className="h-4 w-4" />
                      تواصل معي
                    </a>
                  )}

                  {website && (
                    <a
                      href={normalizeUrl(website)}
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
                        py-3
                        text-sm
                        font-black
                        text-white
                        shadow-lg
                        shadow-primary-600/20
                        transition
                        hover:-translate-y-0.5
                        hover:bg-primary-700
                      "
                    >
                      <Globe className="h-4 w-4" />
                      الموقع الإلكتروني
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <Container>
        <div
          className="
            mt-6
            grid
            gap-6
            lg:grid-cols-[1fr_340px]
          "
        >
          {/* =================================================
              LEFT / MAIN
          ================================================= */}

          <div className="space-y-6">
            {/* ABOUT */}

            {description && (
              <ProfileCard eyebrow="ABOUT" title="نبذة عني" icon={Sparkles}>
                <p
                  className="
                    text-sm
                    font-medium
                    leading-8
                    text-black/55
                    dark:text-white/70
                  "
                >
                  {description}
                </p>
              </ProfileCard>
            )}

            {/* STATS */}

            {stats.length > 0 && (
              <ProfileCard
                eyebrow="STATISTICS"
                title="إحصائيات"
                icon={BarChart3}
              >
                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-3
                  "
                >
                  {stats.map((stat, index) => (
                    <div
                      key={`${stat.label}-${index}`}
                      className="
                          rounded-2xl
                          border
                          border-black/[0.06]
                          bg-[#fafafa]
                          p-5
                          dark:border-white/10
                          dark:bg-white/5
                        "
                    >
                      <p
                        className="
                            text-2xl
                            font-black
                            tracking-tight
                            text-neutral-950
                            dark:text-white
                          "
                      >
                        {stat.value}
                      </p>

                      <p
                        className="
                            mt-1
                            text-xs
                            font-bold
                            text-black/35
                            dark:text-white/40
                          "
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </ProfileCard>
            )}

            {/* CONTACT */}

            {(email || phone || website) && (
              <ProfileCard eyebrow="CONTACT" title="بيانات التواصل" icon={Mail}>
                <div className="space-y-3">
                  {email && (
                    <ContactRow
                      icon={Mail}
                      label="البريد الإلكتروني"
                      value={email}
                      href={`mailto:${email}`}
                    />
                  )}

                  {phone && (
                    <ContactRow
                      icon={Phone}
                      label="رقم الهاتف"
                      value={phone}
                      href={`tel:${phone}`}
                    />
                  )}

                  {website && (
                    <ContactRow
                      icon={Globe}
                      label="الموقع الإلكتروني"
                      value={website}
                      href={normalizeUrl(website)}
                      external
                    />
                  )}
                </div>
              </ProfileCard>
            )}
          </div>

          {/* =================================================
              RIGHT / SIDEBAR
          ================================================= */}

          <aside className="space-y-6">
            {/* SOCIAL */}

            {activeSocials.length > 0 && (
              <ProfileCard
                eyebrow="SOCIAL MEDIA"
                title="تابعني"
                icon={ExternalLink}
              >
                <div className="space-y-3">
                  {activeSocials.map(({ key, label, icon: Icon }) => (
                    <a
                      key={key}
                      href={normalizeUrl(profile[key])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                          group
                          flex
                          items-center
                          gap-3
                          rounded-2xl
                          border
                          border-black/[0.06]
                          bg-[#fafafa]
                          p-3
                          transition
                          hover:border-primary-600/20
                          hover:bg-primary-600/[0.04]
                          dark:border-white/10
                          dark:bg-white/5
                        "
                    >
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
                            transition
                            group-hover:text-primary-600
                            dark:bg-white/10
                            dark:text-white/70
                          "
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                              text-xs
                              font-black
                              text-neutral-900
                              dark:text-white
                            "
                        >
                          {label}
                        </p>

                        <p
                          className="
                              mt-0.5
                              truncate
                              text-[10px]
                              font-medium
                              text-black/30
                              dark:text-white/40
                            "
                        >
                          زيارة الحساب
                        </p>
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
              </ProfileCard>
            )}

            {/* QUICK INFO */}

            {(specialty || phone || email) && (
              <ProfileCard
                eyebrow="QUICK INFO"
                title="معلومات سريعة"
                icon={MapPin}
              >
                <div className="space-y-4">
                  {specialty && <InfoRow label="التخصص" value={specialty} />}

                  {phone && <InfoRow label="الهاتف" value={phone} />}

                  {email && <InfoRow label="البريد" value={email} />}
                </div>
              </ProfileCard>
            )}

            {/* PROFILE LINK */}
          </aside>
        </div>
      </Container>
    </main>
  );
}

/* =========================================================
   PROFILE CARD
========================================================= */

function ProfileCard({ eyebrow, title, icon: Icon, children }) {
  return (
    <section
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-black/[0.06]
        bg-white
        shadow-[0_8px_30px_rgba(0,0,0,0.035)]
        dark:border-white/10
        dark:bg-card
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-black/[0.05]
          px-5
          py-5
          sm:px-6
          dark:border-white/10
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-primary-600/[0.07]
            text-primary-600
          "
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div>
          <p
            className="
              text-[9px]
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
            mt-0.5
            text-lg
            font-black
            tracking-tight
            text-neutral-950
            dark:text-white
          "
        >
          {title}
        </h2>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

/* =========================================================
   CONTACT ROW
========================================================= */

function ContactRow({ icon: Icon, label, value, href, external = false }) {
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
          bg-primary-600/[0.06]
          text-primary-600
        "
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="
            text-[10px]
            font-bold
            text-black/30
            dark:text-white/40
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-sm
            font-bold
            text-neutral-900
            dark:text-white
          "
        >
          {value}
        </p>
      </div>

      {external && <ExternalLink className="h-4 w-4 text-black/20 dark:text-white/30" />}
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
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-black/[0.05]
        bg-[#fafafa]
        p-3
        transition
        hover:border-primary-600/20
        hover:bg-primary-600/[0.03]
        dark:border-white/10
        dark:bg-white/5
      "
    >
      {content}
    </a>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({ label, value }) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
        border-b
        border-black/[0.05]
        pb-3
        last:border-0
        last:pb-0
        dark:border-white/10
      "
    >
      <span
        className="
          shrink-0
          text-xs
          font-bold
          text-black/30
          dark:text-white/40
        "
      >
        {label}
      </span>

      <span
        className="
          min-w-0
          truncate
          text-right
          text-xs
          font-black
          text-neutral-900
          dark:text-white
        "
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   URL NORMALIZER
========================================================= */

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

/* =========================================================
   SKELETON
========================================================= */

function ProfileSkeleton() {
  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        bg-[#fafafa]
        pb-20
        dark:bg-background
      "
    >
      <div
        className="
          h-[260px]
          animate-pulse
          bg-neutral-200
          sm:h-[340px]
          lg:h-[400px]
          dark:bg-neutral-800
        "
      />

      <Container>
        <div
          className="
            relative
            -mt-20
            sm:-mt-24
          "
        >
          <div
            className="
              h-48
              animate-pulse
              rounded-[2rem]
              bg-white
              shadow-sm
              dark:bg-card
            "
          />
        </div>

        <div
          className="
            mt-6
            grid
            gap-6
            lg:grid-cols-[1fr_340px]
          "
        >
          <div className="space-y-6">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="
                  h-64
                  animate-pulse
                  rounded-[2rem]
                  bg-white
                  dark:bg-card
                "
              />
            ))}
          </div>

          <div className="space-y-6">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="
                  h-52
                  animate-pulse
                  rounded-[2rem]
                  bg-white
                  dark:bg-card
                "
              />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
