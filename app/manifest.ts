import type { MetadataRoute } from "next";

// app/manifest.ts
// Next.js's native manifest route convention — this file is served
// automatically at /manifest.webmanifest with no extra routing or build
// config, and works unchanged on Vercel. Icons/colors below reuse the exact
// mark and Sage/Teal tokens already in tailwind.config.ts (see
// claude/phase2-wireframes.md "Design System") so the installed app icon and
// splash background match the in-app UI exactly.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clinic Operations Hub",
    short_name: "Clinic Hub",
    description:
      "A Healthcare Virtual Assistant operating system for a Sleep Medicine & Weight Management clinic — track open loops, generate documentation, and learn clinic workflows in one place.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#FFFFFF",
    theme_color: "#5B7F5E",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
