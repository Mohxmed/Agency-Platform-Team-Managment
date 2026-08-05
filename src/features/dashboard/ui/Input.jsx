"use client";

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
        <select
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`
            ${baseInputClass}
            h-11
            cursor-pointer
            appearance-none
            px-3.5
            pe-10
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
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Arrow */}
        <div
          className="
            pointer-events-none
            absolute
            end-3.5
            top-1/2
            -translate-y-1/2
            text-ink/60
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      {error && (
        <div id={`${inputId}-error`}>
          <FieldMessage error={error} />
        </div>
      )}
    </div>
  );
}
