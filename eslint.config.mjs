import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // 1️⃣ Tell ESLint what to IGNORE globally (very important in your mono-repo)
  globalIgnores([
    // Default Next.js stuff
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // 🔒 Dependencies & build outputs
    "node_modules/**",
    "**/node_modules/**",
    "**/dist/**",

    // 🔒 Other projects in this repo (they’ll have their own config later)
    "tredia-mobile/**",
    "tredia-api/**",

    // That weird duplicate folder
    "tredia-mobile/node_modules 2/**",
  ]),

  // 2️⃣ Apply Next.js + TypeScript rules ONLY to this app
  ...nextVitals,
  ...nextTs,
]);

export default eslintConfig;
