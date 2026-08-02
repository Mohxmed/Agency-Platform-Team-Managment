"use client";

import { Container } from "@/features/landing";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import FloatingVisual from "./FloatingVisual";
import ScrollIndicator from "@/shared/ui/ScrollIndicator";
import { motion } from "framer-motion";
import { fadeInUp, floating } from "@/shared/motions";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative mx-auto flex min-h-[calc(100vh-64px)] max-h-[950px] w-full max-w-[1920px] items-center overflow-hidden py-10 sm:py-16 lg:py-24 xl:py-28"
      style={{ minHeight: "calc(100vh - 64px)" }}
      aria-labelledby="hero-heading"
    >
      <HeroBackground />

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.02) 100%)",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
      </div>

      <Container className="flex h-full flex-col justify-center gap-8 sm:gap-12 lg:gap-16 relative z-10">
        <div className="flex flex-col items-center justify-center flex-1 w-full">
          <HeroContent />
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex w-full justify-center pt-4 sm:pt-8 lg:pt-12"
          style={{ transitionDelay: "0.4s" }}
        >
          <motion.div animate={floating.animate} className="relative">
            <div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-px rounded-full pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(232,33,37,0.3), transparent)",
                filter: "blur(1px)",
              }}
            />
            <ScrollIndicator className="w-10 h-16" />
          </motion.div>
        </motion.div>
      </Container>

      <FloatingVisual className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full max-w-[600px] pointer-events-none sm:max-w-[680px] lg:max-w-[760px] xl:max-w-[840px]" />

      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at right center, rgba(232,33,37,0.04) 0%, transparent 60%)",
            maskImage: "linear-gradient(90deg, transparent 0%, black 40%, black 100%)",
          }}
        />
      </div>
    </section>
  );
}