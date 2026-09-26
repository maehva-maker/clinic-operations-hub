import type { Metadata } from "next";
import { PatientDirectoryView } from "@/components/patients/PatientDirectoryView";

export const metadata: Metadata = { title: "Patient Directory" };

export default function PatientDirectoryPage() {
  return <PatientDirectoryView />;
}
