import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// app/page.tsx
// Root route decides between /login and /dashboard based on real session
// state. In practice middleware.ts already redirects an unauthenticated
// request before it ever reaches this component — this check is
// defense-in-depth for the rare case a cached response slips through.
export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? "/dashboard" : "/login");
}
