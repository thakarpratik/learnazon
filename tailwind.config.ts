import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito:  ["var(--font-nunito)", "sans-serif"],
        fredoka: ["var(--font-fredoka)", "sans-serif"],
      },
      colors: {
        brand: {
          blue:          "#3D5AFE",
          "blue-light":  "#EEF1FF",
          "blue-dark":   "#2541E0",
          yellow:        "#FFC107",
          "yellow-light":"#FFF8E1",
          "yellow-dark": "#E6AC00",
          green:         "#00E676",
          "green-light": "#E8FFF4",
          "green-dark":  "#00C060",
          purple:        "#7C4DFF",
          "purple-light":"#F3EEFF",
          "purple-dark": "#6535E8",
          bg:            "#F5F7FA",
          text:          "#1A1A2E",
          muted:         "#6B7280",
        },
      },
      borderRadius: {
        card: "20px",
        btn:  "50px",
      },
      boxShadow: {
        fun:   "4px 4px 0px rgba(61,90,254,0.2)",
        card:  "0 4px 24px rgba(61,90,254,0.08)",
        hover: "0 8px 32px rgba(61,90,254,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
