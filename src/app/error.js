"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center dark:bg-[#0c0c0f]">
      <p className="text-6xl font-black text-red-600 dark:text-red-400">
        خطأ
      </p>
      <p className="mt-4 text-base font-bold text-ink/70 dark:text-white/70">
        حدث خطأ غير متوقع أثناء تحميل هذه الصفحة.
      </p>
      <p className="mt-1 max-w-md text-sm text-ink/60 dark:text-white/40">
        {error?.message || "يرجى المحاولة مرة أخرى."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-black/80 dark:bg-white dark:text-black"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
