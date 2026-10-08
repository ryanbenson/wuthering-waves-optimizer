// Add common Cypress configurations or custom commands here.
import "./commands";

Cypress.on("uncaught:exception", (err) => {
  // Benign Chromium/Electron warning, not an application bug — see
  // https://github.com/cypress-io/cypress/issues/8418. Any component using
  // ResizeObserver (e.g. the build card's export scaling) can trigger it.
  if (err.message.includes("ResizeObserver loop completed")) {
    return false;
  }
  return true;
});

// The v3 UI is the app's default (ADR 0038). Specs that don't seed their own
// settings keep exercising the classic UI, which stays supported until it's
// retired. Registered here, before any spec, so a spec's own cy.visit
// onBeforeLoad runs after this and wins (that's how v3 specs opt in).
Cypress.on("window:before:load", (win) => {
  if (!win.localStorage.getItem("settings")) {
    win.localStorage.setItem(
      "settings",
      JSON.stringify({ config: { useClassicUi: true }, labs: {} }),
    );
  }
});

beforeEach(() => {
  // Google Fonts (and related) can stall window.load for tens of seconds in
  // Cypress Electron. Stub them so cy.visit resolves promptly.
  cy.intercept("https://fonts.googleapis.com/**", {
    statusCode: 200,
    headers: { "content-type": "text/css" },
    body: "/* stubbed for Cypress */",
  });
  cy.intercept("https://fonts.gstatic.com/**", {
    statusCode: 200,
    body: "",
  });
  cy.intercept("https://va.vercel-scripts.com/**", {
    statusCode: 200,
    headers: { "content-type": "application/javascript" },
    body: "/* stubbed for Cypress */",
  });
});
