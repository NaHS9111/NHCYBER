import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // fondatrices — ne changent jamais
        noir: "#0D0D0D",
        or: "#B8934A",
        // secondaires — une par section, jamais toutes ensemble
        pierre: "#C9BDA4",
        charbon: "#2B2B2B",
        ecru: "#F2EDE3",
        gris: "#6B6B63",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        wordmark: ["var(--font-wordmark)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Helvetica", "Arial", "sans-serif"],
        arabic: ["var(--font-arabic)", "serif"],
      },
      transitionTimingFunction: {
        alchemy: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "orbit-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "orbit-slow-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
      },
      animation: {
        "orbit-1": "orbit-slow 34s linear infinite",
        "orbit-2": "orbit-slow-reverse 46s linear infinite",
        "orbit-3": "orbit-slow 60s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
