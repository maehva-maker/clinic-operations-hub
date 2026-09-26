"use client";

// components/directory/ClinicDirectoryView.tsx
// Search + category filter over every clinic contact, favorites sorted
// first. Selecting a card opens the Drawer with full detail (address, notes,
// Communication Log) and copy actions for every contact method.

import { useState } from "react";
import Link from "next/link";
import { Search, Phone, Printer, Mail, MapPin, Stethoscope } from "lucide-react";
import { useClinicDirectory } from "@/hooks/use-clinic-directory";
import { ClinicContactCard } from "@/components/directory/ClinicContactCard";
import { CopyButton } from "@/components/directory/CopyButton";
import { CommunicationLogList } from "@/components/directory/CommunicationLogList";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Toast, type ToastMessage } from "@/components/ui/Toast";
import type { ClinicContact, ClinicContactCategory } from "@/types";

const CATEGORY_OPTIONS: { value: ClinicContactCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "sleep_labs", label: "Sleep Labs" },
  { value: "dme_suppliers", label: "DME Suppliers" },
  { value: "laboratories", label: "Laboratories" },
  { value: "insurance_portals", label: "Insurance Portals" },
  { value: "referral_offices", label: "Referral Offices" },
  { value: "internal_contacts", label: "Internal Contacts" },
];

export function ClinicDirectoryView() {
  const {
    contacts,
    isLoading,
    search,
    setSearch,
    category,
    setCategory,
    isFavoriteContact,
    toggleFavoriteContact,
  } = useClinicDirectory();
  const [activeContact, setActiveContact] = useState<ClinicContact | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  function handleCopy(label: string, success: boolean) {
    setToast({
      id: Date.now(),
      text: success ? `Copied ${label}.` : `Couldn't copy ${label}.`,
      tone: success ? "success" : "error",
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-accent">Clinic Directory</h1>
          <p className="text-sm text-accent/60">
            Sleep labs, DME suppliers, laboratories, insurance portals, referral offices, and internal contacts.
          </p>
        </div>
        <Link
          href="/directory/providers"
          className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-2 text-sm font-semibold text-accent hover:bg-surface"
        >
          <Stethoscope className="h-4 w-4" aria-hidden="true" />
          Provider Directory
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-accent/40"
            aria-hidden="true"
          />
          <Input
            label="Search contacts"
            hideLabel
            placeholder="Search by name…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          label="Category"
          hideLabel
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(event) => setCategory(event.target.value as typeof category)}
          className="sm:w-56"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-accent/60">Loading contacts…</p>
      ) : contacts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-surface-border p-8 text-center text-sm text-accent/50">
          No contacts match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <ClinicContactCard
              key={contact.id}
              contact={contact}
              isFavorite={isFavoriteContact(contact.id)}
              onToggleFavorite={() => toggleFavoriteContact(contact)}
              onOpen={() => setActiveContact(contact)}
              onCopy={handleCopy}
            />
          ))}
        </div>
      )}

      <Drawer isOpen={activeContact !== null} onClose={() => setActiveContact(null)} title={activeContact?.name ?? ""}>
        {activeContact && (
          <div className="flex flex-col gap-5">
            <div className="space-y-2 text-sm text-accent/80">
              {activeContact.phone && (
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-accent/40" aria-hidden="true" />
                    {activeContact.phone}
                  </span>
                  <CopyButton value={activeContact.phone} label="phone" onCopied={handleCopy} />
                </div>
              )}
              {activeContact.fax && (
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <Printer className="h-4 w-4 text-accent/40" aria-hidden="true" />
                    {activeContact.fax}
                  </span>
                  <CopyButton value={activeContact.fax} label="fax" onCopied={handleCopy} />
                </div>
              )}
              {activeContact.email && (
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-accent/40" aria-hidden="true" />
                    {activeContact.email}
                  </span>
                  <CopyButton value={activeContact.email} label="email" onCopied={handleCopy} />
                </div>
              )}
              {activeContact.address && (
                <div className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent/40" aria-hidden="true" />
                  <span>{activeContact.address}</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent/50">Notes</h3>
              <p className="text-sm text-accent/80">{activeContact.notes}</p>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent/50">
                Communication Log
              </h3>
              <CommunicationLogList entries={activeContact.communicationLog} />
            </div>
          </div>
        )}
      </Drawer>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
