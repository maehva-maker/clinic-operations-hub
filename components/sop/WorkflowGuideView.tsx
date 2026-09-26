"use client";

// components/sop/WorkflowGuideView.tsx
// Page 2 — Workflow Guide article. Entirely rendered from the composed
// WorkflowGuideArticle (services/sop.service.ts) — nothing here is
// per-workflow markup, so a 13th workflow needs only new data, not a new
// component.

import { useEffect } from "react";
import Link from "next/link";
import { Wand2, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { QuickReferenceCard } from "@/components/sop/QuickReferenceCard";
import { CommonMistakeCard } from "@/components/sop/CommonMistakeCard";
import { FavoriteButton } from "@/components/sop/FavoriteButton";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { getWorkflowGuideArticle, findSoftwareGuideByTitle } from "@/services/sop.service";
import type { WorkflowDefinitionId } from "@/types";

interface WorkflowGuideViewProps {
  workflowId: WorkflowDefinitionId;
}

export function WorkflowGuideView({ workflowId }: WorkflowGuideViewProps) {
  const article = getWorkflowGuideArticle(workflowId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { recordView } = useRecentlyViewed();
  const href = `/sop/workflows/${article.id}`;

  useEffect(() => {
    recordView({ kind: "workflow_guide", id: article.id, title: article.title, href });
    // Only re-record if the article itself changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.id]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={article.title}
        description={article.purpose}
        action={
          <FavoriteButton
            isFavorite={isFavorite("workflow_guide", article.id)}
            onToggle={() => toggleFavorite({ kind: "workflow_guide", id: article.id, title: article.title, href })}
            label={article.title}
          />
        }
      />

      <QuickReferenceCard quickReference={article.quickReference} />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href={`/workflow-wizard/${article.id}`}>
          <Button type="button">
            <Wand2 className="h-4 w-4" aria-hidden="true" />
            Open in Workflow Wizard
          </Button>
        </Link>
        <Link href={`/clinical-documentation?template=${article.documentationTemplateId}`}>
          <Button type="button" variant="secondary">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Open in Clinical Documentation
          </Button>
        </Link>
      </div>

      <section aria-labelledby="when-to-use-heading" className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 id="when-to-use-heading" className="text-sm font-semibold text-accent">When to Use</h2>
        <p className="mt-1 text-sm text-accent/80">{article.whenToUse}</p>
      </section>

      <section aria-labelledby="required-fields-heading" className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 id="required-fields-heading" className="text-sm font-semibold text-accent">Required Fields</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-accent/80">
          {article.requiredFields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="step-by-step-heading" className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 id="step-by-step-heading" className="text-sm font-semibold text-accent">Step-by-Step Guide</h2>
        <ol className="mt-2 flex flex-col gap-3">
          {article.steps.map((step, index) => (
            <li key={step.id} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary-dark">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-accent">{step.label}</p>
                <p className="text-sm text-accent/70">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="common-mistakes-heading" className="flex flex-col gap-3">
        <h2 id="common-mistakes-heading" className="text-sm font-semibold text-accent">Common Mistakes</h2>
        <div className="flex flex-col gap-2">
          {article.commonMistakes.map((mistake) => (
            <CommonMistakeCard key={mistake} mistake={mistake} />
          ))}
        </div>
      </section>

      <section aria-labelledby="documentation-example-heading" className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 id="documentation-example-heading" className="text-sm font-semibold text-accent">Documentation Example</h2>
        <p className="mt-2 whitespace-pre-wrap rounded-lg bg-surface p-3 text-xs text-accent/70">
          {article.documentationExample}
        </p>
      </section>

      <section aria-labelledby="related-software-heading" className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 id="related-software-heading" className="text-sm font-semibold text-accent">Related Software</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {article.relatedSoftware.map((softwareTitle) => {
            const guide = findSoftwareGuideByTitle(softwareTitle);
            if (!guide) {
              return (
                <span key={softwareTitle} className="rounded-pill border border-surface-border px-3 py-1.5 text-xs font-semibold text-accent/60">
                  {softwareTitle}
                </span>
              );
            }
            return (
              <Link
                key={softwareTitle}
                href={`/sop/software/${guide.id}`}
                className="rounded-pill border border-secondary px-3 py-1.5 text-xs font-semibold text-secondary-dark hover:bg-secondary-light"
              >
                {softwareTitle}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
