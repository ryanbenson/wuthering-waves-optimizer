// V3 build-vs-live stat display (docs/adr/0051-build-vs-live-stats.md): the
// two-tone bar on the action bar chips and Overview rows, and the split stat
// detail. The numbers themselves are covered by tests/calculator/statSplit.test.ts;
// this spec checks the wiring end to end.

function visitV3() {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
      );
    },
  });
}

describe("Build vs live stats (V3)", () => {
  it("shows the build bar, then the split once buffs are on", () => {
    visitV3();
    cy.selectWorkspaceCharacter("Brant");
    cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");

    cy.get("[data-test-live-result-bar-toggle]").click();
    cy.get("[data-test-live-result-overview-legend]").should("contain.text", "Your build");
    cy.get('[data-test-live-result-stat-row-key="totalHp"] + [data-test-live-result-stat-row-bar]').should("exist");

    cy.get("[data-test-workspace-buffs-enable-all]").click();
    cy.get("[data-test-live-result-detail] [data-test-live-result-stat-row-split]")
      .should("have.length.greaterThan", 0)
      .first()
      .should("contain.text", "+");
  });

  it("opens the split stat detail from a buffed stat row", () => {
    visitV3();
    cy.selectWorkspaceCharacter("Brant");
    cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible").click();

    cy.get("[data-test-live-result-bar-toggle]").click();
    cy.get("[data-test-live-result-detail] [data-test-live-result-stat-row-split]")
      .first()
      .closest("[data-test-live-result-stat-row]")
      .click();

    cy.get("[data-test-stat-split]").should("be.visible");
    cy.get("[data-test-stat-split-buffs]").invoke("text").should("match", /^\+/);
    cy.get("[data-test-stat-split-buff-rows] [data-test-stat-split-row]").should("have.length.greaterThan", 0);
    cy.get('[data-test-stat-split-build-rows] [data-test-stat-split-row="base"]').should("exist");
  });
});
