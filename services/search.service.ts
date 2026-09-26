// services/search.service.ts
// Universal Global Search — one service the Top Navigation's search box
// calls, fanning out across every module that has something a name or
// keyword could match: Patients, Open Loops, Clinic Contacts (via the now
// Supabase-backed services), and SOP Articles / Workflow Guides (via the
// existing services/sop.service.ts — no new `sop_articles` table exists, so
// this reuses its searchSopContent() rather than duplicating that content).
// Every result carries just enough to render a grouped list item and link
// straight to the record.

import { getOpenLoops } from "@/services/open-loops.service";
import { getPatients } from "@/services/patients.service";
import { getClinicContacts } from "@/services/directory.service";
import { searchSopContent } from "@/services/sop.service";
import { matchesSearch } from "@/lib/utils/search";
import { DOMAIN_LABEL } from "@/types";

export type GlobalSearchResultKind =
  | "patient"
  | "open_loop"
  | "clinic_contact"
  | "sop_workflow_guide"
  | "sop_software_guide";

export interface GlobalSearchResult {
  kind: GlobalSearchResultKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface GlobalSearchResults {
  patients: GlobalSearchResult[];
  openLoops: GlobalSearchResult[];
  clinicContacts: GlobalSearchResult[];
  sopArticles: GlobalSearchResult[];
}

const MAX_PER_GROUP = 5;
const MIN_QUERY_LENGTH = 2;

export function isSearchableQuery(query: string): boolean {
  return query.trim().length >= MIN_QUERY_LENGTH;
}

/** Runs the same query against every searchable module in parallel and groups the results. */
export async function runGlobalSearch(query: string): Promise<GlobalSearchResults> {
  if (!isSearchableQuery(query)) {
    return { patients: [], openLoops: [], clinicContacts: [], sopArticles: [] };
  }

  const [patients, openLoops, clinicContacts] = await Promise.all([
    getPatients(),
    getOpenLoops(),
    getClinicContacts(),
  ]);

  const patientResults: GlobalSearchResult[] = patients
    .filter((patient) => matchesSearch(query, patient.name, patient.aliases, patient.provider))
    .slice(0, MAX_PER_GROUP)
    .map((patient) => ({
      kind: "patient",
      id: patient.id,
      title: patient.name,
      subtitle: DOMAIN_LABEL[patient.program],
      href: `/patients/${patient.id}`,
    }));

  const openLoopResults: GlobalSearchResult[] = openLoops
    .filter((loop) => matchesSearch(query, loop.patientName, loop.title))
    .slice(0, MAX_PER_GROUP)
    .map((loop) => ({
      kind: "open_loop",
      id: loop.id,
      title: loop.title,
      subtitle: loop.patientName,
      href: `/open-loops?loop=${loop.id}`,
    }));

  const clinicContactResults: GlobalSearchResult[] = clinicContacts
    .filter((contact) => matchesSearch(query, contact.name, contact.notes, contact.address))
    .slice(0, MAX_PER_GROUP)
    .map((contact) => ({
      kind: "clinic_contact",
      id: contact.id,
      title: contact.name,
      subtitle: "Clinic Directory",
      href: `/directory`,
    }));

  const sopResults = searchSopContent(query);
  const sopArticleResults: GlobalSearchResult[] = [
    ...sopResults.workflowGuides.slice(0, MAX_PER_GROUP).map(
      (guide): GlobalSearchResult => ({
        kind: "sop_workflow_guide",
        id: guide.id,
        title: guide.title,
        subtitle: "Workflow Guide",
        href: `/sop/workflows/${guide.id}`,
      }),
    ),
    ...sopResults.softwareGuides.slice(0, MAX_PER_GROUP).map(
      (guide): GlobalSearchResult => ({
        kind: "sop_software_guide",
        id: guide.id,
        title: guide.title,
        subtitle: "Software Guide",
        href: `/sop/software/${guide.id}`,
      }),
    ),
  ];

  return {
    patients: patientResults,
    openLoops: openLoopResults,
    clinicContacts: clinicContactResults,
    sopArticles: sopArticleResults,
  };
}
