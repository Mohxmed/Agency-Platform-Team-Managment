import { buildMetadata, siteConfig } from "@/config/site";
import { getClientByLink } from "@/lib/serverContent";

export async function generateMetadata({ params }) {
  const { link } = await params;
  const client = await getClientByLink(link);

  if (client) {
    return buildMetadata({
      title: client.name || client.title || "ملف العميل",
      description:
        client.description ||
        client.bio ||
        "صفحة تعريفية بأحد عملاء نقطة المميزين من المدرسين وصناع المحتوى.",
      keywords: [client.name, "عميل نقطة", "مدرس", "صانع محتوى", "نقطة"].filter(Boolean),
      path: `/clients/${link}`,
      image: client.image || client.logo || client.avatar,
      type: "profile",
    });
  }

  return buildMetadata({
    title: "ملف العميل",
    description:
      "صفحة تعريفية بأحد عملاء نقطة المميزين من المدرسين وصناع المحتوى.",
    keywords: ["ملف العميل", "عملاء نقطة", "مدرس", "صانع محتوى", "نقطة"],
    path: `/clients/${link}`,
  });
}

export default async function ClientProfileLayout({ children, params }) {
  const { link } = await params;
  const client = await getClientByLink(link).catch(() => null);

  const baseUrl = siteConfig.url.replace(/\/+$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` },
          { "@type": "ListItem", position: 2, name: "عملاؤنا", item: `${baseUrl}/clients` },
          {
            "@type": "ListItem",
            position: 3,
            name: client?.name || client?.title || "ملف العميل",
            item: `${baseUrl}/clients/${link}`,
          },
        ],
      },
      ...(client
        ? [
            {
              "@type": "ProfilePage",
              name: client.name || client.title || "ملف العميل",
              description:
                client.description ||
                client.bio ||
                "عميل من عملاء نقطة المميزين.",
              image: client.image || client.logo || client.avatar || undefined,
              url: `${baseUrl}/clients/${link}`,
              inLanguage: "ar-EG",
              mainEntity: {
                "@type": "Person",
                name: client.name || client.title || "عميل نقطة",
                image: client.image || client.logo || client.avatar || undefined,
              },
              mainEntityOfPage: `${baseUrl}/clients/${link}`,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        id="jsonld-client"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
