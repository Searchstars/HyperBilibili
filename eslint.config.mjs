import js from "@eslint/js"
import prettier from "eslint-config-prettier"

export default [
  js.configs.recommended,
  prettier,
  {
    files: ["src/**/*.{js,ux}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        global: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        Promise: "readonly",
        JSON: "readonly",
        Math: "readonly",
        Date: "readonly",
        String: "readonly",
        Number: "readonly",
        Array: "readonly",
        Object: "readonly",
        parseInt: "readonly",
        parseFloat: "readonly",
        isNaN: "readonly",
        undefined: "readonly",
        Uint8Array: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off"
    }
  },
  {
    ignores: ["dist/", "build/", "node_modules/", "src/buildinfo.ts"]
  }
]
