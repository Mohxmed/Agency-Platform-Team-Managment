export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 15,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const floating = {
  animate: {
    y: [0, 6, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const decorationReveal = {
  hidden: {
    opacity: 0,
    x: -120,
    y: 80,
    scale: 0.6,
    rotate: -15,
  },

  visible: {
    opacity: 0.18,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,

    transition: {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const floatSlow = {
  animate: {
    y: [0, -10, 0],

    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const itemReveal = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const rocketFloat = {
  y: [0, -25, 0],
  rotate: [0, 3, -3, 0],
  scale: [1, 1.04, 1],

  transition: {
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut",
  },
};