import clsx from "clsx";
export function OutlinedBadge({ children, className, variant = "primary" }) {
  return (
    <div
      className={clsx(
        ` flex w-fit items-center gap-2 rounded-full border px-5 py-2 text-sm `,
        {
          "border-primary-200 text-primary-600 dark:border-primary-500/40 dark:text-primary-400":
            variant === "primary",

          "border-white/30 bg-white/15 text-white":
            variant === "white",
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
