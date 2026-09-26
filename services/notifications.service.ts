// services/notifications.service.ts
// Phase 10 NEW FEATURE — Notifications Center. Computes everything the panel
// shows directly from the now-Supabase-backed services (no notifications
// table of its own — every notification is a live, derived view over
// open_loops and documentation_history), per the Phase 10 brief: "Computed
// from the database."

import { getOpenLoops } from "@/services/open-loops.service";
import { getDocumentationHistory } from "@/services/documentation.service";
import { getDueDateBucket } from "@/lib/utils/date";
import { getTemplateById } from "@/lib/constants/documentation-templates";
import type { OpenLoop } from "@/types";

export type NotificationKind =
  | "follow_up_due_today"
  | "overdue_open_loop"
  | "waiting_insurance"
  | "waiting_patient"
  | "recent_documentation";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  timestamp: string;
  href: string;
}

const RECENT_DOCUMENTATION_LIMIT = 5;

function toFollowUpNotification(loop: OpenLoop): AppNotification {
  return {
    id: `follow-up-${loop.id}`,
    kind: "follow_up_due_today",
    title: loop.patientName,
    detail: `Follow-up due today — ${loop.title}`,
    timestamp: loop.updatedAt,
    href: `/open-loops?loop=${loop.id}`,
  };
}

function toOverdueNotification(loop: OpenLoop): AppNotification {
  return {
    id: `overdue-${loop.id}`,
    kind: "overdue_open_loop",
    title: loop.patientName,
    detail: `Overdue — ${loop.title}`,
    timestamp: loop.updatedAt,
    href: `/open-loops?loop=${loop.id}`,
  };
}

function toWaitingNotification(loop: OpenLoop, kind: "waiting_insurance" | "waiting_patient"): AppNotification {
  return {
    id: `${kind}-${loop.id}`,
    kind,
    title: loop.patientName,
    detail: loop.title,
    timestamp: loop.updatedAt,
    href: `/open-loops?loop=${loop.id}`,
  };
}

export async function getNotifications(): Promise<AppNotification[]> {
  const [loops, documentation] = await Promise.all([getOpenLoops(), getDocumentationHistory()]);

  const activeLoops = loops.filter((loop) => loop.status !== "completed");

  const followUpsDueToday = activeLoops
    .filter((loop) => getDueDateBucket(loop.dueDate) === "today")
    .map(toFollowUpNotification);

  const overdueLoops = activeLoops
    .filter((loop) => getDueDateBucket(loop.dueDate) === "overdue")
    .map(toOverdueNotification);

  const waitingInsurance = activeLoops
    .filter((loop) => loop.status === "waiting" && loop.waitingOn === "insurance")
    .map((loop) => toWaitingNotification(loop, "waiting_insurance"));

  const waitingPatient = activeLoops
    .filter((loop) => loop.status === "waiting" && loop.waitingOn === "patient")
    .map((loop) => toWaitingNotification(loop, "waiting_patient"));

  const recentDocumentation: AppNotification[] = [...documentation]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, RECENT_DOCUMENTATION_LIMIT)
    .map((entry) => ({
      id: `doc-${entry.id}`,
      kind: "recent_documentation",
      title: entry.common.patientName,
      detail: getTemplateById(entry.templateId).label,
      timestamp: entry.timestamp,
      href: "/clinical-documentation/history",
    }));

  return [
    ...followUpsDueToday,
    ...overdueLoops,
    ...waitingInsurance,
    ...waitingPatient,
    ...recentDocumentation,
  ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function getUnreadCount(notifications: AppNotification[]): number {
  // "Unread" has no persisted state in this phase (no notifications table) —
  // every currently-computed notification counts, since they're always
  // current-state derivations, not a historical inbox to mark read.
  return notifications.length;
}
