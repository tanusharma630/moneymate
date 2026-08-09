/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        "surface-hi": "var(--color-surface-hi)",
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
        accent: {
          DEFAULT: "#6E7BF2",
          soft: "rgba(110,123,242,0.14)",
          line: "rgba(110,123,242,0.35)",
          2: "#9C8CF9",
        },
        success: {
          DEFAULT: "#3ED9A4",
          soft: "rgba(62,217,164,0.12)",
        },
        danger: {
          DEFAULT: "#FF6B7A",
          soft: "rgba(255,107,122,0.12)",
        },
        warning: {
          DEFAULT: "#F0B65E",
          soft: "rgba(240,182,94,0.12)",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        card: "14px",
        chip: "10px",
      },
      spacing: {
        18: "4.5rem",
      },
      boxShadow: {
        elevate: "0 14px 28px -18px rgba(0,0,0,0.55)",
        glow: "0 16px 36px -16px rgba(110,123,242,0.38)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "100% 0" },
          "100%": { backgroundPosition: "-100% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s ease infinite",
      },
    },
  },
  plugins: [],
};
