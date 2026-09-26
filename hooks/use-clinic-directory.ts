"use client";

// hooks/use-clinic-directory.ts
// Backs both the Clinic Directory and Provider Directory pages: loads
// contacts/providers once, filters by search + category, and sorts pinned
// favorites first using the shared useContactFavorites() pin state.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  filterContacts,
  getClinicContacts,
  getProviders,
  sortContactsByFavorite,
} from "@/services/directory.service";
import { useContactFavorites } from "@/hooks/use-contact-favorites";
import type { ClinicContact, ClinicContactCategory, Provider } from "@/types";

interface UseClinicDirectoryResult {
  contacts: ClinicContact[];
  isLoading: boolean;
  search: string;
  setSearch: (value: string) => void;
  category: ClinicContactCategory | "all";
  setCategory: (value: ClinicContactCategory | "all") => void;
  isFavoriteContact: (contactId: string) => boolean;
  toggleFavoriteContact: (contact: ClinicContact) => void;
  refresh: () => Promise<void>;
}

export function useClinicDirectory(): UseClinicDirectoryResult {
  const [allContacts, setAllContacts] = useState<ClinicContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ClinicContactCategory | "all">("all");
  const { isFavorite, toggleFavorite } = useContactFavorites();

  const load = useCallback(async () => {
    setIsLoading(true);
    const result = await getClinicContacts();
    setAllContacts(result);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const isFavoriteContact = useCallback(
    (contactId: string) => isFavorite("clinic_contact", contactId),
    [isFavorite],
  );

  const toggleFavoriteContact = useCallback(
    (contact: ClinicContact) =>
      toggleFavorite({
        kind: "clinic_contact",
        id: contact.id,
        name: contact.name,
        href: `/directory#${contact.id}`,
      }),
    [toggleFavorite],
  );

  const filtered = useMemo(
    () => filterContacts(allContacts, search, category),
    [allContacts, search, category],
  );

  const contacts = useMemo(
    () => sortContactsByFavorite(filtered, isFavorite, "clinic_contact"),
    [filtered, isFavorite],
  );

  return {
    contacts,
    isLoading,
    search,
    setSearch,
    category,
    setCategory,
    isFavoriteContact,
    toggleFavoriteContact,
    refresh: load,
  };
}

interface UseProviderDirectoryResult {
  providers: Provider[];
  isLoading: boolean;
  isFavoriteProvider: (providerId: string) => boolean;
  toggleFavoriteProvider: (provider: Provider) => void;
}

export function useProviderDirectory(): UseProviderDirectoryResult {
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useContactFavorites();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    void getProviders().then((result) => {
      if (isMounted) {
        setAllProviders(result);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const isFavoriteProvider = useCallback(
    (providerId: string) => isFavorite("provider", providerId),
    [isFavorite],
  );

  const toggleFavoriteProvider = useCallback(
    (provider: Provider) =>
      toggleFavorite({
        kind: "provider",
        id: provider.id,
        name: provider.name,
        href: `/directory/providers#${provider.id}`,
      }),
    [toggleFavorite],
  );

  const providers = useMemo(
    () => sortContactsByFavorite(allProviders, isFavorite, "provider"),
    [allProviders, isFavorite],
  );

  return { providers, isLoading, isFavoriteProvider, toggleFavoriteProvider };
}
