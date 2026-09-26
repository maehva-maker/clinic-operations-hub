"use client";

// components/directory/ClinicContactCard.tsx
// One card per clinic contact in the Clinic Directory list. Clicking it
// opens the full-detail Drawer (name/address/notes/communication log); the
// phone/fax/email rows each carry their own CopyButton so a common lookup
// doesn't require opening the drawer at all.

import { Star, Phone, Printer, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CopyButton } from "@/components/directory/CopyButton";
import type { ClinicContact } from "@/types";

const CATEGORY_LABEL: Record<ClinicContact["category"], string> = {
  sleep_labs: "Sleep Lab",
  dme_suppliers: "DME Supplier",
  laboratories: "Laboratory",
  insurance_portals: "Insurance Portal",
  referral_offices: "Referral Office",
  internal_contacts: "Internal Contact",
};

interface ClinicContactCardProps {
  contact: ClinicContact;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
  onCopy: (label: string, success: boolean) => void;
}

export function ClinicContactCard({
  contact,
  isFavorite,
  onToggleFavorite,
  onOpen,
  onCopy,
}: ClinicContactCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-surface-border bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          <p className="truncate text-sm font-semibold text-accent">{contact.name}</p>
          <p className="text-xs text-accent/60">{CATEGORY_LABEL[contact.category]}</p>
        </button>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Unpin ${contact.name}` : `Pin ${contact.name}`}
          className="shrink-0 rounded-md p-1 text-accent/40 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          <Star className={cn("h-4 w-4", isFavorite && "fill-warning text-warning")} aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-1.5 text-sm text-accent/80">
        {contact.phone && (
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0 text-accent/40" aria-hidden="true" />
              <span className="truncate">{contact.phone}</span>
            </span>
            <CopyButton value={contact.phone} label={`${contact.name} phone`} onCopied={onCopy} />
          </div>
        )}
        {contact.fax && (
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <Printer className="h-3.5 w-3.5 shrink-0 text-accent/40" aria-hidden="true" />
              <span className="truncate">{contact.fax}</span>
            </span>
            <CopyButton value={contact.fax} label={`${contact.name} fax`} onCopied={onCopy} />
          </div>
        )}
        {contact.email && (
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 shrink-0 text-accent/40" aria-hidden="true" />
              <span className="truncate">{contact.email}</span>
            </span>
            <CopyButton value={contact.email} label={`${contact.name} email`} onCopied={onCopy} />
          </div>
        )}
        {contact.address && (
          <div className="flex items-start gap-1.5 pt-0.5 text-xs text-accent/60">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{contact.address}</span>
          </div>
        )}
      </div>
    </div>
  );
}
