import type { NextConfig } from "next";

// next.config.ts
// Production hardening only — no UI or routing behavior changes:
//   - poweredByHeader: false removes the `X-Powered-By: Next.js` response
//     header (avoids advertising the framework/version to the internet).
//   - headers() adds a small set of standard security headers to every
//     response. None of these affect how any page renders or routes.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
