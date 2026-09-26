import Link from "next/link";
import { UserRound, Phone, FileText, ListChecks } from "lucide-react";
import type { Patient } from "@/types";

interface PatientQuickActionsProps {
  patient: Patient;
}

/**
 * Open Profile / Call / Create Documentation / View Open Loops — shown on
 * every Patient Directory card and repeated in the Patient Snapshot on the
 * Profile page itself.
 */
export function PatientQuickActions({ patient }: PatientQuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 border-t border-surface-border pt-3">
      <Link
        href={`/patients/${patient.id}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-surface"
      >
        <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
        Profile
      </Link>
      <a
        href={`tel:${patient.phone.replace(/[^\d+]/g, "")}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-surface"
      >
        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
        Call
      </a>
      <Link
        href={`/clinical-documentation?patientName=${encodeURIComponent(patient.name)}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-surface"
      >
        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
        Document
      </Link>
      <Link
        href={`/open-loops?search=${encodeURIComponent(patient.name)}&domain=${patient.program}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-surface"
      >
        <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
        Open Loops
      </Link>
    </div>
  );
}
