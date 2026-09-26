// components/open-loops/QuickActionsBar.tsx
// The six Quick Actions from the Open Loop Detail drawer. Each button opens
// the modal that owns that action's fields — this component only renders the
// triggers, it holds no state of its own.

import { Phone, Printer, Mail, FileText, ArrowRightLeft, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type QuickAction =
  | "documentation"
  | "call"
  | "fax"
  | "email"
  | "change_status"
  | "set_follow_up";

interface QuickActionsBarProps {
  onSelect: (action: QuickAction) => void;
}

const ACTIONS: { action: QuickAction; label: string; icon: typeof Phone }[] = [
  { action: "documentation", label: "Add Documentation", icon: FileText },
  { action: "call", label: "Log Call", icon: Phone },
  { action: "fax", label: "Upload Fax", icon: Printer },
  { action: "email", label: "Send Email Record", icon: Mail },
  { action: "change_status", label: "Change Status", icon: ArrowRightLeft },
  { action: "set_follow_up", label: "Set Follow-up Date", icon: CalendarClock },
];

export function QuickActionsBar({ onSelect }: QuickActionsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ACTIONS.map(({ action, label, icon: Icon }) => (
        <Button
          key={action}
          type="button"
          variant="secondary"
          className="justify-start"
          onClick={() => onSelect(action)}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{label}</span>
        </Button>
      ))}
    </div>
  );
}
