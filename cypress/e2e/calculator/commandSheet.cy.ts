// Phones: the Command Bar is one row (avatar, name, mode, number) and the
// rest of its controls are in a bottom sheet (CalculatorCommandSheet.vue).
function visitV3() {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: { useClassicUi: false }, labs: {} }),
      );
    },
  });
}

describe("Command Bar on phones", () => {
  beforeEach(() => {
    cy.viewport(390, 844);
    visitV3();
  });

  it("keeps one row and moves the controls into a sheet", () => {
    cy.selectWorkspaceCharacter("Aemeath");
    cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");

    cy.get("[data-test-live-result-bar-name]").should("contain.text", "Aemeath");
    cy.get("[data-test-live-result-bar-mode]").should("contain.text", "Fusion Burst");
    cy.get("[data-test-live-result-bar-stance-select]").should("not.be.visible");
    cy.get("[data-test-live-result-bar-stats]").should("not.be.visible");
    cy.get("[data-test-live-result-bar-toggle]").should("not.be.visible");

    cy.get("[data-test-command-sheet]").should("not.exist");
    cy.get("[data-test-live-result-bar-sheet-open]").click();
    cy.get("[data-test-command-sheet]").should("be.visible");
    cy.get("[data-test-command-sheet-close]").should("have.focus");
    cy.get("[data-test-command-sheet-stats]").should("contain.text", "ATK");

    // Switching the mode in the sheet updates the name on the bar.
    cy.get('[data-test-command-sheet-stance="Tune Rupture"]').click();
    cy.get('[data-test-command-sheet-stance="Tune Rupture"]').should(
      "have.attr",
      "aria-pressed",
      "true",
    );
    cy.get("[data-test-live-result-bar-mode]").should("contain.text", "Tune Rupture");

    // Esc closes it.
    cy.focused().type("{esc}");
    cy.get("[data-test-command-sheet]").should("not.exist");
    cy.get("[data-test-live-result-bar-sheet-open]").should("have.focus");
  });

  it("opens the full breakdown from the sheet", () => {
    cy.selectWorkspaceCharacter("Brant");
    cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");

    cy.get("[data-test-live-result-bar-sheet-open]").click();
    cy.get("[data-test-command-sheet-breakdown]").click();
    cy.get("[data-test-command-sheet]").should("not.exist");
    cy.get("[data-test-live-result-detail]").should("be.visible");
  });

  it("changes the measured action from the label on the bar", () => {
    cy.selectWorkspaceCharacter("Brant");
    cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");

    cy.get("[data-test-live-result-bar-target-trigger]").click();
    cy.get("[data-test-live-result-bar-settings]").should("be.visible");
    cy.get('[data-test-live-result-bar-settings] input[aria-label="Crit"]').click();
    cy.get("[data-test-live-result-bar-target-trigger]").click();
    cy.get("[data-test-live-result-bar-settings]").should("not.exist");
  });
});
