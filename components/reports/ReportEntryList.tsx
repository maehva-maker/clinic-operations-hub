import { formatTimelineTimestamp } from "@/lib/utils/date";
import type { DocumentationEntry } from "@/types";

interface ReportEntryListProps {
  entries: DocumentationEntry[];
  emptyMessage?: string;
}

/** One documentation entry per row — reused by every End-of-Day Report subsection. */
export function ReportEntryList({ entries, emptyMessage = "None." }: ReportEntryListProps) {
  if (entries.length === 0) {
    return <p className="text-xs text-accent/50">{emptyMessage}</p>;
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {entries.map((entry) => (
        <li key={entry.id} className="rounded-lg border border-surface-border/70 bg-surface/40 px-3 py-2 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
            <span className="font-medium text-accent">{entry.common.patientName}</span>
            <span className="text-xs text-accent/50">{formatTimelineTimestamp(entry.timestamp)}</span>
          </div>
          <p className="mt-0.5 text-xs text-accent/70">{entry.noteText}</p>
        </li>
      ))}
    </ul>
  );
}
