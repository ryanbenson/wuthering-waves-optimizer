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
  it("navigates the mini-nav across all four routes with distinct URLs, content, and titles", () => {
    visitWithFlagEnabled();
    cy.location("pathname").should("eq", "/info");
    cy.title().should("contain", "Info");
    cy.contains("work in progress").should("be.visible");

    cy.get('[data-test-info-nav-item="/info/cv-rv"]').click();
    cy.location("pathname").should("eq", "/info/cv-rv");
    cy.title().should("contain", "CV & RV");
    cy.contains("Crit Rate").should("be.visible");

    cy.get('[data-test-info-nav-item="/info/formulas"]').click();
    cy.location("pathname").should("eq", "/info/formulas");
    cy.title().should("contain", "Formulas");
    cy.contains("totalDamageBonus").should("be.visible");

    cy.get('[data-test-info-nav-item="/info/credits"]').click();
    cy.location("pathname").should("eq", "/info/credits");
    cy.title().should("contain", "Credits");
    cy.contains("@LavaSnake").should("be.visible");

    cy.get('[data-test-info-nav-item="/info"]').click();
    cy.location("pathname").should("eq", "/info");
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
    cy.get('[data-test-info-nav-item]').should("not.exist");
  });
});
