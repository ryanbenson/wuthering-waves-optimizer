import { configOptimizer } from "./data/Zani/data";

// Regression test for a scroll-jump bug: Calculator.vue's calcAllDamages()
// reassigns `allDamages.value` to a fresh object that (temporarily) has no
// `.rotations` key, since rotations are computed separately via an awaited
// sequential loop. If that reassignment doesn't carry the previous
// `.rotations` value forward, CalculatorDamages.vue's
// `v-if="rotationsList.length && allDamages.value?.rotations"` briefly flips
// false then true on every buff toggle, unmounting and remounting the whole
// rotation section — which is what caused the results panel's scroll
// position to jump when scrolled near the bottom.
describe("Calculator damages: rotation section stays mounted across a buff toggle", () => {
  it("does not unmount/remount the rotation DOM when a character buff is toggled", () => {
    cy.visit("/");
    cy.importCharacterData(configOptimizer);
    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__selection.Zani").should("exist");

    cy.get("[data-test-damages-list-rotation]").should("exist");

    // Mark the current rotation DOM node directly (bypassing Vue) so we can
    // tell whether it's the same node afterward or a freshly-mounted one.
    cy.get("[data-test-damages-list-rotation]")
      .first()
      .then(($el) => {
        $el[0].setAttribute("data-marker", "before-toggle");
      });

    cy.get('[data-test-calculator-nav="character"]').click({ force: true });
    cy.get(".character__buffs input[type=checkbox]").first().click({ force: true });

    // Give the buff-toggle -> calcAllDamages -> awaited rotation recompute
    // enough time to fully resolve before checking node identity.
    cy.wait(500);

    cy.get("[data-test-damages-list-rotation]")
      .first()
      .should(($el) => {
        expect(
          $el.attr("data-marker"),
          "rotation DOM node identity preserved across recompute",
        ).to.eq("before-toggle");
      });
  });
});
