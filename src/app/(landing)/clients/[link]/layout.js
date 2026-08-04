import { buildMetadata } from "@/config/site";
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

export default function ClientProfileLayout({ children }) {
  return children;
}
