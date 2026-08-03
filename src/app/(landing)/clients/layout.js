import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "عملاؤنا المميزون",
  description:
    "تعرّف على عملاء نقطة المميزين من المدرسين وصناع المحتوى، واستكشف قصص نجاحهم وأعمالهم المنفذة معنا.",
  keywords: [
    "العملاء",
    "عملاؤنا",
    "المدرسين",
    "صناع المحتوى",
    "قصص نجاح",
    "نقطة",
  ],
  path: "/clients",
});

export default function ClientsLayout({ children }) {
  return children;
}
