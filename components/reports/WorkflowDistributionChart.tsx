// components/reports/WorkflowDistributionChart.tsx
// Horizontal-bar breakdown of Workflow Wizard runs by workflow category —
// pairs with SimpleBarChart's vertical day-series charts on the Productivity
// Analytics page.

import type { WorkflowCategoryDatum } from "@/types";

interface WorkflowDistributionChartProps {
  data: WorkflowCategoryDatum[];
}

export function WorkflowDistributionChart({ data }: WorkflowDistributionChartProps) {
  const maxCount = Math.max(1, ...data.map((datum) => datum.count));

  return (
    <div className="rounded-card border border-surface-border bg-white p-4 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-accent">Workflow Category Distribution</h3>
      {data.length === 0 ? (
        <p className="text-sm text-accent/50">No workflow runs updated in this range.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {data.map((datum) => (
            <li key={datum.category} className="flex items-center gap-3">
              <span className="w-36 shrink-0 truncate text-xs font-medium text-accent/70">{datum.label}</span>
              <div className="h-3 flex-1 rounded-full bg-surface">
                <div
                  className="h-3 rounded-full bg-primary"
                  style={{ width: `${Math.max(4, (datum.count / maxCount) * 100)}%` }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-xs font-semibold text-accent">{datum.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
