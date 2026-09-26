"use client";

// components/reports/DateRangeSelector.tsx
// Today / Yesterday / This Week / Custom Range — shared by Reports Home and
// the End-of-Day Report so date-range state always behaves identically.

import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/Input";
import type { ReportDateRangeOption } from "@/types";

const OPTIONS: { value: ReportDateRangeOption; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This Week" },
  { value: "custom", label: "Custom Range" },
];

interface DateRangeSelectorProps {
  option: ReportDateRangeOption;
  onOptionChange: (option: ReportDateRangeOption) => void;
  customStart: string;
  customEnd: string;
  onCustomStartChange: (value: string) => void;
  onCustomEndChange: (value: string) => void;
}

export function DateRangeSelector({
  option,
  onOptionChange,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
}: DateRangeSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" aria-label="Report date range" className="flex flex-wrap gap-2">
        {OPTIONS.map((item) => {
          const isActive = item.value === option;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onOptionChange(item.value)}
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

      {option === "custom" ? (
        <div className="flex flex-wrap items-end gap-3">
          <Input
            label="Start date"
            type="date"
            value={customStart}
            max={customEnd}
            onChange={(event) => onCustomStartChange(event.target.value)}
            className="w-44"
          />
          <Input
            label="End date"
            type="date"
            value={customEnd}
            min={customStart}
            onChange={(event) => onCustomEndChange(event.target.value)}
            className="w-44"
          />
        </div>
      ) : null}
    </div>
  );
}
