export default function ProgressBar({ value = 0, className = "", showLabel = true }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));

  const barColor =
    clamped >= 100
      ? "bg-green-500"
      : clamped >= 60
        ? "bg-emerald-500"
        : clamped >= 30
          ? "bg-amber-500"
          : "bg-red-500";

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold text-ink/45">التقدم</span>

        {showLabel && (
          <span className="text-[11px] font-black text-ink/60">
            {clamped}%
          </span>
        )}
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
