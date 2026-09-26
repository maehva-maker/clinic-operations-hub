// lib/constants/providers.ts

export const PROVIDERS = ["Dr. Pegah Mashayekhi, MD", "Donna Seo, PA"] as const;

export type Provider = (typeof PROVIDERS)[number];
