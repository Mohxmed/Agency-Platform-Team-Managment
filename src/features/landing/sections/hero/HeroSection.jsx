import { Container } from "@/features/landing";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContext";
import HeroRocket from "./HeroRocket";
import HeroScroll from "./HeroScroll";

export default function HeroSection() {
  return (
    <section id="hero" className="relative mx-auto flex h-[calc(100vh-64px)] max-h-[900px] w-full max-w-[1920px] items-center overflow-hidden py-8 sm:py-12 md:py-16">
      <HeroBackground />
      <Container className="flex h-full flex-col justify-center gap-6 sm:gap-8">
        <HeroContent />
        <HeroScroll />
      </Container>
      <HeroRocket />
    </section>
  );
}
