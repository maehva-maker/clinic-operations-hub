import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { CATEGORY_LABEL } from "@/lib/constants/workflow-categories";
import { WAITING_ON_LABEL } from "@/types";
import type { OpenLoop } from "@/types";

interface FollowUpDueTomorrowSectionProps {
  loops: OpenLoop[];
}

/**
 * NEW FEATURE — reads every Open Loop whose follow-up date is tomorrow
 * (relative to the real current date, not whatever range is selected
 * elsewhere on the page) and surfaces Patient / Waiting On / Provider /
 * Priority / Workflow with a one-click jump back into the Open Loop
 * Tracker's own detail drawer.
 */
export function FollowUpDueTomorrowSection({ loops }: FollowUpDueTomorrowSectionProps) {
  return (
    <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2 text-accent">
        <CalendarClock className="h-4 w-4 text-secondary-dark" aria-hidden="true" />
        <h2 className="text-sm font-semibold">
          Follow-up Due Tomorrow <span className="font-normal text-accent/40">({loops.length})</span>
        </h2>
      </div>

      {loops.length === 0 ? (
        <p className="text-sm text-accent/50">No follow-ups are due tomorrow.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-surface-border text-xs uppercase tracking-wide text-accent/50">
                <th className="py-2 pr-3 font-medium">Patient</th>
                <th className="py-2 pr-3 font-medium">Waiting On</th>
                <th className="py-2 pr-3 font-medium">Provider</th>
                <th className="py-2 pr-3 font-medium">Priority</th>
                <th className="py-2 pr-3 font-medium">Workflow</th>
                <th className="py-2 pl-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loops.map((loop) => (
                <tr key={loop.id} className="border-b border-surface-border/60 last:border-0">
                  <td className="py-2 pr-3 font-medium text-accent">{loop.patientName}</td>
                  <td className="py-2 pr-3 text-accent/70">
                    {loop.waitingOn ? WAITING_ON_LABEL[loop.waitingOn] : "—"}
                  </td>
                  <td className="py-2 pr-3 text-accent/70">{loop.provider}</td>
                  <td className="py-2 pr-3">
                    <PriorityBadge priority={loop.priority} />
                  </td>
                  <td className="py-2 pr-3 text-accent/70">{CATEGORY_LABEL[loop.category]}</td>
                  <td className="py-2 pl-3 text-right">
                    <Link
                      href={`/open-loops?loop=${loop.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-dark hover:underline"
                    >
                      Jump to Open Loop
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
