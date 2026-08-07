"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

  const [menuPos, setMenuPos] = useState(null);

  const rootRef = useRef(null);

  const menuRef = useRef(null);

  const inputId = getInputId(id, label);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function handleClose() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [open]);

  const selected = options.find((option) => option.value === value);

  function toggleOpen() {
    if (disabled) return;

    const next = !open;
    setOpen(next);

    if (next && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      const estimatedHeight = Math.min(240, options.length * 40 + 12);
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < estimatedHeight + 8;

      setMenuPos({
        top: openUpward
          ? Math.max(8, rect.top - estimatedHeight - 8)
          : rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    }
  }

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
        onClick={toggleOpen}
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

      {error && (
        <div id={`${inputId}-error`}>
          <FieldMessage error={error} />
        </div>
      )}

      {typeof document !== "undefined" &&
        open &&
        !disabled &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
            }}
            className="z-[9999] max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xl shadow-black/10 dark:border-gray-700 dark:bg-gray-800"
          >
            {options.length === 0 ? (
              <p className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                لا توجد خيارات
              </p>
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
                          ? "bg-red-50 font-bold text-red-600 dark:bg-red-500/15 dark:text-red-300"
                          : "text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    <span className="min-w-0 truncate">{option.label}</span>

                    {active && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
