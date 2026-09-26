// lib/supabase/server.ts
// The server-side Supabase client — for Server Components, Route Handlers,
// and Server Actions, where cookies come from Next.js's `cookies()` rather
// than the browser. Used by the login/logout Server Actions and by any
// Server Component that needs to know who's signed in (e.g. the root
// dashboard layout's auth check as a defense-in-depth alongside middleware).
//
// A fresh client is created per request (never module-level cached, unlike
// the browser client) because it closes over that request's cookies.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component render, where cookies can't be
            // written — middleware's own setAll (below) already refreshes
            // the session on every request, so this is safe to ignore.
          }
        },
      },
    },
  );
}
