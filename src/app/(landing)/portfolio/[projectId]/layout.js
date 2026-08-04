import { buildMetadata } from "@/config/site";
import { getWorkByLink } from "@/lib/serverContent";

export async function generateMetadata({ params }) {
  const { projectId } = await params;
  const work = await getWorkByLink(projectId);

  if (work) {
    return buildMetadata({
      title: work.title || work.name || "تفاصيل المشروع",
      description:
        work.description ||
        work.shortDescription ||
        work.summary ||
        "استكشف تفاصيل أحد مشاريع نقطة الإبداعية في التصميم والتسويق الرقمي وإدارة الحملات.",
      keywords: [work.title, work.categoryName, "مشروع", "نقطة"].filter(Boolean),
      path: `/portfolio/${projectId}`,
      image: work.image || work.coverImage || work.gallery?.[0],
      type: "article",
    });
  }

  return buildMetadata({
    title: "تفاصيل المشروع",
    description:
      "استكشف تفاصيل أحد مشاريع نقطة الإبداعية في التصميم والتسويق الرقمي وإدارة الحملات.",
    keywords: ["مشروع", "تفاصيل المشروع", "أعمال نقطة", "نقطة"],
    path: `/portfolio/${projectId}`,
  });
}

export default function ProjectDetailLayout({ children }) {
  return children;
}
