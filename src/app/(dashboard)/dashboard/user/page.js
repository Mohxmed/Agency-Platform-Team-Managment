"use client";

import { useEffect, useState } from "react";

import {
  Mail,
  Phone,
  Globe,
  User,
  Save,
  FileText,
  Image as ImageIcon,
  BarChart3,
  Plus,
  Trash2,
  ExternalLink,
  Camera,
  LayoutDashboard,
} from "lucide-react";

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";

import { subscribeToAuthChanges } from "@/features/auth/services/auth.service";

import { Container } from "@/features/landing";

import { useToast } from "@/hooks/useToast";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { createNotification } from "@/lib/firestoreService";

/* =========================================================
   EMPTY FORM
========================================================= */

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  specialty: "",

  website: "",
  description: "",

  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  tiktok: "",

  logo: "",
  coverImage: "",

  stats: [],
};

/* =========================================================
   SECTIONS
========================================================= */

const SECTIONS = [
  { id: "media", label: "صور الملف", icon: ImageIcon },
  { id: "personal", label: "البيانات الشخصية", icon: User },
  { id: "profile", label: "الملف العام", icon: FileText },
  { id: "social", label: "حسابات التواصل", icon: ExternalLink },
  { id: "stats", label: "الإحصائيات", icon: BarChart3 },
];

/* =========================================================
   PAGE
========================================================= */

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const { showToast } = useToast();

  /* =======================================================
     LOAD USER + PROFILE
  ======================================================= */

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      try {
        setLoading(true);

        if (!currentUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(currentUser);

        const profileRef = doc(db, "profiles", currentUser.uid);

        const profileSnapshot = await getDoc(profileRef);

        if (profileSnapshot.exists()) {
          const profile = profileSnapshot.data();

          setForm({
            ...EMPTY_FORM,
            ...profile,

            uid: currentUser.uid,

            name: profile.name || currentUser.displayName || "",

            email: currentUser.email || profile.email || "",

            stats: Array.isArray(profile.stats) ? profile.stats : [],
          });
        } else {
          /*
           * Create profile automatically
           */

          const newProfile = {
            ...EMPTY_FORM,

            uid: currentUser.uid,

            name: currentUser.displayName || "",

            email: currentUser.email || "",

            createdAt: serverTimestamp(),

            updatedAt: serverTimestamp(),
          };

          await setDoc(profileRef, newProfile);

          setForm({
            ...EMPTY_FORM,

            uid: currentUser.uid,

            name: currentUser.displayName || "",

            email: currentUser.email || "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);

        showToast({
          type: "error",
          title: "حدث خطأ",
          message: "تعذر تحميل بيانات الملف الشخصي.",
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [showToast]);

  /* =======================================================
     SCROLL SPY
  ======================================================= */

  useEffect(() => {
    const visible = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }

        const current = SECTIONS.find((section) => visible.has(section.id));

        if (current) setActiveSection(current.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);

      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  /* =======================================================
     CHANGE
  ======================================================= */

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };
  }

  /* =======================================================
     STAT CHANGE
  ======================================================= */

  function handleStatChange(index, field) {
    return (event) => {
      const value = event.target.value;

      setForm((prev) => {
        const stats = [...prev.stats];

        stats[index] = {
          ...stats[index],
          [field]: value,
        };

        return {
          ...prev,
          stats,
        };
      });
    };
  }

  /* =======================================================
     ADD STAT
  ======================================================= */

  function addStat() {
    setForm((prev) => ({
      ...prev,

      stats: [
        ...prev.stats,
        {
          label: "",
          value: "",
        },
      ],
    }));
  }

  /* =======================================================
     REMOVE STAT
  ======================================================= */

  function removeStat(index) {
    setForm((prev) => ({
      ...prev,

      stats: prev.stats.filter((_, statIndex) => statIndex !== index),
    }));
  }

  /* =======================================================
     SAVE
  ======================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      showToast({
        type: "error",
        title: "غير مسجل الدخول",
        message: "يجب تسجيل الدخول أولًا.",
      });

      return;
    }

    setSaving(true);

    try {
      const profileRef = doc(db, "profiles", user.uid);

      const cleanStats = form.stats
        .filter(
          (stat) =>
            stat &&
            String(stat.label || "").trim() &&
            String(stat.value || "").trim(),
        )
        .map((stat) => ({
          label: String(stat.label).trim(),

          value: String(stat.value).trim(),
        }));

      const profileData = {
        uid: user.uid,

        name: form.name.trim(),

        email: user.email || form.email.trim(),

        phone: form.phone.trim(),

        specialty: form.specialty.trim(),

        website: form.website.trim(),

        description: form.description.trim(),

        facebook: form.facebook.trim(),

        instagram: form.instagram.trim(),

        linkedin: form.linkedin.trim(),

        youtube: form.youtube.trim(),

        tiktok: form.tiktok.trim(),

        logo: form.logo.trim(),

        photoURL: form.logo.trim() || form.photoURL || user?.photoURL || "",

        coverImage: form.coverImage.trim(),

        stats: cleanStats,

        updatedAt: serverTimestamp(),
      };

      await setDoc(profileRef, profileData, {
        merge: true,
      });

      setForm((prev) => ({
        ...prev,

        ...profileData,

        email: user.email || prev.email,

        stats: cleanStats,
      }));
      await createNotification({
        userId: user.uid,
        title: "تم تحديث البيانات",
        message: ".تم تحديث بيانات حسابك بنجاح",
        type: "الحساب",
        projectId: "PROJECT_ID",
        projectTitle: "الحساب",
        link: "/dashboard/user",
      });

      showToast({
        type: "success",
        title: "تم حفظ البيانات",
        message: "تم تحديث ملفك الشخصي بنجاح.",
      });
    } catch (error) {
      console.error("Failed to save profile:", error);

      showToast({
        type: "error",
        title: "فشل الحفظ",
        message: "حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى.",
      });
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <DashboardSkeleton />;
  }

  /* =======================================================
     NOT LOGGED IN
  ======================================================= */

  if (!user) {
    return (
      <div
        dir="rtl"
        className="
          min-h-screen
          bg-transparent
          py-20
        "
      >
        <Container>
          <div
            className="
              flex
              min-h-[450px]
              items-center
              justify-center
              rounded-[2rem]
              border
              border-ink/[0.06]
              bg-card
              text-center
              shadow-sm
            "
          >
            <div>
              <User
                className="
                  mx-auto
                  h-14
                  w-14
                  text-ink/15
                "
              />

              <h1
                className="
                  mt-5
                  text-2xl
                  font-black
                  text-ink
                "
              >
                يجب تسجيل الدخول
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  text-ink/60
                "
              >
                سجل الدخول للوصول إلى لوحة التحكم الخاصة بك.
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  /* =======================================================
     DASHBOARD
  ======================================================= */

  return (
    <div dir="rtl" className="mx-auto w-full max-w-5xl py-4 sm:py-6">
      {/* ===================================================
          SECTION NAV
      =================================================== */}

      <nav
        className="
          mb-5
          rounded-2xl
          border
          border-ink/[0.06]
          bg-card
          p-2
          shadow-sm
        "
      >
        <div className="flex gap-1.5 overflow-x-auto">
          {SECTIONS.map((section) => {
            const active = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`
                  inline-flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-xl
                  px-3.5
                  py-2.5
                  text-xs
                  font-bold
                  transition
                  ${
                    active
                      ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                      : "text-ink/60 hover:bg-ink/[0.04] hover:text-ink"
                  }
                `}
              >
                <section.icon className="h-4 w-4 shrink-0" />

                <span className="whitespace-nowrap">{section.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ===================================================
          FORM
      =================================================== */}

      <form onSubmit={handleSubmit} className="space-y-4" id="profile-form">
        {/* =================================================
            MEDIA
        ================================================= */}

        <Section
          id="media"
          title="صور الملف"
          description="ضع روابط الصور المرفوعة على Cloudinary أو أي Storage."
          icon={ImageIcon}
        >
          <div className="space-y-4">
            {/* =========================================
                LOGO
            ========================================= */}

            <div
              className="
                rounded-2xl
                border
                border-ink/[0.06]
                bg-surface
                p-3.5
                sm:p-4
              "
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary-600/[0.07]
                    text-primary-600
                  "
                >
                  <Camera className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-black text-ink">صورة اللوجو</p>

                  <p className="mt-0.5 text-[11px] text-ink/60">
                    صورة الحساب الشخصية
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_140px] lg:items-end">
                <Field
                  icon={ImageIcon}
                  label="رابط اللوجو"
                  value={form.logo}
                  onChange={handleChange("logo")}
                  placeholder="https://res.cloudinary.com/..."
                />

                <div
                  className="
                    flex
                    h-[120px]
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-2xl
                    border
                    border-ink/[0.06]
                    bg-card
                  "
                >
                  {form.logo ? (
                    <img
                      src={form.logo}
                      alt="Logo Preview"
                      className="
                        h-24
                        w-24
                        rounded-full
                        object-cover
                      "
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-6 w-6 text-ink/15" />

                      <p className="mt-2 text-[11px] font-bold text-ink/60">
                        معاينة اللوجو
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =========================================
                COVER
            ========================================= */}

            <div
              className="
                rounded-2xl
                border
                border-ink/[0.06]
                bg-surface
                p-3.5
                sm:p-4
              "
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary-600/[0.07]
                    text-primary-600
                  "
                >
                  <ImageIcon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-black text-ink">صورة الغلاف</p>

                  <p className="mt-0.5 text-[11px] text-ink/60">
                    صورة الغلاف الرئيسية للبروفايل
                  </p>
                </div>
              </div>

              <Field
                icon={ImageIcon}
                label="رابط صورة الغلاف"
                value={form.coverImage}
                onChange={handleChange("coverImage")}
                placeholder="https://res.cloudinary.com/..."
              />

              <div
                className="
                  mt-4
                  overflow-hidden
                  rounded-2xl
                  border
                  border-ink/[0.06]
                  bg-card
                "
              >
                <div
                  className="
                    relative
                    aspect-[3/1]
                    w-full
                    overflow-hidden
                  "
                >
                  {form.coverImage ? (
                    <img
                      src={form.coverImage}
                      alt="Cover Preview"
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-full
                        items-center
                        justify-center
                        bg-surface
                      "
                    >
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-7 w-7 text-ink/15" />

                        <p className="mt-2 text-xs font-bold text-ink/60">
                          معاينة صورة الغلاف
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* =================================================
            PERSONAL
        ================================================= */}

        <Section
          id="personal"
          title="البيانات الشخصية"
          description="معلوماتك الأساسية الظاهرة في ملفك."
          icon={User}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              icon={User}
              label="الاسم"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="مثال: Ammar Amer"
            />

            <Field
              icon={Mail}
              label="البريد الإلكتروني"
              type="email"
              value={form.email}
              disabled
              placeholder="you@example.com"
            />

            <Field
              icon={Phone}
              label="رقم الهاتف"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="01000000000"
            />

            <Field
              icon={User}
              label="التخصص"
              value={form.specialty}
              onChange={handleChange("specialty")}
              placeholder="مثال: مدرس كيمياء"
            />
          </div>
        </Section>

        {/* =================================================
            PUBLIC PROFILE
        ================================================= */}

        <Section
          id="profile"
          title="الملف العام"
          description="البيانات التي سيشاهدها الزوار في صفحة ملفك."
          icon={FileText}
        >
          <div className="space-y-4">
            <Field
              icon={Globe}
              label="الموقع الإلكتروني"
              value={form.website}
              onChange={handleChange("website")}
              placeholder="https://example.com"
            />

            <TextAreaField
              label="نبذة عنك"
              value={form.description}
              onChange={handleChange("description")}
              placeholder="اكتب نبذة احترافية مختصرة عنك..."
            />
          </div>
        </Section>

        {/* =================================================
            SOCIAL
        ================================================= */}

        <Section
          id="social"
          title="حسابات التواصل الاجتماعي"
          description="أضف الروابط التي تريد إظهارها في ملفك."
          icon={ExternalLink}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              icon={FaFacebook}
              label="Facebook"
              value={form.facebook}
              onChange={handleChange("facebook")}
              placeholder="https://facebook.com/..."
            />

            <Field
              icon={FaInstagram}
              label="Instagram"
              value={form.instagram}
              onChange={handleChange("instagram")}
              placeholder="https://instagram.com/..."
            />

            <Field
              icon={FaLinkedin}
              label="LinkedIn"
              value={form.linkedin}
              onChange={handleChange("linkedin")}
              placeholder="https://linkedin.com/in/..."
            />

            <Field
              icon={FaYoutube}
              label="YouTube"
              value={form.youtube}
              onChange={handleChange("youtube")}
              placeholder="https://youtube.com/@..."
            />

            <Field
              icon={FaTiktok}
              label="TikTok"
              value={form.tiktok}
              onChange={handleChange("tiktok")}
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </Section>

        {/* =================================================
            STATS
        ================================================= */}

        <Section
          id="stats"
          title="الإحصائيات"
          description="أضف الأرقام التي تريد عرضها في بطاقة العميل."
          icon={BarChart3}
        >
          <div className="space-y-3">
            {form.stats.length === 0 && (
              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  border-ink/[0.1]
                  bg-surface
                  px-5
                  py-6
                  text-center
                "
              >
                <BarChart3 className="mx-auto h-7 w-7 text-ink/15" />

                <p className="mt-2 text-sm font-bold text-ink/60">
                  لا توجد إحصائيات حتى الآن
                </p>

                <p className="mt-1 text-[11px] text-ink/60">
                  أضف أول إحصائية من الزر بالأسفل.
                </p>
              </div>
            )}

            {form.stats.map((stat, index) => (
              <div
                key={index}
                className="
                  rounded-2xl
                  border
                  border-ink/[0.07]
                  bg-surface
                  p-3.5
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-end
                  "
                >
                  <div className="flex-1">
                    <Field
                      icon={FileText}
                      label="اسم الإحصائية"
                      value={stat.label || ""}
                      onChange={handleStatChange(index, "label")}
                      placeholder="مثال: متابعين"
                    />
                  </div>

                  <div className="flex-1">
                    <Field
                      icon={BarChart3}
                      label="القيمة"
                      value={stat.value || ""}
                      onChange={handleStatChange(index, "value")}
                      placeholder="مثال: 15K+"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="
                      inline-flex
                      h-[42px]
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-red-500/10
                      bg-red-500/[0.04]
                      px-4
                      text-xs
                      font-bold
                      text-red-500
                      transition
                      hover:bg-red-500/[0.08]
                    "
                  >
                    <Trash2 className="h-4 w-4" />

                    <span>حذف</span>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addStat}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-primary-600/15
                bg-primary-600/[0.05]
                px-4
                py-2.5
                text-xs
                font-black
                text-primary-600
                transition
                hover:bg-primary-600/[0.1]
              "
            >
              <Plus className="h-4 w-4" />
              إضافة إحصائية
            </button>
          </div>
        </Section>

        {/* =================================================
            BOTTOM SPACING
        ================================================= */}

        <div className="h-20" />
      </form>

      {/* =================================================
          FIXED SAVE BAR
      ================================================= */}

      <div
        className="
          fixed
          bottom-4
          left-1/2
          z-40
          w-[calc(100%-2rem)]
          max-w-5xl
          -translate-x-1/2
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            rounded-2xl
            border
            border-ink/[0.07]
            bg-card/95
            p-3
            shadow-[0_20px_60px_rgba(0,0,0,0.15)]
            backdrop-blur-xl
          "
        >
          {/* LEFT */}

          <div className="hidden items-center gap-2 sm:flex">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-primary-600/[0.07]
                text-primary-600
              "
            >
              <LayoutDashboard className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-black text-ink">إعدادات الملف</p>

              <p className="text-[10px] text-ink/60">
                احفظ التغييرات بعد التعديل
              </p>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex w-full gap-2 sm:w-auto">
            <button
              type="submit"
              form="profile-form"
              disabled={saving}
              className="
                inline-flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-primary-600
                px-6
                py-2.5
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-primary-600/20
                transition-all
                hover:bg-primary-700
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:flex-none
              "
            >
              <Save className="h-4 w-4" />

              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

function Section({ id, title, description, icon: Icon, children }) {
  return (
    <section
      id={id}
      className="
        scroll-mt-24
        overflow-hidden
        rounded-2xl
        border
        border-ink/[0.06]
        bg-card
        shadow-[0_2px_12px_rgba(0,0,0,0.03)]
      "
    >
      <header
        className="
          flex
          items-center
          gap-3
          border-b
          border-ink/[0.05]
          px-4
          py-3.5
          sm:px-5
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-primary-600/[0.07]
            text-primary-600
          "
        >
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <h2 className="text-sm font-black tracking-tight text-ink">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-[11px] text-ink/60">{description}</p>
          )}
        </div>
      </header>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  suffix,
}) {
  return (
    <div>
      <label
        className="
          mb-1.5
          block
          text-[11px]
          font-bold
          text-ink/55
        "
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          className="
            pointer-events-none
            absolute
            right-3.5
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-ink/50
          "
        />

        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full
            rounded-xl
            border
            border-ink/[0.08]
            bg-surface
            py-2.5
            pl-4
            pr-10
            text-sm
            font-medium
            text-ink
            outline-none
            transition
            placeholder:text-ink/50
            focus:border-primary-500/40
            focus:bg-card
            focus:ring-4
            focus:ring-primary-500/[0.06]

            ${disabled ? "cursor-not-allowed opacity-60" : ""}

            ${suffix ? "pl-24" : ""}
          `}
        />

        {suffix && (
          <span
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-xs
              font-bold
              text-ink/60
            "
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label
        className="
          mb-1.5
          block
          text-[11px]
          font-bold
          text-ink/55
        "
      >
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={onChange}
        rows={4}
        placeholder={placeholder}
        className="
          w-full
          resize-none
          rounded-xl
          border
          border-ink/[0.08]
          bg-surface
          px-4
          py-2.5
          text-sm
          font-medium
          leading-7
          text-ink
          outline-none
          transition
          placeholder:text-ink/50
          focus:border-primary-500/40
          focus:bg-card
          focus:ring-4
          focus:ring-primary-500/[0.06]
        "
      />
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function DashboardSkeleton() {
  return (
    <div dir="rtl" className="bg-transparent py-4">
      <div className="animate-pulse space-y-4">
        <div className="h-14 rounded-2xl bg-card shadow-sm" />

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-48 animate-pulse rounded-2xl bg-card shadow-sm"
          />
        ))}
      </div>
    </div>
  );
}
