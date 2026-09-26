"use client";

// hooks/use-current-user.ts
// The signed-in user's id/email for the Top Navigation's user menu, kept in
// sync with Supabase's own auth state (so a sign-out in one tab is reflected
// without a manual refresh).

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CurrentUser } from "@/services/auth.service";

export function useCurrentUser(): { user: CurrentUser | null; isLoading: boolean } {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      setUser(data.user ? { id: data.user.id, email: data.user.email ?? null } : null);
      setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? null } : null);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
}
