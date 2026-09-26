// components/ui/StatusBadge.tsx
// Filled pill badge for LoopStatus/TaskStatus. Color is always paired with
// the text label (never color alone) per the Design System accessibility
// rule in claude/phase2-wireframes.md.

import { STATUS_STYLES } from "@/lib/constants/statuses";
import { cn } from "@/lib/utils/cn";
import { LOOP_STATUS_LABEL, type LoopStatus } from "@/types";

interface StatusBadgeProps {
  status: LoopStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium",
        styles.bg,
        styles.text,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} aria-hidden="true" />
      {LOOP_STATUS_LABEL[status]}
    </span>
  );
}
