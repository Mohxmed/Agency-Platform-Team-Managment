"use client";

import { motion } from "framer-motion";

import { useClients } from "@/features/landing/hooks/useClients";

import Button from "@/shared/ui/buttons/Buttons";
import ClientCard from "@/shared/ui/cards/ClientCard";

import InfiniteSlider from "@/features/landing/components/InfiniteSlider";
import SectionHeading from "@/features/landing/components/SectionHeading";

import { Container } from "@/features/landing";

import { Star, Users } from "lucide-react";

import { HomeClientsSkeleton } from "@/shared/ui/skeletons/Skeletons";

import { ROUTES } from "@/constants/routes";

import { useSettings } from "@/contexts/SettingsContext";

import { fadeUp, viewportOnce } from "@/features/landing/components/sectionMotion";

/* =====================================================
   SECTION
===================================================== */

export default function ClientsSection() {
  const { clients, loading, error } = useClients();
  const { settings } = useSettings();

  const content = settings.content?.clients || {};

  const badge = content.badge || "شركاء النجاح";
  const title = content.title || "أبرز";
  const redTitle = content.redTitle || "شركائنا";
  const description =
    content.description ||
    "نبني شراكات حقيقية مع صناع المحتوى والعلامات التجارية ونحول الأفكار إلى تأثير ملموس.";

  const ctaPrimary = content.ctaPrimary || "تصفح جميع العملاء";
  const ctaPrimaryLink = content.ctaPrimaryLink || ROUTES.CLIENTS;
  const ctaSecondary = content.ctaSecondary || "انضم إلينا";
  const ctaSecondaryLink = content.ctaSecondaryLink || ROUTES.CONTACT;

  return (
    <section
      id="clients"
      className="relative isolate overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-900 py-20"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-60 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full opacity-40 [background:radial-gradient(circle,rgba(255,255,255,.18),transparent_70%)]" />

      <div className="pointer-events-none absolute -right-60 top-1/3 h-[520px] w-[520px] rounded-full opacity-30 [background:radial-gradient(circle,rgba(255,255,255,.16),transparent_70%)]" />

      <Container>
        <SectionHeading
          badge={badge}
          badgeIcon={<Users size={16} />}
          title={title}
          redTitle={redTitle}
          variant="light"
        >
          {description}
        </SectionHeading>
      </Container>

      {/* =====================================================
          FULL WIDTH SLIDER
      ====================================================== */}

      <div className="relative mt-12 w-full">
        <div className="w-full">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce(0.15)}
          >
            {loading && <HomeClientsSkeleton />}

            {!loading && error && (
              <div className="flex min-h-[260px] items-center justify-center text-center text-white">
                <div>
                  <p className="text-sm font-bold text-white/80">
                    تعذر تحميل بيانات العملاء حاليًا.
                  </p>
                  <p className="mt-2 text-xs text-white/50">
                    حاول تحديث الصفحة مرة أخرى.
                  </p>
                </div>
              </div>
            )}

            {!loading && !error && clients.length === 0 && (
              <div className="flex min-h-[260px] items-center justify-center text-center text-white">
                <div>
                  <Users className="mx-auto h-10 w-10 text-white/40" />
                  <p className="mt-4 text-sm font-bold text-white/70">
                    لا يوجد عملاء حتى الآن.
                  </p>
                </div>
              </div>
            )}

            {!loading && !error && clients.length > 0 && (
              <InfiniteSlider variant="red" autoplay autoplayDelay={4500}>
                {clients.map((client) => (
                  <ClientCard key={client.id} teacher={client} />
                ))}
              </InfiniteSlider>
            )}
          </motion.div>
        </div>
      </div>

      {/* =====================================================
          CTA
      ====================================================== */}

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce(0.3)}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" href={ctaPrimaryLink}>
              <Users size={18} />
              {ctaPrimary}
            </Button>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            <Button href={ctaSecondaryLink}>
              <Star size={18} />
              {ctaSecondary}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
