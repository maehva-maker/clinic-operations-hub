"use client";

// hooks/use-auth.ts
// Thin wrapper around services/auth.service.ts that also manages the
// in-flight submit state for the Login form.

import { useCallback, useState } from "react";
import { signIn, type LoginCredentials } from "@/services/auth.service";

interface UseAuthResult {
  submit: (credentials: LoginCredentials) => Promise<boolean>;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export function useAuth(): UseAuthResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = useCallback(async (credentials: LoginCredentials) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await signIn(credentials);
      if (!result.success) {
        setErrorMessage(result.errorMessage ?? "Unable to sign in.");
        return false;
      }
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting, errorMessage };
}
