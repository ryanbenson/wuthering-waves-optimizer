import { configOptimizer, optimizerResults } from "../data/Zani/data";

describe("Calculator Data Verification: Zani", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should import data then verify stats and damages", () => {
    cy.importCharacterData(configOptimizer);
    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__selection.Zani").should("exist");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get(".screen--optimizer").should("be.visible");
    cy.get("[data-test-optimizer-guide-btn]").should("be.visible");
    cy.get("[data-test-optimizer-optimize-btn]").click();
    cy.wait(100);
    cy.get("[data-test-optimizer-optimize-btn]").click();
    cy.get('[data-test-optimizer-results-index="0"]').should("exist");
    // The topN heap updates progressively as loadouts are evaluated —
    // wait for the full search to finish before reading results, or this
    // can flakily capture a not-yet-converged "best so far" instead of the
    // true optimum.
    cy.get("progress.progress-primary", { timeout: 30000 }).should(($el) => {
      const value = Number($el.prop("value"));
      const max = Number($el.prop("max"));
      expect(max).to.be.greaterThan(0);
      expect(value).to.eq(max);
    });
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total]`,
    )
      .invoke("text")
      .should("contain", optimizerResults.totalNormal);
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
      '[data-test-optimizer-results-index="0"] [data-test-optimizer-results-equip-btn]',
    ).click();
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
  });
});
