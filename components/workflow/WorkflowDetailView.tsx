"use client";

// components/workflow/WorkflowDetailView.tsx
// Page 2 — Workflow Detail. Orchestrates the whole guided experience for one
// workflow definition: Progress Tracker (left), Current Step + Required
// Information + Completion Gate (center), Beginner Assistant (right). The
// active run's id lives in the URL as ?run=<id>, the same pattern the Open
// Loop drawer uses, so a run is resumable and shareable without being its
// own route. Requires a <Suspense> boundary in page.tsx for useSearchParams().

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Toast, type ToastMessage } from "@/components/ui/Toast";
import { ProgressTracker } from "@/components/workflow/ProgressTracker";
import { RequiredInformationPanel } from "@/components/workflow/RequiredInformationPanel";
import { CurrentStepPanel } from "@/components/workflow/CurrentStepPanel";
import { CompletionGateBanner } from "@/components/workflow/CompletionGateBanner";
import { GenerateDocumentationModal } from "@/components/workflow/GenerateDocumentationModal";
import { WorkflowBeginnerAssistant } from "@/components/workflow/WorkflowBeginnerAssistant";
import { StartWorkflowRunPanel } from "@/components/workflow/StartWorkflowRunPanel";
import { useWorkflowDetail } from "@/hooks/use-workflow-detail";
import type { WorkflowDefinitionId } from "@/types";

interface WorkflowDetailViewProps {
  workflowId: WorkflowDefinitionId;
}

export function WorkflowDetailView({ workflowId }: WorkflowDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRunId = searchParams.get("run");

  const {
    definition,
    runs,
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
  } = useWorkflowDetail(workflowId, activeRunId);

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const goToRun = useCallback(
    (runId: string) => {
      router.push(`/workflow-wizard/${workflowId}?run=${runId}`);
    },
    [router, workflowId],
  );

  const handleStart = useCallback(
    async (patientName: string) => {
      const run = await startRun(patientName);
      goToRun(run.id);
    },
    [startRun, goToRun],
  );

  const handleComplete = useCallback(async () => {
    setIsCompleting(true);
    try {
      await completeRun();
      setToast({ id: Date.now(), text: "Workflow completed.", tone: "success" });
    } finally {
      setIsCompleting(false);
    }
  }, [completeRun]);

  const currentStep = definition.steps.find((step) => step.id === currentStepId) ?? null;
  const inProgressRuns = runs.filter((run) => run.status === "in_progress");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={definition.title}
        description={activeRun ? `Guiding ${activeRun.patientName} through this workflow.` : "Select or start a run to begin."}
      />

      {!activeRunId || (!activeRun && !isLoadingActiveRun) ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-card border border-surface-border bg-white p-5 shadow-card">
            <StartWorkflowRunPanel
              workflowTitle={definition.title}
              inProgressRuns={inProgressRuns}
              onResume={goToRun}
              onStart={handleStart}
            />
            <div className="mt-6 border-t border-surface-border pt-4">
              <RequiredInformationPanel
                requiredInformation={definition.requiredInformation}
                confirmedItems={[]}
                onToggleItem={() => undefined}
                readOnly
              />
            </div>
          </div>
          <WorkflowBeginnerAssistant definition={definition} />
        </div>
      ) : isLoadingActiveRun || !activeRun ? (
        <p className="text-sm text-accent/50">Loading workflow…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr_320px]">
            <aside aria-label="Progress tracker" className="rounded-card border border-surface-border bg-white p-4 shadow-card lg:order-1">
              <ProgressTracker
                steps={definition.steps}
                run={activeRun}
                currentStepId={currentStepId}
                progressPercent={progressPercent}
                onToggleStep={toggleStep}
              />
            </aside>

            <main className="flex flex-col gap-6 lg:order-2">
              <div className="rounded-card border border-surface-border bg-white p-5 shadow-card">
                <CurrentStepPanel
                  step={currentStep}
                  run={activeRun}
                  onMarkComplete={() => currentStep && toggleStep(currentStep.id)}
                  onOpenDocumentationModal={() => setIsDocModalOpen(true)}
                />
              </div>

              <div className="rounded-card border border-surface-border bg-white p-5 shadow-card">
                <RequiredInformationPanel
                  requiredInformation={definition.requiredInformation}
                  confirmedItems={activeRun.confirmedInfoItems}
                  onToggleItem={toggleInfoItem}
                />
              </div>

              {completionStatus ? (
                <CompletionGateBanner
                  status={activeRun.status}
                  completionStatus={completionStatus}
                  onComplete={handleComplete}
                  isCompleting={isCompleting}
                />
              ) : null}
            </main>

            <div className="lg:order-3">
              <WorkflowBeginnerAssistant definition={definition} />
            </div>
          </div>

          <GenerateDocumentationModal
            isOpen={isDocModalOpen}
            onClose={() => setIsDocModalOpen(false)}
            templateId={definition.documentationTemplateId}
            onSubmit={async (noteText) => {
              await generateDocumentation(noteText);
              setToast({ id: Date.now(), text: "Documentation generated.", tone: "success" });
            }}
          />
        </>
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
