import clsx from "clsx";

const styles = {
  neutral: "bg-surface-hover text-ink/70",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-surface-hover text-ink/70",
  outline: "border border-ink/10 bg-card text-ink/70",
};

export default function Badge({ children, variant = "neutral", className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        styles[variant] ?? styles.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}
