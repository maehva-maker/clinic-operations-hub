"use client";

// components/sop/SoftwareGuideView.tsx
// Page 3 — Software Academy article. Same shell pattern as WorkflowGuideView
// (Quick Reference, Favorite, Recently Viewed) applied to standalone
// software content instead of a composed workflow article.

import { useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuickReferenceCard } from "@/components/sop/QuickReferenceCard";
import { CommonMistakeCard } from "@/components/sop/CommonMistakeCard";
import { FavoriteButton } from "@/components/sop/FavoriteButton";
import { RelatedWorkflowsList } from "@/components/sop/RelatedWorkflowsList";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { getSoftwareGuide } from "@/services/sop.service";
import type { SoftwareId } from "@/types";

interface SoftwareGuideViewProps {
  softwareId: SoftwareId;
}

export function SoftwareGuideView({ softwareId }: SoftwareGuideViewProps) {
  const guide = getSoftwareGuide(softwareId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { recordView } = useRecentlyViewed();
  const href = `/sop/software/${guide.id}`;

  useEffect(() => {
    recordView({ kind: "software_guide", id: guide.id, title: guide.title, href });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guide.id]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={guide.title}
        description={guide.whatIsIt}
        action={
          <FavoriteButton
            isFavorite={isFavorite("software_guide", guide.id)}
            onToggle={() => toggleFavorite({ kind: "software_guide", id: guide.id, title: guide.title, href })}
            label={guide.title}
          />
        }
      />

      <QuickReferenceCard quickReference={guide.quickReference} />

      <section aria-labelledby="when-to-use-heading" className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 id="when-to-use-heading" className="text-sm font-semibold text-accent">When Do I Use It?</h2>
        <p className="mt-1 text-sm text-accent/80">{guide.whenToUseIt}</p>
      </section>

      <section aria-labelledby="navigation-heading" className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 id="navigation-heading" className="text-sm font-semibold text-accent">Navigation Walkthrough</h2>
        <ol className="mt-2 flex flex-col gap-3">
          {guide.navigationSteps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-light text-xs font-semibold text-secondary-dark">
                {index + 1}
              </span>
              <p className="text-sm text-accent/80">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="required-fields-heading" className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 id="required-fields-heading" className="text-sm font-semibold text-accent">Required Fields</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-accent/80">
          {guide.requiredFields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="common-mistakes-heading" className="flex flex-col gap-3">
        <h2 id="common-mistakes-heading" className="text-sm font-semibold text-accent">Common Mistakes</h2>
        <div className="flex flex-col gap-2">
          {guide.commonMistakes.map((mistake) => (
            <CommonMistakeCard key={mistake} mistake={mistake} />
          ))}
        </div>
      </section>

      <section aria-labelledby="time-saving-heading" className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 id="time-saving-heading" className="text-sm font-semibold text-accent">Time-Saving Tips</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-accent/80">
          {guide.timeSavingTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="related-workflows-heading" className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 id="related-workflows-heading" className="text-sm font-semibold text-accent">Related Workflows</h2>
        <div className="mt-2">
          <RelatedWorkflowsList workflowIds={guide.relatedWorkflowIds} />
        </div>
      </section>
    </div>
  );
}
