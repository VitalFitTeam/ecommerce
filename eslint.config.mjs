import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
   ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts"
    ],
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
     // Reglas recomendadas de estilo y consistencia
         // Siempre usar punto y coma
      "quotes": ["error", "double", { "allowTemplateLiterals": true, "avoidEscape": true }], // Permitir dobles y simples si es necesario
      "no-unused-vars": ["warn"],                   // Variables no usadas → warning
      "no-console": ["warn", { allow: ["warn", "error"] }], // console.log → warning
      "eqeqeq": ["error", "always"],                // Usar siempre === y !==
      "curly": ["error", "all"],                    // Siempre llaves en if/for/while
      "indent": ["error", 2, { "SwitchCase": 1 }], // Indentación 2 espacios
    }
  },
];

export default eslintConfig;
