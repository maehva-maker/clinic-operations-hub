import { FileClock } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { WidgetListRow } from "@/components/dashboard/WidgetListRow";
import { WidgetEmptyState } from "@/components/dashboard/WidgetEmptyState";
import type { ChartPrepItem } from "@/types";

interface ChartPrepWidgetProps {
  items: ChartPrepItem[];
}

export function ChartPrepWidget({ items }: ChartPrepWidgetProps) {
  return (
    <DashboardCard title="Tomorrow's Chart Prep" icon={FileClock} href="/open-loops">
      {items.length === 0 ? (
        <WidgetEmptyState message="No visits scheduled tomorrow." />
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <WidgetListRow
                href={item.href}
                label={`${item.patientName} at ${item.appointmentTime}`}
                primaryText={item.patientName}
                trailing={
                  <span className="text-xs text-accent/60">{item.appointmentTime}</span>
                }
              />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
