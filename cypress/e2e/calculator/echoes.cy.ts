import {
  carlottaEchoesStats,
  carlottaEchoesDamages,
} from "./data/Carlotta/index";
import { testAttacks } from "./utils/attackUtils";
import { testStats } from "./utils/statUtils";
import { configureEcho } from "./utils/echoesUtils";

describe("Calculator Echoes", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should enable basic echoes and main echo is based off of the first echo choice", () => {
    cy.get(".character__selection__form--character select").select("Carlotta");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
    cy.get(".character__selection.Carlotta").should("be.visible");
    cy.get('[data-test-calculator-nav="echoes"]').click();

    // should have 5 basic echo items
    cy.get(".echo__item").should("have.length", 5);
    cy.get("[data-test-echoes-set-one]").should("exist");
    cy.get("[data-test-echoes-set-one]").should(
      "contain.text",
      "No first echo set bonus is configured.",
    );
    cy.get("[data-test-echoes-set-two]").should("exist");
    cy.get("[data-test-echoes-set-two]").should(
      "contain.text",
      "No second echo set bonus is configured.",
    );
    // main echo should not exist
    cy.get(".main-echo__name").should("not.exist");

    // configure echoes
    const echo0 = {
      mainEcho: "SentryConstruct",
      mainStat: "CritRate",
      set: "FrostyResolve",
      subStats: {
        CritRate: 7.5,
        CritDMG: 16.2,
        ATK: 9.4,
        ATK_FLAT: 50,
        ResonanceSkillDMGBonus: 10.9,
      },
    };
    configureEcho(0, echo0, cy);

    const echo1 = {
      mainEcho: "AbyssalMercator",
      mainStat: "Glacio",
      set: "FrostyResolve",
      subStats: {
        CritRate: 7.5,
        CritDMG: 16.2,
        ATK: 9.4,
        ATK_FLAT: 50,
        ResonanceSkillDMGBonus: 10.9,
      },
    };
    configureEcho(1, echo1, cy);

    const echo2 = {
      mainEcho: "CuddleWuddle",
      mainStat: "Glacio",
      set: "FrostyResolve",
      subStats: {
        CritRate: 7.5,
        CritDMG: 16.2,
        ATK: 9.4,
        ATK_FLAT: 50,
        ResonanceSkillDMGBonus: 10.9,
      },
    };
    configureEcho(2, echo2, cy);

    const echo3 = {
      mainEcho: "ChestMimic",
      mainStat: "ATK",
      set: "FrostyResolve",
      subStats: {
        CritRate: 7.5,
        CritDMG: 16.2,
        ATK: 9.4,
        ATK_FLAT: 50,
        ResonanceSkillDMGBonus: 10.9,
      },
    };
    configureEcho(3, echo3, cy);

    const echo4 = {
      mainEcho: "LottieLost",
      mainStat: "ATK",
      set: "FrostyResolve",
      subStats: {
        CritRate: 7.5,
        CritDMG: 16.2,
        ATK: 9.4,
        ATK_FLAT: 50,
        ResonanceSkillDMGBonus: 10.9,
      },
    };
    configureEcho(4, echo4, cy);

    // enable the passives for the echo set 2
    cy.get(
      `[data-test-echo-set-passive-enabled="FrostyResolve5Set5SetGlacioDMGBonus"]`,
    ).check();
    cy.get(
      `[data-test-echo-set-passive-enabled="FrostyResolve5Set5SetSkillDMGBonus"]`,
    ).check();
    cy.get(`[data-test-echo-set-stacks="FrostyResolve5Set5SetSkillDMGBonus"]`)
      .clear()
      .type("2");
    // enable the main echo buff
    cy.get(`[data-test-main-echo-enabled="SentryConstruct"]`).check();

    // validate the stats and damages after, stats should be default even with custom buff
    testStats(carlottaEchoesStats, cy);
    testAttacks(carlottaEchoesDamages, cy);
  });
});
