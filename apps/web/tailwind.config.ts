import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        graphite: "var(--graphite)",
        steel: "var(--steel)",
        slate: "var(--slate)",
        faint: "var(--faint)",
        ash: "var(--ash)",
        fog: "var(--fog)",
        mist: "var(--mist)",
        "mist-strong": "var(--mist-strong)",
        ember: "var(--ember)",
        brass: "var(--brass)",
        success: "var(--success)",
        danger: "var(--danger)",
        inverse: "var(--canvas)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Newsreader", "Georgia", "serif"],
        polysans: ["var(--font-display)", "Newsreader", "Georgia", "serif"],
        inter: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        10: ["10px", { lineHeight: "1.5" }],
        11: ["11px", { lineHeight: "1.5" }],
        13: ["13px", { lineHeight: "1.54" }],
        15: ["15px", { lineHeight: "1.6" }],
        subheading: ["25px", { lineHeight: "31px" }],
        heading: ["45px", { lineHeight: "47px" }],
        "heading-lg": ["45px", { lineHeight: "47px" }],
        display: ["45px", { lineHeight: "47px" }],
      },
      borderRadius: {
        tags: "6px",
        buttons: "7px",
        cards: "11px",
        large: "14px",
        "nav-pills": "6px",
      },
      maxWidth: {
        page: "var(--page-max-width)",
      },
      boxShadow: {
        dropdown: "0 8px 28px -12px rgba(0,0,0,.18)",
      },
      keyframes: {
        "editorial-rise": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "editorial-scale": {
          from: { opacity: "0", transform: "scale(.98) translateY(6px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "editorial-rise": "editorial-rise 350ms ease-out both",
        "editorial-scale": "editorial-scale 280ms ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
