import { configOptimizer } from "../data/Cartethyia/data";

// Regression guard for issue #401's optimizer bug: a Rotation target whose
// first action carries a real per-buff advancedConfig override (built from a
// real exported user rotation — "Rexlent's Fleurdelys Rotation") previously
// scored lower in the Optimizer than the same loadout equipped and viewed via
// CalculatorDamages, because scoreOptimizerRotation fed the override
// action's AdditionalBase/CritOverflow bonus calc the character's own
// un-overridden buff config instead of the override's merged one. The
// Optimizer result panel already computes a live diff percentage between its
// own number and the real equipped-loadout CalculatorDamages number
// (CalculatorOptimizerResultRotationDamage.vue's normalDiffPercentage/etc.)
// — this test is the first to actually assert on it.
describe("Calculator Optimizer Round Trip: Cartethyia", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("matches CalculatorDamages exactly once the top loadout is equipped, for a rotation with a per-action buff override", () => {
    cy.importCharacterData(configOptimizer);
    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__selection.Cartethyia").should("exist");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get(".screen--optimizer").should("be.visible");
    cy.get("[data-test-optimizer-guide-btn]").should("be.visible");
    cy.get("[data-test-optimizer-optimize-btn]").click();
    cy.wait(100);
    cy.get("[data-test-optimizer-optimize-btn]").click();
    cy.get('[data-test-optimizer-results-index="0"]', { timeout: 20000 }).should("exist");

    cy.get(
      '[data-test-optimizer-results-index="0"] [data-test-optimizer-results-equip-btn]',
    ).click();

    // Once the equipped loadout's own CalculatorDamages rotation catches up
    // (calcAllDamages is async), the Optimizer's own number for this rotation
    // and the freshly-equipped character's real number must agree exactly —
    // action-for-action divergence would mean the two calculation paths
    // (scoreOptimizerRotation vs. calcCharacterRotationDamage) disagree.
    cy.get(
      '[data-test-optimizer-results-index="0"] [data-test-optimizer-result-rotation-total-dmg-diff]',
    ).should("contain.text", "+0.0%");
    cy.get(
      '[data-test-optimizer-results-index="0"] [data-test-optimizer-result-rotation-total-avg-dmg-diff]',
    ).should("contain.text", "+0.0%");
    cy.get(
      '[data-test-optimizer-results-index="0"] [data-test-optimizer-result-rotation-total-crit-dmg-diff]',
    ).should("contain.text", "+0.0%");
  });
});
