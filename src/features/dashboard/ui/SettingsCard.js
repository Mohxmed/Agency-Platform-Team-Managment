import Card from "./Card";

export function SettingsCard({ icon: Icon, title, description, children }) {
  return (
    <Card className="border-ink/[0.07] bg-card p-5 shadow-none sm:p-7">
      <div className="mb-7 flex items-start gap-4 border-b border-ink/[0.06] pb-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink/[0.045] text-ink/60">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-ink">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-ink/60">{description}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

export function ToggleRow({ title, description, checked, onChange, danger = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-ink/[0.07] bg-[#fafafa] p-4 dark:bg-surface">
      <div className="min-w-0">
        <p className={`text-sm font-bold ${danger && checked ? "text-danger" : "text-ink"}`}>{title}</p>
        <p className="mt-1 text-[11px] leading-5 text-ink/60">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition-all duration-200 ${checked ? (danger ? "bg-danger" : "bg-primary") : "bg-ink/[0.12]"}`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "-translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}
