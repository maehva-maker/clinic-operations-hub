// components/ui/PriorityBadge.tsx
// Outlined pill badge for TaskPriority — deliberately distinct in shape from
// StatusBadge (outline vs. filled) so the two are never confused even when
// shown side by side on the same card.

import { PRIORITY_STYLES } from "@/lib/constants/statuses";
import { cn } from "@/lib/utils/cn";
import { TASK_PRIORITY_LABEL, type TaskPriority } from "@/types";

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const styles = PRIORITY_STYLES[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-2.5 py-1 text-xs font-medium",
        styles.border,
        styles.text,
        className,
      )}
    >
      {TASK_PRIORITY_LABEL[priority]}
    </span>
  );
}
