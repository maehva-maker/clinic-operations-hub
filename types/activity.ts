// types/activity.ts
// The Activity Timeline is the audit trail of everything done on an Open
// Loop. Entries are append-only from the UI's perspective — there is no
// "edit" or "delete" here, only new entries, so the timeline always reflects
// exactly what happened and when.

export type ActivityActionType =
  | "call"
  | "voicemail"
  | "fax"
  | "email"
  | "documentation"
  | "status_change"
  | "follow_up_set"
  | "note";

export interface Activity {
  id: string;
  openLoopId: string;
  timestamp: string; // ISO datetime
  actionType: ActivityActionType;
  note: string;
  performedBy: string;
  attachmentName?: string | null;
  /** Storage object path (bucket "attachments"), added in Phase 10 — resolved to a signed URL on demand, never stored as a public link. */
  attachmentPath?: string | null;
}
