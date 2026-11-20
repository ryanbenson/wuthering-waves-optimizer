// Overview/Attacks/Rotations tabs inside the pinned Full breakdown panel
// (src/components/CalculatorLiveResultDetail.vue) — see
// docs/adr/0018-live-result-panel-tabs-redesign.md. Panel-chrome concerns
// (target/damage-type picker, panel pin, stat-chip parity) stay in
// liveResultBar.cy.ts; this spec covers the tab/accordion/width UI itself.

import { config as cartethyiaConfig } from "./data/Cartethyia/data";

function enableLiveResultBarLab(config: Record<string, unknown> = {}) {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config, labs: { liveResultBar: { isEnabled: true } } }),
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
    // No misleading "first attack" average on a closed group (ADR 0060).
    cy.get('[data-test-live-result-attack-group-key="basicAttacks"]').should(
      "not.contain.text",
      "avg",
    );
  });

  it("pinned attacks and open/closed groups are remembered per character across a reload", () => {
    enableLiveResultBarLab();
    openBreakdown("Brant");
    cy.get("[data-test-live-result-detail-tab-attacks]").click();

    cy.get('[data-test-live-result-attack-group-key="pinnedAttacks"] [data-test-live-result-pinned-attacks-hint]').should(
      "be.visible",
    );

    // Pin Brant's Liberation (the target group, open by default), then
    // close that group and open Basic Attacks.
    cy.get('[data-test-live-result-attack-group-key="liberationAttacks"] [data-test-live-result-attack-pin]')
      .first()
      .click();
    cy.get('[data-test-live-result-attack-group-key="pinnedAttacks"]').should("contain.text", "To the Horizon");
    cy.get('[data-test-live-result-attack-group-key="liberationAttacks"] [data-test-live-result-attack-group-toggle]').click();
    cy.get('[data-test-live-result-attack-group-key="basicAttacks"] [data-test-live-result-attack-group-toggle]').click();

    cy.reload();
    openBreakdown("Brant");
    cy.get("[data-test-live-result-detail-tab-attacks]").click();

    cy.get('[data-test-live-result-attack-group-key="pinnedAttacks"]').should("contain.text", "To the Horizon");
    cy.get('[data-test-live-result-attack-group-key="liberationAttacks"] [data-test-live-result-attack-group-toggle]').should(
      "have.attr",
      "aria-expanded",
      "false",
    );
    cy.get('[data-test-live-result-attack-group-key="basicAttacks"] [data-test-live-result-attack-group-toggle]').should(
      "have.attr",
      "aria-expanded",
      "true",
    );
  });

  it("the Pins Left/Right switch moves the pin buttons and is remembered", () => {
    enableLiveResultBarLab();
    openBreakdown("Brant");
    cy.get("[data-test-live-result-detail-tab-attacks]").click();

    const firstLibRow = '[data-test-live-result-attack-group-key="liberationAttacks"] [data-test-live-result-attack-row]';
    cy.get(firstLibRow).first().find("td:first-child [data-test-live-result-attack-pin]").should("exist");

    cy.get('[data-test-live-result-attacks-pin-side="right"]').click();
    cy.get(firstLibRow).first().find("td:last-child [data-test-live-result-attack-pin]").should("exist");
    cy.get(firstLibRow).first().find("td:first-child [data-test-live-result-attack-pin]").should("not.exist");

    cy.reload();
    openBreakdown("Brant");
    cy.get("[data-test-live-result-detail-tab-attacks]").click();
    cy.get('[data-test-live-result-attacks-pin-side="right"]').should("have.attr", "aria-pressed", "true");
    cy.get(firstLibRow).first().find("td:last-child [data-test-live-result-attack-pin]").should("exist");
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

  it("Attacks tab includes the Elemental Effects group (negative-status attacks) when the character has one enabled", () => {
    // Cartethyia's saved fixture has aeroErosion enabled with 6 stacks, so
    // allDamages.elementalReactions is populated — regression coverage for
    // GROUP_DISPLAY_ORDER previously omitting "elementalReactions" (as well
    // as "echoSetAttacks"/"utilityAttacks"), which silently hid Electro
    // Flare/Fusion Burst/etc. from this accordion even though the legacy
    // CalculatorDamages.vue panel always rendered them.
    //
    // Import in the classic UI (cypress/support/e2e.ts seeds it) — the v3
    // SettingsWorkspace sidebar shell doesn't have the legacy tab strip
    // cy.importCharacterData drives (see settingsWorkspaceFlagged.cy.ts) —
    // then switch to v3 via the real Preferences toggle (a raw localStorage
    // write + reload races the app's own persistedstate autosave and
    // doesn't reliably stick).
    cy.visit("/");
    cy.importCharacterData(cartethyiaConfig);
    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__selection.Cartethyia").should("be.visible");

    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-settings]").click();
    cy.get("[data-test-use-classic-ui]").uncheck();

    cy.get("[data-test-nav-calculator]").click();
    cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");

    cy.get("[data-test-live-result-bar-toggle]").click();
    cy.get("[data-test-live-result-detail]").should("be.visible");
    cy.get("[data-test-live-result-detail-tab-attacks]").click();

    cy.get('[data-test-live-result-attack-group-key="elementalReactions"]')
      .should("be.visible")
      .and("contain.text", "Elemental Effects");
    cy.get('[data-test-live-result-attack-group-key="elementalReactions"] [data-test-live-result-attack-group-toggle]').click();
    cy.get('[data-test-live-result-attack-group-key="elementalReactions"]').should(
      "contain.text",
      "Aero Erosion",
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

  it("dragging the resize handle resizes the panel and persists across a reload", () => {
    cy.viewport(1600, 900);
    enableLiveResultBarLab();
    openBreakdown("Brant");

    const panelWidth = () =>
      cy.get("[data-test-live-result-detail]").invoke("outerWidth");

    panelWidth().should("be.closeTo", 420, 2);

    // Drag the left edge 100px left: the panel grows by 100px.
    cy.get("[data-test-live-result-detail-resizer]").then(($handle) => {
      const rect = $handle[0].getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      cy.wrap($handle).trigger("pointerdown", {
        button: 0,
        clientX: x,
        clientY: y,
        force: true,
      });
      cy.window().trigger("pointermove", { clientX: x - 100, clientY: y });
      cy.window().trigger("pointerup", { clientX: x - 100, clientY: y });
    });
    panelWidth().should("be.closeTo", 520, 2);

    cy.reload();
    cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");
    cy.get("[data-test-live-result-bar-toggle]").click();
    panelWidth().should("be.closeTo", 520, 2);

    // Double-click resets to the default width.
    cy.get("[data-test-live-result-detail-resizer]").dblclick({ force: true });
    panelWidth().should("be.closeTo", 420, 2);
  });

  it("reads a legacy width preset as its old pixel width", () => {
    cy.viewport(1600, 900);
    enableLiveResultBarLab({ liveResultDetailPanelWidth: "wide" });
    openBreakdown("Brant");
    cy.get("[data-test-live-result-detail]")
      .invoke("outerWidth")
      .should("be.closeTo", 480, 2);
  });
});
