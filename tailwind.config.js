// tailwind.config.js

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      {
        black: {
          primary: "#4b6bfb",
          secondary: "#7b92b2",
          accent: "#67cba0",
          neutral: "#181a2a",
          "base-100": "#000000", // <- black background
          "base-200": "#111111",
          "base-300": "#1a1a1a",

          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",

          "rounded-box": "0.5rem",
          "rounded-btn": "0.5rem",
          "rounded-badge": "1rem",
          "animation-btn": "0.25s",
          "animation-input": "0.2s",
          "btn-text-case": "uppercase",
          "btn-focus-scale": "0.95",
          "border-btn": "1px",
          "tab-border": "1px",
          "tab-radius": "0.5rem",
          "base-100": "#000000", // Override base colors
          "base-200": "#111111",
          "base-300": "#1a1a1a",
          "base-content": "#bbbbbb",
          "rounded-box": "0.5rem",
          "rounded-btn": "0.5rem",
          "rounded-badge": "1rem",
          "radius-selector": "1rem",
          "radius-field": "0.25rem",
          "radius-box": "0.5rem",
          "rounded-field": "0.25rem",
          "rounded-selector": "1rem",
        },
      },
    ],
  },
};
