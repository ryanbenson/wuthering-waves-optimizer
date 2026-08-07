import { configOptimizer } from "../data/Lupa/data";

describe("Optimizer worker count setting stays in sync across pages", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("syncs a choice made on the optimizer page to the shared settings store", () => {
    cy.importCharacterData(configOptimizer);
    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__selection.Lupa").should("exist");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get(".screen--optimizer").should("be.visible");

    cy.get('[data-test-optimizer-worker-count-pref="16"]').click();
    cy.get('[data-test-optimizer-worker-count-pref="16"]').should(
      "have.class",
      "btn-primary",
    );

    // Check the persisted store directly rather than navigating live to Settings here:
    // leaving the optimizer tab for another page hits an unrelated, pre-existing race
    // in the calculator's resonance-chain handling (reproduces with zero worker-count
    // interaction — confirmed while writing this test). The other spec in this file
    // (Settings → Optimizer direction) already proves the two controls read/write the
    // exact same store field via a live navigation.
    cy.window()
      .its("localStorage")
      .invoke("getItem", "settings")
      .then((raw) => {
        expect(
          JSON.parse(raw as string).config.optimizerWorkerCount,
        ).to.equal(16);
      });
  });

  it("syncs a choice made in Settings → Preferences to the optimizer page", () => {
    cy.importCharacterData(configOptimizer);

    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-settings]").click();
    cy.get("h1").should("contain.text", "Settings");
    cy.get("[data-test-settings-preferences]").click();
    cy.get('[data-test-optimizer-worker-count-pref="4"]').click();
    cy.get('[data-test-optimizer-worker-count-pref="4"]').should(
      "have.class",
      "btn-primary",
    );

    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__selection.Lupa").should("exist");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get(".screen--optimizer").should("be.visible");
    cy.get('[data-test-optimizer-worker-count-pref="4"]').should(
      "have.class",
      "btn-primary",
    );
  });
});
