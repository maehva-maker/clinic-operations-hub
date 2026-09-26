// lib/mock/patients.ts
// The Patient Directory's canonical patient list — reconciling every patient
// name already used across the app's mock data (Open Loop Tracker uses
// abbreviated names like "H. Stewart"; Clinical Documentation and the
// Workflow Wizard use full names like "Heather Stewart" for the same
// person). Each Patient's `aliases` array lists every other exact string
// this person appears under elsewhere, so services/patients.service.ts can
// match all three phases' records to one profile without renaming any of
// that existing mock data.

import type { Patient } from "@/types";

export const MOCK_PATIENTS: Patient[] = [
  // Sleep Medicine — reconciled from lib/mock/open-loops.ts
  {
    id: "patient-1",
    name: "Jorge Alvarez",
    aliases: ["J. Alvarez"],
    dob: "1975-03-14",
    provider: "Dr. Pegah Mashayekhi, MD",
    program: "sleep_medicine",
    phone: "(602) 555-0112",
    email: "jorge.alvarez@example.com",
  },
  {
    id: "patient-2",
    name: "Marisol Torres",
    aliases: ["M. Torres"],
    dob: "1968-11-02",
    provider: "Dr. Pegah Mashayekhi, MD",
    program: "sleep_medicine",
    phone: "(602) 555-0134",
    email: "marisol.torres@example.com",
  },
  {
    id: "patient-3",
    name: "Raymond Chen",
    aliases: ["R. Chen"],
    dob: "1990-06-21",
    provider: "Donna Seo, PA",
    program: "sleep_medicine",
    phone: "(602) 555-0156",
    email: "raymond.chen@example.com",
  },
  {
    id: "patient-4",
    name: "Lisa Kim",
    aliases: ["L. Kim"],
    dob: "1982-01-09",
    provider: "Dr. Pegah Mashayekhi, MD",
    program: "sleep_medicine",
    phone: "(602) 555-0178",
    email: "lisa.kim@example.com",
  },
  {
    id: "patient-5",
    name: "Deepak Patel",
    aliases: ["D. Patel"],
    dob: "1979-08-30",
    provider: "Donna Seo, PA",
    program: "sleep_medicine",
    phone: "(602) 555-0190",
    email: "deepak.patel@example.com",
  },
  {
    id: "patient-6",
    name: "Tunde Osei",
    aliases: ["T. Osei"],
    dob: "1985-04-17",
    provider: "Dr. Pegah Mashayekhi, MD",
    program: "sleep_medicine",
    phone: "(602) 555-0203",
    email: "tunde.osei@example.com",
  },
  {
    id: "patient-7",
    name: "Heather Stewart",
    aliases: ["H. Stewart"],
    dob: "1988-01-02",
    provider: "Donna Seo, PA",
    program: "sleep_medicine",
    phone: "(602) 555-0148",
    email: "heather.stewart@example.com",
  },
  {
    id: "patient-8",
    name: "Bianca Ortiz",
    aliases: ["B. Ortiz"],
    dob: "1971-12-05",
    provider: "Dr. Pegah Mashayekhi, MD",
    program: "sleep_medicine",
    phone: "(602) 555-0225",
    email: "bianca.ortiz@example.com",
  },
  {
    id: "patient-9",
    name: "Christopher Nguyen",
    aliases: ["C. Nguyen"],
    dob: "1993-07-19",
    provider: "Donna Seo, PA",
    program: "sleep_medicine",
    phone: "(602) 555-0247",
    email: "christopher.nguyen@example.com",
  },

  // Weight Management — reconciled from lib/mock/open-loops.ts
  {
    id: "patient-10",
    name: "Stephanie Nguyen",
    aliases: ["S. Nguyen"],
    dob: "1980-05-11",
    provider: "Dr. Pegah Mashayekhi, MD",
    program: "weight_management",
    phone: "(602) 555-0269",
    email: "stephanie.nguyen@example.com",
  },
  {
    id: "patient-11",
    name: "Kevin Brooks",
    aliases: ["K. Brooks"],
    dob: "1976-02-27",
    provider: "Donna Seo, PA",
    program: "weight_management",
    phone: "(602) 555-0281",
    email: "kevin.brooks@example.com",
  },
  {
    id: "patient-12",
    name: "Amanda Whitfield",
    aliases: ["A. Whitfield"],
    dob: "1984-09-08",
    provider: "Dr. Pegah Mashayekhi, MD",
    program: "weight_management",
    phone: "(602) 555-0303",
    email: "amanda.whitfield@example.com",
  },
  {
    id: "patient-13",
    name: "Javier Romero",
    aliases: ["J. Romero"],
    dob: "1991-10-23",
    provider: "Donna Seo, PA",
    program: "weight_management",
    phone: "(602) 555-0325",
    email: "javier.romero@example.com",
  },
  {
    id: "patient-14",
    name: "Elena Diaz",
    aliases: ["E. Diaz"],
    dob: "1966-06-30",
    provider: "Dr. Pegah Mashayekhi, MD",
    program: "weight_management",
    phone: "(602) 555-0347",
    email: "elena.diaz@example.com",
  },

  // Reconciled from Clinical Documentation (Phase 5) and the Workflow Wizard
  // (Phase 6) mock data — these four don't have an Open Loop Tracker
  // counterpart, so they carry no aliases.
  {
    id: "patient-15",
    name: "Yukiko Britt",
    aliases: [],
    dob: "1978-03-15",
    provider: "Dr. Pegah Mashayekhi, MD",
    program: "weight_management",
    phone: "(602) 555-0369",
    email: "yukiko.britt@example.com",
  },
  {
    id: "patient-16",
    // Appears in both domains across Phase 5/6 mock data (a PAP order and a
    // lab review under Sleep Medicine, a completed New Consultation under
    // Weight Management) — Sleep Medicine is set as the primary program
    // since it accounts for most of her recorded activity.
    name: "Maria Johnson",
    aliases: [],
    dob: "1982-07-01",
    provider: "Dr. Pegah Mashayekhi, MD",
    program: "sleep_medicine",
    phone: "(602) 555-0381",
    email: "maria.johnson@example.com",
  },
  {
    id: "patient-17",
    // Also appears in both domains (a Referral in Sleep Medicine, a
    // Medication Follow-up in Weight Management) — Weight Management is set
    // as the primary program as an editorial call; see build notes.
    name: "David Wilson",
    aliases: [],
    dob: "1974-11-20",
    provider: "Donna Seo, PA",
    program: "weight_management",
    phone: "(602) 555-0403",
    email: "david.wilson@example.com",
  },
];
