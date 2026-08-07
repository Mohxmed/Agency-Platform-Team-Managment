"use client";

import { useEffect, useRef, useState } from "react";

import { Check, ChevronDown } from "lucide-react";

const baseLabelClass = `
  mb-2
  block
  text-sm
  font-semibold
  text-ink
`;

const baseInputClass = `
  w-full
  rounded-xl
  border
  border-ink/40
  bg-card
  text-sm
  text-ink
  outline-none
  transition-all
  duration-200
  placeholder:text-ink/60
  hover:border-ink/20
  focus:border-primary
  focus:ring-4
  focus:ring-primary/10
`;

function getInputId(id, label) {
  return id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
}

function FieldMessage({ error }) {
  if (!error) return null;

  return (
    <div className="mt-1.5 flex items-center gap-1.5">
      <span className="h-1 w-1 rounded-full bg-danger" />

      <p className="text-xs font-medium text-danger">{error}</p>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

export default function Input({
  label,
  error,
  className = "",
  id,
  required = false,
  ...props
}) {
  const inputId = getInputId(id, label);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className={baseLabelClass}>
          {label}

          {required && <span className="mr-1 text-danger">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          required={required}
          className={`
            ${baseInputClass}
            h-11
            px-3.5
            ${
              error
                ? `
                  border-danger/60
                  focus:border-danger
                  focus:ring-danger/10
                `
                : "border-line"
            }
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <div id={`${inputId}-error`}>
          <FieldMessage error={error} />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

export function Textarea({
  label,
  error,
  className = "",
  id,
  rows = 5,
  required = false,
  ...props
}) {
  const inputId = getInputId(id, label);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className={baseLabelClass}>
          {label}

          {required && <span className="mr-1 text-danger">*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        required={required}
        className={`
          ${baseInputClass}
          min-h-[120px]
          resize-y
          px-3.5
          py-3
          leading-6
          ${
            error
              ? `
                border-danger/60
                focus:border-danger
                focus:ring-danger/10
              `
              : "border-line"
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <div id={`${inputId}-error`}>
          <FieldMessage error={error} />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

export function Select({
  label,
  error,
  options = [],
  className = "",
  id,
  required = false,
  placeholder = "اختر...",
  disabled = false,
  value,
  name,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const rootRef = useRef(null);

  const inputId = getInputId(id, label);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selected = options.find((option) => option.value === value);

  function selectOption(option) {
    setOpen(false);
    onChange?.({ target: { value: option.value, name } });
  }

  return (
    <div className={`relative w-full ${className}`} ref={rootRef}>
      {label && (
        <label htmlFor={inputId} className={baseLabelClass}>
          {label}

          {required && <span className="mr-1 text-danger">*</span>}
        </label>
      )}

      <button
        type="button"
        id={inputId}
        disabled={disabled}
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`
          ${baseInputClass}
          flex
          h-11
          w-full
          cursor-pointer
          items-center
          justify-between
          gap-2
          px-3.5
          ${
            error
              ? `
                border-danger/60
                focus:border-danger
                focus:ring-danger/10
              `
              : "border-line"
          }
          ${disabled ? "cursor-not-allowed opacity-60" : ""}
        `}
      >
        <span
          className={`
            min-w-0
            truncate
            text-start
            ${selected ? "text-ink" : "text-ink/60"}
          `}
        >
          {selected?.label || placeholder}
        </span>

        <ChevronDown
          className={`
            h-4
            w-4
            shrink-0
            text-ink/60
            transition-transform
            duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && !disabled && (
        <div
          className="
            absolute
            z-40
            mt-2
            max-h-60
            w-full
            overflow-y-auto
            rounded-xl
            border
            border-ink/10
            bg-card
            p-1.5
            shadow-2xl
            shadow-black/10
            dark:border-white/10
          "
        >
          {options.length === 0 ? (
            <p className="px-3 py-2 text-xs text-ink/60">لا توجد خيارات</p>
          ) : (
            options.map((option) => {
              const active = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectOption(option)}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-2
                    rounded-lg
                    px-3
                    py-2.5
                    text-start
                    text-sm
                    transition
                    ${
                      active
                        ? "bg-primary/10 font-bold text-primary"
                        : "text-ink hover:bg-ink/[0.04]"
                    }
                  `}
                >
                  <span className="min-w-0 truncate">{option.label}</span>

                  {active && <Check className="h-4 w-4 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}

      {error && (
        <div id={`${inputId}-error`}>
          <FieldMessage error={error} />
        </div>
      )}
    </div>
  );
}
