import type { Metadata } from "next";
import { ClinicalDocumentationView } from "@/components/documentation/ClinicalDocumentationView";
import { DOCUMENTATION_TEMPLATES } from "@/lib/constants/documentation-templates";
import type { DocumentationTemplateId } from "@/types";

export const metadata: Metadata = { title: "Clinical Documentation" };

interface ClinicalDocumentationPageProps {
  // Phase 10: patients no longer live in a static mock array, so linking
  // here from a Patient Profile now passes the name straight through
  // (components/patients/PatientQuickActions.tsx) instead of an id this
  // server component would otherwise need a Supabase lookup to resolve.
  searchParams: Promise<{ template?: string; patientName?: string }>;
}

function isDocumentationTemplateId(value: string | undefined): value is DocumentationTemplateId {
  return Boolean(value) && DOCUMENTATION_TEMPLATES.some((template) => template.id === value);
}

export default async function ClinicalDocumentationPage({ searchParams }: ClinicalDocumentationPageProps) {
  const { template, patientName } = await searchParams;
  const initialTemplateId = isDocumentationTemplateId(template) ? template : undefined;
  const initialPatientName = patientName || undefined;

  return (
    <ClinicalDocumentationView
      initialTemplateId={initialTemplateId}
      initialPatientName={initialPatientName}
    />
  );
}
