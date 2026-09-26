import { DOMAIN_LABEL } from "@/types";
import { formatFriendlyDate } from "@/lib/utils/date";
import type { OpenLoop, Patient } from "@/types";
import { PatientQuickActions } from "@/components/patients/PatientQuickActions";

interface PatientSnapshotProps {
  patient: Patient;
  lastContactAt: string | null;
  activeOpenLoopCount: number;
  pendingFollowUp: OpenLoop | null;
}

/**
 * Sits at the top of every Patient Profile: Program Badge, Provider, Last
 * Contact, Open Loop Count, Pending Follow-up, and the same Quick Actions
 * shown on the Directory card, so the most common next steps never require
 * scrolling.
 */
export function PatientSnapshot({
  patient,
  lastContactAt,
  activeOpenLoopCount,
  pendingFollowUp,
}: PatientSnapshotProps) {
  return (
    <div className="rounded-card border border-surface-border bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-accent">{patient.name}</h1>
          <p className="text-sm text-accent/60">DOB {patient.dob} &middot; {patient.provider}</p>
        </div>
        <span className="rounded-pill bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
          {DOMAIN_LABEL[patient.program]}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-surface-border pt-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-accent/50">Last Contact</p>
          <p className="text-sm font-semibold text-accent">
            {lastContactAt ? formatFriendlyDate(lastContactAt.slice(0, 10)) : "No contact yet"}
          </p>
        </div>
        <div>
          <p className="text-xs text-accent/50">Active Open Loops</p>
          <p className="text-sm font-semibold text-accent">{activeOpenLoopCount}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-accent/50">Pending Follow-up</p>
          <p className="text-sm font-semibold text-accent">
            {pendingFollowUp ? `${pendingFollowUp.title} — due ${pendingFollowUp.dueDate}` : "None"}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-surface-border pt-4">
        <PatientQuickActions patient={patient} />
      </div>
    </div>
  );
}
