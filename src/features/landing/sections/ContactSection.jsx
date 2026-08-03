"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MailCheck,
  Send,
  ArrowUpLeft,
  Sparkles,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { OutlinedBadge } from "@/shared/ui/badges/OutlinedBadge";
import { Container } from "@/features/landing";
import Button from "@/shared/ui/buttons/Buttons";
import { useSettings } from "@/contexts/SettingsContext";
import { CONTACT_SECTION } from "@/constants/content";
import { ROUTES } from "@/constants/routes";

/* =========================================================
   ANIMATIONS
========================================================= */

const leftContent = {
  hidden: {
    opacity: 0,
    x: 60,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const rightContent = {
  hidden: {
    opacity: 0,
    x: -60,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 1,
      delay: 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.25,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   CONTACT SECTION
========================================================= */

export default function ContactSection() {
  const { settings } = useSettings();

  const content = settings.content?.contact || {};
  const badgeTitle = content.badgeTitle || CONTACT_SECTION.badgeTitle;
  const heading = content.heading || CONTACT_SECTION.heading;
  const headingHighlight = content.headingHighlight || CONTACT_SECTION.headingHighlight;
  const description =
    content.description ||
    "كلمنا دلوقتي واحكيلنا عن شغلك، وإحنا هنساعدك نحول فكرتك لحاجة احترافية توصل لجمهورك وتحققلك النتيجة اللي مستنيها.";
  const emailLabel = content.emailLabel || "البريد الإلكتروني";
  const phoneLabel = content.phoneLabel || "تليفون / واتساب";
  const addressLabel = content.addressLabel || "مكاننا";
  const mapButton = content.mapButton || "موقعنا على الخريطة";
  const whatsappButton = content.whatsappButton || "كلمنا على واتساب";
  const formTitle = content.formTitle || "احكيلنا عن مشروعك";
  const formSubtitle =
    content.formSubtitle || "املأ البيانات وإحنا هنتواصل معاك في أقرب وقت.";
  const submitLabel = content.submitLabel || "ابعتلنا";

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <section
      id="contact"
      dir="rtl"
      className="
        relative
        min-h-[calc(100vh-64px)]
        w-full
        overflow-hidden
        bg-[#080706]
        py-20
        sm:py-24
        lg:py-28
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      {/* Main Glow */}

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[650px]
          w-[650px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-primary-600/[0.08]
          blur-[150px]
        "
      />

      {/* Right Glow */}

      <motion.div
        animate={{
          y: [0, 35, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -right-40
          top-20
          h-[450px]
          w-[450px]
          rounded-full
          bg-primary-700/[0.10]
          blur-[140px]
        "
      />

      {/* Left Glow */}

      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-10
          h-[400px]
          w-[400px]
          rounded-full
          bg-primary-500/[0.07]
          blur-[140px]
        "
      />

      {/* Grid */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)]
          [background-size:70px_70px]
          [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]
        "
      />

      {/* Top Line */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-px
          w-[70%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-primary-500/50
          to-transparent
          shadow-[0_0_30px_rgba(234,179,8,0.2)]
        "
      />

      {/* Floating particles */}

      <motion.span
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          right-[14%]
          top-[18%]
          h-1.5
          w-1.5
          rounded-full
          bg-primary-400
          shadow-[0_0_18px_5px_rgba(234,179,8,0.2)]
        "
      />

      <motion.span
        animate={{
          y: [0, 18, 0],
          opacity: [0.2, 0.7, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          bottom-[20%]
          left-[13%]
          h-1
          w-1
          rounded-full
          bg-primary-300
          shadow-[0_0_16px_4px_rgba(234,179,8,0.2)]
        "
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <Container className="relative z-10">

        <div
          className="
            grid
            items-center
            gap-14
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-20
          "
        >

          {/* =================================================
              LEFT
          ================================================= */}

          <motion.div
            variants={leftContent}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >

            {/* Badge */}

            <div className="mb-6">
              <OutlinedBadge variant="white">
                <MailCheck size={18} />
                {badgeTitle}
              </OutlinedBadge>
            </div>

            {/* Heading */}

            <h2
              className="
                max-w-xl
                text-4xl
                font-black
                leading-[1.25]
                tracking-tight
                text-white
                sm:text-5xl
                lg:text-6xl
              "
            >
              {heading}
              <br />

              <span className="relative inline-block text-primary-500">
                {headingHighlight}
                
                {/* Underline */}

                <span
                  className="
                    absolute
                    -bottom-2
                    right-0
                    h-1
                    w-1/2
                    rounded-full
                    bg-primary-500/70
                    shadow-[0_0_20px_rgba(234,179,8,0.3)]
                  "
                />
              </span>
            </h2>

            <p
              className="
                mt-7
                max-w-xl
                text-sm
                leading-8
                text-white/45
                sm:text-base
              "
            >
              {description}
            </p>

            {/* Contact Info */}

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              className="mt-10 space-y-3"
            >

              <ContactItem
                icon={<Mail size={18} />}
                label={emailLabel}
                value={settings.contactSectionEmail || "hello@nokta.com"}
                href={`mailto:${settings.contactSectionEmail || "hello@nokta.com"}`}
              />

              <ContactItem
                icon={<Phone size={18} />}
                label={phoneLabel}
                value={`${settings.contactSectionPhone || "01064571025"} / ${settings.contactSectionWhatsapp || "+201066855480"}`}
                href={`tel:${(settings.contactSectionPhone || "01064571025").replace(/[^0-9]/g, "")}`}
              />

              <ContactItem
                icon={<MapPin size={18} />}
                label={addressLabel}
                value={settings.contactSectionAddress || "طلخا، المنصورة - مصر"}
              />

            </motion.div>

            {/* Actions */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: 0.55,
              }}
              className="
                mt-7
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >

              <Button
                variant="outline"
                className="w-full"
                href={
                  settings.contactSectionMapLink ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    settings.contactSectionAddress || "طلخا، المنصورة - مصر",
                  )}`
                }
                blank
              >
                <MapPin size={18} />
                {mapButton}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                href={
                  settings.contactSectionWhatsapp
                    ? `https://wa.me/${settings.contactSectionWhatsapp.replace(/[^0-9]/g, "")}`
                    : ROUTES.WHATSAPP
                }
                blank
              >
                <FaWhatsapp size={20} />
                {whatsappButton}
              </Button>

            </motion.div>

          </motion.div>

          {/* =================================================
              FORM
          ================================================= */}

          <motion.div
            variants={rightContent}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="relative"
          >

            {/* Form Glow */}

            <div
              className="
                pointer-events-none
                absolute
                -inset-5
                rounded-[40px]
                bg-primary-500/[0.05]
                blur-3xl
              "
            />

            {/* Form Card */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-white/[0.08]
                bg-white/[0.035]
                p-6
                shadow-[0_30px_100px_rgba(0,0,0,0.35)]
                backdrop-blur-2xl
                sm:p-8
                lg:p-10
              "
            >

              {/* Card Top Shine */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  top-0
                  h-32
                  bg-gradient-to-b
                  from-white/[0.04]
                  to-transparent
                "
              />

              {/* Moving Shine */}

              <motion.div
                animate={{
                  x: ["-120%", "350%"],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "linear",
                }}
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-0
                  z-20
                  w-1/4
                  rotate-12
                  bg-gradient-to-r
                  from-transparent
                  via-primary-300/[0.04]
                  to-transparent
                  blur-2xl
                "
              />

              <div className="relative z-10">

                {/* Form Header */}

                <div className="mb-8 flex items-start justify-between gap-4">

                  <div>
                    <div
                      className="
                        mb-3
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-primary-500/10
                        text-primary-400
                      "
                    >
                      <Sparkles size={18} />
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      {formTitle}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-white/35">
                      {formSubtitle}
                    </p>
                  </div>

                  <div
                    className="
                      hidden
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/[0.06]
                      bg-white/[0.025]
                      text-white/20
                      sm:flex
                    "
                  >
                    <ArrowUpLeft size={17} />
                  </div>

                </div>

                {/* Form */}

                <form onSubmit={handleSubmit} className="space-y-5">

                  <PremiumInput
                    label="اسمك"
                    placeholder="الاسم كامل"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />

                  <PremiumInput
                    label="تليفونك"
                    placeholder="رقم التليفون أو الواتساب"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />

                  <PremiumInput
                    label="ايميلك"
                    placeholder="بريدك الإلكتروني"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />

                  <div>

                    <label
                      className="
                        mb-2
                        block
                        text-xs
                        font-medium
                        text-white/60
                      "
                    >
                      الرسالة
                    </label>

                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="عرفنا أكتر عن اللي انت محتاجه..."
                      required
                      className="
                        w-full
                        resize-none
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-black/20
                        px-4
                        py-3.5
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-white/20
                        transition-all
                        duration-300
                        focus:border-primary-500/40
                        focus:bg-black/30
                        focus:ring-4
                        focus:ring-primary-500/[0.06]
                      "
                    />

                  </div>

                  {/* Submit */}

                  {submitted ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 py-3.5 text-sm font-bold text-emerald-400">
                      <MailCheck size={17} />
                      تم إرسال الرسالة بنجاح ❤️
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={loading}
                        className="
                          w-full
                          rounded-2xl
                          py-3.5
                          shadow-[0_15px_40px_rgba(234,179,8,0.12)]
                        "
                      >
                        <Send size={17} />
                        {loading ? "جاري الإرسال..." : submitLabel}
                      </Button>
                    </motion.div>
                  )}

                  {error && (
                    <p className="text-center text-xs text-red-400">{error}</p>
                  )}

                </form>

              </div>
            </div>

          </motion.div>

        </div>

      </Container>
    </section>
  );
}

/* =========================================================
   CONTACT ITEM
========================================================= */

function ContactItem({
  icon,
  label,
  value,
  href,
}) {
  const content = (
    <>
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-primary-500/10
          bg-primary-500/[0.06]
          text-primary-400
          transition-all
          duration-300
          group-hover:border-primary-500/25
          group-hover:bg-primary-500/10
          group-hover:shadow-[0_0_25px_rgba(234,179,8,0.08)]
        "
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[11px] text-white/30">
          {label}
        </p>

        <p
          className="
            mt-1
            truncate
            text-sm
            font-medium
            text-white/70
            transition-colors
            group-hover:text-primary-300
          "
        >
          {value}
        </p>

      </div>

      <ArrowUpLeft
        size={15}
        className="
          mr-auto
          text-white/15
          opacity-0
          transition-all
          duration-300
          group-hover:-translate-x-1
          group-hover:opacity-100
          group-hover:text-primary-400
        "
      />
    </>
  );

  if (href) {
    return (
      <motion.a
        variants={item}
        href={href}
        className="
          group
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-white/[0.05]
          bg-white/[0.018]
          px-4
          py-3
          transition-all
          duration-300
          hover:border-primary-500/15
          hover:bg-primary-500/[0.025]
        "
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      variants={item}
      className="
        group
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-white/[0.05]
        bg-white/[0.018]
        px-4
        py-3
      "
    >
      {content}
    </motion.div>
  );
}

/* =========================================================
   PREMIUM INPUT
========================================================= */

function PremiumInput({
  label,
  placeholder,
  type,
  name,
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
          text-xs
          font-medium
          text-white/60
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
        required={required}
        placeholder={placeholder}
        className="
          h-12
          w-full
          rounded-2xl
          border
          border-white/[0.08]
          bg-black/20
          px-4
          text-sm
          text-white
          outline-none
          placeholder:text-white/20
          transition-all
          duration-300
          hover:border-white/[0.12]
          focus:border-primary-500/40
          focus:bg-black/30
          focus:ring-4
          focus:ring-primary-500/[0.06]
        "
      />
    </div>
  );
}
