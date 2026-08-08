import { getPriorityMeta } from "../lib/teamUtils";

const badgeStyles = {
  neutral: "bg-gray-500/10 text-gray-600 dark:bg-white/[0.08] dark:text-ink/60",
  warning: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const dotStyles = {
  neutral: "bg-gray-400",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export default function PriorityBadge({ priority, className = "" }) {
  const meta = getPriorityMeta(priority);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${badgeStyles[meta.variant] || badgeStyles.neutral} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotStyles[meta.variant] || dotStyles.neutral}`}
      />
      {meta.labelAr}
    </span>
  );
}
