// lib/supabase/client.ts
// The browser Supabase client — one instance, reused by every hook and
// service that runs client-side (which, per the Phase 10 build notes, is
// still all of them: the app keeps its existing hook/service architecture
// rather than moving data-fetching into Server Components). Every request
// this client makes carries the signed-in user's session cookie, so Row
// Level Security (not application code) is what scopes every query to that
// user's own rows.

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return browserClient;
}
