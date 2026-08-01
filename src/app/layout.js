// Essential
import "./globals.css";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
// Auth
import { AuthProvider } from "@/features/auth";
// Fonts
import { ScrollProgress } from "@/features/landing";
import AppInitializer from "@/providers/AppInitializer";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SettingsProvider } from "@/contexts/SettingsContext";
import SeoInjector from "@/features/seo/SeoInjector";
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
  title: siteConfig.siteName,
  description: siteConfig.description,
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
        <Script
          id="theme-init"
          strategy="beforeInteractive"
        >
          {(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark");}catch(e){}})()}
        </Script>
      </head>
      <body className={`min-h-full flex flex-col`}>
        <ThemeProvider>
          <AuthProvider>
            <SettingsProvider>
              <AppInitializer />
              <SeoInjector />
              <ScrollProgress />
              {children}
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
