// Issue #706: equipping a result updates the comparisons without flagging the
// run; changing a non-echo setting (here, the character's buffs) shows a
// "setup changed" alert with Run again, and the comparisons stay where they
// were. Same Augusta setup as workspaceFlagged.cy.ts.
import { configOptimizer } from "../data/Augusta/data";

const firstRow = '[data-test-optimizer-workspace-leaderboard-row="0"]';

describe("Optimizer results snapshot (v3)", () => {
  it("updates comparisons on equip, and holds them with a rerun offer after a setup change", () => {
    cy.visit("/");
    cy.importCharacterData(configOptimizer);
    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__selection.Augusta").should("be.visible");

    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-settings]").click();
    cy.get("[data-test-use-classic-ui]").uncheck();

    cy.get("[data-test-nav-calculator]").click();
    cy.get('[data-test-workspace-avatar="Augusta"]').should("exist");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get("[data-test-optimizer-workspace]").should("be.visible");
    // Let the buff panels emit their persisted state first (see workspaceFlagged.cy.ts).
    cy.wait(300);
    cy.get("[data-test-optimizer-workspace-optimize-btn]").click();
    cy.get(firstRow).should("exist");
    cy.get("[data-test-optimizer-stale-alert]").should("not.exist");

    cy.get(firstRow)
      .invoke("text")
      .then((beforeEquip) => {
        // Equipping is the expected next step: no alert, comparisons follow the new build.
        cy.get("[data-test-optimizer-workspace-equip-btn]").click();
        cy.get("[data-test-optimizer-workspace-equip-btn]").should("contain.text", "Already equipped");
        cy.get("[data-test-optimizer-stale-alert]").should("not.exist");
        cy.get(firstRow).invoke("text").should("not.eq", beforeEquip);
      });

    cy.get(firstRow)
      .invoke("text")
      .then((afterEquip) => {
        // A non-echo change: turn off all character buffs, then come back.
        cy.get('[data-test-calculator-nav="character"]').click();
        cy.get("[data-test-workspace-buffs-disable-all]").click();
        cy.get('[data-test-calculator-nav="optimizer"]').click();

        cy.get("[data-test-optimizer-stale-alert]").should("be.visible");
        cy.get(firstRow).invoke("text").should("eq", afterEquip);
      });

    cy.get("[data-test-optimizer-rerun]").click();
    cy.get(firstRow).should("exist");
    cy.get("[data-test-optimizer-stale-alert]").should("not.exist");
  });
});
