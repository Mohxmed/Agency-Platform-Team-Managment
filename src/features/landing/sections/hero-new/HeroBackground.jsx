"use client";

import Image from "next/image";
import logoIcon from "@/assets/identity/logo-icon.png";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
      {/* Brand watermark — the "dot" mark, oversized and faint */}
      <div className="absolute -top-[12%] -end-[10%] w-[640px] h-[640px] opacity-[0.05] pointer-events-none">
        <Image src={logoIcon} alt="" fill className="object-contain" priority />
      </div>

      <div className="absolute -bottom-[18%] -start-[8%] w-[420px] h-[420px] opacity-[0.035] pointer-events-none rotate-12">
        <Image src={logoIcon} alt="" fill className="object-contain" />
      </div>

      {/* Soft brand-red spotlight behind the headline */}
      <div
        className="absolute -top-1/4 -end-1/6 h-[560px] w-[560px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(232,33,37,0.06) 0%, transparent 70%)",
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