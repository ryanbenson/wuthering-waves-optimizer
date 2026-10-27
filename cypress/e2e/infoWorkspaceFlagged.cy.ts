// Covers the redesigned Info page (real nested routes under /info) behind
// the "UI Overhaul 3.0" liveResultBar labs flag.
function visitWithFlagEnabled(path = "/info") {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
      );
    },
  });
}

describe("Info nested routes (liveResultBar flag)", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("navigates the tab row across all four routes with distinct URLs, content, and titles", () => {
    visitWithFlagEnabled();
    cy.location("pathname").should("eq", "/info");
    cy.title().should("contain", "Info");
    cy.contains("work in progress").should("be.visible");

    cy.get('[data-test-info-nav="cv-echo-rating"]').click();
    cy.location("pathname").should("eq", "/info/cv-echo-rating");
    cy.title().should("contain", "Echo Rating");
    cy.contains("Crit Rate").should("be.visible");

    cy.get('[data-test-info-nav="formulas"]').click();
    cy.location("pathname").should("eq", "/info/formulas");
    cy.title().should("contain", "Formulas");
    cy.contains("totalDamageBonus").should("be.visible");

    cy.get('[data-test-info-nav="credits"]').click();
    cy.location("pathname").should("eq", "/info/credits");
    cy.title().should("contain", "Credits");
    cy.contains("@LavaSnake").should("be.visible");

    cy.get('[data-test-info-nav="overview"]').click();
    cy.location("pathname").should("eq", "/info");
    cy.get('[data-test-info-nav="overview"]').should("have.attr", "aria-current", "page");
  });

  it("switches pages from the phone section menu", () => {
    cy.viewport(390, 844);
    visitWithFlagEnabled();
    cy.get("[data-test-nav-section-title]").should("have.text", "Overview");
    cy.get("[data-test-nav-section-switcher]").click();
    cy.get('[data-test-info-mobile-nav="formulas"]').click();
    cy.location("pathname").should("eq", "/info/formulas");
    cy.get("[data-test-nav-section-title]").should("have.text", "Formulas");
  });

  it("shows the full legacy article on a /info/* sub-path when the flag is off", () => {
    cy.visit("/info/formulas");
    cy.get("article.page-info h1").should(
      "contain.text",
      "Wuthering Waves Calculator & Optimizer",
    );
    // The complete legacy page renders, not a blank/partial one.
    cy.contains("h3", "Formulas").should("be.visible");
    cy.contains("h3", "Shoutouts").should("be.visible");
    cy.get("[data-test-info-nav]").should("not.exist");
  });
});
