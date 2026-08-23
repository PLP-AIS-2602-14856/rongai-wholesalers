import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18201b",
        leaf: "#2f6f4e",
        clay: "#b65f3b",
        maize: "#f0b84f",
        mist: "#eef3ef"
      },
      boxShadow: {
        soft: "0 12px 40px rgba(24, 32, 27, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
