import { configOptimizer, optimizerResults } from "../data/Lupa/data";

describe("Calculator Data Verification: Lupa (32 workers, sharded generator)", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("produces the same optimizer results as the default worker count", () => {
    cy.importCharacterData(configOptimizer);

    // Bump worker count to 32 — this is the only combination that spins up
    // multiple generator shards (see splitOptimizerWorkerCount), exercising
    // the cross-shard dedup path added alongside the setting.
    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-settings]").click();
    cy.get("h1").should("contain.text", "Settings");
    cy.get("[data-test-settings-preferences]").click();
    cy.get('[data-test-optimizer-worker-count-pref="32"]').click();
    cy.get('[data-test-optimizer-worker-count-pref="32"]').should(
      "have.class",
      "btn-primary",
    );

    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__selection.Lupa").should("exist");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get(".screen--optimizer").should("be.visible");
    cy.get("[data-test-optimizer-guide-btn]").should("be.visible");
    cy.get("[data-test-optimizer-optimize-btn]").click();
    cy.wait(100);
    cy.get("[data-test-optimizer-optimize-btn]").click();
    // 32 workers take a while to spin up under the Vite dev server (each one
    // loads its module graph separately), well past the 4s default — and
    // results render progressively, so row 0 can show a not-yet-final
    // loadout for a while before the full search settles on the best one.
    cy.get(
      `[data-test-optimizer-results-index="0"] [data-test-optimizer-rotation-damage-total]`,
      { timeout: 60000 },
    ).should("contain", optimizerResults.totalNormal);
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
  });
});
