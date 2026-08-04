// Dynamic sitemap: static routes + /portfolio/[link] + /clients/[link] from Firestore.
// Rendered per-request so new works/clients show up immediately.

import { siteConfig } from "@/config/site";
import { getWorks, getClients } from "@/lib/serverContent";

export const dynamic = "force-dynamic";

const STATIC_PAGES = [
  "/",
  "/services",
  "/pricing",
  "/portfolio",
  "/clients",
  "/contact",
  "/reports",
  "/terms-of-use",
  "/privacy-policy",
  "/copyrights",
];

export default async function sitemap() {
  const baseUrl = siteConfig.url.replace(/\/+$/, "");
  const now = new Date();

  const staticRoutes = STATIC_PAGES.map((path, index) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: index === 0 ? "daily" : "weekly",
    priority: index === 0 ? 1 : 0.8,
  }));

  let dynamicRoutes = [];

  try {
    const [works, clients] = await Promise.all([getWorks(), getClients()]);

    dynamicRoutes = [
      ...works.map((work) => ({
        url: `${baseUrl}/portfolio/${work.link}`,
        lastModified: work.updatedAt || now,
        changeFrequency: "monthly",
        priority: 0.6,
      })),
      ...clients.map((client) => ({
        url: `${baseUrl}/clients/${client.link}`,
        lastModified: client.updatedAt || now,
        changeFrequency: "monthly",
        priority: 0.6,
      })),
    ];
  } catch {
    // Admin SDK not configured yet — sitemap falls back to static pages only.
  }

  return [...staticRoutes, ...dynamicRoutes];
}
