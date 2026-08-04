import { buildMetadata } from "@/config/site";

export const metadata = buildMetadata({
  title: "نقطة",
  description: "نقطة",
  path: "/preview",
  noindex: true,
});

export default function PreviewLayout({ children }) {
  return children;
}
