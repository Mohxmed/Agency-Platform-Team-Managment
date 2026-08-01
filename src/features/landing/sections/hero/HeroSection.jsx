import { Container } from "@/features/landing";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContext";
import HeroRocket from "./HeroRocket";
import HeroScroll from "./HeroScroll";

export default function HeroSection() {
  return (
    <section id="hero" className="relative mx-auto flex h-[calc(100vh-64px)] max-h-256 w-full max-w-[1920px] items-center overflow-hidden py-12 ">
      <HeroBackground />
      <Container className="flex h-full flex-col justify-center gap-8 ">
        <HeroContent />
        <HeroScroll />
      </Container>
      <HeroRocket />
    </section>
  );
}
