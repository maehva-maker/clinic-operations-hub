import Link from "next/link";
import { DOMAIN_LABEL } from "@/types";
import type { Patient } from "@/types";
import { PatientQuickActions } from "@/components/patients/PatientQuickActions";

interface PatientCardProps {
  patient: Patient;
  lastContactAt: string | null;
  activeOpenLoopCount: number;
}

export function PatientCard({ patient, lastContactAt, activeOpenLoopCount }: PatientCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-surface-border bg-white p-4 shadow-card">
      <Link
        href={`/patients/${patient.id}`}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
      >
        <p className="text-sm font-semibold text-accent">{patient.name}</p>
        <p className="text-xs text-accent/60">DOB {patient.dob}</p>
      </Link>

      <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-accent/70">
        <dt className="text-accent/50">Program</dt>
        <dd className="text-right text-accent">{DOMAIN_LABEL[patient.program]}</dd>
        <dt className="text-accent/50">Provider</dt>
        <dd className="text-right text-accent">{patient.provider}</dd>
        <dt className="text-accent/50">Phone</dt>
        <dd className="text-right text-accent">{patient.phone}</dd>
        <dt className="text-accent/50">Last Contact</dt>
        <dd className="text-right text-accent">
          {lastContactAt ? new Date(lastContactAt).toLocaleDateString("en-US") : "—"}
        </dd>
        <dt className="text-accent/50">Active Open Loops</dt>
        <dd className="text-right font-semibold text-accent">{activeOpenLoopCount}</dd>
      </dl>

      <PatientQuickActions patient={patient} />
    </div>
  );
}
