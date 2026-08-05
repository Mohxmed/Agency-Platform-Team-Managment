import { buildMetadata } from "@/config/site";
import { getClients } from "@/lib/serverContent";

export async function generateMetadata() {
  const clients = await getClients().catch(() => []);
  const photo =
    clients?.[0]?.image ||
    clients?.[0]?.photo ||
    clients?.[0]?.logo ||
    clients?.[0]?.avatar ||
    undefined;

  return buildMetadata({
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
    image: photo,
  });
}

export default function ClientsLayout({ children }) {
  return children;
}
