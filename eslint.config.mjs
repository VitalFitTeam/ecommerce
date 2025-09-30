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
      "semi": ["error", "always"],
      "quotes": ["error", "double"],   // Comillas dobles
      "no-unused-vars": ["warn"],
      "no-console": ["warn"],
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "indent": ["error", 2, { "SwitchCase": 1 }]
    }
  },
];

export default eslintConfig;
