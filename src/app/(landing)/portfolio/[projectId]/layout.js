import { buildMetadata, siteConfig } from "@/config/site";
import { getWorkByLink } from "@/lib/serverContent";

export async function generateMetadata({ params }) {
  const { projectId } = await params;
  const work = await getWorkByLink(projectId);

  if (work) {
    return buildMetadata({
      title: work.title || work.name || "تفاصيل المشروع",
      description:
        work.description ||
        work.shortDescription ||
        work.summary ||
        "استكشف تفاصيل أحد مشاريع نقطة الإبداعية في التصميم والتسويق الرقمي وإدارة الحملات.",
      keywords: [work.title, work.categoryName, "مشروع", "نقطة"].filter(Boolean),
      path: `/portfolio/${projectId}`,
      image: work.image || work.coverImage || work.gallery?.[0],
      type: "article",
    });
  }

  return buildMetadata({
    title: "تفاصيل المشروع",
    description:
      "استكشف تفاصيل أحد مشاريع نقطة الإبداعية في التصميم والتسويق الرقمي وإدارة الحملات.",
    keywords: ["مشروع", "تفاصيل المشروع", "أعمال نقطة", "نقطة"],
    path: `/portfolio/${projectId}`,
  });
}

export default async function ProjectDetailLayout({ children, params }) {
  const { projectId } = await params;
  const work = await getWorkByLink(projectId).catch(() => null);

  const baseUrl = siteConfig.url.replace(/\/+$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` },
          { "@type": "ListItem", position: 2, name: "معرض الأعمال", item: `${baseUrl}/portfolio` },
          {
            "@type": "ListItem",
            position: 3,
            name: work?.title || work?.name || "تفاصيل المشروع",
            item: `${baseUrl}/portfolio/${projectId}`,
          },
        ],
      },
      ...(work
        ? [
            {
              "@type": "Article",
              headline: work.title || work.name || "تفاصيل المشروع",
              description:
                work.description ||
                work.shortDescription ||
                work.summary ||
                "مشروع من أعمال نقطة الإبداعية.",
              image: work.image || work.coverImage || work.gallery?.[0] || undefined,
              author: { "@type": "Organization", name: siteConfig.siteName, url: baseUrl },
              publisher: { "@type": "Organization", name: siteConfig.siteName, url: baseUrl },
              url: `${baseUrl}/portfolio/${projectId}`,
              inLanguage: "ar-EG",
              mainEntityOfPage: `${baseUrl}/portfolio/${projectId}`,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        id="jsonld-project"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
