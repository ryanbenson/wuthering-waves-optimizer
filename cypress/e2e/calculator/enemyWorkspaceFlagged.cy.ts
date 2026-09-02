// Covers the redesigned Enemy workspace (src/components/CalculatorEnemyWorkspace.vue)
// behind the "UI Overhaul 3.0" liveResultBar labs flag. Reuses the same
// Carlotta/Phoebe fixtures and expected numbers as the legacy-path spec
// (./enemy.cy.ts) so this proves parity through the new steppers/inline
// resistance editor, not just "renders something" — the flag-off path is
// left untouched and covered separately.
import { carlottaEnemyFifty } from "./data/Carlotta/index";

function visitWithFlagEnabled() {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
      );
    },
  });
}

// See teamBuffsWorkspaceFlagged.cy.ts — with the flag on, stats/damages
// render inside the live-result detail slide-out instead of the flag-off
// `.results` pane.
function testAttacksInDetail(attackTests: AttackTests) {
  attackTests.forEach(({ selector, values }) => {
    cy.get(`[data-test-live-result-detail] ${selector}`).should(($el) => {
      values.forEach((text) => {
        expect($el).to.contain.text(text);
      });
    });
  });
}

describe("Enemy Workspace (liveResultBar flag)", () => {
  it("reproduces the legacy Enemy page's exact stats/damages through the redesigned workspace", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="enemy"]').click();

    cy.get("[data-test-enemy-workspace-status]").should("be.visible");
    // No preset selected yet — resistance falls back to the single manual field.
    cy.get("[data-test-enemy-workspace-resist-manual]").should("be.visible");

    cy.get("[data-test-enemy-workspace-level-input]")
      .invoke("val", 50)
      .trigger("input")
      .trigger("change");
    cy.get("[data-test-enemy-workspace-level-value]").should("contain.text", "50");

    // Number inputs don't reliably clear via .clear().type() — set the
    // value directly and dispatch the events Vue listens for, same as the
    // level range input above.
    cy.get("[data-test-enemy-workspace-resist-fallback-input]")
      .invoke("val", 50)
      .trigger("input")
      .trigger("change");

    cy.get("[data-test-live-result-bar-toggle]").click();
    cy.get("[data-test-live-result-detail]").should("be.visible");
    cy.get("[data-test-live-result-detail-tab-attacks]").click();
    cy.get("[data-test-live-result-attacks-expand-all]").click();
    testAttacksInDetail(carlottaEnemyFifty);
  });

  it("shows the full resistance reference row once an enemy preset is chosen, editable only for the character's element", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta"); // Glacio element
    cy.get('[data-test-calculator-nav="enemy"]').click();

    cy.get("[data-test-enemy-workspace-browse-open]").click();
    // bellBorneGeochelone: Glacio 40, every other element 10 (src/enemies/index.ts).
    cy.get('[data-test-enemy-browser-choose="bellBorneGeochelone"]').click();

    cy.get("[data-test-enemy-workspace-name]").should("contain.text", "Bell-Borne Geochelone");
    cy.get("[data-test-enemy-workspace-type-badge]").should("contain.text", "Calamity");

    // Glacio is Carlotta's element — inline-editable, pre-filled from the preset.
    cy.get('[data-test-enemy-workspace-resist-active-input="Glacio"]').should("have.value", "40");
    // Every other element is read-only reference.
    cy.get('[data-test-enemy-workspace-resist-value="Aero"]').should("contain.text", "10%");
    cy.get('[data-test-enemy-workspace-resist-value="Havoc"]').should("contain.text", "10%");

    // Recently-used chip appears, and re-picking a second enemy adds another.
    cy.get('[data-test-enemy-workspace-recent="bellBorneGeochelone"]').should("be.visible");
    cy.get("[data-test-enemy-workspace-browse-open]").click();
    cy.get('[data-test-enemy-browser-choose="dreamless"]').click(); // Havoc 40, Glacio 10
    cy.get('[data-test-enemy-workspace-resist-active-input="Glacio"]').should("have.value", "10");
    cy.get('[data-test-enemy-workspace-recent="dreamless"]').should("be.visible");

    // Clicking the earlier recent chip re-selects it without reopening the browser.
    cy.get('[data-test-enemy-workspace-recent="bellBorneGeochelone"]').click();
    cy.get("[data-test-enemy-workspace-name]").should("contain.text", "Bell-Borne Geochelone");
    cy.get('[data-test-enemy-workspace-resist-active-input="Glacio"]').should("have.value", "40");
  });

  it("gates status-effect steppers by the selected character's kit, with a show-more escape hatch, and Reset all clears everything", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Phoebe");
    cy.get('[data-test-calculator-nav="enemy"]').click();

    cy.get('[data-test-enemy-workspace-status-row="spectroFrazzleStacks"]').should("be.visible");
    cy.get('[data-test-enemy-workspace-status-row="aeroErosionStacks"]').should("not.exist");
    // Always-shown regardless of character.
    cy.get('[data-test-enemy-workspace-status-row="strainStacks"]').should("be.visible");
    cy.get('[data-test-enemy-workspace-status-row="havocBaneStacks"]').should("be.visible");

    cy.get('[data-test-enemy-workspace-status-input="spectroFrazzleStacks"]')
      .invoke("val", 10)
      .trigger("input")
      .trigger("change");
    cy.get('[data-test-enemy-workspace-status-value="spectroFrazzleStacks"]').should("contain.text", "10");
    cy.get("[data-test-enemy-workspace-status-count]").should("contain.text", "1 active");

    // Stacks persist through a build-key remount (elemental reaction procs
    // like Spectro Frazzle aren't in the live-result-detail Attacks tab's
    // group list — a pre-existing gap in that panel, unrelated to this
    // workspace — so parity is checked here via the store round-trip
    // instead of a rendered damage row).
    cy.get('[data-test-calculator-nav="character"]').click();
    cy.get('[data-test-calculator-nav="enemy"]').click();
    cy.get('[data-test-enemy-workspace-status-value="spectroFrazzleStacks"]').should("contain.text", "10");

    // The escape hatch reveals effects outside Phoebe's own kit.
    cy.get("[data-test-enemy-workspace-status-showmore]").click();
    cy.get('[data-test-enemy-workspace-status-row="aeroErosionStacks"]').should("be.visible");
    cy.get('[data-test-enemy-workspace-status-input="aeroErosionStacks"]')
      .invoke("val", 1)
      .trigger("input")
      .trigger("change");
    cy.get('[data-test-enemy-workspace-status-value="aeroErosionStacks"]').should("contain.text", "1");

    cy.get("[data-test-enemy-workspace-level-input]").invoke("val", 50).trigger("input").trigger("change");
    cy.get("[data-test-enemy-workspace-reset]").click();

    cy.get("[data-test-enemy-workspace-level-value]").should("contain.text", "90");
    cy.get('[data-test-enemy-workspace-status-value="spectroFrazzleStacks"]').should("contain.text", "0");
    cy.get("[data-test-enemy-workspace-status-count]").should("contain.text", "0 active");
    // Reset also collapses the show-more reveal back down.
    cy.get('[data-test-enemy-workspace-status-row="aeroErosionStacks"]').should("not.exist");
  });

  it("supports quick-set level chips and the Enemy Type segmented control", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="enemy"]').click();

    cy.get('[data-test-enemy-workspace-level-quickset="120"]').click();
    cy.get("[data-test-enemy-workspace-level-value]").should("contain.text", "120");
    cy.get("[data-test-enemy-workspace-level-input]").should("have.value", "120");

    cy.get('[data-test-enemy-workspace-type-option="Calamity"]').click();
    cy.get("[data-test-enemy-workspace-type-badge]").should("contain.text", "Calamity");
    cy.get('[data-test-enemy-workspace-type-option="Calamity"]').should("have.class", "btn-active");
  });
});
