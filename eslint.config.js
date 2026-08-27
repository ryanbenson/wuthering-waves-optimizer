import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginCypress from "eslint-plugin-cypress";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist/**", "coverage/**", "cypress/downloads/**", "cypress/screenshots/**", "cypress/videos/**"],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
    },
  },
  {
    // <script lang="ts"> blocks need the TS parser just to be parseable —
    // no @typescript-eslint rules/plugin enabled here, this repo relies
    // on vue-tsc for type checking.
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    // Type positions (interfaces, type aliases, generics) trip up the base
    // no-undef rule since it has no concept of TS's type space — vue-tsc
    // is what actually catches undefined-symbol errors in this repo.
    files: ["**/*.ts", "**/*.vue"],
    rules: {
      "no-undef": "off",
    },
  },
  {
    files: ["cypress/**/*.ts"],
    ...pluginCypress.configs.recommended,
  },
  {
    // vitest.config.ts sets test.globals: true (Jest-style describe/it/expect
    // injected at runtime) plus vitest's own `vi` mocking utility.
    files: ["tests/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.jest,
        vi: "readonly",
      },
    },
  },
];
