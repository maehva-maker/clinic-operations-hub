// components/dashboard/WidgetEmptyState.tsx
// Shared empty-state text treatment for every list-widget, so "nothing here"
// always reads the same way across the Dashboard.

interface WidgetEmptyStateProps {
  message: string;
}

export function WidgetEmptyState({ message }: WidgetEmptyStateProps) {
  return <p className="text-sm text-accent/50">{message}</p>;
}
