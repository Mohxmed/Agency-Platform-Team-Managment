// Site-wide configuration and metadata placeholders.
// Set NEXT_PUBLIC_SITE_URL (or a Vercel env) before launch to use absolute URLs.

function resolveSiteUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    return explicit.replace(/\/+$/, "");
  }
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) {
    return `https://${vercelProduction}`;
  }
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  siteName: "نقطة",
  title: "نقطة | وكالة إبداع رقمي",
  description:
    "في نقطة، نحول الأفكار إلى نتائج. نقدم حلولًا متكاملة في التسويق الرقمي، تصميم الهوية البصرية، إنتاج المحتوى، تطوير المواقع، وإدارة وسائل التواصل الاجتماعي، لنساعد عملاءنا على الوصول إلى جمهورهم وبناء علامة تجارية مؤثرة تحقق النمو والاستمرارية.",
  keywords: [
    "نقطة",
    "وكالة تسويق",
    "تسويق رقمي",
    "دعاية وإعلان",
    "حملات المدرسين",
    "صناع المحتوى",
    "إدارة سوشيال ميديا",
    "مصر",
  ],
  author: "نقطة",
  url: resolveSiteUrl(),
  locale: "ar_EG",
  ogImage: "/icons/icon-512.png",
  twitterHandle: "@no2ta",
  links: {
    website: "",
    twitter: "",
    github: "",
  },
};

export function buildMetadata({
  title,
  description,
  keywords,
  path = "/",
  image,
  noindex = false,
  type = "website",
}) {
  const url = siteConfig.url ? `${siteConfig.url}${path}` : undefined;
  const ogImage = image || siteConfig.ogImage;
  const ogTitle = typeof title === "string" ? title : title?.default || siteConfig.title;

  return {
    title,
    description,
    keywords,
    robots: noindex ? { index: false, follow: false } : undefined,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: ogTitle,
      description,
      type,
      locale: siteConfig.locale,
      siteName: siteConfig.siteName,
      url,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      creator: siteConfig.twitterHandle,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
