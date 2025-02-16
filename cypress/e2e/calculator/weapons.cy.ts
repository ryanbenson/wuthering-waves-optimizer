import {
    carlottaBaseDamages,
    carlottaBaseStats,
    carlottaBaseWeaponDamages,
    carlottaBaseWeaponStats,
} from "./data/Carlotta/index";
import { testAttacks } from "./utils/attackUtils";
import { testStats } from "./utils/statUtils";

describe("Calculator Weapons", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should verify that by default no weapon is chosen", () => {
    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.get(".weapon__basic-data").should("be.visible");
    cy.get(".weapon__left").should("be.visible");
    cy.get(".weapon__selection__image").should("be.visible");
    cy.get("[data-test-weapon-basic-stats]").should("not.exist");
    cy.get("[data-test-weapon-passives]").should("not.exist");
  });

  it("should be able to use the weapon browser", () => {
    cy.get(".character__selection__form--character select").select("Carlotta");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
    cy.get(".character__selection.Carlotta").should("be.visible");
    // validate stats and damages before choosing a weapon
    testStats(carlottaBaseStats, cy);
    // should be good at this point
    cy.get('[data-test-calculator-nav="weapon"]').click();
    // open the browser
    cy.get('[data-test-weapon-open-browser]').click();
    // verify default state with filters and items
    cy.get("[data-test-weapon-browser-list]").should("be.visible");
    cy.get("[data-test-weapon-browser-filters]").should("be.visible");
    // do a filter
    cy.get('[data-test-weapon-browser-filter-rarity="5"]').should("be.visible");
    cy.get("[data-test-weapon-browser-list]").should("be.visible");
    // choose a weapon
    cy.get('[data-test-weapon-browser-list="TheLastDance"]').should("be.visible");
    cy.get('[data-test-weapon-browser-list="TheLastDance"]').click();
    cy.get('[data-test-weapon-browser]').should("not.be.visible");
    cy.get("[data-test-weapon-basic-stats]").should("be.visible");
    cy.get("[data-test-weapon-passives]").should("be.visible");
    // validate the input
    cy.get('[data-test-weapon-select]').find('option:selected').should('have.text', 'The Last Dance');
    // validate the stats and damages after choosing a weapon
    testStats(carlottaBaseWeaponStats, cy);


    // TODO: Choose passives and re-validate
    // should only have the rarity filters
    // Stats calculations
    // testStats(calcharoLevel90BaseStats, cy);
    // // Damages validations
    // testAttacks(calcharoLevel90, cy);
    // cy.get(".character__self-buffs .character__buffs .card").each(($card) => {
    //   cy.wrap($card).find("input[type=checkbox]").click();
    // });
    // // Stats calculations
    // testStats(calcharoLevel90AllSelfBonusesStats, cy);
    // // Damages validations
    // testAttacks(calcharoLevel90AllSelfBonuses, cy);
  });
});
