// services/auth.service.ts
// Real Supabase Auth — email/password sign-in, sign-out, and the current
// session/user lookup. This replaces the Phase 3 mock (any well-formed
// email/password combination signed in); the exported shapes are unchanged
// on purpose, so hooks/use-auth.ts and components/auth/LoginForm.tsx needed
// no changes at all.

import { createClient } from "@/lib/supabase/client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  errorMessage?: string;
}

export async function signIn({ email, password }: LoginCredentials): Promise<LoginResult> {
  if (!email || !password) {
    return { success: false, errorMessage: "Enter your email and password." };
  }
  if (!email.includes("@")) {
    return { success: false, errorMessage: "Enter a valid email address." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase's own message ("Invalid login credentials") is already
    // beginner-friendly and safe to show as-is.
    return { success: false, errorMessage: error.message };
  }

  return { success: true };
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export interface CurrentUser {
  id: string;
  email: string | null;
}

/** The signed-in user, or null. Used by the Top Navigation's user menu. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return { id: user.id, email: user.email ?? null };
}
