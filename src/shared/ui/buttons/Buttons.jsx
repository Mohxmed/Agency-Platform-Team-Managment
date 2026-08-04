import clsx from "clsx";
import Link from "next/link";

export default function Button({
  href,
  children,
  variant = "primary",
  rounded = "sm",
  className = "",
  blank,
  hasEffects = true,
  isLoading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  const classes = clsx(
    `
      group/button
      relative
      inline-flex
      items-center
      justify-center
      overflow-hidden
      px-8
      py-4
      text-md
      font-medium
      transition-all
      duration-300
      hover:-translate-y-1
    `,
    {
      // Radius
      "rounded-sm": rounded === "sm",
      "rounded-md": rounded === "md",
      "rounded-lg": rounded === "lg",
      "rounded-xl": rounded === "xl",
      "rounded-2xl": rounded === "2xl",
      "rounded-full": rounded === "full",

      // Variants
      "bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700":
        variant === "primary",

      "bg-primary-600 text-white hover:bg-primary-700":
        variant === "cleanPrimary",

      "bg-black text-white shadow-lg shadow-black/20 hover:bg-black-85":
        variant === "secondary",

      "border-2 border-white bg-white/10 text-white hover:bg-white/20":
        variant === "outline",

      "border border-primary-600 px-3 text-primary-600 hover:bg-primary-50":
        variant === "icon",

      "cursor-not-allowed opacity-50": disabled || isLoading,
    },
    className,
  );

  const content = (
    <>
      {hasEffects && (
        <>
          <span
            className="
              pointer-events-none
              absolute
              inset-0
              -translate-x-[120%]
              bg-linear-to-r
              from-transparent
              via-white/40
              to-transparent
              transition-transform
              duration-700
              group-hover/button:translate-x-[120%]
            "
          />

          <span
            className="
              pointer-events-none
              absolute
              inset-0
              bg-white/0
              transition-all
              duration-300
              group-hover/button:bg-white/10
            "
          />
        </>
      )}

      <span
        className="
          relative
          z-10
          flex
          items-center
          gap-2
        "
      >
        {isLoading ? "ثواني ..." : children}
      </span>
    </>
  );

  // If href exists → Link
  if (href) {
    return (
      <Link
        href={href}
        target={blank ? "_blank" : "_self"}
        className={classes}
        {...props}
      >
        {content}
      </Link>
    );
  }

  // Otherwise → actual button
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
}
