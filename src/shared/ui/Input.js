"use client";
import { cn } from "@/utils/cn";

export function Input({ label, id, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-xs font-medium text-lo">
          - {label}
        </label>
      ) : null}
      <input
        id={id}
        className={cn(
          "border border-black/20 w-full rounded-sm px-4 py-3 text-sm",
          error && "input-error",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs border-red-600 text-[#ef5b5b]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
