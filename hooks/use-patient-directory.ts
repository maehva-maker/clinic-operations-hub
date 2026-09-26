"use client";

// hooks/use-patient-directory.ts
// Backs the Patient Directory page: loads every patient's aggregated
// open-loop/contact stats once, then filters by search + program and sorts
// alphabetically in memory — no additional service calls per keystroke.

import { useCallback, useEffect, useMemo, useState } from "react";
import { getPatientSummaries, type PatientSummary } from "@/services/patients.service";
import { useSearch } from "@/hooks/use-search";
import type { WorkflowDomain } from "@/types";

interface UsePatientDirectoryResult {
  summaries: PatientSummary[];
  isLoading: boolean;
  search: string;
  setSearch: (value: string) => void;
  program: WorkflowDomain | "all";
  setProgram: (value: WorkflowDomain | "all") => void;
}

export function usePatientDirectory(): UsePatientDirectoryResult {
  const [allSummaries, setAllSummaries] = useState<PatientSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState<WorkflowDomain | "all">("all");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    void getPatientSummaries().then((result) => {
      if (isMounted) {
        setAllSummaries(result);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const byProgram = useMemo(
    () => allSummaries.filter((summary) => program === "all" || summary.patient.program === program),
    [allSummaries, program],
  );

  const searched = useSearch(byProgram, search, (summary) => [
    summary.patient.name,
    summary.patient.aliases,
    summary.patient.phone,
  ]);

  const summaries = useMemo(
    () => [...searched].sort((a, b) => a.patient.name.localeCompare(b.patient.name)),
    [searched],
  );

  return { summaries, isLoading, search, setSearch, program, setProgram };
}
