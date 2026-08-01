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
  social: { facebook: "", instagram: "", linkedin: "", youtube: "", tiktok: "" },
  sections: { hero: true, clients: true, works: true, services: true, contact: true, social: true },
  content: {
    hero: {
      badge: "سمعنا انك بتدور علينا؟",
      ctaPrimary: "اتواصل معانا",
      ctaSecondary: "اتفرج على أخر اعمالنا",
    },
    social: {
      title: "NO2TA COMMUNITY",
      redTitle: "تابعنا على السوشيال ميديا",
      description:
        "عشان تفضل على تواصل معانا وتكتشف آخر المشاريع، التحديثات، والعروض اللي بنعملها.",
    },
    contact: {
      badgeTitle: "تواصل معانا",
      heading: "عندك فكرة؟",
      headingHighlight: "خلينا ننفذها.",
    },
    footer: {
      description:
        "شركة دعاية وإعلان في مصر، نهتم بإدارة والترويج واستلام حملات المدرسين وصناع المحتوى، ونساعدهم على بناء حضور أقوى على السوشيال ميديا.",
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
  notifications: { projectStatus: true, teamUpdates: true, deadlines: true, newProjects: true, tasks: true },
  system: { maintenanceMode: false, language: "ar", currency: "EGP", maintenanceTitle: "", maintenanceMessage: "" },
  auth: { allowRegistration: true },
};

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

  useEffect(() => { load(); }, [load]);

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
    if (overrides[key] && typeof overrides[key] === "object" && !Array.isArray(overrides[key])) {
      result[key] = { ...defaults[key], ...overrides[key] };
    } else if (overrides[key] !== undefined) {
      result[key] = overrides[key];
    }
  }
  return result;
}
