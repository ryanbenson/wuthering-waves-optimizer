import { carlottaEnemyFifty } from "./data/Carlotta/index";
import { testAttacks } from "./utils/attackUtils";

describe("Calculator Enemy", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should verify that enemy level and info are available, and not elemental effects and can change basic enemy data", () => {
    cy.get(".character__selection__form--character select").select("Carlotta");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
    cy.get(".character__selection.Carlotta").should("be.visible");
    cy.get('[data-test-calculator-nav="enemy"]').click();
    cy.get("[data-test-enemy-info]").should("be.visible");
    cy.get("[data-test-enemy-level]").should("be.visible");
    cy.get("[data-test-enemy-resist]").should("be.visible");
    cy.get("[data-test-enemy-resist]").should("be.visible");
    cy.get("[data-test-enemy-elemental-effects-title]").should("exist");
    cy.get("[data-test-enemy-spectro-frazzle]").should("not.exist");
    cy.get("[data-test-enemy-havoc-bane]").should("exist");

    // alter the enemy level and resist
    cy.get("[data-test-enemy-level-input]")
      .invoke("val", 50)
      .trigger("input")
      .trigger("change");
    cy.get("[data-test-enemy-resist-input]")
      .invoke("val", 0.5)
      .trigger("input")
      .trigger("change");
    // ensure the labels are updated
    cy.get("[data-test-enemy-level-label]").should("contain.text", "50");
    cy.get("[data-test-enemy-resist-label]").should("contain.text", "50%");
    // validate the stats and damages after
    testAttacks(carlottaEnemyFifty, cy);
  });

  it("should verify that spectro frazzle appears on relevant characters", () => {
    cy.get(".character__selection__form--character select").select("Phoebe");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
    cy.get(".character__selection.Phoebe").should("be.visible");
    cy.get('[data-test-calculator-nav="enemy"]').click();
    cy.get("[data-test-enemy-info]").should("be.visible");
    cy.get("[data-test-enemy-level]").should("be.visible");
    cy.get("[data-test-enemy-resist]").should("be.visible");
    cy.get("[data-test-enemy-resist]").should("be.visible");
    cy.get("[data-test-enemy-elemental-effects-title]").should("exist");
    cy.get("[data-test-enemy-spectro-frazzle]").should("exist");

    // alter the stacks
    cy.get("[data-test-enemy-spectro-frazzle-input]")
      .invoke("val", 10)
      .trigger("input")
      .trigger("change");
    // ensure the labels are updated
    cy.get("[data-test-enemy-spectro-frazzle-label]").should(
      "contain.text",
      "10",
    );
    // ensure spectro frazzle damage appears on Phoebe
    cy.get(".calculator__damages .spectro-frazzle").should(
      "contain.text",
      "Spectro Frazzle",
    );
    cy.get(".calculator__damages .spectro-frazzle").should(
      "contain.text",
      "4137",
    );
  });
});
