describe("Build Card feature flag", () => {
  it("hides the nav link while the Labs flag is off", () => {
    cy.visit("/");
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible");

    cy.get('[data-test-calculator-nav="buildCard"]').should("not.exist");
    cy.get('[data-test-calculator-mobile-nav="buildCard"]').should(
      "not.exist",
    );
  });

  it("can be enabled from Settings > Labs, revealing the nav link", () => {
    cy.visit("/");
    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-settings]").click();
    cy.get("[data-test-settings-labs]").click();
    cy.contains("label", "Build Card")
      .find("input[type=checkbox]")
      .click();

    cy.get("[data-test-nav-calculator]").click();
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible");

    cy.get('[data-test-calculator-nav="buildCard"]').should("be.visible");
  });
});
