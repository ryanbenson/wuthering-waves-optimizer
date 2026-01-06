import { config, dataAttacks, dataStats } from "../data/Galbrena/data";
import { testAttacks } from "../utils/attackUtils";
import { testStats } from "../utils/statUtils";

describe("Calculator Data Verification: Galbrena", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should import data then verify stats and damages", () => {
    // get to settings and import raw data
    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-settings]").click();
    cy.get("h1").should("contain.text", "Settings");
    cy.get("h1").should("contain.text", "Settings");
    cy.get("[data-test-settings-import]").click();
    cy.get("h3").should("contain.text", "Overwrite your existing data");
    cy.get("[data-test-import-raw-text]")
      .invoke("val", JSON.stringify(config))
      .trigger("input")
      .trigger("change");
    cy.get("[data-test-import-raw-button]").click();
    // go back to the calculator
    cy.get("[data-test-nav-calculator]").click();
    // ensure it's Galbrena before we validate
    cy.get(".character__selection.Galbrena").should("be.visible");

    // validate the stats and damages after
    testStats(dataStats, cy);
    testAttacks(dataAttacks, cy);
  });
});
