/* =========================================================
   Shared scroll-reveal variants for landing sections.
   Single source of truth so sections stop redefining easing.
========================================================= */

export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

export const softReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

export const viewportOnce = (amount = 0.25) => ({ once: true, amount });
