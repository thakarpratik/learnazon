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
        baloo:  ["var(--font-baloo)", "sans-serif"],
        comic:  ["var(--font-comic)", "sans-serif"],
      },
      colors: {
        brand: {
          // Core palette
          indigo:        "#4F46E5",
          "indigo-soft":  "#818CF8",
          "indigo-light": "#EEF2FF",
          "indigo-dark":  "#3730A3",
          orange:        "#F97316",
          "orange-light": "#FFF7ED",
          "orange-dark":  "#EA6C0A",
          // Accent modules
          coral:   "#FF6B6B",
          mint:    "#34D399",
          sky:     "#38BDF8",
          violet:  "#A78BFA",
          amber:   "#FBBF24",
          rose:    "#FB7185",
          // Neutrals
          bg:      "#EEF2FF",
          surface: "#FFFFFF",
          text:    "#1E1B4B",
          muted:   "#6B7280",
          border:  "#C7D2FE",
        },
      },
      borderRadius: {
        clay: "20px",
        btn:  "50px",
        xl2:  "24px",
      },
      boxShadow: {
        // Claymorphism: outer + inner glow
        clay:    "0 6px 0px rgba(0,0,0,0.12), 0 2px 12px rgba(79,70,229,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
        "clay-hover": "0 10px 0px rgba(0,0,0,0.12), 0 4px 20px rgba(79,70,229,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
        "clay-press": "0 2px 0px rgba(0,0,0,0.12), 0 1px 6px rgba(79,70,229,0.08), inset 0 1px 0 rgba(255,255,255,0.4)",
        card:    "0 4px 24px rgba(79,70,229,0.08)",
        "card-hover": "0 8px 40px rgba(79,70,229,0.14)",
        soft:    "0 2px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
