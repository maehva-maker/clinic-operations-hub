import type { Metadata } from "next";
import { ClinicDirectoryView } from "@/components/directory/ClinicDirectoryView";

export const metadata: Metadata = { title: "Clinic Directory" };

export default function ClinicDirectoryPage() {
  return <ClinicDirectoryView />;
}
