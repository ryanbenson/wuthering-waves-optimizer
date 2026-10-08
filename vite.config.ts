import { createHash } from "node:crypto";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { buildScannerDataFile } from "./src/scanner/scannerData";

/**
 * Publishes /scanner-data.json (game data for the Wavescan desktop scanner, ADR 0035):
 * emitted into every production build and served by the dev server. Generated from the
 * app's own tables at build time, so it is never committed and can't go stale.
 */
function scannerDataPlugin(): Plugin {
  const fileName = "scanner-data.json";
  const render = () =>
    JSON.stringify(buildScannerDataFile((text) => createHash("sha256").update(text).digest("hex")));
  return {
    name: "wutheringtools:scanner-data",
    configureServer(server) {
      server.middlewares.use(`/${fileName}`, (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(render());
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName, source: render() });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), scannerDataPlugin()],
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
});
