import { Wind } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { WidgetListRow } from "@/components/dashboard/WidgetListRow";
import { WidgetEmptyState } from "@/components/dashboard/WidgetEmptyState";
import type { PapOrderPendingItem } from "@/types";

interface PapPendingWidgetProps {
  items: PapOrderPendingItem[];
}

export function PapPendingWidget({ items }: PapPendingWidgetProps) {
  return (
    <DashboardCard
      title="PAP Orders Pending"
      icon={Wind}
      href="/open-loops"
      helpText={`${items.length} pending`}
    >
      {items.length === 0 ? (
        <WidgetEmptyState message="No PAP orders pending." />
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <WidgetListRow
                href={item.href}
                label={`${item.patientName}: ${item.status}`}
                primaryText={item.patientName}
                trailing={<span className="text-xs text-accent/60">{item.status}</span>}
              />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
