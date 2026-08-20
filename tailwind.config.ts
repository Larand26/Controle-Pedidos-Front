import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bloodRed: "#BC0F0F",
        petrolBlue: "#003650",
        offWhite: "#EAEAEA",
        offBlack: "#1C1C1C",
      },
      fontFamily: {
        title: ['"Bebas Neue"', "sans-serif"],
        body: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "main-gradient": "linear-gradient(135deg, #003650 0%, #1C1C1C 100%)",
      },
      boxShadow: {
        glow: "0 0 15px rgba(0, 54, 80, 0.5)",
        "glow-red": "0 0 15px rgba(188, 15, 15, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
