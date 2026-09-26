import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { WAITING_ON_LABEL } from "@/types";
import type { OutstandingGroup } from "@/types";

interface OutstandingItemsSectionProps {
  groups: OutstandingGroup[];
}

/** Every unresolved Open Loop, grouped by Waiting On — the End-of-Day Report's "what's still open" section. */
export function OutstandingItemsSection({ groups }: OutstandingItemsSectionProps) {
  if (groups.length === 0) {
    return <p className="text-sm text-accent/50">No outstanding open loops.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group.waitingOn}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent/50">
            {group.waitingOn === "not_set" ? "Not Set" : WAITING_ON_LABEL[group.waitingOn]}{" "}
            <span className="font-normal normal-case text-accent/40">({group.loops.length})</span>
          </h3>
          <ul className="flex flex-col gap-1.5">
            {group.loops.map((loop) => (
              <li key={loop.id}>
                <Link
                  href={`/open-loops?loop=${loop.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-surface-border px-3 py-2 text-sm hover:bg-surface"
                >
                  <span>
                    <span className="font-medium text-accent">{loop.patientName}</span>
                    <span className="text-accent/60"> — {loop.title}</span>
                  </span>
                  <StatusBadge status={loop.status} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
