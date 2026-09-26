"use client";

// components/directory/ProviderDirectoryView.tsx
// The 2-provider Provider Directory — favorites sort first, each provider's
// Related Workflows link straight into the Workflow Guide library.

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProviderDirectory } from "@/hooks/use-clinic-directory";
import { ProviderCard } from "@/components/directory/ProviderCard";

export function ProviderDirectoryView() {
  const { providers, isLoading, isFavoriteProvider, toggleFavoriteProvider } = useProviderDirectory();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Link
          href="/directory"
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-dark hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Clinic Directory
        </Link>
        <h1 className="text-xl font-semibold text-accent">Provider Directory</h1>
        <p className="text-sm text-accent/60">Clinic providers, their schedules, and related workflows.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-accent/60">Loading providers…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              isFavorite={isFavoriteProvider(provider.id)}
              onToggleFavorite={() => toggleFavoriteProvider(provider)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
