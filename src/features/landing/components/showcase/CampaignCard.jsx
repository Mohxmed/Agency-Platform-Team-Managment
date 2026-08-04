"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Megaphone } from "lucide-react";

import logoIcon from "@/assets/identity/logo-icon.png";
import useParallax from "./useParallax";

/* =========================================================
   CAMPAIGN CARD — floating dark card (logo, title, text).
   Sits above the main analytics card.
========================================================= */

export default function CampaignCard({
  campaign = {},
  parallax = { x: null, y: null },
  static: isStatic = false,
}) {
  const reduceMotion = useReducedMotion();

  const title = campaign.title || "حملة تسويقية";
  const text =
    campaign.text || "وصلنا لأكثر من 200 ألف متابع مستهدف خلال أسبوعين.";
  const logo = campaign.logo || "";

  /* Mouse parallax — card drifts slightly (10-20px max) */
  const cardX = useParallax(parallax.x, 14);
  const cardY = useParallax(parallax.y, 11);

  const float = reduceMotion || isStatic
    ? {}
    : {
        y: [0, -10, 0],
        transition: { duration: 6, repeat: Infinity, delay: 0.9, ease: "easeInOut" },
      };

  return (
    <motion.div
      style={{ x: cardX, y: cardY }}
      className={
        isStatic
          ? "relative"
          : "showcase-card absolute top-3 end-[265px] z-10 w-[240px] rotate-[6deg]"
      }
    >
      <motion.div animate={float}>
        <div className="rounded-[28px] bg-[#121826] p-5 text-white shadow-[0_35px_80px_rgba(0,0,0,0.25)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 p-1.5">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" className="h-full w-full object-contain" />
              ) : (
                <Image src={logoIcon} alt="" className="h-full w-full object-contain" />
              )}
            </div>
            <span className="text-sm font-bold leading-6">{title}</span>
          </div>

          <p className="text-sm leading-relaxed text-white/70">{text}</p>

          <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-white/40">
            <Megaphone size={13} />
            Campaign
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
