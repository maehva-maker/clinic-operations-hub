"use client";

// hooks/use-workflow-detail.ts
// Backs the Workflow Detail page for one workflow definition: the list of
// existing runs (for "resume" / "start new"), the currently selected run,
// and every mutation the wizard can perform on it. All gating and
// Completion Gate logic lives in services/workflow.service.ts — this hook
// only wires that service to React state and re-fetches the run after every
// mutation, matching the pattern in use-open-loop-detail.ts.

import { useCallback, useEffect, useMemo, useState } from "react";
import { getWorkflowDefinition } from "@/lib/constants/workflow-definitions";
import {
  completeWorkflowRun,
  createWorkflowRun,
  generateDocumentationForRun,
  getCompletionStatus,
  getCurrentStepId,
  getRunById,
  getRunsForWorkflow,
  toggleRequiredInfoItem,
  toggleStepCompletion,
} from "@/services/workflow.service";
import type { WorkflowDefinitionId, WorkflowRun } from "@/types";

interface UseWorkflowDetailResult {
  definition: ReturnType<typeof getWorkflowDefinition>;
  runs: WorkflowRun[];
  isLoadingRuns: boolean;
  activeRun: WorkflowRun | null;
  isLoadingActiveRun: boolean;
  currentStepId: string | null;
  progressPercent: number;
  completionStatus: ReturnType<typeof getCompletionStatus> | null;
  startRun: (patientName: string) => Promise<WorkflowRun>;
  toggleStep: (stepId: string) => Promise<void>;
  toggleInfoItem: (item: string) => Promise<void>;
  generateDocumentation: (noteText: string) => Promise<void>;
  completeRun: () => Promise<void>;
  refreshRuns: () => Promise<void>;
}

export function useWorkflowDetail(
  workflowId: WorkflowDefinitionId,
  activeRunId: string | null,
): UseWorkflowDetailResult {
  const definition = useMemo(() => getWorkflowDefinition(workflowId), [workflowId]);

  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(true);
  const [activeRun, setActiveRun] = useState<WorkflowRun | null>(null);
  const [isLoadingActiveRun, setIsLoadingActiveRun] = useState(false);

  const loadRuns = useCallback(async () => {
    setIsLoadingRuns(true);
    const result = await getRunsForWorkflow(workflowId);
    setRuns(result);
    setIsLoadingRuns(false);
  }, [workflowId]);

  const loadActiveRun = useCallback(async () => {
    if (!activeRunId) {
      setActiveRun(null);
      return;
    }
    setIsLoadingActiveRun(true);
    const result = await getRunById(activeRunId);
    setActiveRun(result);
    setIsLoadingActiveRun(false);
  }, [activeRunId]);

  useEffect(() => {
    void loadRuns();
  }, [loadRuns]);

  useEffect(() => {
    void loadActiveRun();
  }, [loadActiveRun]);

  const startRun = useCallback(
    async (patientName: string) => {
      const run = await createWorkflowRun(workflowId, patientName);
      await loadRuns();
      return run;
    },
    [workflowId, loadRuns],
  );

  const toggleStep = useCallback(
    async (stepId: string) => {
      if (!activeRun) return;
      await toggleStepCompletion(activeRun.id, stepId);
      await Promise.all([loadActiveRun(), loadRuns()]);
    },
    [activeRun, loadActiveRun, loadRuns],
  );

  const toggleInfoItem = useCallback(
    async (item: string) => {
      if (!activeRun) return;
      await toggleRequiredInfoItem(activeRun.id, item);
      await Promise.all([loadActiveRun(), loadRuns()]);
    },
    [activeRun, loadActiveRun, loadRuns],
  );

  const generateDocumentation = useCallback(
    async (noteText: string) => {
      if (!activeRun) return;
      await generateDocumentationForRun(activeRun.id, noteText);
      await Promise.all([loadActiveRun(), loadRuns()]);
    },
    [activeRun, loadActiveRun, loadRuns],
  );

  const completeRun = useCallback(async () => {
    if (!activeRun) return;
    await completeWorkflowRun(activeRun.id);
    await Promise.all([loadActiveRun(), loadRuns()]);
  }, [activeRun, loadActiveRun, loadRuns]);

  const currentStepId = activeRun ? getCurrentStepId(definition, activeRun) : null;
  const progressPercent = activeRun
    ? Math.round((activeRun.completedStepIds.length / definition.steps.length) * 100)
    : 0;
  const completionStatus = activeRun ? getCompletionStatus(definition, activeRun) : null;

  return {
    definition,
    runs,
    isLoadingRuns,
    activeRun,
    isLoadingActiveRun,
    currentStepId,
    progressPercent,
    completionStatus,
    startRun,
    toggleStep,
    toggleInfoItem,
    generateDocumentation,
    completeRun,
    refreshRuns: loadRuns,
  };
}
