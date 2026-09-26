import type { Metadata } from "next";
import { GlossaryView } from "@/components/sop/GlossaryView";

export const metadata: Metadata = { title: "Medical Glossary" };

export default function GlossaryPage() {
  return <GlossaryView />;
}
