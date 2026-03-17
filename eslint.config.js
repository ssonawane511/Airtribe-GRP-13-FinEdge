import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
  globalIgnores(["node_modules/", "dist/", "build/", "coverage/"]),
  js.configs.recommended, // ← Add directly instead of extends
  {
    files: ["src/**/*.js", "test/**/*.js", "*.js"],
    plugins: {
      prettier,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "writable",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
]);
