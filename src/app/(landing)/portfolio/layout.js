import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
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
});

export default function PortfolioLayout({ children }) {
  return children;
}
