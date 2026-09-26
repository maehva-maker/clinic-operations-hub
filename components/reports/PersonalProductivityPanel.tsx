import { TrendingUp } from "lucide-react";
import type { PersonalProductivity } from "@/types";

interface PersonalProductivityPanelProps {
  personal: PersonalProductivity;
}

/**
 * NEW FEATURE — Average documentation/day, average calls/day, completion
 * rate, and a waiting-vs-completed ratio, over a fixed rolling 7-day window.
 * "For personal improvement only" per the brief, so it's visually separated
 * from the range-scoped charts above it rather than reacting to them.
 */
export function PersonalProductivityPanel({ personal }: PersonalProductivityPanelProps) {
  const completionPercent = Math.round(personal.completionRate * 100);

  return (
    <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
      <div className="mb-1 flex items-center gap-2 text-accent">
        <TrendingUp className="h-4 w-4 text-secondary-dark" aria-hidden="true" />
        <h2 className="text-sm font-semibold">Personal Productivity</h2>
      </div>
      <p className="mb-4 text-xs text-accent/60">
        Your own trends over the last 7 days — for personal improvement only, not a performance review.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-accent/50">Avg. Documentation / Day</p>
          <p className="text-xl font-bold text-accent">{personal.avgDocumentationPerDay}</p>
        </div>
        <div>
          <p className="text-xs text-accent/50">Avg. Calls / Day</p>
          <p className="text-xl font-bold text-accent">{personal.avgCallsPerDay}</p>
        </div>
        <div>
          <p className="text-xs text-accent/50">Completion Rate</p>
          <p className="text-xl font-bold text-accent">{completionPercent}%</p>
        </div>
        <div>
          <p className="text-xs text-accent/50">Waiting : Completed</p>
          <p className="text-xl font-bold text-accent">
            {personal.waitingCount} : {personal.completedCount}
            {personal.waitingToCompletedRatio !== null ? (
              <span className="ml-1 text-xs font-normal text-accent/50">
                ({personal.waitingToCompletedRatio.toFixed(2)}x)
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  );
}
