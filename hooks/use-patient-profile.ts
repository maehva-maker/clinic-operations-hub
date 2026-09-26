"use client";

// hooks/use-patient-profile.ts
// Backs the Patient Profile page: loads the patient record plus every
// cross-module list (Open Loops, Documentation, Workflow Runs, unified
// Activity Timeline) in parallel.

import { useCallback, useEffect, useState } from "react";
import {
  getDocumentationForPatient,
  getOpenLoopsForPatient,
  getPatientActivityTimeline,
  getPatientById,
  getWorkflowRunsForPatient,
  getActiveOpenLoopCount,
  getLastContactAt,
  getPendingFollowUp,
} from "@/services/patients.service";
import type {
  DocumentationEntry,
  OpenLoop,
  Patient,
  UnifiedActivityEntry,
  WorkflowRun,
} from "@/types";

interface UsePatientProfileResult {
  patient: Patient | null;
  isLoading: boolean;
  notFound: boolean;
  openLoops: OpenLoop[];
  documentation: DocumentationEntry[];
  workflowRuns: WorkflowRun[];
  timeline: UnifiedActivityEntry[];
  activeOpenLoopCount: number;
  lastContactAt: string | null;
  pendingFollowUp: OpenLoop | null;
  refresh: () => Promise<void>;
}

export function usePatientProfile(patientId: string): UsePatientProfileResult {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [openLoops, setOpenLoops] = useState<OpenLoop[]>([]);
  const [documentation, setDocumentation] = useState<DocumentationEntry[]>([]);
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [timeline, setTimeline] = useState<UnifiedActivityEntry[]>([]);

  const load = useCallback(async () => {
    setIsLoading(true);
    const found = await getPatientById(patientId);
    if (!found) {
      setNotFoundState(true);
      setIsLoading(false);
      return;
    }

    setPatient(found);
    const [loops, docs, runs, activity] = await Promise.all([
      getOpenLoopsForPatient(found),
      getDocumentationForPatient(found),
      getWorkflowRunsForPatient(found),
      getPatientActivityTimeline(found),
    ]);
    setOpenLoops(loops);
    setDocumentation(docs);
    setWorkflowRuns(runs);
    setTimeline(activity);
    setIsLoading(false);
  }, [patientId]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    patient,
    isLoading,
    notFound: notFoundState,
    openLoops,
    documentation,
    workflowRuns,
    timeline,
    activeOpenLoopCount: getActiveOpenLoopCount(openLoops),
    lastContactAt: getLastContactAt(openLoops, documentation, workflowRuns),
    pendingFollowUp: getPendingFollowUp(openLoops),
    refresh: load,
  };
}
