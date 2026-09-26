"use client";

// components/documentation/ClinicalDocumentationView.tsx
// Page 1 — Clinical Documentation. Three-panel workspace (templates / form /
// live preview + help) that stacks vertically on mobile. This page is
// documentation only — it never touches the EMR itself, it only generates
// text a person copies into PracticeQ or saves to an Open Loop's timeline.

import { useCallback, useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Toast, type ToastMessage } from "@/components/ui/Toast";
import { TemplateSidebar } from "@/components/documentation/TemplateSidebar";
import { DocumentationForm } from "@/components/documentation/DocumentationForm";
import { EmrPreviewPanel } from "@/components/documentation/EmrPreviewPanel";
import { BeginnerAssistantPanel } from "@/components/documentation/BeginnerAssistantPanel";
import { useDocumentationForm } from "@/hooks/use-documentation-form";
import { getTemplateById } from "@/lib/constants/documentation-templates";
import type { DocumentationTemplateId } from "@/types";

interface ClinicalDocumentationViewProps {
  /** Deep-linked from a Workflow Guide's "Open in Clinical Documentation" button. */
  initialTemplateId?: DocumentationTemplateId;
  /** Deep-linked from a Patient Profile/Directory's "Document" quick action. */
  initialPatientName?: string;
}

export function ClinicalDocumentationView({
  initialTemplateId,
  initialPatientName,
}: ClinicalDocumentationViewProps) {
  const form = useDocumentationForm(initialTemplateId, initialPatientName);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const template = getTemplateById(form.selectedTemplateId);

  const showToast = useCallback((text: string, tone: ToastMessage["tone"]) => {
    setToast({ id: Date.now(), text, tone });
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(form.previewText);
      showToast("Copied to clipboard.", "success");
    } catch {
      showToast("Couldn't copy — select and copy the text manually.", "error");
    }
  }, [form.previewText, showToast]);

  const handleSave = useCallback(async () => {
    const entry = await form.save();
    if (entry) {
      showToast("Saved to Activity Timeline.", "success");
    } else {
      showToast("Fill in the required fields before saving.", "error");
    }
  }, [form, showToast]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clinical Documentation"
        description="Generate PracticeQ-ready notes and log them straight to the Activity Timeline. This is documentation only — it is not the EMR."
        action={
          <Link href="/clinical-documentation/history">
            <Button variant="secondary">
              <History className="h-4 w-4" aria-hidden="true" />
              View History
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr_320px]">
        <aside aria-label="Documentation templates" className="rounded-card border border-surface-border bg-white p-4 shadow-card lg:order-1">
          <TemplateSidebar
            templates={form.filteredTemplates}
            selectedTemplateId={form.selectedTemplateId}
            onSelectTemplate={form.selectTemplate}
            categoryFilter={form.categoryFilter}
            onCategoryFilterChange={form.setCategoryFilter}
            search={form.templateSearch}
            onSearchChange={form.setTemplateSearch}
          />
        </aside>

        <main className="rounded-card border border-surface-border bg-white p-5 shadow-card lg:order-2">
          <DocumentationForm
            template={template}
            common={form.common}
            onCommonChange={form.updateCommon}
            fieldValues={form.fieldValues}
            onFieldChange={form.updateField}
            missingFieldLabels={form.missingFieldLabels}
          />
        </main>

        <div className="flex flex-col gap-6 lg:order-3">
          <div className="rounded-card border border-surface-border bg-white p-5 shadow-card">
            <EmrPreviewPanel
              previewText={form.previewText}
              isValid={form.isValid}
              missingFieldLabels={form.missingFieldLabels}
              isSaving={form.isSaving}
              onCopy={handleCopy}
              onSave={handleSave}
              relatedOpenLoopId={form.relatedOpenLoopId}
              onRelatedOpenLoopChange={form.setRelatedOpenLoopId}
              openLoopOptions={form.openLoopOptions}
            />
          </div>

          <BeginnerAssistantPanel template={template} />
        </div>
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
