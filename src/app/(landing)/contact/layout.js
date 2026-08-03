import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "تواصل معنا",
  description:
    "تواصل مع فريق نقطة واستفسر عن خدماتنا، أو اطلب حملة تسويقية لمدرستك أو نشاطك التجاري. نحن في انتظارك.",
  keywords: [
    "تواصل معنا",
    "اتصل بنا",
    "نقطة",
    "طلب عرض سعر",
  ],
  path: "/contact",
});

export default function ContactLayout({ children }) {
  return children;
}
