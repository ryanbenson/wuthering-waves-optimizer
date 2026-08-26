// Labs-flagged docked panel / bottom sheet echo editor (src/components/
// CalculatorEchoEditPanel.vue, mounted here via InventoryEchoEditPanel.vue)
// — see docs/adr/0014-echo-editor-redesign.md. Covers the standalone
// Inventory page; the Calculator's build-strip context has its own spec at
// cypress/e2e/calculator/echoEditPanel.cy.ts.

const ECHO_ID = "echo-edit-panel-test-echo";

function seedEcho(overrides: Record<string, unknown> = {}) {
  return {
    echoId: ECHO_ID,
    echo: "BellBorneGeochelone",
    echoSet: "VoidThunder",
    rank: 5,
    stat: "CritRate",
    type: 4,
    echoSubStatsType1: "ATK",
    echoSubStatsValue1: 100,
    echoSubStatsType2: "none",
    echoSubStatsValue2: 0,
    echoSubStatsType3: "none",
    echoSubStatsValue3: 0,
    echoSubStatsType4: "none",
    echoSubStatsValue4: 0,
    echoSubStatsType5: "none",
    echoSubStatsValue5: 0,
    ...overrides,
  };
}

function visitInventoryWithEcho(density: "comfy" | "compact" = "comfy") {
  cy.visit("/inventory", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({
          config: { density },
          labs: { liveResultBar: { isEnabled: true } },
        }),
      );
      win.localStorage.setItem(
        "inventory",
        JSON.stringify({
          echoes: [seedEcho()],
          equipped: {},
          echoPresets: [],
          equippedPresets: {},
        }),
      );
    },
  });
}

function openEditPanelForSeededEcho() {
  cy.get(`[data-test-echo-select="${ECHO_ID}"]`)
    .closest(".echo__item-wrap")
    .contains("button", "Edit")
    .click();
}

describe("Echo Edit Panel — Inventory context (Labs flag)", () => {
  it("opens from the card's Edit action as a fixed docked panel, not the legacy modal", () => {
    visitInventoryWithEcho();
    cy.get("[data-test-echo-edit-panel]").should("not.exist");

    openEditPanelForSeededEcho();
    cy.get("[data-test-echo-edit-panel]").should("be.visible");
    // the legacy InventoryEchoEdit component isn't mounted at all when the
    // flag is on (v-if, not v-show) — its modal shouldn't exist in the DOM
    cy.get("#echoModal").should("not.exist");
  });

  it("editing a substat persists immediately and survives a reload", () => {
    visitInventoryWithEcho();
    openEditPanelForSeededEcho();

    cy.get('[data-test="echo-edit-slot-type-1"]').click();
    cy.get(".app-rich-select__menu:visible")
      .contains(".app-rich-select__option", "Crit DMG")
      .click();
    // subStatsTable.CritDMG = [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21]
    cy.get('[data-test-echo-edit-slot="1"] input[type=range]').invoke("val", 7).trigger("input");
    cy.get('[data-test-echo-edit-slot="1"]').should("contain.text", "21");

    cy.reload();
    cy.get(`[data-test-echo-select="${ECHO_ID}"]`).should("be.visible");
    cy.get(`[data-test-echo-select="${ECHO_ID}"]`)
      .closest(".echo__item-wrap")
      .should("contain.text", "21%");
  });

  it("shows family-colored substat chips in comfy density", () => {
    visitInventoryWithEcho("comfy");
    cy.get(`[data-test-echo-select="${ECHO_ID}"]`)
      .closest(".echo__item-wrap")
      .find("tr")
      .filter(":contains('ATK')")
      .should("have.class", "border-l-4");
  });

  it("shows family-colored substat chips in compact density", () => {
    visitInventoryWithEcho("compact");
    cy.get(`[data-test-echo-select="${ECHO_ID}"]`)
      .closest(".echo__item-wrap")
      .should("be.visible");
    // ATK is a "flat" family substat -> neutral bg-base-300 chip
    cy.get(`[data-test-echo-select="${ECHO_ID}"]`)
      .closest(".echo__item-wrap")
      .find(".bg-base-300")
      .should("exist");
  });

  it("stays off by default — the legacy modal renders unchanged", () => {
    cy.visit("/inventory", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "inventory",
          JSON.stringify({
            echoes: [seedEcho()],
            equipped: {},
            echoPresets: [],
            equippedPresets: {},
          }),
        );
      },
    });
    openEditPanelForSeededEcho();
    cy.get("#echoModal").should("be.visible");
    cy.get("[data-test-echo-edit-panel]").should("not.exist");
  });
});
