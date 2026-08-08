"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

const SELECT_CLOSE_EVENT = "ds:select-close";

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
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef(null);
  const menuRef = useRef(null);

  const inputId = getInputId(id, label);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  const computePos = useCallback(() => {
    if (!rootRef.current) return null;

    const rect = rootRef.current.getBoundingClientRect();
    const menuHeight = Math.min(240, options.length * 42 + 12);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < menuHeight + 8 && spaceAbove > spaceBelow;

    const width = Math.max(rect.width, 180);
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const top = openUpward
      ? Math.max(8, rect.top - menuHeight - 8)
      : Math.min(rect.bottom + 6, window.innerHeight - menuHeight - 8);

    return { top, left, width };
  }, [options.length]);

  useEffect(() => {
    if (!open) return;

    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setMenuPos(computePos());
          ticking = false;
        });
      }
    }

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

    function handleDocumentKeyDown(event) {
      if (event.key === "Escape" || event.key === "Tab") {
        setOpen(false);
      }
    }

    function handleClose() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleDocumentKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    window.addEventListener(SELECT_CLOSE_EVENT, handleClose);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleDocumentKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener(SELECT_CLOSE_EVENT, handleClose);
    };
  }, [open, computePos]);

  useEffect(() => {
    if (!open || !menuRef.current || activeIndex < 0) return;

    const optionEl = menuRef.current.querySelector(
      `[data-index="${activeIndex}"]`,
    );
    if (!optionEl) return;

    const menu = menuRef.current;
    const optionTop = optionEl.offsetTop;
    const optionBottom = optionTop + optionEl.offsetHeight;

    if (optionTop < menu.scrollTop) {
      menu.scrollTop = optionTop;
    } else if (optionBottom > menu.scrollTop + menu.clientHeight) {
      menu.scrollTop = optionBottom - menu.clientHeight;
    }
  }, [activeIndex, open]);

  const selected = options.find((option) => option.value === value);

  function toggleOpen() {
    if (disabled) return;

    if (!open) {
      window.dispatchEvent(new Event(SELECT_CLOSE_EVENT));
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      setMenuPos(computePos());
    }

    setOpen(!open);
  }

  function selectOption(option) {
    setOpen(false);
    setActiveIndex(-1);
    onChange?.({ target: { value: option.value, name } });
  }

  function moveActive(direction) {
    if (options.length === 0) return;

    setActiveIndex((current) => {
      if (current === -1) return direction === 1 ? 0 : options.length - 1;
      return (current + direction + options.length) % options.length;
    });
  }

  function handleMenuKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) selectOption(option);
    }
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
        onKeyDown={handleMenuKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${inputId}-listbox` : undefined}
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
              : open
                ? "border-primary ring-4 ring-primary/10"
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
            id={`${inputId}-listbox`}
            role="listbox"
            aria-activedescendant={
              activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined
            }
            onKeyDown={handleMenuKeyDown}
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
            }}
            className="select-menu select-pop z-[9999] max-h-60 overflow-y-auto rounded-xl border border-line bg-card p-1.5 shadow-xl"
          >
            {options.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted">لا توجد خيارات</p>
            ) : (
              options.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = activeIndex === index;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    id={`${inputId}-option-${index}`}
                    data-index={index}
                    aria-selected={isSelected}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                    onMouseEnter={() => setActiveIndex(index)}
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
                      transition-colors
                      duration-100
                      ${
                        isSelected
                          ? "bg-primary-50 font-semibold text-primary-700 dark:bg-primary/15 dark:text-primary-300"
                          : isActive
                            ? "bg-surface-hover text-ink"
                            : "text-ink hover:bg-surface-hover"
                      }
                    `}
                  >
                    <span className="min-w-0 truncate">{option.label}</span>

                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
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
