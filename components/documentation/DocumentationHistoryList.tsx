// components/documentation/DocumentationHistoryList.tsx
// Desktop/tablet table + mobile stacked-card fallback for Documentation
// History, matching the pattern established by OpenLoopTable.

import { getTemplateById } from "@/lib/constants/documentation-templates";
import { CATEGORY_LABEL } from "@/lib/constants/workflow-categories";
import { formatTimelineTimestamp } from "@/lib/utils/date";
import type { DocumentationEntry, OpenLoop } from "@/types";

interface DocumentationHistoryListProps {
  entries: DocumentationEntry[];
  openLoopsById: Map<string, OpenLoop>;
  onSelectEntry: (entry: DocumentationEntry) => void;
}

function relatedLoopLabel(entry: DocumentationEntry, openLoopsById: Map<string, OpenLoop>): string {
  if (!entry.relatedOpenLoopId) return "—";
  const loop = openLoopsById.get(entry.relatedOpenLoopId);
  return loop ? `${loop.patientName} — ${CATEGORY_LABEL[loop.category]}` : "Linked loop";
}

export function DocumentationHistoryList({
  entries,
  openLoopsById,
  onSelectEntry,
}: DocumentationHistoryListProps) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-card border border-surface-border bg-white shadow-card md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-surface-border bg-surface text-xs uppercase tracking-wide text-accent/50">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Timestamp</th>
              <th scope="col" className="px-4 py-3 font-semibold">Patient</th>
              <th scope="col" className="px-4 py-3 font-semibold">Action</th>
              <th scope="col" className="px-4 py-3 font-semibold">Performer</th>
              <th scope="col" className="px-4 py-3 font-semibold">Related Open Loop</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                tabIndex={0}
                role="button"
                aria-label={`View documentation for ${entry.common.patientName}`}
                onClick={() => onSelectEntry(entry)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") onSelectEntry(entry);
                }}
                className="cursor-pointer border-b border-surface-border last:border-0 hover:bg-surface focus-visible:outline-none focus-visible:bg-surface"
              >
                <td className="px-4 py-3 text-accent/70">{formatTimelineTimestamp(entry.timestamp)}</td>
                <td className="px-4 py-3 font-medium text-accent">{entry.common.patientName}</td>
                <td className="px-4 py-3 text-accent/70">{getTemplateById(entry.templateId).label}</td>
                <td className="px-4 py-3 text-accent/70">{entry.common.performer}</td>
                <td className="px-4 py-3 text-accent/70">{relatedLoopLabel(entry, openLoopsById)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelectEntry(entry)}
            aria-label={`View documentation for ${entry.common.patientName}`}
            className="flex flex-col gap-1.5 rounded-card border border-surface-border bg-white p-4 text-left shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-accent">{entry.common.patientName}</p>
              <span className="text-xs text-accent/50">{formatTimelineTimestamp(entry.timestamp)}</span>
            </div>
            <p className="text-xs text-accent/60">{getTemplateById(entry.templateId).label}</p>
            <p className="text-xs text-accent/50">By {entry.common.performer}</p>
          </button>
        ))}
      </div>
    </>
  );
}
