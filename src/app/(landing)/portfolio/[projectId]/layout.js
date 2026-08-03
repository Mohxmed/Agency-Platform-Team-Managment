import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "تفاصيل المشروع",
  description:
    "استكشف تفاصيل أحد مشاريع نقطة الإبداعية في التصميم والتسويق الرقمي وإدارة الحملات.",
  keywords: [
    "مشروع",
    "تفاصيل المشروع",
    "أعمال نقطة",
    "نقطة",
  ],
  path: "/portfolio",
});

export default function ProjectDetailLayout({ children }) {
  return children;
}
