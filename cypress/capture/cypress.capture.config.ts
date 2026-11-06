import { defineConfig } from "cypress";

// Separate from cypress.config.ts so the E2E suite keeps its defaults: the captures need
// a window large enough for a 1440x900 viewport, at twice the pixel density.
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/capture/*.cy.ts",
    viewportWidth: 1440,
    viewportHeight: 900,
    setupNodeEvents(on) {
      on("before:browser:launch", (_browser, launchOptions) => {
        launchOptions.preferences.width = 1600;
        launchOptions.preferences.height = 1100;
        return launchOptions;
      });
    },
  },
});
