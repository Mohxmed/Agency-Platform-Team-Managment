import { siteConfig } from "@/config/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api", "/preview"],
      },
    ],
    sitemap: `${siteConfig.url.replace(/\/+$/, "")}/sitemap.xml`,
    host: siteConfig.url.replace(/\/+$/, ""),
  };
}
