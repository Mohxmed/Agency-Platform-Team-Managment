export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-neutral-200 rounded-2xl dark:bg-neutral-800 ${className}`}
    />
  );
}

export function PricingSkeleton() {
  return (
    <div dir="rtl" className="mx-auto mt-12 grid max-w-6xl items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-6 sm:p-7 dark:border-white/10 dark:bg-card"
        >
          <Skeleton className="mb-6 h-12 w-12" />
          <Skeleton className="mb-2 h-6 w-32" />
          <Skeleton className="mb-2 h-10 w-20" />
          <Skeleton className="h-4 w-44" />
          <div className="mt-7 border-y border-black/[0.06] py-6 dark:border-white/10">
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="mt-7 space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-8 h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

export function PortfolioSkeleton() {
  return (
    <div dir="rtl" className="mx-auto mt-10 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white dark:border-white/10 dark:bg-card"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="p-5">
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div dir="rtl" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <Skeleton className="mb-6 h-8 w-32" />
      <Skeleton className="mb-8 aspect-[21/9] w-full" />
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}

export function ServicesSkeleton() {
  return (
    <div dir="rtl" className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex flex-col items-center rounded-[2rem] border border-black/[0.06] bg-white p-8 text-center dark:border-white/10 dark:bg-card"
        >
          <Skeleton className="mb-5 h-14 w-14 rounded-2xl" />
          <Skeleton className="mb-2 h-6 w-28" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-4 h-3 w-3/4" />
          <Skeleton className="mt-1 h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function ClientsSkeleton() {
  return (
    <div dir="rtl" className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex flex-col items-center rounded-[2rem] border border-black/[0.06] bg-white p-8 text-center dark:border-white/10 dark:bg-card"
        >
          <Skeleton className="mb-5 h-24 w-24 rounded-full" />
          <Skeleton className="mb-2 h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function HomeClientsSkeleton() {
  return (
    <div className="flex min-h-[320px] items-center justify-center gap-5 overflow-hidden px-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex h-32 w-48 shrink-0 flex-col items-center justify-center gap-3 rounded-[1.75rem] bg-white/10"
        >
          <div className="h-12 w-12 animate-pulse rounded-full bg-white/15" />
          <div className="h-4 w-24 animate-pulse rounded-lg bg-white/15" />
        </div>
      ))}
    </div>
  );
}

export function HomeWorksSkeleton() {
  return (
    <div className="flex min-h-[420px] items-center justify-center gap-5 overflow-hidden px-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-[340px] shrink-0 overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white dark:border-white/10 dark:bg-card"
        >
          <div className="aspect-[4/3] w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          <div className="p-5">
            <div className="mb-2 h-5 w-3/4 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-1/2 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
