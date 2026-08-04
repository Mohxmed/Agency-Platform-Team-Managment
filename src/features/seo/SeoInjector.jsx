"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href) {
  if (!href) return;
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SeoInjector() {
  const pathname = usePathname();
  const { settings, loading } = useSettings();

  useEffect(() => {
    if (loading) return;

    const seo = settings.seo || {};
    const isHome = pathname === "/" || pathname === "";

    // Google site verification is harmless on every page (it only confirms ownership).
    if (seo.googleVerification) {
      setMeta("name", "google-site-verification", seo.googleVerification);
    }

    // Only the homepage overrides server-rendered metadata with admin settings.
    // Nested pages (services, portfolio, clients, ...) keep their own
    // server-generated titles/canonical to avoid conflicts.
    if (!isHome) return;

    const siteName = settings.siteName || "نقطة";
    const description = seo.description || settings.description || "";
    const title = seo.title || `${siteName} | ${settings.tagline || ""}`.trim();

    if (seo.title) document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "keywords", seo.keywords);
    setMeta("name", "robots", seo.robots);

    setMeta("property", "og:site_name", siteName);
    setMeta("property", "og:title", seo.ogTitle || title);
    setMeta("property", "og:description", seo.ogDescription || description);
    if (seo.ogImage) setMeta("property", "og:image", seo.ogImage);

    setMeta("name", "twitter:card", seo.twitterCard || "summary_large_image");
    setMeta("name", "twitter:title", seo.ogTitle || title);
    setMeta("name", "twitter:description", seo.ogDescription || description);
    if (seo.ogImage) setMeta("name", "twitter:image", seo.ogImage);

    if (seo.canonicalUrl) setCanonical(seo.canonicalUrl);
  }, [settings, loading, pathname]);

  return null;
}
