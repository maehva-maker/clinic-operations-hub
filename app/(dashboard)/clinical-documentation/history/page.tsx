import type { Metadata } from "next";
import { DocumentationHistoryView } from "@/components/documentation/DocumentationHistoryView";

export const metadata: Metadata = { title: "Documentation History" };

export default function DocumentationHistoryPage() {
  return <DocumentationHistoryView />;
}
