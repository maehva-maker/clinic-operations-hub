// lib/constants/action-types.ts
// Icon and label mapping for Activity Timeline entries, kept in one place so
// an action type's appearance can never drift between the timeline and any
// quick-action control that creates one.

import {
  Phone,
  Voicemail,
  Printer,
  Mail,
  FileText,
  ArrowRightLeft,
  CalendarClock,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import type { ActivityActionType } from "@/types";

export const ACTION_TYPE_LABEL: Record<ActivityActionType, string> = {
  call: "Log Call",
  voicemail: "Voicemail",
  fax: "Upload Fax",
  email: "Send Email Record",
  documentation: "Add Documentation",
  status_change: "Status Change",
  follow_up_set: "Follow-up Set",
  note: "Note",
};

export const ACTION_TYPE_ICON: Record<ActivityActionType, LucideIcon> = {
  call: Phone,
  voicemail: Voicemail,
  fax: Printer,
  email: Mail,
  documentation: FileText,
  status_change: ArrowRightLeft,
  follow_up_set: CalendarClock,
  note: StickyNote,
};
