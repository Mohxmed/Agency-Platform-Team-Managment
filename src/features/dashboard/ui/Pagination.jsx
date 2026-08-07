"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

function pageNumbers(currentPage, totalPages) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const numbers = [];

  for (let index = start; index <= end; index += 1) {
    numbers.push(index);
  }

  return numbers;
}

const PAGE_BUTTON =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 bg-white text-ink/60 transition hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-30 dark:border-white/10 dark:bg-white/[0.05]";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  currentCount = 0,
  totalCount = 0,
  itemLabel = "عنصر",
  onPageChange,
}) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-ink/10 px-6 py-4 sm:flex-row">
      <p className="text-xs font-medium text-ink/60">
        عرض {currentCount} من {totalCount} {itemLabel}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage - 2)}
          disabled={currentPage === 1}
          className={PAGE_BUTTON}
          title="الصفحة السابقة"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {currentPage > 3 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange?.(0)}
              className={PAGE_BUTTON}
            >
              1
            </button>

            <span className="px-1 text-xs text-ink/40">...</span>
          </>
        )}

        {pageNumbers(currentPage, totalPages).map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onPageChange?.(number - 1)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition ${
              number === currentPage
                ? "bg-primary text-white shadow-sm"
                : "border border-ink/10 bg-white text-ink/60 hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/[0.05]"
            }`}
          >
            {number}
          </button>
        ))}

        {currentPage < totalPages - 2 && (
          <>
            <span className="px-1 text-xs text-ink/40">...</span>

            <button
              type="button"
              onClick={() => onPageChange?.(totalPages - 1)}
              className={PAGE_BUTTON}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onPageChange?.(currentPage)}
          disabled={currentPage === totalPages}
          className={PAGE_BUTTON}
          title="الصفحة التالية"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
