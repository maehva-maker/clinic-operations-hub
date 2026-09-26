// components/open-loops/ActivityTimelineList.tsx
// Renders the full, unlimited-length Activity Timeline for one Open Loop,
// newest entry first (the service layer returns them pre-sorted that way).

import { ActivityTimelineItem } from "@/components/open-loops/ActivityTimelineItem";
import type { Activity } from "@/types";

interface ActivityTimelineListProps {
  activities: Activity[];
}

export function ActivityTimelineList({ activities }: ActivityTimelineListProps) {
  if (activities.length === 0) {
    return <p className="text-sm text-accent/50">No activity logged yet.</p>;
  }

  return (
    <ol className="flex flex-col gap-4" aria-label="Activity timeline">
      {activities.map((activity) => (
        <ActivityTimelineItem key={activity.id} activity={activity} />
      ))}
    </ol>
  );
}
