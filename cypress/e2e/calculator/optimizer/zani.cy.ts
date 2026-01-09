import { configOptimizer, optimizerResults } from "../data/Phrolova/data";

describe("Calculator Data Verification: Phrolova", () => {
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
      .invoke("val", JSON.stringify(configOptimizer))
      .trigger("input")
      .trigger("change");
    cy.get("[data-test-import-raw-button]").click();
    // go back to the calculator
    cy.get("[data-test-nav-calculator]").click();
    // ensure it's Galbrena before we validate
    cy.get(".character__selection.Phrolova").should("exist");
    // swap over to the optimizer page
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get("[data-test-optimizer-guide-btn").should("exist");
    // everything should be filled out, just click optimize
    cy.get("[data-test-optimizer-optimize-btn]").click();
    cy.wait(100);
    cy.get("[data-test-optimizer-optimize-btn]").click();
    // wait for the first result to appear
    cy.get('[data-test-optimizer-results-index="0"]').should("exist");
    // make sure the total damage is the same
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total]`,
    ).contains(optimizerResults.totalNormal);
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total-avg]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.totalAverage);
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total-crit]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.totalCrit);
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.percentNormal);
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total-avg]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.percentAvg);
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total-crit]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.percentCrit);
    // equip the first one
    cy.get(
      '[data-test-optimizer-results-index="0"] [data-test-optimizer-results-equip-btn]',
    ).click();
    // double check that the stats are 0% since we just equipped it
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.totalNormalAfterEquip);
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total-avg]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.totalAverageAfterEquip);
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total-crit]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.totalCritAfterEquip);
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.percentNormalAfterEquip);
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total-avg]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.percentAvgAfterEquip);
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total-crit]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.percentCritAfterEquip);
  });
});
