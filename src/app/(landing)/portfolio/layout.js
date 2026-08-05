import { buildMetadata } from "@/config/site";
import { getWorks } from "@/lib/serverContent";

export async function generateMetadata() {
  const works = await getWorks().catch(() => []);
  const cover =
    works?.[0]?.image ||
    works?.[0]?.coverImage ||
    works?.[0]?.gallery?.[0] ||
    undefined;

  return buildMetadata({
    title: "معرض الأعمال",
    description:
      "شاهد أحدث أعمال ومشاريع نقطة: هويات تجارية، تصاميم، حملات تسويقية، ومشاريع إبداعية نفذناها للمدرسين وصناع المحتوى.",
    keywords: [
      "معرض الأعمال",
      "أعمالنا",
      "مشاريع",
      "تصميم",
      "هوية بصرية",
      "نقطة",
    ],
    path: "/portfolio",
    image: cover,
  });
}

export default function PortfolioLayout({ children }) {
  return children;
}
