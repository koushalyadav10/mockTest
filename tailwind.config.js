/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9ddfd",
          300: "#7cc2fb",
          400: "#36a3f7",
          500: "#0c87eb",
          600: "#026ac8",
          700: "#0354a2",
          800: "#074785",
          900: "#0c3b6f",
          950: "#082649",
        },
        cbt: {
          answered: "#10b981", // Emerald 500
          notAnswered: "#ef4444", // Red 500
          notVisited: "#94a3b8", // Slate 400
          review: "#8b5cf6", // Purple 500
          ansReview: "#6366f1", // Indigo 500
          headerBg: "#0f172a", // Slate 900
          panelBg: "#f8fafc", // Slate 50
        },
        canvas: {
          default: "#f6f8fa", // Soothing warm off-white, eliminates eye strain
          soft: "#f8f9fa",
          subtle: "#f1f3f5",
          card: "#ffffff",
          cardWarm: "#fafbfc",
          border: "#e2e8f0",
          borderLight: "#edf2f7",
        },
      },
      fontFamily: {
        sans: ["Satoshi", "Plus Jakarta Sans", "Noto Sans Devanagari", "Inter", "system-ui", "-apple-system", "sans-serif"],
        hindi: ["Noto Sans Devanagari", "Mangal", "Arial Unicode MS", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
