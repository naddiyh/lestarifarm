// components/ui/skeleton.tsx
// Universal skeleton components untuk LestariFarm

import { cn } from "@/lib/utils";

// ── Base Skeleton ─────────────────────────────────────────────
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// ── Sensor Card Skeleton ──────────────────────────────────────
// Untuk: pH card, TDS card, Temperature card
function SensorCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3">
      {/* Icon + label */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      {/* Value */}
      <Skeleton className="h-10 w-28" />
      {/* Status badge */}
      <Skeleton className="h-5 w-16 rounded-full" />
      {/* Description */}
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

// ── AI Insight Skeleton ───────────────────────────────────────
function ForecastSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
      {/* Subtitle */}
      <Skeleton className="h-3 w-48" />
      {/* Alert box */}
      <Skeleton className="h-14 w-full rounded-lg" />
      {/* Divider */}
      <Skeleton className="h-px w-full" />
      {/* Forecast label */}
      <Skeleton className="h-3 w-32" />
      {/* Forecast rows */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-2 flex-1 rounded-full" />
          <Skeleton className="h-3 w-3" />
        </div>
      ))}
      {/* Range info */}
      <Skeleton className="h-3 w-56" />
      {/* Divider */}
      <Skeleton className="h-px w-full" />
      {/* Recommended action */}
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-14 w-full rounded-lg" />
      {/* Footer */}
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

// ── Water Tank Skeleton ───────────────────────────────────────
function WaterTankSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      {/* Tank visual */}
      <div className="flex justify-center py-4">
        <div className="relative w-40 h-52">
          <Skeleton className="absolute inset-0 rounded-2xl" />
        </div>
      </div>
      {/* Footer stats */}
      <div className="flex justify-between items-center pt-2">
        <div className="space-y-1">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-16 mx-auto" />
          <Skeleton className="h-3 w-6 mx-auto mt-1" />
        </div>
        <div className="text-center">
          <Skeleton className="h-6 w-12 mx-auto" />
          <Skeleton className="h-3 w-10 mx-auto mt-1" />
        </div>
      </div>
    </div>
  );
}

// ── Chart Skeleton ────────────────────────────────────────────
// Untuk: TDS chart, pH chart, Temperature chart
function ChartSkeleton({ bars = 7 }: { bars?: number }) {
  const heights = [60, 80, 55, 90, 70, 85, 65];
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      {/* Chart area */}
      <div className="flex items-end gap-2 h-40 pt-4">
        {[...Array(bars)].map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: `${heights[i % heights.length]}%` }}
          />
        ))}
      </div>
      {/* X axis labels */}
      <div className="flex gap-2">
        {[...Array(bars)].map((_, i) => (
          <Skeleton key={i} className="flex-1 h-3 rounded" />
        ))}
      </div>
      {/* Footer */}
      <div className="flex justify-between pt-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// ── Area Chart Skeleton ───────────────────────────────────────
// Untuk: TDS time series, pH area chart
function AreaChartSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-40" />
      </div>
      {/* Chart area — simulate wave */}
      <div className="relative h-40 overflow-hidden rounded-lg">
        <Skeleton className="absolute inset-0" />
        {/* Fake wave lines */}
        <div className="absolute inset-0 flex flex-col justify-around px-2 opacity-30">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-px w-full" />
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

// ── Status Distribution Skeleton ──────────────────────────────
// Untuk: System Status Distribution (pie chart)
function StatusDistributionSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-56" />
      </div>
      {/* Donut chart */}
      <div className="flex justify-center py-4">
        <div className="relative w-40 h-40">
          <Skeleton className="w-40 h-40 rounded-full" />
          {/* Hole */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-card" />
          </div>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex justify-center gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Skeleton className="w-2.5 h-2.5 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="space-y-1 pt-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-56" />
      </div>
    </div>
  );
}

// ── Table Row Skeleton ────────────────────────────────────────
// Untuk: tabel monitoring
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b bg-muted/30">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b last:border-0">
          {[...Array(5)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Dashboard Page Skeleton ───────────────────────────────────
// Skeleton untuk seluruh halaman dashboard sekaligus
function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Sensor cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SensorCardSkeleton />
        <SensorCardSkeleton />
        <SensorCardSkeleton />
      </div>
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Water tank */}
        <WaterTankSkeleton />
        {/* AI Insight */}
        <div className="lg:col-span-2">
          <ForecastSkeleton />
        </div>
      </div>
      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AreaChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

export {
  Skeleton,
  SensorCardSkeleton,
  ForecastSkeleton,
  WaterTankSkeleton,
  ChartSkeleton,
  AreaChartSkeleton,
  StatusDistributionSkeleton,
  TableSkeleton,
  DashboardSkeleton,
};
