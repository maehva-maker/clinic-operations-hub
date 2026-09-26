"use client";

// components/patients/PatientProfileView.tsx
// Snapshot + Overview + Active Open Loops + Documentation History +
// Workflow History + unified Activity Timeline, all composed from Phase
// 4/5/6 data via usePatientProfile() — nothing here owns its own records.

import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { PatientSnapshot } from "@/components/patients/PatientSnapshot";
import { usePatientProfile } from "@/hooks/use-patient-profile";
import { getWorkflowDefinition } from "@/lib/constants/workflow-definitions";
import { getTemplateById } from "@/lib/constants/documentation-templates";
import { formatTimelineTimestamp } from "@/lib/utils/date";
import { DOMAIN_LABEL } from "@/types";

interface PatientProfileViewProps {
  patientId: string;
}

export function PatientProfileView({ patientId }: PatientProfileViewProps) {
  const {
    patient,
    isLoading,
    notFound: patientNotFound,
    openLoops,
    documentation,
    workflowRuns,
    timeline,
    activeOpenLoopCount,
    lastContactAt,
    pendingFollowUp,
  } = usePatientProfile(patientId);

  if (patientNotFound) {
    notFound();
  }

  if (isLoading || !patient) {
    return <p className="text-sm text-accent/60">Loading patient…</p>;
  }

  const activeLoops = openLoops.filter((loop) => loop.status !== "completed");

  return (
    <div className="flex flex-col gap-6">
      <PatientSnapshot
        patient={patient}
        lastContactAt={lastContactAt}
        activeOpenLoopCount={activeOpenLoopCount}
        pendingFollowUp={pendingFollowUp}
      />

      <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 className="mb-3 text-sm font-semibold text-accent">Overview</h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between border-b border-surface-border/70 pb-1.5">
            <dt className="text-accent/50">Date of Birth</dt>
            <dd className="text-accent">{patient.dob}</dd>
          </div>
          <div className="flex justify-between border-b border-surface-border/70 pb-1.5">
            <dt className="text-accent/50">Provider</dt>
            <dd className="text-accent">{patient.provider}</dd>
          </div>
          <div className="flex justify-between border-b border-surface-border/70 pb-1.5">
            <dt className="text-accent/50">Program</dt>
            <dd className="text-accent">{DOMAIN_LABEL[patient.program]}</dd>
          </div>
          <div className="flex justify-between border-b border-surface-border/70 pb-1.5">
            <dt className="text-accent/50">Phone</dt>
            <dd className="text-accent">{patient.phone}</dd>
          </div>
          <div className="flex justify-between border-b border-surface-border/70 pb-1.5 sm:col-span-2">
            <dt className="text-accent/50">Email</dt>
            <dd className="text-accent">{patient.email}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 className="mb-3 text-sm font-semibold text-accent">
          Active Open Loops <span className="text-accent/40">({activeLoops.length})</span>
        </h2>
        {activeLoops.length === 0 ? (
          <p className="text-sm text-accent/50">No active open loops.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {activeLoops.map((loop) => (
              <li key={loop.id}>
                <Link
                  href={`/open-loops?loop=${loop.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-surface-border p-3 hover:bg-surface"
                >
                  <div>
                    <p className="text-sm font-medium text-accent">{loop.title}</p>
                    <p className="text-xs text-accent/50">Due {loop.dueDate ?? "—"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={loop.priority} />
                    <StatusBadge status={loop.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 className="mb-3 text-sm font-semibold text-accent">
          Documentation History <span className="text-accent/40">({documentation.length})</span>
        </h2>
        {documentation.length === 0 ? (
          <p className="text-sm text-accent/50">No documentation saved yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {documentation.map((entry) => (
              <li key={entry.id}>
                <Link
                  href="/clinical-documentation/history"
                  className="flex flex-col gap-1 rounded-lg border border-surface-border p-3 hover:bg-surface"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-accent">
                      {getTemplateById(entry.templateId).label}
                    </p>
                    <span className="text-xs text-accent/50">{formatTimelineTimestamp(entry.timestamp)}</span>
                  </div>
                  <p className="truncate text-xs text-accent/60">{entry.noteText}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 className="mb-3 text-sm font-semibold text-accent">
          Workflow History <span className="text-accent/40">({workflowRuns.length})</span>
        </h2>
        {workflowRuns.length === 0 ? (
          <p className="text-sm text-accent/50">No workflows started yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {workflowRuns.map((run) => {
              const definition = getWorkflowDefinition(run.workflowId);
              return (
                <li key={run.id}>
                  <Link
                    href={`/workflow-wizard/${run.workflowId}?run=${run.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-surface-border p-3 hover:bg-surface"
                  >
                    <p className="text-sm font-medium text-accent">{definition.title}</p>
                    <span className="text-xs font-semibold capitalize text-accent/60">
                      {run.status.replace("_", " ")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 className="mb-3 text-sm font-semibold text-accent">Activity Timeline</h2>
        {timeline.length === 0 ? (
          <p className="text-sm text-accent/50">No activity recorded yet.</p>
        ) : (
          <ol className="flex flex-col gap-2 border-l-2 border-surface-border pl-4">
            {timeline.map((entry) => (
              <li key={`${entry.kind}-${entry.id}`}>
                <Link href={entry.href} className="block rounded-lg p-2 hover:bg-surface">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-accent/50">
                    <span>{formatTimelineTimestamp(entry.timestamp)}</span>
                    <span>&middot; {entry.performedBy}</span>
                  </div>
                  <p className="text-sm text-accent">{entry.summary}</p>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
