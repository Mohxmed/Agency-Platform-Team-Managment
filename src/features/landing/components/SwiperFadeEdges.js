export default function SwiperFadeEdges({ children, variant = "red" }) {
  const variants = {
    red: {
      left: `
        [background:linear-gradient(to_left,rgba(137,17,18,0.98)_0%,rgba(178,23,26,0.6)_35%,rgba(232,33,37,0.12)_65%,rgba(232,33,37,0)_100%)]
      `,
      right: `
        [background:linear-gradient(to_right,rgba(137,17,18,0.98)_0%,rgba(178,23,26,0.6)_35%,rgba(232,33,37,0.12)_65%,rgba(232,33,37,0)_100%)]
      `,
    },

    white: {
      left: `
        [background:linear-gradient(to_left,#ffffff_0%,rgba(255,255,255,0.94)_35%,rgba(255,255,255,0.35)_65%,rgba(255,255,255,0)_100%)]
        dark:[background:linear-gradient(to_left,#0a0a0f_0%,rgba(10,10,15,0.94)_35%,rgba(10,10,15,0.35)_65%,rgba(10,10,15,0)_100%)]
      `,
      right: `
        [background:linear-gradient(to_right,#ffffff_0%,rgba(255,255,255,0.94)_35%,rgba(255,255,255,0.35)_65%,rgba(255,255,255,0)_100%)]
        dark:[background:linear-gradient(to_right,#0a0a0f_0%,rgba(10,10,15,0.94)_35%,rgba(10,10,15,0.35)_65%,rgba(10,10,15,0)_100%)]
      `,
    },
  };

  const colors = variants[variant];

  return (
    <div className="relative isolate">
      {children}

      {/* Left cloud fade — soft rounded mask keeps it cloud-like */}
      <div
        className={`
          pointer-events-none
          absolute
          inset-y-0
          start-0
          z-20
          w-32
          sm:w-64
          lg:w-[24rem]
          ${colors.left}
          [mask-image:radial-gradient(ellipse_75%_90%_at_center,black_25%,transparent_80%)]
          [mask-composite:intersect]
        `}
      />

      {/* Right cloud fade */}
      <div
        className={`
          pointer-events-none
          absolute
          inset-y-0
          end-0
          z-20
          w-32
          sm:w-64
          lg:w-[24rem]
          ${colors.right}
          [mask-image:radial-gradient(ellipse_75%_90%_at_center,black_25%,transparent_80%)]
          [mask-composite:intersect]
        `}
      />
    </div>
  );
}
