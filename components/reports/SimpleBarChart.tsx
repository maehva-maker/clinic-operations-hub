// components/reports/SimpleBarChart.tsx
// A small, dependency-free bar chart for Productivity Analytics — the app
// has no charting library installed, and these charts are simple enough
// (one series, a handful of bars) that plain divs sized by percentage do the
// job without adding one. Each bar is also a real number in the DOM (not
// just a color), so a screen reader gets the value, not just a shape.

import { cn } from "@/lib/utils/cn";
import type { ProductivitySeriesPoint } from "@/types";

interface SimpleBarChartProps {
  title: string;
  points: ProductivitySeriesPoint[];
  barColorClassName?: string;
}

export function SimpleBarChart({ title, points, barColorClassName = "bg-secondary" }: SimpleBarChartProps) {
  const maxValue = Math.max(1, ...points.map((point) => point.value));

  return (
    <div className="rounded-card border border-surface-border bg-white p-4 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-accent">{title}</h3>
      {points.every((point) => point.value === 0) ? (
        <p className="text-sm text-accent/50">No activity in this range.</p>
      ) : (
        <div className="overflow-x-auto">
          <div
            className="flex h-40 items-end gap-1.5"
            style={{ minWidth: points.length > 10 ? `${points.length * 32}px` : undefined }}
            role="img"
            aria-label={`${title}: ${points.map((point) => `${point.label} ${point.value}`).join(", ")}`}
          >
            {points.map((point) => (
              <div key={point.date} className="flex flex-1 flex-col items-center gap-1.5" aria-hidden="true">
                <span className="text-[11px] font-semibold text-accent/70">{point.value || ""}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={cn("w-full rounded-t-sm transition-all", barColorClassName)}
                    style={{ height: `${Math.max(2, (point.value / maxValue) * 100)}%` }}
                  />
                </div>
                <span className="whitespace-nowrap text-[10px] text-accent/50">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
