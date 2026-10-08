import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Shared scanner logic (ADR 0034); resolved from source here, published to npm.
      "@wutheringtools/scanner-core": path.resolve(__dirname, "packages/scanner-core/src"),
      // Damage/heal/shield formulas (ADR 0036); resolved from source here, published to npm.
      "@wutheringtools/formulas": path.resolve(__dirname, "packages/formulas/src"),
      // Build card (Discord bot image) parser (ADR 0037); resolved from source here, published to npm.
      "@wutheringtools/build-card-scanner": path.resolve(__dirname, "packages/build-card-scanner/src"),
    },
  },
  test: {
    globals: true, // Enable jest-like globals (optional)
    environment: "jsdom", // Use JSDOM for lightweight DOM testing
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      './src/config/**',
    ],
  },
});
