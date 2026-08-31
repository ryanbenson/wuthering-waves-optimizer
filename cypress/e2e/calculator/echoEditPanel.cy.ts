// Labs-flagged docked panel / bottom sheet echo editor (src/components/
// CalculatorEchoEditPanel.vue) — see docs/adr/0014-echo-editor-redesign.md.
// Covers the Calculator's build-strip context; the Inventory context has
// its own spec at cypress/e2e/inventory/echoEditPanel.cy.ts. The legacy
// modal (flag off) already has full coverage in calculator/echoes.cy.ts and
// is untouched by this feature.

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

function openBrantEchoesTab() {
  enableLiveResultBarLab();
  cy.selectWorkspaceCharacter("Brant");
  cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");
  cy.get('[data-test-calculator-nav="echoes"]').click();
}

function pickEcho(echoKey: string) {
  cy.get("[data-test-echo-edit-find]").click();
  cy.get(`[data-test-echo-picker-option="${echoKey}"]`).click();
}

function pickFromOpenMenu(text: string) {
  cy.get(".app-rich-select__menu:visible").contains(".app-rich-select__option", text).click();
}

describe("Echo Edit Panel — Calculator build context (Labs flag)", () => {
  it("opens the docked panel from a build-strip tile, and closes via the close button", () => {
    openBrantEchoesTab();
    cy.get("[data-test-echo-edit-panel]").should("not.exist");

    cy.get('[data-test-echo-item="0"]').click();
    cy.get("[data-test-echo-edit-panel]").should("be.visible");

    cy.get("[data-test-echo-edit-panel-close]").click();
    cy.get("[data-test-echo-edit-panel]").should("not.exist");
  });

  it("closes on Escape", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item="0"]').click();
    cy.get("[data-test-echo-edit-panel]").should("be.visible").type("{esc}");
    cy.get("[data-test-echo-edit-panel]").should("not.exist");
  });

  it("picking an echo drives the real Live Result Bar number live, not a separate preview", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item="0"]').click();

    cy.get("[data-test-live-result-bar-hero]")
      .invoke("text")
      .then((before) => {
        pickEcho("BellBorneGeochelone");
        cy.get("[data-test-live-result-bar-hero]").invoke("text").should("not.eq", before);
      });
  });

  it("shows cost and the free stat as a single locked row with no interactive controls", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item="0"]').click();
    pickEcho("BellBorneGeochelone");

    cy.get("[data-test-echo-edit-cost-row]").should("contain.text", "Cost 4").and("contain.text", "ATK +150");
    cy.get("[data-test-echo-edit-cost-row]").find("input, select, button").should("not.exist");
  });

  it("constrains the main stat options to the echo's cost tier", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item="0"]').click();
    pickEcho("AeroDrake"); // Common -> cost 1, main stat options are HP%/ATK%/DEF% only

    cy.get('[data-test="echo-edit-main-stat"]').click();
    cy.get(".app-rich-select__menu:visible").should("contain.text", "ATK%");
    cy.get(".app-rich-select__menu:visible").should("not.contain.text", "Crit Rate");
  });

  it("assigns a substat to a specific slot, leaving the others empty — no more first-empty-slot behavior", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item="0"]').click();
    pickEcho("BellBorneGeochelone");

    cy.get('[data-test="echo-edit-slot-type-2"]').click();
    pickFromOpenMenu("Crit Rate");

    cy.get('[data-test-echo-edit-slot="0"]').should("contain.text", "Choose substat");
    cy.get('[data-test-echo-edit-slot="1"]').should("contain.text", "Choose substat");
    cy.get('[data-test-echo-edit-slot="2"]').should("contain.text", "Crit Rate");
    cy.get('[data-test-echo-edit-slot="3"]').should("contain.text", "Choose substat");
    cy.get('[data-test-echo-edit-slot="4"]').should("contain.text", "Choose substat");
  });

  it("dragging a substat's slider snaps to the real roll table and updates the tile", () => {
    openBrantEchoesTab();
    // Extra viewport height: slot 0's dropdown sits close enough to the
    // panel's fixed Rank header that AppRichSelect's flip-to-open-upward
    // placement (correct when there's more room above than below) can
    // overlap it at the default 1280x720 spec viewport.
    cy.viewport(1280, 1000);
    cy.get('[data-test-echo-item="0"]').click();
    pickEcho("BellBorneGeochelone");

    cy.get('[data-test="echo-edit-slot-type-0"]').click();
    pickFromOpenMenu("Crit Rate");

    // subStatsTable.CritRate = [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5] — index 7 is the max roll
    cy.get('[data-test-echo-edit-slot="0"] input[type=range]').invoke("val", 7).trigger("input");
    cy.get('[data-test-echo-edit-slot="0"]').should("contain.text", "10.5");

    cy.get("[data-test-echo-edit-panel-close]").click();
    cy.get('[data-test-echo-item="0"] [data-test-echo-item-substat="0"]').should("contain.text", "10.5%");
  });

  it("opens as a bottom sheet with a scrim on a mobile viewport", () => {
    cy.viewport(390, 844);
    enableLiveResultBarLab();
    cy.selectWorkspaceCharacter("Brant");
    cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");
    cy.get('[data-test-calculator-mobile-nav="echoes"]').click({ force: true });
    cy.get('[data-test-echo-item="0"]').click();

    // The scrim spans the full viewport (position: fixed; inset: 0), but its
    // bounding-box center sits under the sheet itself (which legitimately
    // covers ~80% of the screen on top of it) — so Cypress's strict
    // visibility check on the scrim element fails even though it's exactly
    // where it should be. Assert its positioning instead of "visible".
    cy.get("[data-test-echo-edit-panel-scrim]")
      .should("exist")
      .and("have.css", "position", "fixed");
    cy.get("[data-test-echo-edit-panel-scrim]").click({ force: true });
    cy.get("[data-test-echo-edit-panel]").should("not.exist");
  });

  it("stays off by default — the legacy modal renders unchanged", () => {
    cy.visit("/");
    cy.richSelect("[data-test-character-select]", "Brant");
    cy.get(".character__self-buffs").should("be.visible");
    cy.get('[data-test-calculator-nav="echoes"]').click();

    cy.get("[data-test-echo-item='0']").should("exist");
    cy.get('[data-test-echo-item="0"] .echo__item__image').click();
    cy.get("#echoModal0").should("be.visible");
    cy.get("[data-test-echo-edit-panel]").should("not.exist");
  });
});
