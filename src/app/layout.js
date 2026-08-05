// Essential
import "./globals.css";
import localFont from "next/font/local";
import { siteConfig, toAbsoluteUrl } from "@/config/site";
// Auth
import { AuthProvider } from "@/features/auth";
// Fonts
import { ScrollProgress } from "@/features/landing";
import AppInitializer from "@/providers/AppInitializer";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SettingsProvider } from "@/contexts/SettingsContext";
import SeoInjector from "@/features/seo/SeoInjector";
import PwaRegister from "@/providers/PwaRegister";
import { MotionConfig } from "framer-motion";
import Script from "next/script";
// Local Arabic Font
const bukra = localFont({
  src: [
    {
      path: "../assets/fonts/bukra-light.woff2",
      weight: "300",
    },
    {
      path: "../assets/fonts/bukra-regular.woff2",
      weight: "400",
    },
    {
      path: "../assets/fonts/bukra-bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-bukra",
});
// Central metadata
export const metadata = {
  metadataBase: new URL(siteConfig.url || "http://localhost:3000"),
  title: {
    default: siteConfig.title,
    template: "%s | نقطة",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.siteName,
  applicationName: siteConfig.siteName,
  robots: {
    index: true,
    follow: true,
  },
  alternates: siteConfig.url ? { canonical: siteConfig.url } : undefined,
  icons: {
    icon: "/icon.png",
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url || undefined,
    siteName: siteConfig.siteName,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: toAbsoluteUrl(siteConfig.ogImage) }],
  },
  twitter: {
    card: "summary_large_image",
    creator: siteConfig.twitterHandle,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [toAbsoluteUrl(siteConfig.ogImage)],
  },
  category: "business",
};

export const viewport = {
  themeColor: "#e11d48",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${bukra.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#e11d48" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
        >
          {(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark");}catch(e){}})()}
        </Script>
        <script
          id="jsonld-site"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteConfig.url}/#organization`,
                  name: siteConfig.siteName,
                  url: siteConfig.url,
                  logo: `${siteConfig.url}/icon.png`,
                  image: toAbsoluteUrl(siteConfig.ogImage),
                  sameAs: Object.values(siteConfig.links).filter(Boolean),
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteConfig.url}/#website`,
                  url: siteConfig.url,
                  name: siteConfig.siteName,
                  description: siteConfig.description,
                  inLanguage: "ar-EG",
                  publisher: { "@id": `${siteConfig.url}/#organization` },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`min-h-full flex flex-col`}>
        <MotionConfig reducedMotion="user">
          <ThemeProvider>
            <AuthProvider>
              <SettingsProvider>
                <AppInitializer />
                <SeoInjector />
                <PwaRegister />
                <ScrollProgress />
                {children}
              </SettingsProvider>
            </AuthProvider>
          </ThemeProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
