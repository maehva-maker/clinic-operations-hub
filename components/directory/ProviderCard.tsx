import Link from "next/link";
import { Star, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getWorkflowDefinition } from "@/lib/constants/workflow-definitions";
import type { Provider } from "@/types";

interface ProviderCardProps {
  provider: Provider;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ProviderCard({ provider, isFavorite, onToggleFavorite }: ProviderCardProps) {
  return (
    <div id={provider.id} className="flex flex-col gap-3 rounded-card border border-surface-border bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-accent">{provider.name}</p>
          <p className="text-xs text-accent/60">{provider.specialty}</p>
        </div>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Unpin ${provider.name}` : `Pin ${provider.name}`}
          className="shrink-0 rounded-md p-1 text-accent/40 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          <Star className={cn("h-4 w-4", isFavorite && "fill-warning text-warning")} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-accent/60">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        {provider.clinicDays.join(", ")}
      </div>

      <p className="text-sm text-accent/80">{provider.notes}</p>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-accent/50">Related Workflows</p>
        <div className="flex flex-wrap gap-1.5">
          {provider.relatedWorkflowIds.map((workflowId) => {
            const definition = getWorkflowDefinition(workflowId);
            return (
              <Link
                key={workflowId}
                href={`/sop/workflows/${workflowId}`}
                className="rounded-pill border border-secondary/30 bg-secondary-light px-2.5 py-1 text-xs font-medium text-secondary-dark hover:bg-secondary/20"
              >
                {definition.title}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
