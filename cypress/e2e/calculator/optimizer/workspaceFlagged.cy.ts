// Covers the redesigned Optimizer workspace (src/components/optimizerWorkspace/)
// behind the "UI Overhaul 3.0" liveResultBar labs flag. Reuses the same Augusta
// fixture/expected numbers as the legacy-path spec (../optimizer/augusta.cy.ts)
// so this proves parity, not just "renders something" — the flag-off path is
// left untouched and covered separately.
import { configOptimizer, optimizerResults } from "../data/Augusta/data";

describe("Optimizer Workspace (liveResultBar flag): Augusta golden path", () => {
  it("runs to completion, shows a leaderboard + spotlight, and equips a loadout", () => {
    // Import with the labs flag off — with it on, Settings renders the
    // "UI Overhaul 3.0" SettingsWorkspace sidebar shell instead of the
    // legacy tab strip cy.importCharacterData drives (see
    // liveResultDetailTabs.cy.ts) — then enable the flag afterward via the
    // real Labs toggle UI (a raw localStorage write + reload races the
    // app's own persistedstate autosave and doesn't reliably stick).
    cy.visit("/");
    cy.importCharacterData(configOptimizer);
    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__selection.Augusta").should("be.visible");

    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-settings]").click();
    cy.get("[data-test-settings-labs]").click();
    cy.get('input[type="checkbox"]').first().check();

    cy.get("[data-test-nav-calculator]").click();
    // With the flag on, character selection renders via the Command Bar
    // (CalculatorCommandBar.vue), not the legacy .character__selection
    // grid asserted on above.
    cy.get('[data-test-workspace-avatar="Augusta"]').should("exist");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get(".screen--optimizer").should("be.visible");
    cy.get("[data-test-optimizer-workspace]").should("be.visible");
    cy.get("[data-test-optimizer-workspace-guide-btn]").should("be.visible");

    // The legacy spec clicks Run twice with a wait in between — that isn't
    // a quirk, it's giving the echo-set/main-echo buff child components
    // time to mount and emit their initial (persisted) buff state into the
    // Setup panel before the click reads it. Here the Setup panel unmounts
    // once results land, so a second click isn't possible; wait for that
    // same settling instead.
    cy.wait(300);
    cy.get("[data-test-optimizer-workspace-optimize-btn]").click();

    cy.get('[data-test-optimizer-workspace-leaderboard-row="0"]').should("exist");
    cy.get("[data-test-optimizer-workspace-spotlight]").should("be.visible");

    cy.get(
      "[data-test-optimizer-workspace-spotlight] [data-test-optimizer-rotation-damage-total]",
    )
      .invoke("text")
      .should("contain", optimizerResults.totalNormal);
    cy.get(
      "[data-test-optimizer-workspace-spotlight] [data-test-optimizer-rotation-damage-total-avg]",
    )
      .invoke("text")
      .should("contain", optimizerResults.totalAverage);
    cy.get(
      "[data-test-optimizer-workspace-spotlight] [data-test-optimizer-rotation-damage-total-crit]",
    )
      .invoke("text")
      .should("contain", optimizerResults.totalCrit);

    cy.get("[data-test-optimizer-workspace-equip-btn]").click();

    cy.get(
      "[data-test-optimizer-workspace-spotlight] [data-test-optimizer-rotation-damage-total]",
    )
      .invoke("text")
      .should("contain", optimizerResults.totalNormalAfterEquip);
    cy.get(
      "[data-test-optimizer-workspace-spotlight] [data-test-optimizer-rotation-damage-total-avg]",
    )
      .invoke("text")
      .should("contain", optimizerResults.totalAverageAfterEquip);
    cy.get(
      "[data-test-optimizer-workspace-spotlight] [data-test-optimizer-rotation-damage-total-crit]",
    )
      .invoke("text")
      .should("contain", optimizerResults.totalCritAfterEquip);
  });
});
