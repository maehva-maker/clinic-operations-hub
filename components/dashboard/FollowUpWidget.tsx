import { CalendarClock } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { WidgetListRow } from "@/components/dashboard/WidgetListRow";
import { WidgetEmptyState } from "@/components/dashboard/WidgetEmptyState";
import { DOMAIN_LABEL, WAITING_ON_LABEL } from "@/types";
import type { FollowUpDueItem } from "@/types";

interface FollowUpWidgetProps {
  items: FollowUpDueItem[];
}

export function FollowUpWidget({ items }: FollowUpWidgetProps) {
  return (
    <DashboardCard
      title="Follow-ups Due Today"
      icon={CalendarClock}
      href="/open-loops"
      helpText={`${items.length} due today`}
    >
      {items.length === 0 ? (
        <WidgetEmptyState message="No follow-ups due today." />
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const secondary = `${DOMAIN_LABEL[item.domain]}${
              item.waitingOn ? ` · Waiting on ${WAITING_ON_LABEL[item.waitingOn]}` : ""
            }`;
            return (
              <li key={item.id}>
                <WidgetListRow
                  href={item.href}
                  label={`${item.patientName}, ${item.category}, ${secondary}`}
                  primaryText={`${item.patientName} — ${item.category}`}
                  secondaryText={secondary}
                />
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}
