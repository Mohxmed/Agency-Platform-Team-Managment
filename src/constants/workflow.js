export const WORKFLOW_STATUSES = [
  {
    value: "backlog",
    label: "Backlog",
    labelAr: "تراكمي",
    variant: "neutral",
    color: "#9CA3AF",
    barColor: "bg-gray-400",
  },
  {
    value: "in-progress",
    label: "In Progress",
    labelAr: "قيد التنفيذ",
    variant: "warning",
    color: "#F59E0B",
    barColor: "bg-amber-500",
  },
  {
    value: "review",
    label: "Review",
    labelAr: "مراجعة",
    variant: "primary",
    color: "#8B5CF6",
    barColor: "bg-violet-500",
  },
  {
    value: "revision",
    label: "Revision",
    labelAr: "تعديلات",
    variant: "danger",
    color: "#EF4444",
    barColor: "bg-red-500",
  },
  {
    value: "done",
    label: "Done",
    labelAr: "منجز",
    variant: "success",
    color: "#059669",
    barColor: "bg-green-600",
  },
];

export const WORKFLOW_VALUES = WORKFLOW_STATUSES.map((status) => status.value);

export const PRIORITIES = [
  { value: "low", labelAr: "منخفضة", variant: "neutral" },
  { value: "medium", labelAr: "متوسطة", variant: "warning" },
  { value: "high", labelAr: "عالية", variant: "danger" },
  { value: "urgent", labelAr: "عاجلة", variant: "danger" },
];

export const PRIORITY_VALUES = PRIORITIES.map((priority) => priority.value);
