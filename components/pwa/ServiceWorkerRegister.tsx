"use client";

// components/pwa/ServiceWorkerRegister.tsx
// Renders nothing — registers /sw.js on mount so the app is installable and
// static assets are cached offline. Split into its own client component
// (rather than inline script in the server-rendered root layout) so it
// doesn't change anything about how the layout itself renders or hydrates.

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Best-effort — a failed registration should never break the app.
    });
  }, []);

  return null;
}
