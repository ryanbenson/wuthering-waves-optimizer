// v3 Optimizer setup readiness (issue #618): sticky run bar with named checks,
// the Echo buffs section (open by default, "not set" count, Enable all / Max
// all). The calculator fallback itself is covered by component tests
// (tests/components/CalculatorOptimizerEchoSetPassive.test.ts).

function openOptimizer() {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem("settings", JSON.stringify({ config: {} }));
    },
  });
  cy.selectWorkspaceCharacter("Carlotta");
  cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");
  cy.get('[data-test-calculator-nav="optimizer"]').click();
  cy.get("[data-test-optimizer-workspace-run-bar]").should("be.visible");
}

const check = (id: string) => cy.get(`[data-test-optimizer-workspace-check="${id}"]`);

describe("Optimizer Workspace: setup readiness", () => {
  it("names what's missing, warns about unset buffs without blocking, and bulk-sets them", () => {
    cy.viewport(1280, 800);
    openOptimizer();

    // Carlotta starts on her recommended set (Frosty Resolve) and an attack target,
    // so only the main echo is missing; Run is disabled.
    cy.get('[data-test-optimizer-workspace-echo-sets] [data-test-echo-set-toggle="FrostyResolve"]').should("have.attr", "aria-pressed", "true");
    check("sets").should("have.attr", "data-test-optimizer-workspace-check-state", "ok");
    check("mainEcho").should("have.attr", "data-test-optimizer-workspace-check-state", "missing");
    cy.get("[data-test-optimizer-workspace-optimize-btn]").should("be.disabled");

    // Without any set, that is its own red chip.
    cy.get('[data-test-optimizer-workspace-echo-sets] [data-test-echo-set-toggle="FrostyResolve"]').click();
    check("sets").should("have.attr", "data-test-optimizer-workspace-check-state", "missing");
    cy.get("[data-test-optimizer-workspace-recommended-sets]").click();
    check("sets").should("have.attr", "data-test-optimizer-workspace-check-state", "ok");

    // The main echo picker opens on the recommended sets and can search by name.
    cy.get("[data-test-optimizer-workspace-add-echo]").click();
    cy.get("[data-test-optimizer-workspace-picker-recommended]").should("have.class", "btn-active");
    cy.get("[data-test-optimizer-workspace-picker-search]").type("Sentry", { force: true });
    cy.get("[data-test-optimizer-workspace-pick-echo]").each(($button) => {
      expect($button.attr("data-test-optimizer-workspace-pick-echo")).to.contain("Sentry");
    });
    cy.get('[data-test-optimizer-workspace-pick-echo="SentryConstruct"]').click({ force: true });

    check("sets").should("have.attr", "data-test-optimizer-workspace-check-state", "ok");
    check("mainEcho").should("have.attr", "data-test-optimizer-workspace-check-state", "ok");
    check("target").should("have.attr", "data-test-optimizer-workspace-check-state", "ok");

    // Frosty Resolve's two optional passives have no setting anywhere.
    cy.get("[data-test-optimizer-workspace-buffs]").should("be.visible");
    cy.get("[data-test-optimizer-workspace-buffs-toggle]").should("have.attr", "aria-expanded", "true");
    cy.get("[data-test-optimizer-workspace-buffs-not-set]").should("contain.text", "2 not set");
    check("buffs")
      .should("have.attr", "data-test-optimizer-workspace-check-state", "warn")
      .and("contain.text", "2 buffs not set");
    // A warning, not a blocker.
    cy.get("[data-test-optimizer-workspace-optimize-btn]").should("not.be.disabled");
    cy.screenshot("optimizer-readiness-desktop", { capture: "viewport" });

    // Enable all keeps stacks, so the stacking passive is now "on at 0 stacks".
    cy.get("[data-test-optimizer-workspace-buffs-enable-all]").click();
    cy.get('[data-test-echo-set-passive="FrostyResolve5Set5SetSkillDMGBonus"]')
      .find("[data-test-optimizer-buff-status]")
      .should("have.attr", "data-test-optimizer-buff-status", "zero-stacks");
    check("buffs").should("contain.text", "1 buff not set");

    cy.get("[data-test-optimizer-workspace-buffs-max-all]").click();
    cy.get('[data-test-echo-set-stacks="FrostyResolve5Set5SetSkillDMGBonus"]').should("have.value", "2");
    check("buffs").should("not.exist");
    cy.get("[data-test-optimizer-workspace-buffs-not-set]").should("not.exist");

    // Turning one off on purpose is a setting, not a warning.
    cy.get('[data-test-echo-set-passive-enabled="FrostyResolve5Set5SetGlacioDMGBonus"]').uncheck();
    cy.get('[data-test-echo-set-passive="FrostyResolve5Set5SetGlacioDMGBonus"]')
      .find("[data-test-optimizer-buff-status]")
      .should("have.attr", "data-test-optimizer-buff-status", "off");
    check("buffs").should("not.exist");

    // The panel can be collapsed; it isn't remembered.
    cy.get("[data-test-optimizer-workspace-buffs-toggle]").click();
    cy.get('[data-test-echo-set-passive="FrostyResolve5Set5SetGlacioDMGBonus"]').should("not.be.visible");
  });

  it("clicking the buffs warning opens the section", () => {
    cy.viewport(1440, 900);
    openOptimizer();
    // Frosty Resolve is Carlotta's recommended set, selected from the start.
    cy.get("[data-test-optimizer-workspace-buffs-toggle]").click();
    cy.get("[data-test-optimizer-workspace-buffs-toggle]").should("have.attr", "aria-expanded", "false");

    check("buffs").click();
    cy.get("[data-test-optimizer-workspace-buffs-toggle]").should("have.attr", "aria-expanded", "true");
    // Scrolled into view under the sticky run bar, not hidden behind it.
    // (It's the last section, so the page may run out of scroll before it
    // reaches the bar.)
    cy.get("[data-test-optimizer-workspace-buffs]").should(($section) => {
      const bar = Cypress.$("[data-test-optimizer-workspace-run-bar]")[0].getBoundingClientRect();
      const top = $section[0].getBoundingClientRect().top;
      expect(top, `section top ${top}, bar bottom ${bar.bottom}`).to.be.within(bar.bottom - 4, 450);
    });
  });

  it("shows a one-line summary on phones", () => {
    // The optimizer tab is behind the menu on phones; open it at desktop width.
    cy.viewport(1440, 900);
    openOptimizer();
    cy.viewport(390, 844);
    // Carlotta's recommended set is already selected, so only the main echo is left.
    cy.get("[data-test-optimizer-workspace-run-bar-summary]").should("contain.text", "1 to fix");
    cy.screenshot("optimizer-readiness-phone", { capture: "viewport" });
  });
});
