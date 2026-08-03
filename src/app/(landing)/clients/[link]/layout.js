import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "ملف العميل",
  description:
    "صفحة تعريفية بأحد عملاء نقطة المميزين من المدرسين وصناع المحتوى.",
  keywords: [
    "ملف العميل",
    "عملاء نقطة",
    "مدرس",
    "صانع محتوى",
    "نقطة",
  ],
  path: "/clients",
});

export default function ClientProfileLayout({ children }) {
  return children;
}
