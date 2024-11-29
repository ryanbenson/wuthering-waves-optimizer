import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true, // Enable jest-like globals (optional)
    environment: "jsdom", // Use JSDOM for lightweight DOM testing
  },
});
