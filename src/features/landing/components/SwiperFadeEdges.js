export default function SwiperFadeEdges({
  children,
  variant = "red",
}) {
  const variants = {
    red: {
      left:
        "[background:linear-gradient(to_right,rgb(137,17,18)_0%,rgba(137,17,18,.95)_18%,rgba(137,17,18,.75)_40%,rgba(137,17,18,.35)_70%,transparent_100%)]",

      right:
        "[background:linear-gradient(to_left,rgb(137,17,18)_0%,rgba(137,17,18,.95)_18%,rgba(137,17,18,.75)_40%,rgba(137,17,18,.35)_70%,transparent_100%)]",
    },

    white: {
      left: `
        [background:linear-gradient(to_right,#fff_0%,rgba(255,255,255,.96)_18%,rgba(255,255,255,.75)_40%,rgba(255,255,255,.3)_70%,transparent_100%)]
        dark:[background:linear-gradient(to_right,#0a0a0f_0%,rgba(10,10,15,.96)_18%,rgba(10,10,15,.75)_40%,rgba(10,10,15,.3)_70%,transparent_100%)]
      `,

      right: `
        [background:linear-gradient(to_left,#fff_0%,rgba(255,255,255,.96)_18%,rgba(255,255,255,.75)_40%,rgba(255,255,255,.3)_70%,transparent_100%)]
        dark:[background:linear-gradient(to_left,#0a0a0f_0%,rgba(10,10,15,.96)_18%,rgba(10,10,15,.75)_40%,rgba(10,10,15,.3)_70%,transparent_100%)]
      `,
    },
  };

  const colors = variants[variant];

  return (
    <div className="relative isolate overflow-hidden">
      {children}

      <div
        className={`
          pointer-events-none
          absolute
          inset-y-0
          right-0
          z-20
          w-24
          sm:w-40
          lg:w-60
          ${colors.left}
          blur-xl
        `}
      />

      <div
        className={`
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-20
          w-24
          sm:w-40
          lg:w-60
          ${colors.right}
          blur-xl
        `}
      />
    </div>
  );
}