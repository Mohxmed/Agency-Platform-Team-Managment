import { Loader2 } from "lucide-react";
import clsx from "clsx";

const variants = {
  primary: `
    bg-primary-600
    text-white
    hover:bg-primary-700
    focus-visible:ring-primary/30
  `,

  secondary: `
    bg-ink
    text-white
    hover:bg-ink/90
    focus-visible:ring-ink/20
  `,

  outline: `
    border
    border-ink/[0.10]
    bg-card
    text-ink/75
    hover:border-ink/[0.16]
    hover:bg-ink/[0.025]
    hover:text-ink
    focus-visible:ring-ink/[0.10]
  `,

  ghost: `
    text-ink/60
    hover:bg-ink/[0.04]
    hover:text-ink
    focus-visible:ring-ink/[0.08]
  `,

  danger: `
    bg-danger
    text-white
    hover:bg-danger/90
    focus-visible:ring-danger/30
  `,
};

const sizes = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-10.5 px-4.5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-0",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={clsx(
        `
          cursor-pointer
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          font-semibold
          tracking-[-0.01em]
          transition-all
          duration-200
          active:scale-[0.98]
        `,

        `
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-offset-2
          focus-visible:ring-offset-white
          dark:focus-visible:ring-offset-card
        `,

        `
          disabled:pointer-events-none
          disabled:opacity-50
        `,

        variants[variant],
        sizes[size],
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}

      {children}
    </button>
  );
}
