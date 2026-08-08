import { getWorkflowMeta } from "../lib/teamUtils";

const badgeStyles = {
  neutral: "bg-gray-500/10 text-gray-600 dark:bg-white/[0.08] dark:text-ink/60",
  primary: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  warning: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  success: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
};

const dotStyles = {
  neutral: "bg-gray-400",
  primary: "bg-blue-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  success: "bg-green-500",
};

export default function WorkflowBadge({ status, small = false, className = "" }) {
  const meta = getWorkflowMeta(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${small ? "px-2 py-0.5 text-[10px]" : ""} ${badgeStyles[meta.variant] || badgeStyles.neutral} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotStyles[meta.variant] || dotStyles.neutral}`}
      />
      {meta.labelAr}
    </span>
  );
}
