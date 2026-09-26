// services/directory.service.ts
// Clinic Directory (contacts) and Provider Directory data access. Phase 10:
// backed by the real `clinic_contacts`, `providers`, and `communication_logs`
// Supabase tables. Contacts and providers are self-contained records —
// unlike Patients, they don't compose data from other modules — but a
// ClinicContact's `communicationLog` now lives in its own table, so
// `getClinicContacts`/`getContactById` join it in per contact to keep the
// exact same `ClinicContact` shape callers already rely on.

import { createClient } from "@/lib/supabase/client";
import { matchesSearch } from "@/lib/utils/search";
import type { ClinicContact, ClinicContactCategory, ContactReference, Provider } from "@/types";
import type { Database } from "@/types/database";

type ClinicContactRow = Database["public"]["Tables"]["clinic_contacts"]["Row"];
type ProviderRow = Database["public"]["Tables"]["providers"]["Row"];
type CommunicationLogRow = Database["public"]["Tables"]["communication_logs"]["Row"];

function rowToProvider(row: ProviderRow): Provider {
  return {
    id: row.id,
    name: row.name,
    specialty: row.specialty,
    clinicDays: [...row.clinic_days],
    notes: row.notes,
    relatedWorkflowIds: row.related_workflow_ids as Provider["relatedWorkflowIds"],
  };
}

function rowToCommunicationLogEntry(row: CommunicationLogRow): ClinicContact["communicationLog"][number] {
  return {
    id: row.id,
    date: row.date,
    method: row.method,
    summary: row.summary,
    performer: row.performer,
  };
}

function rowToClinicContact(row: ClinicContactRow, logRows: CommunicationLogRow[]): ClinicContact {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    phone: row.phone,
    fax: row.fax,
    email: row.email,
    address: row.address,
    notes: row.notes,
    communicationLog: logRows
      .filter((log) => log.contact_id === row.id)
      .map(rowToCommunicationLogEntry)
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}

export async function getClinicContacts(): Promise<ClinicContact[]> {
  const supabase = createClient();
  const [{ data: contacts, error: contactsError }, { data: logs, error: logsError }] = await Promise.all([
    supabase.from("clinic_contacts").select("*").order("name", { ascending: true }),
    supabase.from("communication_logs").select("*"),
  ]);
  if (contactsError) throw new Error(`Couldn't load clinic contacts: ${contactsError.message}`);
  if (logsError) throw new Error(`Couldn't load communication logs: ${logsError.message}`);
  return (contacts ?? []).map((row) => rowToClinicContact(row, logs ?? []));
}

export async function getContactById(id: string): Promise<ClinicContact | null> {
  const supabase = createClient();
  const [{ data: contact, error: contactError }, { data: logs, error: logsError }] = await Promise.all([
    supabase.from("clinic_contacts").select("*").eq("id", id).maybeSingle(),
    supabase.from("communication_logs").select("*").eq("contact_id", id),
  ]);
  if (contactError) throw new Error(`Couldn't load clinic contact: ${contactError.message}`);
  if (logsError) throw new Error(`Couldn't load communication logs: ${logsError.message}`);
  return contact ? rowToClinicContact(contact, logs ?? []) : null;
}

export async function getProviders(): Promise<Provider[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("providers").select("*").order("name", { ascending: true });
  if (error) throw new Error(`Couldn't load providers: ${error.message}`);
  return (data ?? []).map(rowToProvider);
}

export async function getProviderById(id: string): Promise<Provider | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("providers").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Couldn't load provider: ${error.message}`);
  return data ? rowToProvider(data) : null;
}

export function filterContacts(
  contacts: ClinicContact[],
  query: string,
  category: ClinicContactCategory | "all",
): ClinicContact[] {
  return contacts.filter((contact) => {
    const matchesCategory = category === "all" || contact.category === category;
    if (!matchesCategory) return false;
    return matchesSearch(query, contact.name, contact.notes, contact.address);
  });
}

/** Pinned/favorited contacts sort first, each group keeping its existing order. */
export function sortContactsByFavorite<T extends ClinicContact | Provider>(
  items: T[],
  isFavorite: (kind: ContactReference["kind"], id: string) => boolean,
  kind: ContactReference["kind"],
): T[] {
  return [...items].sort((a, b) => {
    const aFav = isFavorite(kind, a.id) ? 0 : 1;
    const bFav = isFavorite(kind, b.id) ? 0 : 1;
    return aFav - bFav;
  });
}
