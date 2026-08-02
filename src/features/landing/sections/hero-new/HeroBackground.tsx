"use client";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
      {/* Single soft spotlight, top-start corner — replaces the 5 animated glow orbs */}
      <div
        className="absolute -top-1/4 -start-1/6 h-[560px] w-[560px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(232,33,37,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Faint dot grid for texture, masked so it fades toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 70% 30%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 70% 30%, black 0%, transparent 75%)",
          opacity: 0.6,
        }}
      />
    </div>
  );
}
