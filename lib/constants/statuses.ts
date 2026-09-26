// lib/constants/statuses.ts
// Color-token mapping for StatusBadge and PriorityBadge. Kept in one place
// so a status's color can never drift between components — see the Design
// System color tokens in claude/phase2-wireframes.md.

import type { LoopStatus, TaskPriority } from "@/types";

export const STATUS_STYLES: Record<
  LoopStatus,
  { bg: string; text: string; dot: string }
> = {
  new: { bg: "bg-surface-border/60", text: "text-accent", dot: "bg-accent/60" },
  in_progress: {
    bg: "bg-secondary-light",
    text: "text-secondary-dark",
    dot: "bg-secondary",
  },
  waiting: { bg: "bg-warning-light", text: "text-warning", dot: "bg-warning" },
  completed: {
    bg: "bg-success-light",
    text: "text-success",
    dot: "bg-success",
  },
  escalated: {
    bg: "bg-critical-light",
    text: "text-critical",
    dot: "bg-critical",
  },
};

export const PRIORITY_STYLES: Record<
  TaskPriority,
  { border: string; text: string }
> = {
  low: { border: "border-surface-border", text: "text-accent/60" },
  normal: { border: "border-surface-border", text: "text-accent/80" },
  high: { border: "border-warning", text: "text-warning" },
  urgent: { border: "border-critical", text: "text-critical" },
};
