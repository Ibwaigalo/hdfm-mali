import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: "#1A5FA8",
          dark: "#14437a",
          light: "#2a72c0",
        },
        green: {
          DEFAULT: "#3AAA35",
          dark: "#2a8026",
          light: "#4dc447",
        },
        bg: "#F2F4F6",
        border: "#dde2ea",
        muted: "#5a6474",
      },
      fontFamily: {
        sans: ["Source Sans 3", "Source Sans Pro", "sans-serif"],
        heading: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
