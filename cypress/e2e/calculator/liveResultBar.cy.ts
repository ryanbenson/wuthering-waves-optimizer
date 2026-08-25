// Labs-flagged pinned summary bar (src/calculator/liveResultBar.ts) — see
// docs/adr/0013-live-result-bar-labs-flag.md. Covers the flag-enabled layout
// end to end; the legacy (flag-off) split-pane already has full coverage in
// calculator.cy.ts and is asserted here only as a regression guard.

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

describe("Live Result Bar (Labs flag)", () => {
  it("stays off by default — legacy split pane renders unchanged", () => {
    cy.visit("/");
    cy.richSelect("[data-test-character-select]", "Brant");
    cy.get(".character__self-buffs").should("be.visible");
    cy.get("[data-test-live-result-bar]").should("not.exist");
    cy.get(".results").should("be.visible");
  });

  it("replaces the split pane with a pinned bar once enabled", () => {
    enableLiveResultBarLab();
    cy.richSelect("[data-test-character-select]", "Brant");
    cy.get(".character__self-buffs").should("be.visible");

    cy.get("[data-test-live-result-bar]").should("be.visible");
    cy.get(".results").should("not.exist");

    cy.get("[data-test-live-result-bar-name]").should("contain.text", "Brant");
    cy.get("[data-test-live-result-bar-stats]").should("contain.text", "ATK");
    cy.get("[data-test-live-result-bar-stats]").should("contain.text", "375");

    // Brant has no saved rotation yet, so this falls back to his highest-
    // priority action (Liberation) rather than his declared rotation default.
    cy.get("[data-test-live-result-bar-hero]").should(
      "contain.text",
      "To the Horizon DMG",
    );
  });

  it("opens the full breakdown slide-out and reuses the real stat/damage data", () => {
    enableLiveResultBarLab();
    cy.richSelect("[data-test-character-select]", "Brant");
    cy.get(".character__self-buffs").should("be.visible");

    cy.get("[data-test-live-result-detail]").should("not.exist");
    cy.get("[data-test-live-result-bar-toggle]").click();
    cy.get("[data-test-live-result-detail]").should("be.visible");
    cy.get("[data-test-live-result-detail]").should("contain.text", "HP");
    cy.get("[data-test-live-result-detail]").should("contain.text", "11,675");

    cy.get("[data-test-live-result-detail-close]").click();
    cy.get("[data-test-live-result-detail]").should("not.exist");
  });

  it("picking a specific action + damage type from the settings popover updates the hero number, and persists per character across a reload", () => {
    enableLiveResultBarLab();
    cy.richSelect("[data-test-character-select]", "Brant");
    cy.get(".character__self-buffs").should("be.visible");

    // Target + damage type live behind the settings gear, not inline in
    // the bar — see the "cluttered" feedback that moved them there.
    cy.get("[data-test-live-result-bar-settings] summary").click();
    // richSelect's click target keys off the option's value (the
    // "Attack:group|key" string), not its visible label — the label goes
    // to the search box via the `search` override instead.
    cy.richSelect(
      "[data-test-live-result-bar-settings] .app-rich-select__trigger",
      "Attack:tuneBreakAttacks|TuneBreakDMG",
      { search: "Tune Break DMG" },
    );
    cy.get('[data-test-live-result-bar-settings] input[aria-label="Crit"]').click({
      force: true,
    });
    cy.get("[data-test-live-result-bar-hero]").should(
      "contain.text",
      "Tune Break DMG",
    );

    // Persists for Brant specifically across a reload...
    cy.reload();
    cy.get(".character__self-buffs").should("be.visible");
    cy.get("[data-test-live-result-bar-hero]").should(
      "contain.text",
      "Tune Break DMG",
    );

    // ...but a different character still gets their own default, not
    // Brant's remembered pick.
    cy.richSelect("[data-test-character-select]", "Jiyan");
    cy.get(".character__self-buffs").should("be.visible");
    cy.get("[data-test-live-result-bar-hero]").should(
      "not.contain.text",
      "Tune Break DMG",
    );

    // Switching back to Brant restores it again.
    cy.richSelect("[data-test-character-select]", "Brant");
    cy.get(".character__self-buffs").should("be.visible");
    cy.get("[data-test-live-result-bar-hero]").should(
      "contain.text",
      "Tune Break DMG",
    );
  });

  it("persists a pinned breakdown across a reload", () => {
    enableLiveResultBarLab();
    cy.richSelect("[data-test-character-select]", "Brant");
    cy.get(".character__self-buffs").should("be.visible");

    cy.get("[data-test-live-result-bar-toggle]").click();
    cy.get("[data-test-live-result-detail-pin]").click();
    cy.get("[data-test-live-result-detail-pin]").should(
      "have.attr",
      "aria-pressed",
      "true",
    );

    cy.reload();
    cy.get(".character__self-buffs").should("be.visible");
    cy.get("[data-test-live-result-detail]").should("be.visible");
    cy.get("[data-test-live-result-detail-pin]").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
  });

  it("clicking a stat chip opens the same breakdown drawer a stat row opens today", () => {
    enableLiveResultBarLab();
    cy.richSelect("[data-test-character-select]", "Brant");
    cy.get(".character__self-buffs").should("be.visible");

    cy.get("[data-test-live-result-bar-stats] button")
      .contains("ATK")
      .click();
    cy.get(".calculator-breakdown").should("be.visible");
  });
});
