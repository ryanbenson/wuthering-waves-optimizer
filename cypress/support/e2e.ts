// Add common Cypress configurations or custom commands here.
import "./commands";

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
