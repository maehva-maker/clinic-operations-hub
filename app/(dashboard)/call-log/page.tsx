import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = { title: "Call Log" };

export default function CallLogPage() {
  return (
    <PlaceholderPage
      title="Call Log"
      description="Every inbound and outbound patient conversation, searchable and filterable."
      phase="a later phase"
    />
  );
}
