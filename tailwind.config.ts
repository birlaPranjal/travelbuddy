import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: "#03132D",
        lightdark: "#03045E"  ,
        light: "#EEEBD8",
        primary: "#FF7F50",
        secondary: "#FFA07A",
        accent: "#20B2AA",
        muted: "#F5F5F5",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        placeholder: "var(--placeholder)",
      },
    },
  },
  plugins: [],
};
export default config;
