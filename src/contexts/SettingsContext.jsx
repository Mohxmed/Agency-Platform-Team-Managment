"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchSettings, clearSettingsCache } from "@/lib/settingsCache";
import { getOptimizedUrl } from "@/lib/cloudinaryService";

const EMPTY = {
  siteName: "نقطة | وكالة إبداع رقمي",
  tagline: "نقطة ومن أول السطر، شغلك محتاج إبداع.",
  description:
    "في نقطة، نحول الأفكار إلى نتائج. نقدم حلولًا متكاملة في التسويق الرقمي، تصميم الهوية البصرية، إنتاج المحتوى، تطوير المواقع، وإدارة وسائل التواصل الاجتماعي، لنساعد عملاءنا على الوصول إلى جمهورهم وبناء علامة تجارية مؤثرة تحقق النمو والاستمرارية.",
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
      titlePrefix: "نقطة",
      titleHighlight: "مؤثرة",
      titleSuffix: "تصنع",
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
        logo: "",
        visible: true,
      },
      analytics: {
        title: "محتوى أسبوعي",
        growth: "+24%",
        text: "تفاعل أعلى من المتوسط بثلاث أضعاف",
        ring: 82,
        chart: [45, 65, 40, 75, 55, 85, 70],
        live: true,
        visible: true,
      },
      growth: {
        value: "+150K",
        label: "متابع جديد",
        period: "هذا الشهر",
        color: "#e82125",
        visible: true,
      },
      rocket: {
        visible: true,
        image: "",
        speed: 20,
        size: 170,
        opacity: 0.8,
        glow: 0.35,
      },
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
      mapButton: "موقعنا على الخريطة",
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

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = migrateSettings(await fetchSettings(false));
      if (data) {
        setSettings(optimizeSettingsImages(deepMerge(EMPTY, data)));
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

function migrateSettings(data) {
  if (!data) return data;
  const contact = data.content?.contact;
  if (contact && contact.mapButton === "افتح مكاننا على الخريطة") {
    contact.mapButton = "موقعنا على الخريطة";
  }
  return data;
}

function optimizeSettingsImages(settings) {
  const hero = settings.content?.hero;
  if (hero?.campaign?.logo) {
    hero.campaign.logo = getOptimizedUrl(hero.campaign.logo);
  }
  if (hero?.rocket?.image) {
    hero.rocket.image = getOptimizedUrl(hero.rocket.image);
  }
  return settings;
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
