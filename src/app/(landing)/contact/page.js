"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Container } from "@/features/landing";
import SocialMediaLinks from "@/features/landing/components/SocialMediaLinks";
import { useSettings } from "@/contexts/SettingsContext";

/* =========================================================
   ANIMATION
========================================================= */

const pageContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 25,
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

const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   PAGE
========================================================= */

export default function ContactSection() {
  const { settings } = useSettings();

  const contactEmail = settings.contactSectionEmail || "hello@nokta.com";
  const contactPhone = settings.contactSectionPhone || "+20 100 000 0000";
  const contactAddress = settings.contactSectionAddress || "طلخا، الدقهلية - مصر";
  const whatsappNumber = (
    settings.contactSectionWhatsapp ||
    settings.whatsapp ||
    "201000000000"
  ).replace(/[^0-9]/g, "");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "حدث خطأ");
      }

      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-white
        py-10
        sm:py-14
        lg:py-20
        dark:bg-background
      "
    >
      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary glow (static radial gradient — no filter) */}

        <div
          className="
            absolute
            -right-52
            -top-52
            h-[650px]
            w-[650px]
            [background:radial-gradient(circle_at_center,rgba(217,4,41,0.07),transparent_62%)]
          "
        />

        {/* Secondary glow (static) */}

        <div
          className="
            absolute
            -bottom-60
            -left-52
            h-[600px]
            w-[600px]
            [background:radial-gradient(circle_at_center,rgba(217,4,41,0.05),transparent_62%)]
          "
        />

        {/* Small center glow (static) */}

        <div
          className="
            absolute
            left-1/2
            top-[40%]
            h-72
            w-72
            -translate-x-1/2
            [background:radial-gradient(circle_at_center,rgba(217,4,41,0.025),transparent_65%)]
          "
        />

        {/* Decorative rings */}

        <div
          className="
            absolute
            -right-24
            top-48
            h-80
            w-80
            rounded-full
            border
            border-primary-600/[0.045]
          "
        />

        <div
          className="
            absolute
            -right-12
            top-60
            h-56
            w-56
            rounded-full
            border
            border-primary-600/[0.035]
          "
        />

        <div
          className="
            absolute
            -bottom-24
            -left-24
            h-80
            w-80
            rounded-full
            border
            border-primary-600/[0.04]
          "
        />
      </div>

      <Container className="relative z-10">
        {/* =====================================================
            HERO
        ====================================================== */}

        <motion.section
          initial="hidden"
          animate="visible"
          variants={pageContainer}
          className="
            mb-10
            text-center
            sm:mb-14
            lg:mb-16
          "
        >
          {/* Badge */}

          <motion.div
            variants={fadeUp}
            className="
              mx-auto
              mb-5
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-primary-600/10
              bg-primary-600/[0.05]
              px-4
              py-2
              text-xs
              font-semibold
              text-primary-700
              shadow-sm
              dark:border-primary-600/20
              dark:bg-primary-600/10
              dark:text-primary-400
            "
          >
            <span
              style={{ animation: "pf-wobble 3s ease-in-out infinite" }}
            >
              <Sparkles size={14} />
            </span>
            خلينا نبدأ حاجة جديدة
          </motion.div>

          {/* Title */}

          <motion.h1
            variants={fadeUp}
            className="
              text-3xl
              font-black
              tracking-tight
              text-neutral-950
              sm:text-4xl
              lg:text-5xl
              dark:text-white
          "
          >
            تواصل معانا
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-neutral-500
              sm:text-base
              sm:leading-8
              dark:text-neutral-400
            "
          >
            عندك فكرة، مشروع، حملة إعلانية أو حتى مجرد استفسار؟ ابعتلنا وإحنا
            هنرجعلك ونشوف مع بعض إزاي نقدر نساعدك.
          </motion.p>
        </motion.section>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
          variants={pageContainer}
          className="
            grid
            gap-5
            lg:grid-cols-[0.82fr_1.18fr]
          "
        >
          {/* ===================================================
              CONTACT INFO
          ==================================================== */}

          <motion.div
            variants={cardAnimation}
            className="
              group
              relative
              overflow-hidden
              rounded-[2rem]
              bg-neutral-950
              p-7
              text-white
              shadow-[0_25px_80px_rgba(0,0,0,0.10)]
              sm:p-9
            "
          >
            {/* Background glow (static radial gradient — no filter) */}

            <div
              className="
                pointer-events-none
                absolute
                -right-28
                -top-28
                h-80
                w-80
                [background:radial-gradient(circle_at_center,rgba(217,4,41,0.18),transparent_65%)]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-32
                -left-24
                h-72
                w-72
                [background:radial-gradient(circle_at_center,rgba(190,18,60,0.30),transparent_65%)]
              "
            />

            {/* Decorative plus */}

            <div
              className="
                pointer-events-none
                absolute
                left-5
                top-5
                select-none
                text-[140px]
                font-black
                leading-none
                text-white/[0.025]
              "
            >
              +
            </div>

            <div className="relative z-10">
              {/* Header */}

              <div className="mb-9">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    rotate: 2,
                  }}
                  className="
                    mb-5
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.06]
                    text-primary-400
                  "
                >
                  <MessageCircle size={22} />
                </motion.div>

                <h2 className="text-2xl font-black sm:text-3xl">
                  احكيلنا فكرتك
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-white/45">
                  مهما كانت فكرتك، إحنا جاهزين نسمعها ونساعدك تحولها لحاجة
                  حقيقية.
                </p>
              </div>

              {/* Contact Items */}

              <div className="space-y-3">
                <ContactInfo
                  icon={<Mail size={18} />}
                  title="البريد الإلكتروني"
                  value={contactEmail}
                  href={`mailto:${contactEmail}`}
                />

                <ContactInfo
                  icon={<Phone size={18} />}
                  title="رقم الهاتف"
                  value={contactPhone}
                  href={`tel:${contactPhone.replace(/[^0-9]/g, "")}`}
                />

                <ContactInfo
                  icon={<MapPin size={18} />}
                  title="موقعنا"
                  value={contactAddress}
                />
              </div>

              {/* =================================================
                  SOCIAL MEDIA — CENTERED
              ================================================== */}

              <div className="mt-9 border-t border-white/[0.08] pt-7">
                <p className="mb-4 text-center text-xs text-white/35">
                  تابعنا على السوشيال ميديا
                </p>

                <div className="flex justify-center text-black">
                  <SocialMediaLinks
                    Facebook={settings.social?.facebook || ""}
                    Instagram={settings.social?.instagram || ""}
                    Twitter={settings.social?.twitter || ""}
                    LinkedIn={settings.social?.linkedin || ""}
                    Youtube={settings.social?.youtube || ""}
                    TikTok={settings.social?.tiktok || ""}
                    Whatsapp={settings.contactSectionWhatsapp || settings.whatsapp || ""}
                    size="lg"
                    className="justify-center border-none!"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ===================================================
              FORM
          ==================================================== */}

          <motion.div
            variants={cardAnimation}
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-black/[0.06]
              bg-white
              p-6
              shadow-[0_20px_70px_rgba(0,0,0,0.055)]
              sm:p-9
              dark:border-white/10
              dark:bg-card
            "
          >
            {/* Top glow (static gradient — no filter) */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-52
                w-52
                [background:radial-gradient(circle_at_center,rgba(217,4,41,0.06),transparent_65%)]
              "
            />

            <div className="relative z-10">
              {/* Form Header */}

              <div className="mb-8">
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary-600">
                  CONTACT US
                </span>

                <h2 className="mt-2 text-2xl font-black text-neutral-950 dark:text-white">
                  ابعتلنا رسالة
                </h2>

                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  املأ البيانات دي وإحنا هنتواصل معاك في أقرب وقت.
                </p>
              </div>

              {/* =================================================
                  SUCCESS / FORM
              ================================================== */}

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.97,
                    }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                      flex
                      min-h-[400px]
                      flex-col
                      items-center
                      justify-center
                      text-center
                    "
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 18,
                        delay: 0.1,
                      }}
                      className="
                        mb-5
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-primary-600/10
                        text-primary-600
                      "
                    >
                      <CheckCircle2 size={40} />
                    </motion.div>

                    <h3 className="text-2xl font-black text-neutral-950 dark:text-white">
                      وصلت الرسالة ❤️
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                      شكرًا لتواصلك معانا. هنراجع رسالتك وهنرجعلك في أقرب وقت.
                    </p>

                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="
                        mt-7
                        rounded-full
                        border
                        border-primary-600/15
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-primary-700
                        transition
                        hover:bg-primary-600/[0.05]
                        dark:border-primary-600/30
                        dark:text-primary-400
                        dark:hover:bg-primary-600/10
                      "
                    >
                      إرسال رسالة أخرى
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Name + Email */}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <InputField
                        label="الاسم"
                        name="name"
                        placeholder="اكتب اسمك"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />

                      <InputField
                        label="البريد الإلكتروني"
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Phone */}

                    <InputField
                      label="رقم الهاتف"
                      name="phone"
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={form.phone}
                      onChange={handleChange}
                    />

                    {/* Message */}

                    <div>
                      <label
                        htmlFor="message"
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-neutral-800
                          dark:text-neutral-200
                        "
                      >
                        رسالتك
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="احكيلنا عن مشروعك أو الخدمة اللي محتاجها..."
                        className="
                          w-full
                          resize-none
                          rounded-2xl
                          border
                          border-black/[0.08]
                          bg-neutral-50
                          px-4
                          py-3
                          text-sm
                          text-neutral-900
                          outline-none
                          transition-all
                          duration-300
                          placeholder:text-neutral-400
                          hover:border-black/15
                          focus:border-primary-600/30
                          focus:bg-white
                          focus:ring-4
                          focus:ring-primary-600/10
                          dark:border-white/10
                          dark:bg-black/40
                          dark:text-white
                          dark:placeholder:text-white/30
                          dark:hover:border-white/20
                          dark:focus:bg-black/60
                        "
                      />
                    </div>

                    {/* Submit */}

                    {error && (
                      <div className="flex items-start gap-2 rounded-2xl border border-red-500/10 bg-red-50 px-4 py-3 text-xs leading-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={loading ? {} : { y: -2 }}
                      whileTap={loading ? {} : { scale: 0.985 }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 22,
                      }}
                      className={`
                        group
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        py-4
                        text-sm
                        font-bold
                        text-white
                        shadow-xl
                        shadow-black/10
                        transition-colors
                        duration-300
                        ${loading
                          ? "bg-neutral-700 cursor-not-allowed"
                          : "bg-neutral-950 hover:bg-primary-700"
                        }
                      `}
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send
                          size={17}
                          className="
                            transition-transform
                            duration-300
                            group-hover:-translate-x-1
                          "
                        />
                      )}
                      {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                    </motion.button>

                    <p className="text-center text-[11px] text-neutral-400">
                      بالضغط على إرسال، أنت توافق على سياسة الخصوصية الخاصة بنا.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.section>

        {/* =====================================================
            WHATSAPP CTA
        ====================================================== */}

        <motion.section
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
            amount: 0.3,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-5
            flex
            flex-col
            items-center
            justify-between
            gap-5
            rounded-[2rem]
            border
            border-black/[0.05]
            bg-neutral-50
            px-6
            py-6
            text-center
            sm:flex-row
            sm:text-right
            dark:border-white/10
            dark:bg-card
          "
        >
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white">محتاج رد سريع؟</h3>

            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              تقدر تتواصل معانا مباشرة على واتساب.
            </p>
          </div>

          <motion.a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="
              group
              flex
              shrink-0
              items-center
              gap-2
              rounded-full
              border
              border-black/[0.07]
              bg-white
              px-5
              py-3
              text-sm
              font-bold
              text-neutral-800
              shadow-sm
              transition-all
              duration-300
              hover:border-primary-600/20
              hover:text-primary-700
              hover:shadow-md
              dark:border-white/15
              dark:bg-white/5
              dark:text-white
              dark:hover:border-primary-400/30
              dark:hover:text-primary-400
            "
          >
            تواصل على واتساب
            <ArrowLeft
              size={16}
              className="
                transition-transform
                duration-300
                group-hover:-translate-x-1
              "
            />
          </motion.a>
        </motion.section>
      </Container>
    </main>
  );
}

/* =========================================================
   INPUT
========================================================= */

function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="
          mb-2
          block
          text-sm
          font-semibold
          text-neutral-800
          dark:text-neutral-200
        "
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          h-12
          w-full
          rounded-2xl
          border
          border-black/[0.08]
          bg-neutral-50
          px-4
          text-sm
          text-neutral-900
          outline-none
          transition-all
          duration-300
          placeholder:text-neutral-400
          hover:border-black/15
          focus:border-primary-600/30
          focus:bg-white
          focus:ring-4
          focus:ring-primary-600/10
          dark:border-white/10
          dark:bg-black/40
          dark:text-white
          dark:placeholder:text-white/30
          dark:hover:border-white/20
          dark:focus:bg-black/60
        "
      />
    </div>
  );
}

/* =========================================================
   CONTACT INFO
========================================================= */

function ContactInfo({ icon, title, value, href }) {
  const content = (
    <motion.div
      whileHover={{
        x: -3,
        backgroundColor: "rgba(255,255,255,0.075)",
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 25,
      }}
      className="
        group
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.05]
        p-4
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-white/[0.07]
          text-primary-300
          transition-all
          duration-300
          group-hover:scale-105
          group-hover:bg-primary-600/15
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] text-white/35">{title}</p>

        <p className="mt-1 truncate text-sm font-semibold text-white/85">
          {value}
        </p>
      </div>
    </motion.div>
  );

  if (!href) return content;

  return (
    <a href={href} className="block">
      {content}
    </a>
  );
}
