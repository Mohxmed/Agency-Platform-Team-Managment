import { Inbox } from "lucide-react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-hover text-ink/30">
        <Inbox className="h-6 w-6" />
      </div>
      <div>
        <p className="font-medium text-ink">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-ink/50">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
