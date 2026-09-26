import type { Metadata } from "next";
import { ProviderDirectoryView } from "@/components/directory/ProviderDirectoryView";

export const metadata: Metadata = { title: "Provider Directory" };

export default function ProviderDirectoryPage() {
  return <ProviderDirectoryView />;
}
