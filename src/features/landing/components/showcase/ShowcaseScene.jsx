"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

import { useSettings } from "@/contexts/SettingsContext";

import AnalyticsPanel from "./AnalyticsPanel";
import CampaignCard from "./CampaignCard";
import GrowthCard from "./GrowthCard";
import ShowcaseRocket from "./ShowcaseRocket";

/* =========================================================
   SHOWCASE SCENE — floating cards + orbiting rocket.
   Desktop: cinematic absolute scene with mouse parallax.
   Mobile/tablet: static stacked cards (no floats/tilt).
========================================================= */

export default function ShowcaseScene() {
  const { settings } = useSettings();
  const hero = settings.content?.hero || {};
  const campaign = hero.campaign || {};
  const analytics = hero.analytics || {};
  const growth = hero.growth || {};
  const rocket = hero.rocket || {};

  const reduceMotion = useReducedMotion();

  /* Mouse parallax — one source of truth, scaled per element */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const y = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    if (reduceMotion) return;
    const move = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY, reduceMotion]);

  /* Scene glow drifts with the mouse (more than the cards) */

  const parallax = { x, y };
  const showCampaign = campaign.visible !== false;
  const showAnalytics = analytics.visible !== false;
  const showGrowth = growth.visible !== false;

  return (
    <>
      {/* Desktop floating scene */}
      <div className="showcase relative hidden min-h-[440px] w-full lg:block">
        {/* Brand halo behind the cards */}      
        {/* Rocket — orbits behind the cards */}
        <ShowcaseRocket config={rocket} parallax={parallax} />

        {/* Cards (z-10, above the rocket) */}
        {showAnalytics && (
          <AnalyticsPanel campaign={campaign} analytics={analytics} parallax={parallax} />
        )}
        {showCampaign && <CampaignCard campaign={campaign} parallax={parallax} />}
        {showGrowth && <GrowthCard growth={growth} parallax={parallax} />}
      </div>

      {/* Mobile / tablet — static stacked cards */}
      <div className="w-full space-y-4 lg:hidden">
        {showAnalytics && (
          <AnalyticsPanel campaign={campaign} analytics={analytics} static />
        )}
        {(showCampaign || showGrowth) && (
          <div className="grid grid-cols-2 gap-4">
            {showCampaign && <CampaignCard campaign={campaign} static />}
            {showGrowth && <GrowthCard growth={growth} static />}
          </div>
        )}
      </div>
    </>
  );
}
