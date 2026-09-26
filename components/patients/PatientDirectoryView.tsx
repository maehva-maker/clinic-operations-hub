"use client";

// components/patients/PatientDirectoryView.tsx
// Search + program filter over every patient, sorted alphabetically, each
// rendered as a PatientCard with its aggregated stats and Quick Actions.

import { Search } from "lucide-react";
import { usePatientDirectory } from "@/hooks/use-patient-directory";
import { PatientCard } from "@/components/patients/PatientCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DOMAIN_LABEL } from "@/types";

const PROGRAM_OPTIONS = [
  { value: "all", label: "All Programs" },
  { value: "sleep_medicine", label: DOMAIN_LABEL.sleep_medicine },
  { value: "weight_management", label: DOMAIN_LABEL.weight_management },
];

export function PatientDirectoryView() {
  const { summaries, isLoading, search, setSearch, program, setProgram } = usePatientDirectory();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-accent">Patient Directory</h1>
        <p className="text-sm text-accent/60">Search and manage every patient across both programs.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-accent/40"
            aria-hidden="true"
          />
          <Input
            label="Search patients"
            hideLabel
            placeholder="Search by name or phone…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          label="Program"
          hideLabel
          options={PROGRAM_OPTIONS}
          value={program}
          onChange={(event) => setProgram(event.target.value as typeof program)}
          className="sm:w-56"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-accent/60">Loading patients…</p>
      ) : summaries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-surface-border p-8 text-center text-sm text-accent/50">
          No patients match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map(({ patient, activeOpenLoopCount, lastContactAt }) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              activeOpenLoopCount={activeOpenLoopCount}
              lastContactAt={lastContactAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
