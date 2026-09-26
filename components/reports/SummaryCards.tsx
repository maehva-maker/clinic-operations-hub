import { PhoneCall, FileText, CheckCircle2, CalendarClock, Wind, Scale } from "lucide-react";
import type { ReportsSummary } from "@/types";

interface SummaryCardsProps {
  summary: ReportsSummary;
}

const CARD_DEFS = [
  { key: "callsCompleted" as const, label: "Calls Completed", icon: PhoneCall },
  { key: "documentationCreated" as const, label: "Documentation Created", icon: FileText },
  { key: "openLoopsClosed" as const, label: "Open Loops Closed", icon: CheckCircle2 },
  { key: "activeFollowUps" as const, label: "Active Follow-ups", icon: CalendarClock },
  { key: "papOrders" as const, label: "PAP Orders", icon: Wind },
  { key: "weightManagementTasks" as const, label: "Weight Management Tasks", icon: Scale },
];

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {CARD_DEFS.map(({ key, label, icon: Icon }) => (
        <div key={key} className="flex flex-col gap-2 rounded-card border border-surface-border bg-white p-4 shadow-card">
          <div className="flex items-center gap-1.5 text-accent/50">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-xs font-medium">{label}</span>
          </div>
          <p className="text-2xl font-bold text-accent">{summary[key]}</p>
        </div>
      ))}
    </div>
  );
}
