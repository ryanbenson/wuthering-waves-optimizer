// Echo Insights panel (src/components/CalculatorEchoInsightsPanel.vue) —
// see docs/adr/0014-echo-editor-redesign.md decision #10. Two-column split
// of the Echoes tab: the existing build strip on the left, this aggregation
// panel on the right (stacked below on mobile). Only rendered when the
// liveResultBar Labs flag is on; the flag-off path has no insights panel.

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
  cy.richSelect("[data-test-character-select]", "Brant");
  cy.get(".character__self-buffs").should("be.visible");
  cy.get('[data-test-calculator-nav="echoes"]').click();
}

function pickEcho(echoKey: string) {
  cy.get("[data-test-echo-edit-find]").click();
  cy.get(`[data-test-echo-picker-option="${echoKey}"]`).click();
}

function pickFromOpenMenu(text: string) {
  cy.get(".app-rich-select__menu:visible").contains(".app-rich-select__option", text).click();
}

function assignSlot(index: number, statLabel: string) {
  cy.get(`[data-test="echo-edit-slot-type-${index}"]`).click();
  pickFromOpenMenu(statLabel);
}

describe("Echo Insights panel — Calculator build context (Labs flag)", () => {
  it("shows an empty state before any echo is equipped", () => {
    openBrantEchoesTab();
    cy.get("[data-test-echo-insights-panel]").should("be.visible");
    cy.get("[data-test-echo-insights-equipped-count]").should("contain.text", "0/5");
  });

  it("sums total CV and per-substat totals across equipped echoes, ordered by Brant's priority weights", () => {
    openBrantEchoesTab();

    // Brant's curated weights: CritRate 4, CritDMG 4, BasicAttackDMGBonus 3,
    // EnergyRegen 2, ATK 2, ATK_FLAT 1.
    cy.get('[data-test-echo-item="0"]').click();
    pickEcho("BellBorneGeochelone");
    assignSlot(0, "Crit Rate");
    cy.get('[data-test-echo-edit-slot="0"] input[type=range]').invoke("val", 7).trigger("input"); // 10.5
    assignSlot(1, "Crit DMG");
    cy.get('[data-test-echo-edit-slot="1"] input[type=range]').invoke("val", 7).trigger("input"); // 21
    assignSlot(2, "Basic Attack DMG Bonus");
    assignSlot(3, "ATK%");
    assignSlot(4, "HP%");
    cy.get("[data-test-echo-edit-panel-close]").click();

    cy.get("[data-test-echo-insights-equipped-count]").should("contain.text", "1/5");
    // CV = CritRate 10.5 * 2 + CritDMG 21 = 42
    cy.get("[data-test-echo-insights-total-cv]").should("contain.text", "42.0%");

    // CritRate/CritDMG (weight 4) should lead the priority list, ahead of a
    // lower-weighted priority stat like EnergyRegen (weight 2, unrolled).
    cy.get("[data-test-echo-insights-row]").then(($rows) => {
      const types = [...$rows].map((el) => el.getAttribute("data-test-echo-insights-row"));
      expect(types.indexOf("CritRate")).to.be.lessThan(types.indexOf("EnergyRegen"));
    });

    // HP (weight 0 for Brant) lands in "Other rolled substats", not flagged.
    cy.get('[data-test-echo-insights-row="HP"]').should("exist").and("not.have.class", "echo-insights__row--missing");
  });

  it("flags a zero-roll priority substat as missing", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item="0"]').click();
    pickEcho("BellBorneGeochelone");
    // Deliberately never roll EnergyRegen (one of Brant's priority stats).
    assignSlot(0, "Crit Rate");
    assignSlot(1, "Crit DMG");
    assignSlot(2, "Basic Attack DMG Bonus");
    assignSlot(3, "ATK%");
    assignSlot(4, "HP%");
    cy.get("[data-test-echo-edit-panel-close]").click();

    cy.get('[data-test-echo-insights-row="EnergyRegen"]')
      .should("have.class", "echo-insights__row--missing")
      .and("contain.text", "0 rolls");
  });

  it("aggregates roll counts across more than one equipped echo", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item="0"]').click();
    pickEcho("BellBorneGeochelone");
    assignSlot(0, "Crit Rate");
    cy.get("[data-test-echo-edit-panel-close]").click();

    cy.get('[data-test-echo-item="1"]').click();
    pickEcho("BellBorneGeochelone");
    assignSlot(0, "Crit Rate");
    cy.get("[data-test-echo-edit-panel-close]").click();

    cy.get('[data-test-echo-insights-row="CritRate"]').should("contain.text", "×2");
  });

  it("stacks the insights panel below the strip on a mobile viewport", () => {
    cy.viewport(390, 844);
    enableLiveResultBarLab();
    cy.richSelect("[data-test-character-select]", "Brant");
    cy.get(".character__self-buffs").should("be.visible");
    cy.get('[data-test-calculator-mobile-nav="echoes"]').click({ force: true });

    cy.get('[data-test-echo-item="0"]').then(($strip) => {
      cy.get("[data-test-echo-insights-panel]").then(($insights) => {
        expect($insights[0].getBoundingClientRect().top).to.be.greaterThan(
          $strip[0].getBoundingClientRect().bottom - 1,
        );
      });
    });
  });

  it("stays off by default — no insights panel on the legacy path", () => {
    cy.visit("/");
    cy.richSelect("[data-test-character-select]", "Brant");
    cy.get(".character__self-buffs").should("be.visible");
    cy.get('[data-test-calculator-nav="echoes"]').click();

    cy.get("[data-test-echo-insights-panel]").should("not.exist");
  });
});
