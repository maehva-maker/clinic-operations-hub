// components/directory/CommunicationLogList.tsx
// A clinic contact's own communication history — independent from any
// patient's Documentation History or Activity Timeline. Read-only display;
// entries are seeded mock data for this phase.

import { PhoneCall, Mail, Printer, Globe, User } from "lucide-react";
import { formatTimelineTimestamp } from "@/lib/utils/date";
import type { CommunicationLogEntry, CommunicationMethod } from "@/types";

const METHOD_ICON: Record<CommunicationMethod, typeof PhoneCall> = {
  call: PhoneCall,
  fax: Printer,
  email: Mail,
  portal: Globe,
  in_person: User,
};

const METHOD_LABEL: Record<CommunicationMethod, string> = {
  call: "Call",
  fax: "Fax",
  email: "Email",
  portal: "Portal",
  in_person: "In Person",
};

interface CommunicationLogListProps {
  entries: CommunicationLogEntry[];
}

export function CommunicationLogList({ entries }: CommunicationLogListProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-surface-border p-4 text-center text-sm text-accent/50">
        No communication logged yet.
      </p>
    );
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ol className="space-y-3">
      {sorted.map((entry) => {
        const Icon = METHOD_ICON[entry.method];
        return (
          <li key={entry.id} className="flex gap-3 rounded-lg border border-surface-border bg-surface/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-light">
              <Icon className="h-4 w-4 text-secondary-dark" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="text-xs font-semibold text-accent">{METHOD_LABEL[entry.method]}</span>
                <span className="text-xs text-accent/50">{formatTimelineTimestamp(entry.date)}</span>
                <span className="text-xs text-accent/50">&middot; {entry.performer}</span>
              </div>
              <p className="mt-1 text-sm text-accent">{entry.summary}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
