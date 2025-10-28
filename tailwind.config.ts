//Es el archivo donde se configura Tailwind definiendo colores, tipografías y estilos personalizados para todo el proyecto.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
        bebas: ["var(--font-bebas)", "sans-serif"], // si quieres usar font-bebas directamente
      },
    },
  },
  plugins: [],
};

export default config;
