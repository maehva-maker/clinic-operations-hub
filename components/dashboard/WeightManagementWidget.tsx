import { Scale } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { WidgetListRow } from "@/components/dashboard/WidgetListRow";
import { WidgetEmptyState } from "@/components/dashboard/WidgetEmptyState";
import { formatShortDate } from "@/lib/utils/date";
import type { WeightFollowUpItem } from "@/types";

interface WeightManagementWidgetProps {
  dueThisWeekCount: number;
  items: WeightFollowUpItem[];
}

export function WeightManagementWidget({
  dueThisWeekCount,
  items,
}: WeightManagementWidgetProps) {
  return (
    <DashboardCard
      title="Weight Management Follow-ups"
      icon={Scale}
      href="/open-loops"
      helpText={`${dueThisWeekCount} due this week`}
    >
      {items.length === 0 ? (
        <WidgetEmptyState message="Nothing due this week." />
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <WidgetListRow
                href={item.href}
                label={`${item.patientName}, due ${formatShortDate(item.dueDate)}`}
                primaryText={item.patientName}
                trailing={
                  <span className="text-xs text-accent/60">
                    {formatShortDate(item.dueDate)}
                  </span>
                }
              />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
