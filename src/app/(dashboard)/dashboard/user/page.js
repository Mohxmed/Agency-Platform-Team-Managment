"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  Mail,
  Phone,
  Globe,
  User,
  Save,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  BarChart3,
  Plus,
  Trash2,
  ExternalLink,
  Pencil,
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

  link: "",
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
   PAGE
========================================================= */

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const formRef = useRef(null);

  const { showToast } = useToast();

  /* =======================================================
     PROFILE URL
  ======================================================= */

  const profileUrl = form.link?.trim() ? `/team/${form.link.trim()}` : null;

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

    /*
     * Validate username
     */

    const username = form.link.trim().toLowerCase();

    if (!username) {
      showToast({
        type: "warning",
        title: "رابط الملف مطلوب",
        message: "اكتب اسم المستخدم الذي سيظهر في رابط البروفايل.",
      });

      return;
    }

    /*
     * Simple username validation
     */

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      showToast({
        type: "warning",
        title: "رابط الملف غير صحيح",
        message: "استخدم الحروف الإنجليزية والأرقام و - أو _ فقط.",
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

        /*
         * username
         */

        link: username,

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
     SCROLL TO FORM
  ======================================================= */

  function handleEditClick() {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
      <main
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
                  text-ink/40
                "
              >
                سجل الدخول للوصول إلى لوحة التحكم الخاصة بك.
              </p>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  /* =======================================================
     DASHBOARD
  ======================================================= */

  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        bg-transparent
        py-8
        sm:py-12
      "
    >
      {/* ===================================================
          TOAST
      =================================================== */}

      <Container>
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-8">
          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-primary-600
                "
              >
                USER DASHBOARD
              </p>

              <h1
                className="
                  mt-2
                  text-3xl
                  font-black
                  tracking-tight
                  text-ink
                  sm:text-4xl
                "
              >
                لوحة التحكم
              </h1>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-ink/40
                "
              >
                إدارة بيانات ملفك الشخصي وروابط التواصل والصور والإحصائيات.
              </p>
            </div>

            {/* =========================================
                HEADER ACTIONS
            ========================================= */}

            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >
              {/* VIEW PROFILE */}

              {profileUrl ? (
                <Link
                  href={profileUrl}
                  target="_blank"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-ink/[0.08]
                    bg-card
                    px-5
                    py-3
                    text-sm
                    font-black
                    text-ink
                    shadow-sm
                    transition-all
                    hover:-translate-y-0.5
                    hover:border-primary-600/20
                    hover:text-primary-600
                  "
                >
                  <ExternalLink className="h-4 w-4" />
                  عرض البروفايل
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-ink/[0.08]
                    bg-card
                    px-5
                    py-3
                    text-sm
                    font-black
                    text-ink/50
                    shadow-sm
                  "
                >
                  <ExternalLink className="h-4 w-4" />
                  أضف رابط الملف
                </button>
              )}

              {/* EDIT */}

              <button
                type="button"
                onClick={handleEditClick}
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
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-primary-700
                "
              >
                <Pencil className="h-4 w-4" />
                تعديل البيانات
              </button>
            </div>
          </div>

          {/* ===========================================
              PROFILE LINK
          =========================================== */}

          {profileUrl && (
            <div
              className="
                mt-6
                flex
                flex-col
                gap-2
                rounded-2xl
                border
                border-primary-600/10
                bg-primary-600/[0.035]
                px-4
                py-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                "
              >
                <LinkIcon
                  className="
                    h-4
                    w-4
                    shrink-0
                    text-primary-600
                  "
                />

                <span
                  className="
                    text-xs
                    font-bold
                    text-ink/40
                  "
                >
                  رابط ملفك:
                </span>

                <span
                  className="
                    truncate
                    text-xs
                    font-black
                    text-primary-600
                    sm:text-sm
                  "
                >
                  {profileUrl}
                </span>
              </div>

              <Link
                href={profileUrl}
                target="_blank"
                className="
                  inline-flex
                  shrink-0
                  items-center
                  gap-1.5
                  text-xs
                  font-black
                  text-primary-600
                  hover:underline
                "
              >
                فتح الملف
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </header>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="
            scroll-mt-8
            space-y-6
          "
        >
          {/* =================================================
              PERSONAL
          ================================================= */}

          <DashboardCard
            eyebrow="PROFILE"
            title="البيانات الشخصية"
            description="المعلومات الأساسية الظاهرة في ملفك."
            icon={User}
          >
            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >
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
          </DashboardCard>

          {/* =================================================
              PUBLIC PROFILE
          ================================================= */}

          <DashboardCard
            eyebrow="PUBLIC PROFILE"
            title="الملف العام"
            description="البيانات التي سيشاهدها الزوار في صفحة ملفك."
            icon={FileText}
          >
            <div className="space-y-5">
              <div>
                <Field
                  icon={LinkIcon}
                  label="اسم المستخدم / رابط الملف"
                  value={form.link}
                  onChange={handleChange("link")}
                  placeholder="ammar-amer"
                  suffix="/team/"
                />

                <p
                  className="
                    mt-2
                    text-[11px]
                    font-medium
                    text-ink/30
                  "
                >
                  استخدم الحروف الإنجليزية والأرقام و - أو _
                </p>
              </div>

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
          </DashboardCard>

          {/* =================================================
              SOCIAL
          ================================================= */}

          <DashboardCard
            eyebrow="SOCIAL MEDIA"
            title="حسابات التواصل الاجتماعي"
            description="أضف الروابط التي تريد إظهارها في ملفك."
            icon={ExternalLink}
          >
            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >
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
          </DashboardCard>

          {/* =================================================
              MEDIA
          ================================================= */}

          <DashboardCard
            eyebrow="MEDIA"
            title="صور الملف"
            description="ضع روابط الصور المرفوعة على Cloudinary أو أي Storage."
            icon={ImageIcon}
          >
            <div className="space-y-6">
              {/* =========================================
                  LOGO
              ========================================= */}

              <div
                className="
                  rounded-3xl
                  border
                  border-ink/[0.06]
                  bg-surface
                  p-4
                  sm:p-5
                "
              >
                <div
                  className="
                    mb-4
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary-600/[0.07]
                      text-primary-600
                    "
                  >
                    <Camera className="h-5 w-5" />
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-black
                        text-ink
                      "
                    >
                      صورة اللوجو
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-ink/35
                      "
                    >
                      صورة الحساب الشخصية
                    </p>
                  </div>
                </div>

                <div
                  className="
                    grid
                    gap-5
                    lg:grid-cols-[1fr_180px]
                    lg:items-end
                  "
                >
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
                      h-[150px]
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
                          h-28
                          w-28
                          rounded-full
                          object-cover
                        "
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-7 w-7 text-ink/15" />

                        <p className="mt-2 text-[11px] font-bold text-ink/25">
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
                  rounded-3xl
                  border
                  border-ink/[0.06]
                  bg-surface
                  p-4
                  sm:p-5
                "
              >
                <div
                  className="
                    mb-4
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary-600/[0.07]
                      text-primary-600
                    "
                  >
                    <ImageIcon className="h-5 w-5" />
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-black
                        text-ink
                      "
                    >
                      صورة الغلاف
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-ink/35
                      "
                    >
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
                          <ImageIcon className="mx-auto h-8 w-8 text-ink/15" />

                          <p className="mt-2 text-xs font-bold text-ink/25">
                            معاينة صورة الغلاف
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* =================================================
              STATS
          ================================================= */}

          <DashboardCard
            eyebrow="STATISTICS"
            title="الإحصائيات"
            description="أضف الأرقام والمعلومات التي تريد عرضها في بطاقة العميل."
            icon={BarChart3}
          >
            <div className="space-y-4">
              {form.stats.length === 0 && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-ink/[0.1]
                    bg-surface
                    px-5
                    py-8
                    text-center
                  "
                >
                  <BarChart3
                    className="
                      mx-auto
                      h-8
                      w-8
                      text-ink/15
                    "
                  />

                  <p
                    className="
                      mt-3
                      text-sm
                      font-bold
                      text-ink/40
                    "
                  >
                    لا توجد إحصائيات حتى الآن
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-ink/25
                    "
                  >
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
                      p-4
                    "
                >
                  <div
                    className="
                        flex
                        flex-col
                        gap-4
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
                          h-[50px]
                          items-center
                          justify-center
                          gap-2
                          rounded-2xl
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
                  rounded-2xl
                  border
                  border-primary-600/15
                  bg-primary-600/[0.05]
                  px-5
                  py-3
                  text-sm
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
          </DashboardCard>

          {/* =================================================
              SAVE AREA
          ================================================= */}

          <div className="h-20" />

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
              max-w-4xl
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

              <div
                className="
                  hidden
                  items-center
                  gap-2
                  sm:flex
                "
              >
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
                  <p
                    className="
                      text-xs
                      font-black
                      text-ink
                    "
                  >
                    إعدادات الملف
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-ink/35
                    "
                  >
                    احفظ التغييرات بعد التعديل
                  </p>
                </div>
              </div>

              {/* ACTIONS */}

              <div
                className="
                  flex
                  w-full
                  gap-2
                  sm:w-auto
                "
              >
                {profileUrl && (
                  <Link
                    href={profileUrl}
                    target="_blank"
                    className="
                      inline-flex
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-ink/[0.07]
                      bg-card
                      px-4
                      py-3
                      text-xs
                      font-black
                      text-ink
                      transition
                      hover:bg-surface
                      sm:flex-none
                    "
                  >
                    <ExternalLink className="h-4 w-4" />

                    <span className="hidden sm:inline">عرض البروفايل</span>

                    <span className="sm:hidden">البروفايل</span>
                  </Link>
                )}

                <button
                  type="submit"
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
                    py-3
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
        </form>
      </Container>
    </main>
  );
}

/* =========================================================
   DASHBOARD CARD
========================================================= */

function DashboardCard({ eyebrow, title, description, icon: Icon, children }) {
  return (
    <section
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-ink/[0.06]
        bg-card
        shadow-[0_8px_30px_rgba(0,0,0,0.035)]
      "
    >
      <div
        className="
          flex
          items-start
          gap-4
          border-b
          border-ink/[0.05]
          px-5
          py-5
          sm:px-7
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
            rounded-2xl
            bg-primary-600/[0.07]
            text-primary-600
          "
        >
          <Icon className="h-5 w-5" />
        </div>

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
              mt-1
              text-xl
              font-black
              tracking-tight
              text-ink
            "
          >
            {title}
          </h2>

          {description && (
            <p
              className="
                mt-1
                text-xs
                leading-5
                text-ink/35
              "
            >
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-7">{children}</div>
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
          mb-2
          block
          text-xs
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
            right-4
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-ink/25
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
            rounded-2xl
            border
            border-ink/[0.08]
            bg-surface
            py-3.5
            pl-4
            pr-11
            text-sm
            font-medium
            text-ink
            outline-none
            transition
            placeholder:text-ink/25
            focus:border-primary-500/40
            focus:bg-card
            focus:ring-4
            focus:ring-primary-500/[0.07]

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
              text-ink/25
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
          mb-2
          block
          text-xs
          font-bold
          text-ink/55
        "
      >
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={onChange}
        rows={5}
        placeholder={placeholder}
        className="
          w-full
          resize-none
          rounded-2xl
          border
          border-ink/[0.08]
          bg-surface
          px-4
          py-3.5
          text-sm
          font-medium
          leading-7
          text-ink
          outline-none
          transition
          placeholder:text-ink/25
          focus:border-primary-500/40
          focus:bg-card
          focus:ring-4
          focus:ring-primary-500/[0.07]
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
    <main
      dir="rtl"
      className="
        min-h-screen
        bg-transparent
        py-12
      "
    >
      <Container>
        <div className="animate-pulse">
          <div className="h-3 w-28 rounded bg-ink/[0.08]" />

          <div
            className="
              mt-3
              h-10
              w-56
              rounded-xl
              bg-ink/[0.08]
            "
          />

          <div
            className="
              mt-3
              h-4
              w-80
              rounded
              bg-ink/[0.08]
            "
          />
        </div>

        <div className="mt-8 space-y-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                  h-64
                  animate-pulse
                  rounded-[2rem]
                  bg-card
                  shadow-sm
                "
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
