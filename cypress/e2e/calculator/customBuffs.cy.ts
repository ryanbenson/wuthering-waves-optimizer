import {
  carlottaOnlyCustomBuffsStats,
  carlottaOnlyCustomBuffsDamages,
} from "./data/Carlotta/index";
import { testAttacks } from "./utils/attackUtils";
import { testStats } from "./utils/statUtils";

describe("Calculator Custom Buffs", () => {
  const customBuffNav = '[data-test-calculator-nav="customBuffs"]';
  const customBuffList = ".custom__buffs-list";
  const customBuffInputs = `${customBuffList} .form-control input[type=number]`;

  beforeEach(() => {
    cy.visit("/");
  });

  it("shows all custom buffs defaulting to zero", () => {
    cy.get(customBuffNav).click();
    cy.get(customBuffList).should("be.visible");
    cy.get(customBuffInputs).each(($input) => {
      cy.wrap($input).should("have.value", "0");
    });
  });

  it("applies custom buffs and updates expected stats/damage", () => {
    cy.get(".character__selection__form--character select").select("Carlotta");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
    cy.get(".character__selection.Carlotta").should("be.visible");
    cy.get(customBuffNav).click();

    cy.get(customBuffInputs).each(($input) => {
      cy.wrap($input).clear().type("50");
    });
    // validate the stats and damages after
    testStats(carlottaOnlyCustomBuffsStats, cy);
    testAttacks(carlottaOnlyCustomBuffsDamages, cy);
  });
});
