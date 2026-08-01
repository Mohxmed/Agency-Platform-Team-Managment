import { getWorkflowMeta } from "../lib/teamUtils";

const badgeStyles = {
  neutral: "bg-gray-100 text-gray-600",
  primary: "bg-blue-50 text-blue-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-600",
  success: "bg-green-50 text-green-700",
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
