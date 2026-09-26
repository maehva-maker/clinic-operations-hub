// types/open-loop.ts
// An Open Loop is a persistent workflow record — it stays open across days,
// accumulating Activity Timeline entries, until explicitly closed. It is not
// a to-do item: closing it requires an explicit status change, never the
// passage of time.

import type {
  LoopStatus,
  OpenLoopCategory,
  TaskPriority,
  WaitingOnType,
  WorkflowDomain,
} from "./shared";

export interface OpenLoop {
  id: string;
  patientName: string;
  patientDob: string; // ISO date
  domain: WorkflowDomain;
  category: OpenLoopCategory;
  title: string;
  description: string;
  status: LoopStatus;
  priority: TaskPriority;
  provider: string;
  waitingOn: WaitingOnType | null;
  dueDate: string | null; // ISO date
  openedAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export type DueDateFilter = "all" | "overdue" | "today" | "this_week" | "none";

export interface OpenLoopFilters {
  domain: WorkflowDomain;
  category: OpenLoopCategory | "all";
  status: LoopStatus | "all";
  priority: TaskPriority | "all";
  /** A specific provider name, or "all". */
  provider: string;
  dueDate: DueDateFilter;
  search: string;
}
