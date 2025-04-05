import {
  carlottaOnlyCustomBuffsStats,
  carlottaOnlyCustomBuffsDamages,
} from "./data/Carlotta/index";
import { testAttacks } from "./utils/attackUtils";
import { testStats } from "./utils/statUtils";

describe("Calculator Custom Buffs", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should verify that by default no resonance chains are chosen", () => {
    cy.get('[data-test-calculator-nav="customBuffs"]').click();
    cy.get(".custom__buffs-list").should("be.visible");
    cy.get(".custom__buffs-list .form-control").each(($input) => {
      cy.wrap($input).find("input[type=number]").should("have.value", "0");
    });
  });

  it("should ensure all resonance chains are able to be chosen and affect your results", () => {
    cy.get(".character__selection__form--character select").select("Carlotta");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
    cy.get(".character__selection.Carlotta").should("be.visible");
    cy.get('[data-test-calculator-nav="customBuffs"]').click();

    cy.get(".custom__buffs-list .form-control").each(($input) => {
      cy.wrap($input).find("input[type=number]").clear().type("50");
    });
    // validate the stats and damages after
    testStats(carlottaOnlyCustomBuffsStats, cy);
    testAttacks(carlottaOnlyCustomBuffsDamages, cy);
  });
});
