// eslint.config.mjs
import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

// Importar plugin y parser de TypeScript
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  // Ignorar directorios
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".next/types/**",
    ],
  },

  // Configuración oficial de Next.js (es un array)
  ...nextConfig,

  // Config de Prettier
  prettierConfig,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsparser,
    },

    plugins: {
      "@typescript-eslint": tseslint,
    },

    rules: {
      // Reglas personalizadas
      quotes: [
        "error",
        "double",
        { allowTemplateLiterals: true, avoidEscape: true },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],

      "@typescript-eslint/no-unused-expressions": ["warn"],
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": ["warn"],
      "@typescript-eslint/ban-ts-comment": ["error"],
      "@typescript-eslint/no-empty-object-type": ["error"],
      "@typescript-eslint/triple-slash-reference": ["error"],

      "no-unused-vars": ["warn"],
      "no-eval": ["error"],
      "@next/next/no-assign-module-variable": ["error"],
    },
  },
];
