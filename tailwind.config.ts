import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens — see claude/phase2-wireframes.md "Design System" section
        primary: {
          DEFAULT: "#5B7F5E", // Sage Green
          light: "#EEF3ED",
          dark: "#42603F",
        },
        secondary: {
          DEFAULT: "#2E8B8B", // Teal
          light: "#E6F4F4",
          dark: "#1F6363",
        },
        surface: {
          DEFAULT: "#F5F6F5", // Light Gray
          border: "#E3E6E2",
        },
        accent: {
          DEFAULT: "#1F2A44", // Navy
        },
        success: {
          DEFAULT: "#2E9E5B",
          light: "#E7F6ED",
        },
        warning: {
          DEFAULT: "#C98A1E",
          light: "#FBF1DF",
        },
        critical: {
          DEFAULT: "#C15B5B",
          light: "#FBEBEB",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "12px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(31, 42, 68, 0.06), 0 1px 3px 0 rgba(31, 42, 68, 0.08)",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
