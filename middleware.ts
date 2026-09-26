// middleware.ts
// Root Next.js middleware: every request (except static assets) is routed
// through updateSession(), which refreshes the Supabase session cookie and
// redirects unauthenticated requests away from protected pages — this is
// the "middleware session refresh" and "protected routes" pieces of Phase
// 10's Authentication requirement.

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match every request path except:
     * - _next/static, _next/image (build assets)
     * - favicon.ico and other files with an extension (images, fonts, etc.)
     * - manifest.webmanifest and sw.js — the PWA manifest and service worker
     *   must be fetchable without an auth redirect, or the browser can never
     *   install the app or register offline caching in the first place.
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
