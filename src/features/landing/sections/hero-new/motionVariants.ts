export const heroVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  },

  item: {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },

  itemSlow: {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },

  badge: {
    hidden: { opacity: 0, scale: 0.92, y: 12 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },

  headline: {
    hidden: { opacity: 0, y: 28, blur: 8 },
    visible: {
      opacity: 1,
      y: 0,
      blur: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },

  description: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },

  cta: {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },

  visual: {
    hidden: { opacity: 0, scale: 0.92, y: 40, rotateX: 12 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },

  visualFloat: {
    y: [0, -16, 0],
    rotateX: [0, -1.5, 0],
    rotateY: [0, 1.5, 0],
    scale: [1, 1.01, 1],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  gradientOrb: {
    x: [-60, 60, -60],
    y: [-40, 40, -40],
    scale: [1, 1.15, 1],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  gradientOrbSlow: {
    x: [40, -40, 40],
    y: [60, -60, 60],
    scale: [1, 1.1, 1],
    transition: {
      duration: 28,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  floatingLight: {
    x: [-30, 30, -30],
    y: [-20, 20, -20],
    opacity: [0.15, 0.35, 0.15],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  noise: {
    opacity: [0.03, 0.06, 0.03],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  shimmer: {
    x: ["-100%", "100%", "100%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    },
  },
};

export const reducedMotionVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.08 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  },
  visual: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  },
};