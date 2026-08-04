"use client";

import { motionValue, useTransform } from "framer-motion";

const ZERO = motionValue(0);

/* =========================================================
   useParallax — null-safe mouse parallax transform.
   Falls back to a static 0 when no motion value is given
   (e.g. static/mobile cards that don't track the cursor).
========================================================= */

export default function useParallax(motion, factor) {
  return useTransform(motion ?? ZERO, (v) => v * factor);
}
