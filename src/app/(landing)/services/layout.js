import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "خدماتنا",
  description:
    "نقدم في نقطة مجموعة متكاملة من خدمات التسويق الرقمي والإعلان وإدارة الحملات والتصميم للمدرسين وصناع المحتوى.",
  keywords: [
    "خدمات",
    "تسويق رقمي",
    "إدارة حملات",
    "تصميم",
    "إعلانات",
    "نقطة",
  ],
  path: "/services",
});

export default function ServicesLayout({ children }) {
  return children;
}
