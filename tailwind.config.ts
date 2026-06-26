import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#05060f",
          panel: "#0c0e24",
          neon: "#ff2bd6",
          cyan: "#00f0ff",
          purple: "#9d4edd",
          lime: "#b6ff3a",
          pink: "#ff7ad9",
          gold: "#ffd166",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        neon: "0 0 10px rgba(255,43,214,0.7), 0 0 30px rgba(255,43,214,0.4)",
        "neon-cyan": "0 0 10px rgba(0,240,255,0.7), 0 0 30px rgba(0,240,255,0.4)",
        "neon-purple": "0 0 10px rgba(157,78,221,0.7), 0 0 30px rgba(157,78,221,0.4)",
        "neon-lime": "0 0 10px rgba(182,255,58,0.7), 0 0 30px rgba(182,255,58,0.4)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        flicker: {
          "0%,19%,21%,23%,25%,54%,56%,100%": { opacity: "1" },
          "20%,24%,55%": { opacity: "0.4" },
        },
        gridmove: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(44px)" },
        },
        signpulse: {
          "0%,100%": { filter: "brightness(1) drop-shadow(0 0 6px var(--sign-glow, #ff2bd6))" },
          "50%": { filter: "brightness(1.35) drop-shadow(0 0 14px var(--sign-glow, #ff2bd6))" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        flicker: "flicker 3s linear infinite",
        gridmove: "gridmove 2s linear infinite",
        signpulse: "signpulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;