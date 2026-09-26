import { Inbox } from "lucide-react";

interface OpenLoopEmptyStateProps {
  message: string;
}

export function OpenLoopEmptyState({ message }: OpenLoopEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-surface-border bg-white px-6 py-16 text-center">
      <Inbox className="mb-3 h-8 w-8 text-accent/30" aria-hidden="true" />
      <p className="text-sm text-accent/60">{message}</p>
    </div>
  );
}
