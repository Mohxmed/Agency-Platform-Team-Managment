// Site-wide configuration and metadata placeholders.
// Fill these in with real values before launch.

export const siteConfig = {
  siteName: "نقطة",
  title: "نقطة | محطتك الأولى للظهور على الميديا",
  description:
    "نقطة وكالة دعاية وإعلان في مصر، متخصصة في إدارة وتنفيذ حملات المدرسين وصناع المحتوى على السوشيال ميديا. نساعدك على بناء حضور أقوى وتحقيق نتائج حقيقية.",
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
  // ضع رابط الموقع الحقيقي هنا قبل الإطلاق
  url: "",
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
  const ogTitle =
    typeof title === "string" ? title : title?.default || siteConfig.title;

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
