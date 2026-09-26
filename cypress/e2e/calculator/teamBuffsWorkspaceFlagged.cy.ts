// Covers the redesigned Team Buffs workspace (src/components/CalculatorTeamBuffsWorkspace.vue)
// behind the "UI Overhaul 3.0" liveResultBar labs flag. Reuses the same Carlotta
// fixture/expected numbers as the legacy-path spec (./teamBuffs.cy.ts) so this
// proves parity, not just "renders something" — the flag-off path is left
// untouched and covered separately.
import {
  carlottaDamagesAfterAllTeamBuffs,
  carlottaStatsAfterAllTeamBuffs,
} from "./data/Carlotta/index";

function visitWithFlagEnabled() {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
      );
    },
  });
}

// The legacy spec's testAttacks/testStats scope to `.results` — the
// flag-off split pane. With the flag on, CalculatorLiveResultDetail shows
// them in tabs instead: the Attacks tab reuses CalculatorDamage rows (same
// `.{attack}-dmg` classes), but the Overview tab has its own stat rows keyed
// by `data-test-live-result-stat-row-key`, and only lists the character's own
// element — so the legacy `.stat-*` selectors are mapped onto those keys here,
// and other elements' bonuses (covered by calculator/teamBuffs.cy.ts) skipped.
const OVERVIEW_STAT_KEYS: Record<string, string> = {
  ".stat-hp": "totalHp",
  ".stat-atk": "totalAtk",
  ".stat-def": "totalDef",
  ".stat-cr": "totalCritRate",
  ".stat-cd": "totalCritDMG",
  ".stat-er": "energyRegen",
  ".stat-basic": "basicAttackDmgBonus",
  ".stat-heavy": "heavyAttackDmgBonus",
  ".stat-skill": "resonanceSkillDmgBonus",
  ".stat-liberation": "resonanceLiberationDmgBonus",
  ".stat-glacio": "elementDmgBonus", // Carlotta's own element
  ".stat-healing": "healingBonus",
};
function testStatsInDetail(stats: StatTests) {
  cy.get("[data-test-live-result-detail-tab-overview]").click();
  stats.forEach(({ selector, value }) => {
    const key = OVERVIEW_STAT_KEYS[selector];
    if (!key) return;
    cy.get(
      `[data-test-live-result-detail] [data-test-live-result-stat-row-key="${key}"]`,
    ).should("contain.text", value);
  });
}
function testAttacksInDetail(attackTests: AttackTests) {
  // Attack groups are a collapsed-by-default accordion.
  cy.get("[data-test-live-result-detail-tab-attacks]").click();
  cy.get("[data-test-live-result-attacks-expand-all]").click();
  attackTests.forEach(({ selector, values }) => {
    cy.get(`[data-test-live-result-detail] ${selector}`).should(($el) => {
      values.forEach((text) => {
        expect($el).to.contain.text(text);
      });
    });
  });
}

describe("Team Buffs Workspace (liveResultBar flag): Carlotta golden path", () => {
  it("reproduces the legacy Team Buffs page's exact stats/damages through the redesigned workspace", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="team"]').click();

    cy.get('[data-test-team-buffs-slot-avatar="1"]').should("be.visible");
    cy.get('[data-test-team-buffs-slot-avatar="2"]').should("be.visible");

    // choose 2 characters for team buffs — sections start expanded (they
    // reuse useFilterPanelOpen, same as Custom Buffs), unlike the legacy
    // page's DaisyUI collapse which starts closed, so no clicks needed here.
    cy.selectTeamBuffsSlotCharacter(1, "Shorekeeper");
    cy.selectTeamBuffsSlotCharacter(2, "Zhezhi");
    cy.get('[data-test-team-buffs-slot-name="1"]').should("contain.text", "Shorekeeper");
    cy.get('[data-test-team-buffs-slot-name="2"]').should("contain.text", "Zhezhi");

    // enable team member buffs for Shorekeeper
    cy.get('[data-test-team-buffs-buff-enabled="SophisticatedStellarealmCritRate"]').check();
    cy.get('[data-test-team-buffs-buff-input-base="SophisticatedStellarealmCritRate"]').type("250");
    cy.get('[data-test-team-buffs-buff-enabled="ReleasedStellarealmCritDMG"]').check();
    cy.get('[data-test-team-buffs-buff-input-base="ReleasedStellarealmCritDMG"]').type("250");

    cy.get('[data-test-team-buffs-buff-enabled="OutroSkillBinaryButterfly"]').check();
    cy.get('[data-test-team-buffs-buff-enabled="InherentSkillSelfGravitation"]').check();
    cy.get('[data-test-team-buffs-buff-enabled="SequenceNode2NightsGiftandRefusal"]').check();
    // enable team member buffs for Zhezhi
    cy.get('[data-test-team-buffs-buff-enabled="OutroSkillWhitening"]').check();
    cy.get('[data-test-team-buffs-buff-enabled="SequenceNode4HuesSpectrum"]').check();

    // activate all team echo buffs
    cy.get('[data-test-team-buffs-buff-enabled="RejuvenatingGlow"]').check();
    cy.get('[data-test-team-buffs-buff-enabled="MoonlitClouds"]').check();
    cy.get('[data-test-team-buffs-buff-enabled="ImpermanenceHeron"]').check();
    cy.get('[data-test-team-buffs-buff-enabled="BellBorne eochelone"]').check();
    cy.get('[data-test-team-buffs-buff-enabled="FallacyOfNoReturn"]').check();
    cy.get('[data-test-team-buffs-buff-enabled="EmpyreanAnthem"]').check();
    cy.get('[data-test-team-buffs-buff-enabled="MidnightVeil"]').check();

    // activate all team weapon buffs
    cy.get('[data-test-team-buffs-buff-enabled="StaticMistATK"]').check();
    cy.get('[data-test-team-buffs-buff-stacks="StaticMistATK"]').clear().type("1");
    cy.get('[data-test-team-buffs-buff-refinement="StaticMistATK"]').select("5");
    cy.get('[data-test-team-buffs-buff-enabled="StellarSymphonyATK"]').check();
    cy.get('[data-test-team-buffs-buff-refinement="StellarSymphonyATK"]').select("5");
    cy.get('[data-test-team-buffs-buff-enabled="LuminousHymnSpectroFrazzle"]').check();
    cy.get('[data-test-team-buffs-buff-refinement="LuminousHymnSpectroFrazzle"]').select("5");

    // verify the stats and damages, read from the live-result detail
    // slide-out instead of the legacy `.results` split pane
    cy.get("[data-test-live-result-bar-toggle]").click();
    cy.get("[data-test-live-result-detail]").should("be.visible");
    testAttacksInDetail(carlottaDamagesAfterAllTeamBuffs);
    testStatsInDetail(carlottaStatsAfterAllTeamBuffs);
  });

  it("lets you quickly cap a stacking team buff's stacks with the Max button", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="team"]').click();
    cy.get('[data-test-team-buffs-buff-enabled="PactofNeonlightLeap"]').check();
    cy.get('[data-test-team-buffs-buff-stacks="PactofNeonlightLeap"]').should("have.value", "0");
    cy.get('[data-test-team-buffs-buff-stacks-max="PactofNeonlightLeap"]').click();
    cy.get('[data-test-team-buffs-buff-stacks="PactofNeonlightLeap"]').should("have.value", "50");
  });

  it("supports the redesign's own affordances: search and the grouped active-buffs tray", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="team"]').click();

    // Search narrows the echo/weapon lists by name or effect text.
    cy.get('[data-test-team-buffs-workspace-search]').type("Fallacy");
    cy.get('[data-test-team-buffs-buff-enabled="FallacyOfNoReturn"]').should("be.visible");
    cy.get('[data-test-team-buffs-buff-enabled="ImpermanenceHeron"]').should("not.exist");
    cy.get('[data-test-team-buffs-workspace-search]').clear();

    // Enabling a buff lists it in the active tray under its source's group.
    cy.get('[data-test-team-buffs-buff-enabled="FallacyOfNoReturn"]').check();
    cy.get('[data-test-team-buffs-tray-group="echo"]').should("contain.text", "Fallacy of No Return");
    cy.get('[data-test-team-buffs-tray-group="weapon"]').should("not.exist");

    // The tray's ✕ disables the buff without opening the section again.
    cy.get('[data-test-team-buffs-tray-remove="FallacyOfNoReturn"]').click();
    cy.get('[data-test-team-buffs-buff-enabled="FallacyOfNoReturn"]').should("not.be.checked");

    // Reset all clears every enabled buff and both teammate slots.
    cy.selectTeamBuffsSlotCharacter(1, "Shorekeeper");
    cy.get('[data-test-team-buffs-buff-enabled="RejuvenatingGlow"]').check();
    cy.get('[data-test-team-buffs-workspace-reset]').click();
    cy.get('[data-test-team-buffs-slot-name="1"]').should("contain.text", "None");
    cy.get("[data-test-team-buffs-active-tray]").should("not.exist");
  });

  it("hides inactive buffs via the Hide unused toggle", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="team"]').click();

    cy.get('[data-test-team-buffs-buff-enabled="FallacyOfNoReturn"]').scrollIntoView().should("be.visible");
    cy.get('[data-test-team-buffs-buff-enabled="ImpermanenceHeron"]').check();

    cy.get("[data-test-team-buffs-hide-unused]").check();
    cy.get('[data-test-team-buffs-buff-enabled="FallacyOfNoReturn"]').should("not.exist");
    cy.get('[data-test-team-buffs-buff-enabled="ImpermanenceHeron"]').scrollIntoView().should("be.visible");

    cy.get("[data-test-team-buffs-hide-unused]").uncheck();
    cy.get('[data-test-team-buffs-buff-enabled="FallacyOfNoReturn"]').scrollIntoView().should("be.visible");
  });

  it("hides weapon buffs no selected teammate can equip via the Hide impossible toggle", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="team"]').click();

    // No teammates yet: nothing can be ruled out, so the toggle is a no-op.
    cy.get("[data-test-team-buffs-hide-impossible]").check();
    cy.get('[data-test-team-buffs-buff-enabled="StaticMistATK"]').should("exist");

    // Shorekeeper wields a Rectifier: Pistol buffs go, Rectifier buffs stay.
    cy.selectTeamBuffsSlotCharacter(1, "Shorekeeper");
    cy.get('[data-test-team-buffs-buff-enabled="StaticMistATK"]').should("not.exist");
    cy.get('[data-test-team-buffs-buff-enabled="StellarSymphonyATK"]').should("exist");

    cy.get("[data-test-team-buffs-hide-impossible]").uncheck();
    cy.get('[data-test-team-buffs-buff-enabled="StaticMistATK"]').should("exist");
  });

  it("toggles a teammate's buff list by clicking anywhere on the bar, not just the chevron", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="team"]').click();
    cy.selectTeamBuffsSlotCharacter(1, "Shorekeeper");

    // Starts open by default. Clicking empty space in the bar closes it.
    cy.get('[data-test-team-buffs-section="team1"]').should("have.attr", "aria-expanded", "true");
    cy.get('[data-test-team-buffs-slot-avatar="1"]').parent().click("right");
    cy.get('[data-test-team-buffs-section="team1"]').should("have.attr", "aria-expanded", "false");

    // Clicking it again reopens it.
    cy.get('[data-test-team-buffs-slot-avatar="1"]').parent().click("right");
    cy.get('[data-test-team-buffs-section="team1"]').should("have.attr", "aria-expanded", "true");

    // The chevron button itself still toggles exactly once (no double-toggle
    // from the click also bubbling to the row's own handler).
    cy.get('[data-test-team-buffs-section="team1"]').click();
    cy.get('[data-test-team-buffs-section="team1"]').should("have.attr", "aria-expanded", "false");
    cy.get('[data-test-team-buffs-slot-avatar="1"]').parent().click("right");

    // Toggling a buff, or opening the avatar's character browser, doesn't
    // also collapse the bar (their clicks don't propagate to it either).
    cy.get('[data-test-team-buffs-buff-enabled="SophisticatedStellarealmCritRate"]').check();
    cy.get('[data-test-team-buffs-section="team1"]').should("have.attr", "aria-expanded", "true");
    cy.get('[data-test-team-buffs-slot-avatar="1"]').click();
    cy.get("dialog.modal[open]").should("exist");
  });
});
