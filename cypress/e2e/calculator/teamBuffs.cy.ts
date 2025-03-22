import { 
  carlottaDamagesAfterAllTeamBuffs,
  carlottaStatsAfterAllTeamBuffs,
} from "./data/Carlotta/index";
import { testAttacks } from "./utils/attackUtils";
import { testStats } from "./utils/statUtils";

describe("Calculator Team Buffs", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should enable you to choose characters to get buffs from", () => {
    cy.get(".character__selection__form--character select").select("Carlotta");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
    cy.get(".character__selection.Carlotta").should("be.visible");
    cy.get('[data-test-calculator-nav="teamBuffs"]').click();
    cy.get("[data-test-party-member-1-input]").should("be.visible");
    cy.get("[data-test-party-member-2-input]").should("be.visible");

    // choose 2 characters for team buffs
    cy.get("[data-test-party-member-1-input]").select("Shorekeeper");
    cy.get("[data-test-party-member-2-input]").select("Zhezhi");
    cy.get("[data-test-party-member-1-name]").should("contain.text", "Shorekeeper");
    cy.get("[data-test-party-member-2-name]").should("contain.text", "Zhezhi");
    // enable team member buffs for Shorekeeper
    cy.get(`[data-test-party-buff-enabled="SophisticatedStellarealmCritRate"]`).check();
    cy.get(`data-test-party-buff-input-base="SophisticatedStellarealmCritRate"`).type("250");
    cy.get(`[data-test-party-buff-enabled="ReleasedStellarealmCritDMG"]`).check();
    cy.get(`data-test-party-buff-input-base="ReleasedStellarealmCritDMG"`).type("250");
    cy.get(`[data-test-party-buff-enabled="OutroSkillBinaryButterfly"]`).check();
    cy.get(`[data-test-party-buff-enabled="InherentSkillSelfGravitation"]`).check();
    cy.get(`[data-test-party-buff-enabled="SequenceNode2NightsGiftandRefusal"]`).check();
    // enable team member buffs for Zhezhi
    cy.get(`[data-test-party-buff-enabled="OutroSkillWhitening"]`)
      .check();
    cy.get(`[data-test-party-buff-enabled="SequenceNode4HuesSpectrum"]`)
      .check();
    // activate all team echo buffs
    cy.get(`[data-test-party-buff-enabled="RejuvenatingGlow"]`).check();
    cy.get(`[data-test-party-buff-enabled="MoonlitClouds"]`).check();
    cy.get(`[data-test-party-buff-enabled="ImpermanenceHeron"]`).check();
    cy.get(`[data-test-party-buff-enabled="BellBorne eochelone"]`).check();
    cy.get(`[data-test-party-buff-enabled="FallacyOfNoReturn"]`).check();
    cy.get(`[data-test-party-buff-enabled="MidnightVeil"]`).check();
    cy.get(`[data-test-party-buff-enabled="EmpyreanAnthem"]`).check()
    // activate all team weapon buffs
    cy.get(`[data-test-party-buff-enabled="StaticMistATK"]`).check();
    cy.get(`[data-test-party-buff-stacks="StaticMistATK"]`).type("1");
    cy.get(`[data-test-party-refinements="StaticMistATK"]`).select("5");
    cy.get(`[data-test-party-buff-enabled="StellarSymphonyATK"]`).check();
    cy.get(`[data-test-party-refinements="StellarSymphonyATK"]`).select("5");
    cy.get(`[data-test-party-buff-enabled="LuminousHymnSpectroFrazzle"]`).check();
    cy.get(`[data-test-party-refinements="LuminousHymnSpectroFrazzle"]`).select("5");

    // verify the stats and damages are valid
    testAttacks(carlottaDamagesAfterAllTeamBuffs, cy);
    testStats(carlottaStatsAfterAllTeamBuffs, cy);
  });
});
