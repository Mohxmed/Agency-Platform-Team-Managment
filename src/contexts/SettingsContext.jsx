"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchSettings, clearSettingsCache } from "@/lib/settingsCache";

const EMPTY = {
  siteName: "نقطة",
  tagline: "نقطة ومن أول السطر، شغلك محتاج إبداع.",
  description:
    "نقطة هي مكانك الأول والأخير اللي هتخليك تظهر بشكل احترافي على السوشيال ميديا ونريحك من الإدارة والمتابعة ونسلمك نتائج.",
  whatsapp: "",
  copyright: "",
  contactSectionEmail: "",
  contactSectionPhone: "",
  contactSectionAddress: "",
  contactSectionMapLink: "",
  contactSectionWhatsapp: "",
  social: { facebook: "", instagram: "", linkedin: "", youtube: "", tiktok: "", twitter: "" },
  sections: { hero: true, clients: true, works: true, services: true, contact: true, social: true },
  content: {
    hero: {
      badge: "سمعنا انك بتدور علينا؟",
      titlePrefix: "ومن",
      titleHighlight: "أول السطر،",
      titleSuffix: "هنبدأ حكايات جديدة..",
      ctaPrimary: "اتواصل معانا",
      ctaPrimaryLink: "/contact",
      ctaPrimaryIcon: "ArrowLeft",
      ctaSecondary: "اتفرج على أخر اعمالنا",
      ctaSecondaryLink: "/portfolio",
      ctaSecondaryIcon: "Play",
      campaign: {
        title: "حملة تسويقية",
        text: "وصلنا لأكثر من 200 ألف متابع مستهدف خلال أسبوعين.",
        likes: "2.4K",
        comments: "318",
      },
      analytics: {
        title: "محتوى أسبوعي",
        growth: "+24%",
        text: "تفاعل أعلى من المتوسط بثلاث أضعاف",
      },
growth: {
      value: "+150K",
      label: "متابع جديد",
      period: "هذا الشهر",
    },
    flying: [
      {
        title: "حضور قوي كل يوم",
        text: "محتوى بيردد صداه ويخلي جمهورك يتفاعل",
        value: "+2.4K",
        label: "إعجاب جديد",
        icon: "Heart",
        metric: "likes",
        animated: true,
        color: "rose",
      },
      {
        title: "وصول بذكاء محسوب",
        text: "حملات مدروسة بتوصل لجمهورك الصح",
        value: "+150K",
        label: "متابع جديد",
        icon: "Target",
        metric: "followers",
        animated: true,
        color: "blue",
      },
      {
        title: "شغل بخامة عالية",
        text: "تصميم بيشد العين وبيفرض الاحترافية",
        value: "+3.5K",
        label: "مشترك جديد",
        icon: "Users",
        metric: "subscribers",
        animated: true,
        color: "purple",
      },
      {
        title: "مشاهدات بتتضاعف",
        text: "فيديوهات ومحتوى بيحقق أرقام قياسية",
        value: "+2.1M",
        label: "مشاهدة",
        icon: "Video",
        metric: "views",
        animated: true,
        color: "orange",
      },
      {
        title: "مشاركة وانتشار واسع",
        text: "محتوى بيستاهل المشاركة والريتويت",
        value: "+89K",
        label: "مشاركة",
        icon: "Share2",
        metric: "shares",
        animated: true,
        color: "green",
      },
      {
        title: "تفاعل حقيقي ومتزايد",
        text: "تعليقات ونقاشات بتثري المحتوى",
        value: "+12.4K",
        label: "تعليق",
        icon: "MessageSquare",
        metric: "comments",
        animated: true,
        color: "indigo",
      },
      {
        title: "معدل تفاعل قياسي",
        text: "أداء محتوى بياخد المركز الأول",
        value: "12.8%",
        label: "معدل التفاعل",
        icon: "Zap",
        metric: "engagementRate",
        animated: true,
        color: "amber",
      },
      {
        title: "وصول لملايين العيون",
        text: "حضور رقمي بيفرض نفسه في السوق",
        value: "+5.2M",
        label: "وصول",
        icon: "Eye",
        metric: "reach",
        animated: true,
        color: "red",
      },
    ],
  },
    clients: {
      badge: "شركاء النجاح",
      title: "ابرز",
      redTitle: "شركائنا",
      description:
        "خلف كل نجاح قصة، وخلف كل قصة شراكة حقيقية. نفخر بأننا كنا جزءًا من رحلة العديد من المعلمين وصناع المحتوى، وساهمنا في تحويل أفكارهم إلى تأثير يصل إلى الآلاف والملايين.",
      ctaPrimary: "تصفح جميع العملاء",
      ctaPrimaryLink: "/clients",
      ctaSecondary: "انضم الينا",
      ctaSecondaryLink: "/contact",
    },
    works: {
      badge: "محفظة أعمالنا",
      title: "",
      redTitle: "أفكار بتتحول لأرقام",
      description:
        "كل مشروع بيعكس شغفنا للإبداع والتخطيط والأداء. بنصنع تجربة تربط الهوية بالجمهور وتحول الأفكار إلى نمو محسوب.",
      ctaBadge: "خطوات فعلية لنجاحات واقعية",
      ctaHeading: "مزيج بين البساطة",
      ctaHeadingHighlight: "والإحترافية",
      ctaDescription:
        "احنا بنقدم تجربة رقمية مزيج بين البساطة والإبداع والسرعة والتصميم عشان نضيف قيمة وأثر في كل عين.",
      ctaPrimary: "عرض كل الأعمال",
      ctaPrimaryLink: "/portfolio",
      ctaSecondary: "كلمنا دلوقتي",
      ctaSecondaryLink: "/contact",
    },
    services: {
      badge: "خدماتنا",
      title: "كل شئ انت محتاجه",
      redTitle: "",
      description:
        "احنا بندمج الابداع والتخطيط والتكنولوجيا عشان نقدم حلول تسويقية تساعد المشاريع تبني براندات قوية تحقق ارقام قياسية ونمو ملحوظ على مدى زمني قصير",
      moreTitle: "المزيد..",
      moreDescription:
        "وغيرها من الخدمات والحلول اللي بنقدمها، تقدر تشوف أكتر في صفحة خدماتنا",
      moreLink: "/services",
    },
    contact: {
      badgeTitle: "تواصل معانا",
      heading: "عندك فكرة؟",
      headingHighlight: "خلينا ننفذها.",
      description:
        "كلمنا دلوقتي واحكيلنا عن شغلك، وإحنا هنساعدك نحول فكرتك لحاجة احترافية توصل لجمهورك وتحققلك النتيجة اللي مستنيها.",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "تليفون / واتساب",
      addressLabel: "مكاننا",
      mapButton: "افتح مكاننا على الخريطة",
      whatsappButton: "كلمنا على واتساب",
      formTitle: "احكيلنا عن مشروعك",
      formSubtitle: "املأ البيانات وإحنا هنتواصل معاك في أقرب وقت.",
      submitLabel: "ابعتلنا",
    },
    social: {
      title: "NO2TA COMMUNITY",
      redTitle: "تابعنا على السوشيال ميديا",
      description:
        "عشان تفضل على تواصل معانا وتكتشف آخر المشاريع، التحديثات، والعروض اللي بنعملها.",
      bottomText: "كن جزءًا من مجتمع نقطة",
    },
    footer: {
      description:
        "شركة دعاية وإعلان في مصر، نهتم بإدارة والترويج واستلام حملات المدرسين وصناع المحتوى، ونساعدهم على بناء حضور أقوى على السوشيال ميديا.",
      column1Title: "اعرف أكتر",
      column1Links: [
        { label: "احنا مين", href: "#" },
        { label: "أعمالنا", href: "/portfolio" },
        { label: "خدماتنا", href: "/services" },
        { label: "تواصل معنا", href: "/contact" },
      ],
      column2Title: "المزيد عن",
      column2Links: [
        { label: "حقوق النشر", href: "/copyrights" },
        { label: "سياسة الخصوصية", href: "/privacy-policy" },
        { label: "اتفاقية الاستخدام", href: "/terms-of-use" },
        { label: "الشكاوى والإقتراحات", href: "/reports" },
      ],
    },
  },
  stats: [
    { value: "120+", label: "مشروع مكتمل", icon: "BriefcaseBusiness" },
    { value: "48", label: "هوية تجارية", icon: "Palette" },
    { value: "3", label: "دول وصلنا لها", icon: "Globe2" },
    { value: "99%", label: "رضا العملاء", icon: "Sparkles" },
  ],
  seo: {
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "",
    canonicalUrl: "",
    googleVerification: "",
    robots: "",
  },
  notifications: { enabled: true, projectStatus: true, teamUpdates: true, deadlines: true, newProjects: true, tasks: true },
  system: { maintenanceMode: false, currency: "EGP", maintenanceTitle: "", maintenanceMessage: "" },
  auth: { allowRegistration: true },
};

export const DEFAULT_CONTENT = EMPTY.content;

export const FLYING_CARD_GROUPS = [
  {
    key: "hero",
    title: "الواجهة الرئيسية",
    description: "الشارة، العنوان (البادئة، المميز)، الأزرار، والبطاقات العائمة (الحملات الاجتماعية، التحليلات، النمو).",
    icon: Sparkles,
    fields: [
      { key: "badge", label: "نص الشارة العلوية", type: "text" },
      { key: "titlePrefix", label: "كلمة قبل الجزء المميز", type: "text" },
      { key: "titleHighlight", label: "الجزء المميز من العنوان", type: "text" },
      { key: "titleSuffix", label: "السطر الثاني من العنوان", type: "text" },
      { key: "ctaPrimary", label: "الزر الأساسي (تواصل)", type: "text" },
      { key: "ctaPrimaryLink", label: "رابط الزر الأساسي", type: "link" },
      { key: "ctaPrimaryIcon", label: "أيقونة الزر الأساسي", type: "icon" },
      { key: "ctaSecondary", label: "الزر الثانوي (أعمالنا)", type: "text" },
      { key: "ctaSecondaryLink", label: "رابط الزر الثانوي", type: "link" },
      { key: "ctaSecondaryIcon", label: "أيقونة الزر الثانوي", type: "icon" },
    ],
  },
  {
    key: "hero",
    title: "بطاقات التفاعل الطائرة",
    description: "11 بطاقة تفاعل طائرة (إعجاب، متابعون، مشتركون، مشاهدات، مشاركة، تفاعل، معدل تفاعل، وصول، حلول، دول، شركات، جوائز) مع رسوم متحركة وتأثيرات hover.",
    icon: TrendingUp,
    fields: [],
    isArray: true,
    arrayFields: [
      { key: "title", label: "عنوان البطاقة", type: "text" },
      { key: "text", label: "نص البطاقة", type: "textarea" },
      { key: "value", label: "القيمة (مع '+' قبلها)", type: "text" },
      { key: "label", label: "وصف القيمة", type: "text" },
      { key: "icon", label: "أيقونة البطاقة", type: "icon" },
      { key: "metric", label: "اسم المقياس", type: "text" },
      { key: "animated", label: "هل متحركة؟", type: "select", options: ["{true: نعم", "{false: لا}"] },
      { key: "color", label: "لون البطاقة (لونفسجية)", type: "select", options: ["{rose: أحمر", "{blue: أزرق", "{purple: بنفسج", "{orange: برتقالي", "{green: أخضر", "{indigo: نيلي", "{amber: أصفر", "{red: أحمر"] },
    ],
  },
];

export { DEFAULT_CONTENT, FLYING_CARD_GROUPS };

export const FLYING_CARD_GROUPS = [
  {
    key: "hero",
    title: "الواجهة الرئيسية",
    description: "الشارة، العنوان (البادئة، المميز)، الأزران، والبطاقات العائمة (الحملات الاجتماعية، التحليلات، النمو).",
    icon: Sparkles,
    fields: [
      { key: "badge", label: "نص الشارة العلوية", type: "text" },
      { key: "titlePrefix", label: "كلمة قبل الجزء المميز", type: "text" },
      { key: "titleHighlight", label: "الجزء المميز من العنوان", type: "text" },
      { key: "titleSuffix", label: "السطر الثاني من العنوان", type: "text" },
      { key: "ctaPrimary", label: "الزر الأساسي (تواصل)", type: "text" },
      { key: "ctaPrimaryLink", label: "رابط الزر الأساسي", type: "link" },
      { key: "ctaPrimaryIcon", label: "أيقونة الزر الأساسي", type: "icon" },
      { key: "ctaSecondary", label: "الزر الثانوي (أعمالنا)", type: "text" },
      { key: "ctaSecondaryLink", label: "رابط الزر الثانوي", type: "link" },
      { key: "ctaSecondaryIcon", label: "أيقونة الزر الثانوي", type: "icon" },
    ],
  },
  {
    key: "hero",
    title: "بطاقات التفاعل الطائرة",
    description: "11 بطاقة تفاعل طائرة (إعجاب، متابعون، مشتركون، مشاهدات، مشاركة، تفاعل، معدل تفاعل، وصول، حلول، دول، شركات، جوائز) مع رسوم متحركة وتأثيرات hover.",
    icon: TrendingUp,
    fields: [],
    isArray: true,
    arrayFields: [
      { key: "title", label: "عنوان البطاقة", type: "text" },
      { key: "text", label: "نص البطاقة", type: "textarea" },
      { key: "value", label: "القيمة (مع '+' قبلها)", type: "text" },
      { key: "label", label: "وصف القيمة", type: "text" },
      { key: "icon", label: "أيقونة البطاقة", type: "icon" },
      { key: "metric", label: "اسم المقياس", type: "text" },
      { key: "animated", label: "هل متحركة؟", type: "select", options: ["{true: نعم", "{false: لا}"] },
      { key: "color", label: "لون البطاقة (لنفسجية)", type: "select", options: ["{rose: أحمر", "{blue: أزرق", "{purple: بنفسج", "{orange: برتقالي", "{green: أخضر", "{indigo: نيلي", "{amber: أصفر", "{red: أحمر"] },
    ],
  },
];

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSettings(false);
      if (data) {
        setSettings(deepMerge(EMPTY, data));
      } else {
        setSettings(EMPTY);
      }
    } catch (err) {
      setError(err);
      setSettings(EMPTY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Intentional: load settings once on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // Refetch settings whenever the dashboard saves them.
  useEffect(() => {
    const handleSettingsUpdated = () => {
      clearSettingsCache();
      load();
    };
    window.addEventListener("settings-updated", handleSettingsUpdated);
    return () => {
      window.removeEventListener("settings-updated", handleSettingsUpdated);
    };
  }, [load]);

  const refetch = useCallback(() => {
    clearSettingsCache();
    return load();
  }, [load]);

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refetch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within <SettingsProvider>");
  }
  return ctx;
}

function deepMerge(defaults, overrides) {
  const result = { ...defaults };
  for (const key of Object.keys(overrides)) {
    const value = overrides[key];
    if (value === undefined) continue;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = deepMerge(defaults[key] || {}, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
