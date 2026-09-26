import { AlertTriangle } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { WidgetListRow } from "@/components/dashboard/WidgetListRow";
import { WidgetEmptyState } from "@/components/dashboard/WidgetEmptyState";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import type { HighPriorityPatientItem } from "@/types";

interface HighPriorityWidgetProps {
  items: HighPriorityPatientItem[];
}

export function HighPriorityWidget({ items }: HighPriorityWidgetProps) {
  return (
    <DashboardCard title="High Priority Patients" icon={AlertTriangle} href="/open-loops">
      {items.length === 0 ? (
        <WidgetEmptyState message="Nothing urgent right now — nice work." />
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <WidgetListRow
                href={item.href}
                label={`${item.patientName}: ${item.reason}`}
                primaryText={item.patientName}
                secondaryText={item.reason}
                trailing={<PriorityBadge priority={item.priority} />}
              />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
