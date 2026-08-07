import clsx from "clsx";

export default function Card({ children, className, hover = true, ...props }) {
  return (
    <div
      className={clsx(
        `
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-black/[0.06]
        bg-white/70
        backdrop-blur-2xl
        shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)]
        dark:border-white/[0.08]
        dark:bg-white/[0.04]
        dark:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)]
        transition-all
        duration-500
        `,
        hover
          ? `
            hover:-translate-y-1
            hover:shadow-[0_30px_70px_-25px_rgba(0,0,0,0.18)]
            dark:hover:shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)]
          `
          : "",
        className
      )}
      {...props}
    >
      {/* Glass reflection */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/80
          to-transparent
          opacity-70
          dark:via-white/20
        "
      />

      {/* Noise */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          mix-blend-overlay
          bg-[url('/noise.png')]
        "
      />

      {children}
    </div>
  );
}