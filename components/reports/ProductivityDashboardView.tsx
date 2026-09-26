"use client";

// components/reports/ProductivityDashboardView.tsx
// Productivity Analytics: Today/7 Days/30 Days charts for documentation,
// calls, and open loops completed, a workflow category distribution chart,
// and the Personal Productivity panel (fixed 7-day window, independent of
// the chart range toggle above it).

import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { SimpleBarChart } from "@/components/reports/SimpleBarChart";
import { WorkflowDistributionChart } from "@/components/reports/WorkflowDistributionChart";
import { PersonalProductivityPanel } from "@/components/reports/PersonalProductivityPanel";
import { useProductivityAnalytics } from "@/hooks/use-productivity-analytics";
import type { ProductivityRangeOption } from "@/types";

const RANGE_OPTIONS: { value: ProductivityRangeOption; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7_days", label: "7 Days" },
  { value: "30_days", label: "30 Days" },
];

export function ProductivityDashboardView() {
  const { analytics, personal, isLoading, range, setRange } = useProductivityAnalytics();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/reports"
        className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-secondary-dark hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Reports & Analytics
      </Link>

      <PageHeader
        title="Productivity Analytics"
        description="Trends across Documentation, Calls, and Open Loops — mock trend data for this phase."
        action={
          <Link href="/reports/end-of-day">
            <Button variant="secondary">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              End-of-Day Report
            </Button>
          </Link>
        }
      />

      <div role="tablist" aria-label="Chart range" className="flex flex-wrap gap-2">
        {RANGE_OPTIONS.map((item) => {
          const isActive = item.value === range;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setRange(item.value)}
              className={cn(
                "rounded-pill border px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-surface-border bg-white text-accent/70 hover:bg-surface",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {isLoading || !analytics || !personal ? (
        <p className="text-sm text-accent/60">Loading analytics…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SimpleBarChart title="Daily Documentation Count" points={analytics.documentationByDay} />
            <SimpleBarChart
              title="Calls by Day"
              points={analytics.callsByDay}
              barColorClassName="bg-primary"
            />
            <SimpleBarChart
              title="Open Loops Completed"
              points={analytics.openLoopsCompletedByDay}
              barColorClassName="bg-success"
            />
            <WorkflowDistributionChart data={analytics.workflowCategoryDistribution} />
          </div>

          <PersonalProductivityPanel personal={personal} />
        </>
      )}
    </div>
  );
}
