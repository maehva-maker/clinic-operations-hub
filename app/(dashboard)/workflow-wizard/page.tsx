import type { Metadata } from "next";
import { WorkflowWizardHomeView } from "@/components/workflow/WorkflowWizardHomeView";

export const metadata: Metadata = { title: "Workflow Wizard" };

export default function WorkflowWizardPage() {
  return <WorkflowWizardHomeView />;
}
