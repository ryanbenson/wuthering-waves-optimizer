// v3 redesign of the "Set Bonuses" / "Main Echo Buff" panels (src/components/
// CalculatorEchoSetBonusPanel.vue, CalculatorEchoSetBonusSlot.vue,
// CalculatorMainEchoPanel.vue) — see docs/adr/0028. The legacy blocks
// (CalculatorEchoesSetBonusOnePiece/One/Two.vue + the bare "Enable set
// override" checkbox, and the unwrapped CalculatorMainEchoBuff list) are
// untouched and still have full coverage in calculator/echoes.cy.ts; this
// spec covers the v3-flagged replacement using the same FrostyResolve 5pc
// fixture (Carlotta) so the two are easy to compare.

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

function openCarlottaEchoesTab() {
  enableLiveResultBarLab();
  cy.selectWorkspaceCharacter("Carlotta");
  cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");
  cy.get('[data-test-calculator-nav="echoes"]').click();
}

function pickEcho(echoKey: string) {
  cy.get("[data-test-echo-edit-find]").click();
  cy.get(`[data-test-echo-picker-option="${echoKey}"]`).click();
}

/** Configures one build-strip slot: pick the echo, assign it to FrostyResolve. */
function configureFrostyResolveEcho(index: number, echoKey: string) {
  cy.get(`[data-test-echo-item="${index}"]`).click();
  pickEcho(echoKey);
  cy.get('[data-test-echo-edit-panel] button[aria-label="FrostyResolve"]').click();
  cy.get("[data-test-echo-edit-panel-close]").click();
}

describe("Echo Set Bonuses / Main Echo panel — v3 (Labs flag)", () => {
  it("stays off by default — legacy Set Bonuses / Main Echo Buff render unchanged", () => {
    cy.visit("/");
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible");
    cy.get('[data-test-calculator-nav="echoes"]').click();

    cy.get("[data-test-echoes-set-one]").should("exist");
    cy.get("[data-test-echo-set-bonus-panel]").should("not.exist");
    cy.get("[data-test-main-echo-panel]").should("not.exist");
  });

  it("shows empty states before any echoes are configured, hiding the always-empty 1-piece slot in Auto", () => {
    openCarlottaEchoesTab();

    cy.get("[data-test-echo-set-bonus-panel]").scrollIntoView().should("be.visible");
    // Only Shadow of Shattered Dreams has a 1pc bonus, so an inactive
    // 1-piece slot is hidden entirely in Auto mode rather than shown empty.
    cy.get('[data-test-echo-set-bonus-slot="setBonusOnePiece"]').should("not.exist");
    cy.get('[data-test-echo-set-bonus-slot="setBonusOne"]').should("contain.text", "No bonus active yet.");
    cy.get('[data-test-echo-set-bonus-slot="setBonusTwo"]').should("contain.text", "No bonus active yet.");

    cy.get("[data-test-main-echo-panel]").should("contain.text", "No main echo equipped.");

    // Manual override always shows it, since it's still pickable there.
    cy.get("[data-test-set-override-toggle]").contains("Manual override").click();
    cy.get('[data-test-echo-set-bonus-slot="setBonusOnePiece"]').should("exist");
  });

  it("auto-detects a 5pc bonus as echoes are equipped, and reuses the existing passive/main-echo-buff controls", () => {
    openCarlottaEchoesTab();

    configureFrostyResolveEcho(0, "SentryConstruct");
    configureFrostyResolveEcho(1, "AbyssalMercator");
    configureFrostyResolveEcho(2, "CuddleWuddle");
    configureFrostyResolveEcho(3, "ChestMimic");
    configureFrostyResolveEcho(4, "LottieLost");

    cy.get('[data-test-echo-set-bonus-slot="setBonusTwo"]').should("contain.text", "Frosty Resolve");
    cy.get('[data-test-echo-set-bonus-slot="setBonusTwo"]').should("contain.text", "5pc");

    // Reused unchanged from the legacy component — same keys as
    // calculator/echoes.cy.ts's assertions for this exact fixture.
    cy.get('[data-test-echo-set-passive-enabled="FrostyResolve5Set5SetGlacioDMGBonus"]').check();
    cy.get('[data-test-echo-set-passive-enabled="FrostyResolve5Set5SetSkillDMGBonus"]').check();
    cy.get('[data-test-echo-set-stacks="FrostyResolve5Set5SetSkillDMGBonus"]').clear().type("2");

    // SentryConstruct's main-slot buff is alwaysEnabled — force-checked and
    // disabled, same as the legacy path.
    cy.get('[data-test-main-echo-panel]').should("contain.text", "Sentry Construct");
    cy.get('[data-test-main-echo-enabled="SentryConstruct"]').should("be.checked").and("be.disabled");
  });

  it("Manual override lets you pick a different set independent of what's equipped, and Auto reverts it", () => {
    openCarlottaEchoesTab();

    configureFrostyResolveEcho(0, "SentryConstruct");
    configureFrostyResolveEcho(1, "AbyssalMercator");
    configureFrostyResolveEcho(2, "CuddleWuddle");
    configureFrostyResolveEcho(3, "ChestMimic");
    configureFrostyResolveEcho(4, "LottieLost");
    cy.get('[data-test-echo-set-bonus-slot="setBonusTwo"]').should("contain.text", "Frosty Resolve");

    cy.get("[data-test-set-override-toggle]").contains("Manual override").click();
    cy.get('[data-test-echo-set-bonus-slot="setBonusTwo"] [data-test-echo-set-bonus-picker]').click();
    cy.get(".app-rich-select__menu:visible").contains(".app-rich-select__option", "Freezing Frost 5 Set").click();
    cy.get('[data-test-echo-set-bonus-slot="setBonusTwo"]').should("contain.text", "Freezing Frost");

    cy.get("[data-test-set-override-toggle]").contains("Auto").click();
    cy.get('[data-test-echo-set-bonus-slot="setBonusTwo"]').should("contain.text", "Frosty Resolve");
  });
});
