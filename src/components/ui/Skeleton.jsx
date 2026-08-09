import { cn } from "@/utils/cn";

/**
 * A single shimmering placeholder block.
 * @param {Object} props
 * @param {string} [props.className]
 */
export function SkeletonBlock({ className }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-lg bg-[length:400%_100%]",
        "bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.08)_37%,rgba(255,255,255,0.04)_63%)]",
        className
      )}
    />
  );
}

/** Skeleton for a single summary/stat card. */
export function SkeletonCard() {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <SkeletonBlock className="h-3 w-1/2" />
      <SkeletonBlock className="mt-4 h-6 w-2/3" />
      <SkeletonBlock className="mt-2.5 h-3 w-2/5" />
    </div>
  );
}

/** Skeleton placeholder for the full dashboard grid, shown during initial load. */
export function SkeletonDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="rounded-card border border-border bg-surface p-5 xl:col-span-8" style={{ minHeight: 380 }}>
          <SkeletonBlock className="h-4 w-1/3" />
          <SkeletonBlock className="mt-6 h-56 w-full" />
        </div>
        <div className="rounded-card border border-border bg-surface p-5 xl:col-span-4" style={{ minHeight: 380 }}>
          <SkeletonBlock className="h-4 w-3/5" />
          <SkeletonBlock className="mt-5 h-3 w-full" />
          <SkeletonBlock className="mt-2.5 h-3 w-4/5" />
          <SkeletonBlock className="mt-2.5 h-3 w-3/5" />
        </div>
      </div>
    </div>
  );
}
