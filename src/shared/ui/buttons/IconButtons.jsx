import Link from "next/link";

export default function IconButton({
  children,
  href,
  size = "md",
  variant = "primary",
  className = "",
  ...props
}) {
  const sizes = {
    sm: "h-9 w-9",
    md: "h-11 w-11",
    lg: "h-14 w-14",
  };
  const variants = {
    primary: `
      bg-primary-600
      text-white
      shadow-[0_10px_30px_rgba(178,23,26,0.35)]
      hover:bg-primary-700
    `,

    secondary: `
      bg-secondary-800
      text-white
      shadow-[0_10px_30px_rgba(0,0,0,0.25)]
      hover:bg-secondary-900
    `,

    glass: `
      border
      border-white/40
      bg-white/55
      text-neutral-700
      shadow-[0_10px_40px_rgba(0,0,0,0.08)]
      hover:bg-white/70
      hover:text-primary-600
    `,

    outline: `
      border
      border-primary-600/40
      text-primary-600
      hover:bg-primary-600
      hover:text-white
    `,

    ghost: `
      text-neutral-600
      hover:bg-neutral-100
      hover:text-primary-600
    `,
  };

  const content = (
    <>
      {/* Shine */}
      <span
        aria-hidden="true"
        className="
        pointer-events-none
        absolute
        inset-0
        translate-x-[-120%]
        bg-linear-to-r
        from-transparent
        via-white/40
        to-transparent
        transition-transform
        duration-700
        group-hover:translate-x-[120%]
        "
      />

      {/* Icon */}
      <span
        aria-hidden="true"
        className="
        relative
        z-10
        flex
        items-center
        justify-center
        "
      >
        {children}
      </span>
    </>
  );

  const classes = `
    group
    relative
    inline-flex
    items-center
    justify-center
    overflow-hidden
    rounded-full
    cursor-pointer
    transition-all
    duration-300
    ease-out
    active:scale-95
    ${sizes[size]}
    ${variants[variant]}
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
