import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

// PWA metadata (manifest is served automatically from app/manifest.ts at
// /manifest.webmanifest — no <link> needed, Next adds it). `icons` covers the
// favicon and Apple touch icon; `appleWebApp` adds the iOS-specific
// meta tags (standalone launch, status bar style, home-screen title) Safari
// still reads instead of the manifest for some install behavior.
export const metadata: Metadata = {
  title: {
    default: "Clinic Operations Hub",
    template: "%s · Clinic Operations Hub",
  },
  description:
    "A Healthcare Virtual Assistant operating system for a Sleep Medicine & Weight Management clinic — track open loops, generate documentation, and learn clinic workflows in one place.",
  icons: {
    icon: [{ url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Clinic Hub",
  },
};

// Theme color drives the browser chrome (Chrome/Edge address bar, Android
// splash screen background) using the same Sage Green as the manifest and
// the in-app primary color — no separate value to keep in sync.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5B7F5E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
