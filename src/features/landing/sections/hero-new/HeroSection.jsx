"use client";

import { Container } from "@/features/landing";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import ContentShowcase from "./ContentShowcase";
import ScrollIndicator from "@/shared/ui/ScrollIndicator";
import { motion } from "framer-motion";
import { fadeInUp } from "@/shared/motions";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1400px] items-center overflow-hidden py-10 sm:py-16 lg:py-20"
      aria-labelledby="hero-heading"
    >
      <HeroBackground />

      <Container className="relative z-10 flex flex-col gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center">
          <HeroContent />
          <ContentShowcase className="hidden lg:block" />
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex w-full justify-center"
          style={{ transitionDelay: "0.4s" }}
        >
          <ScrollIndicator className="w-10 h-16" />
        </motion.div>
      </Container>
    </section>
  );
}
