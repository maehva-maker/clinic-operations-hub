// types/directory.ts
// The Clinic Directory and Provider Directory. A ClinicContact's
// communication log is its own history — independent from a patient's
// Activity Timeline or Documentation History, per the Phase 8 brief.

import type { WorkflowDefinitionId } from "./workflow";

export type ClinicContactCategory =
  | "sleep_labs"
  | "dme_suppliers"
  | "laboratories"
  | "insurance_portals"
  | "referral_offices"
  | "internal_contacts";

export type CommunicationMethod = "call" | "fax" | "email" | "portal" | "in_person";

export interface CommunicationLogEntry {
  id: string;
  date: string; // ISO datetime
  method: CommunicationMethod;
  summary: string;
  performer: string;
}

export interface ClinicContact {
  id: string;
  name: string;
  category: ClinicContactCategory;
  phone: string | null;
  fax: string | null;
  email: string | null;
  address: string | null;
  notes: string;
  communicationLog: CommunicationLogEntry[];
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  clinicDays: string[];
  notes: string;
  relatedWorkflowIds: WorkflowDefinitionId[];
}

export type PinnableContactKind = "clinic_contact" | "provider";

/** What Favorite Contacts stores — the Clinic/Provider Directory's own pin list, separate from the SOP Center's. */
export interface ContactReference {
  kind: PinnableContactKind;
  id: string;
  name: string;
  href: string;
}
