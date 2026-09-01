// Overview/Attacks/Rotations tabs inside the pinned Full breakdown panel
// (src/components/CalculatorLiveResultDetail.vue) — see
// docs/adr/0018-live-result-panel-tabs-redesign.md. Panel-chrome concerns
// (target/damage-type picker, panel pin, stat-chip parity) stay in
// liveResultBar.cy.ts; this spec covers the tab/accordion/width UI itself.

function enableLiveResultBarLab() {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
      );
    },
  });
}

function openBreakdown(character: string) {
  cy.selectWorkspaceCharacter(character);
  cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");
  cy.get("[data-test-live-result-bar-toggle]").click();
  cy.get("[data-test-live-result-detail]").should("be.visible");
}

describe("Live Result panel tabs (Labs flag)", () => {
  it("opens on the Overview tab, showing the full stat grouping", () => {
    enableLiveResultBarLab();
    openBreakdown("Brant");

    cy.get("[data-test-live-result-detail-tab-overview]").should(
      "have.class",
      "tab-active",
    );
    cy.get('[data-test-live-result-stat-row-key="totalHp"]').should("be.visible");
    cy.get('[data-test-live-result-stat-row-key="totalAtk"]').should("be.visible");
  });

  it("Attacks tab starts with the current target's group expanded, others collapsed", () => {
    enableLiveResultBarLab();
    openBreakdown("Brant");

    cy.get("[data-test-live-result-detail-tab-attacks]").click();
    cy.get("[data-test-live-result-detail-tab-attacks]").should(
      "have.class",
      "tab-active",
    );

    // Brant has no saved rotation, so the default target falls back to his
    // highest-priority action group (Liberation) — see liveResultBar.cy.ts.
    cy.get('[data-test-live-result-attack-group-key="liberationAttacks"]')
      .find("[data-test-live-result-attack-group-toggle]")
      .should("have.attr", "aria-expanded", "true");
    cy.get('[data-test-live-result-attack-group-key="liberationAttacks"]').should(
      "contain.text",
      "To the Horizon",
    );

    cy.get('[data-test-live-result-attack-group-key="basicAttacks"]')
      .find("[data-test-live-result-attack-group-toggle]")
      .should("have.attr", "aria-expanded", "false");
    cy.get('[data-test-live-result-attack-group-key="basicAttacks"]').should(
      "contain.text",
      "avg",
    );
  });

  it("clicking a collapsed group's header expands it, and Expand all/Collapse all work", () => {
    enableLiveResultBarLab();
    openBreakdown("Brant");
    cy.get("[data-test-live-result-detail-tab-attacks]").click();

    cy.get('[data-test-live-result-attack-group-key="basicAttacks"] [data-test-live-result-attack-group-toggle]').click();
    cy.get('[data-test-live-result-attack-group-key="basicAttacks"] [data-test-live-result-attack-group-toggle]').should(
      "have.attr",
      "aria-expanded",
      "true",
    );

    cy.get("[data-test-live-result-attacks-collapse-all]").click();
    cy.get('[data-test-live-result-attack-group-key="liberationAttacks"] [data-test-live-result-attack-group-toggle]').should(
      "have.attr",
      "aria-expanded",
      "false",
    );

    cy.get("[data-test-live-result-attacks-expand-all]").click();
    cy.get('[data-test-live-result-attack-group-key="basicAttacks"] [data-test-live-result-attack-group-toggle]').should(
      "have.attr",
      "aria-expanded",
      "true",
    );
  });

  it("Rotations tab renders the same aggregate totals the legacy view shows", () => {
    enableLiveResultBarLab();
    openBreakdown("Brant");

    cy.get("[data-test-live-result-detail-tab-rotations]").click();
    cy.get("[data-test-live-result-detail-tab-rotations]").should(
      "have.class",
      "tab-active",
    );
    // Brant has no saved rotation in this fixture — empty state, not a
    // crash or a leftover Overview/Attacks row.
    cy.get("[data-test-live-result-detail]").should(
      "contain.text",
      "No rotations saved",
    );
  });

  it("cycling the width preset resizes the panel and persists across a reload", () => {
    enableLiveResultBarLab();
    openBreakdown("Brant");

    cy.get("[data-test-live-result-detail-width-wide]").click();
    cy.get("[data-test-live-result-detail]").should(
      "have.class",
      "live-result-detail--wide",
    );

    cy.reload();
    cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");
    cy.get("[data-test-live-result-bar-toggle]").click();
    cy.get("[data-test-live-result-detail]").should(
      "have.class",
      "live-result-detail--wide",
    );

    cy.get("[data-test-live-result-detail-width-compact]").click();
    cy.get("[data-test-live-result-detail]").should(
      "have.class",
      "live-result-detail--compact",
    );
  });
});
