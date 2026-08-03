import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "الباقات والأسعار",
  description:
    "تصفح باقات وأسعار نقطة لخدمات التسويق الرقمي وإدارة حملات المدرسين وصناع المحتوى. اختر الباقة المناسبة لاحتياجك وابدأ رحلتك معنا.",
  keywords: [
    "باقات",
    "أسعار",
    "تسويق رقمي",
    "إعلانات",
    "حملات المدرسين",
    "نقطة",
  ],
  path: "/pricing",
});

export default function PricingLayout({ children }) {
  return children;
}
