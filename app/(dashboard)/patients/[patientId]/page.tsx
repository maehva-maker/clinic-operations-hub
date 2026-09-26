import type { Metadata } from "next";
import { PatientProfileView } from "@/components/patients/PatientProfileView";

// Phase 10: patients now live in a real, mutable `patients` Supabase table
// rather than a fixed mock array, so this route can no longer be statically
// generated for a known set of ids (generateStaticParams removed — the route
// is dynamic) and the page title can't be resolved from a synchronous mock
// lookup at request time without a server-side Supabase call. The generic
// title below is a deliberate, documented simplification; the actual
// patient's name still appears immediately in the page body via
// PatientProfileView's own client-side fetch.
interface PatientProfilePageProps {
  params: Promise<{ patientId: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Patient Profile" };
}

export default async function PatientProfilePage({ params }: PatientProfilePageProps) {
  const { patientId } = await params;
  return <PatientProfileView patientId={patientId} />;
}
