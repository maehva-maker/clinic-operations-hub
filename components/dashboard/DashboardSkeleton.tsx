// components/dashboard/DashboardSkeleton.tsx
// Loading placeholder shown while useDashboardData() resolves, matching the
// real grid's shape so there's no layout shift once data arrives.

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-surface-border/60" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-card border border-surface-border bg-white shadow-card"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-card border border-surface-border bg-white shadow-card"
          />
        ))}
      </div>
    </div>
  );
}
