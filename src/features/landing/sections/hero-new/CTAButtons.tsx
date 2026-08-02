"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { ArrowRight, MessageSquareHeart, Eye } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { HERO } from "@/constants/content";
import { useSettings } from "@/contexts/SettingsContext";

const PRIMARY_GRADIENT = "linear-gradient(135deg, #e82125 0%, #b2171a 100%)";
const PRIMARY_GRADIENT_HOVER = "linear-gradient(135deg, #ff3639 0%, #e82125 100%)";
const PRIMARY_GRADIENT_ACTIVE = "linear-gradient(135deg, #b2171a 0%, #891112 100%)";

const SECONDARY_BG = "rgba(255,255,255,0.08)";
const SECONDARY_BG_HOVER = "rgba(255,255,255,0.14)";
const SECONDARY_BG_ACTIVE = "rgba(255,255,255,0.05)";
const SECONDARY_BORDER = "rgba(255,255,255,0.18)";
const SECONDARY_BORDER_HOVER = "rgba(255,255,255,0.3)";
const SECONDARY_BORDER_ACTIVE = "rgba(232,33,37,0.4)";

export default function CTAButtons() {
  const { settings } = useSettings();

  const ctaPrimary = settings.content?.hero?.ctaPrimary || HERO.ctaPrimary;
  const ctaSecondary = settings.content?.hero?.ctaSecondary || HERO.ctaSecondary;

  const [primaryHover, setPrimaryHover] = useState(false);
  const [primaryActive, setPrimaryActive] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);
  const [secondaryActive, setSecondaryActive] = useState(false);

  const primaryScale = useSpring(primaryActive ? 0.97 : primaryHover ? 1.02 : 1, {
    stiffness: 400,
    damping: 30,
  });
  const primaryY = useSpring(primaryHover ? -3 : primaryActive ? -1 : 0, {
    stiffness: 300,
    damping: 25,
  });
  const primaryShadow = useTransform(primaryY, (y) =>
    y < 0
      ? `0 ${Math.abs(y * 4)}px ${Math.abs(y * 8)}px -4px rgba(232,33,37,0.4), 0 0 0 1px rgba(232,33,37,0.1)`
      : "0 4px 16px -4px rgba(232,33,37,0.3), 0 0 0 1px rgba(232,33,37,0.08)"
  );
  const primaryGradient = primaryActive
    ? PRIMARY_GRADIENT_ACTIVE
    : primaryHover
    ? PRIMARY_GRADIENT_HOVER
    : PRIMARY_GRADIENT;

  const secondaryScale = useSpring(secondaryActive ? 0.97 : secondaryHover ? 1.02 : 1, {
    stiffness: 400,
    damping: 30,
  });
  const secondaryY = useSpring(secondaryHover ? -3 : secondaryActive ? -1 : 0, {
    stiffness: 300,
    damping: 25,
  });
  const secondaryShadow = useTransform(secondaryY, (y) =>
    y < 0
      ? `0 ${Math.abs(y * 4)}px ${Math.abs(y * 8)}px -4px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)`
      : "0 4px 16px -4px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.05)"
  );
  const secondaryBg = secondaryActive
    ? SECONDARY_BG_ACTIVE
    : secondaryHover
    ? SECONDARY_BG_HOVER
    : SECONDARY_BG;
  const secondaryBorder = secondaryActive
    ? SECONDARY_BORDER_ACTIVE
    : secondaryHover
    ? SECONDARY_BORDER_HOVER
    : SECONDARY_BORDER;

  const handlePrimaryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setPrimaryActive(true);
      setTimeout(() => setPrimaryActive(false), 150);
    }
  };

  const handleSecondaryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSecondaryActive(true);
      setTimeout(() => setSecondaryActive(false), 150);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:items-center w-full max-w-md mx-auto">
      <motion.button
        onMouseEnter={() => setPrimaryHover(true)}
        onMouseLeave={() => {
          setPrimaryHover(false);
          setPrimaryActive(false);
        }}
        onMouseDown={() => setPrimaryActive(true)}
        onMouseUp={() => setPrimaryActive(false)}
        onKeyDown={handlePrimaryKeyDown}
        onKeyUp={() => setPrimaryActive(false)}
        style={{
          background: primaryGradient,
          transform: primaryScale.get(),
          y: primaryY.get(),
          boxShadow: primaryShadow.get(),
        }}
        className="relative group w-full sm:w-auto px-10 py-4.5 rounded-2xl font-semibold text-white text-base tracking-wide transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label={ctaPrimary}
      >
        <span
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            transform: "translateX(-120%)",
          }}
          className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
        >
          <motion.span
            animate={{ x: ["-120%", "120%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute inset-0"
          />
        </span>

        <span className="relative z-10 flex items-center justify-center gap-3">
          <MessageSquareHeart className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span>{ctaPrimary}</span>
          <motion.span
            initial={{ x: 0, opacity: 1 }}
            whileHover={{ x: 6, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex items-center"
            aria-hidden="true"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        </span>

        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
            opacity: 0,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      <motion.button
        onMouseEnter={() => setSecondaryHover(true)}
        onMouseLeave={() => {
          setSecondaryHover(false);
          setSecondaryActive(false);
        }}
        onMouseDown={() => setSecondaryActive(true)}
        onMouseUp={() => setSecondaryActive(false)}
        onKeyDown={handleSecondaryKeyDown}
        onKeyUp={() => setSecondaryActive(false)}
        style={{
          background: secondaryBg,
          borderColor: secondaryBorder,
          transform: secondaryScale.get(),
          y: secondaryY.get(),
          boxShadow: secondaryShadow.get(),
        }}
        className="relative group w-full sm:w-auto px-10 py-4.5 rounded-2xl font-semibold text-white text-base tracking-wide border transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white backdrop-blur-xl"
        aria-label={ctaSecondary}
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          <Eye className="w-5 h-5 flex-shrink-0 text-white/80" aria-hidden="true" />
          <span>{ctaSecondary}</span>
        </span>

        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(232,33,37,0.15) 0%, transparent 70%)",
            opacity: 0,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none border"
          style={{
            borderColor: "rgba(232,33,37,0.3)",
            opacity: 0,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </div>
  );
}