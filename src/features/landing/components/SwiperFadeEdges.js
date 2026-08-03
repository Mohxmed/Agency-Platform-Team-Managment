export default function SwiperFadeEdges({ children, variant = "red" }) {
  const variants = {
    red: {
      left: `
        bg-gradient-to-r
        from-primary-700
        via-primary-800/90
        to-primary-900/50
      `,
      right: `
        bg-gradient-to-l
        from-primary-700
        via-primary-800/90
        to-primary-900/50
      `,
    },

    white: {
      left: `
        bg-gradient-to-r
        from-white
        via-white/80
        to-white/0
        dark:from-card
        dark:via-card/80
        dark:to-card/0
      `,
      right: `
        bg-gradient-to-l
        from-white
        via-white/80
        to-white/0
        dark:from-card
        dark:via-card/80
        dark:to-card/0
      `,
    },
  };

  const colors = variants[variant];

  return (
    <div className="relative isolate">
      {children}

      {/* Left Fade */}
      <div
        className={`
          pointer-events-none
          absolute
          -left-16
          top-0
          z-20
          h-full
          w-16
          blur-lg
          sm:w-32
          sm:blur-2xl
          lg:w-56
          ${colors.left}
        `}
      />

      {/* Right Fade */}
      <div
        className={`
          pointer-events-none
          absolute
          -right-16
          top-0
          z-20
          h-full
          w-16
          blur-lg
          sm:w-32
          sm:blur-2xl
          lg:w-56
          lg:blur-3xl
          ${colors.right}
        `}
      />
    </div>
  );
}
