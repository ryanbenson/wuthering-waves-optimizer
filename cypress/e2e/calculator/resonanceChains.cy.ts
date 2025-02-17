import {
  carlottaOnlyResonanceChainsStats,
  carlottaOnlyResonanceChainsDamages,
} from "./data/Carlotta/index";
import { testAttacks } from "./utils/attackUtils";
import { testStats } from "./utils/statUtils";

describe("Calculator Resonance Chains", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should verify that by default no resonance chains are chosen", () => {
    cy.get('[data-test-calculator-nav="resonanceChains"]').click();
    cy.get(".character__resonance-chains").should("be.visible");
    cy.get('[type="checkbox"]').should("not.be.checked");
  });

  it("should ensure all resonance chains are able to be chosen and affect your results", () => {
    cy.get(".character__selection__form--character select").select("Carlotta");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
    cy.get(".character__selection.Carlotta").should("be.visible");
    cy.get('[data-test-calculator-nav="resonanceChains"]').click();

    // should only be one
    cy.get(".character__resonance-chain").each(($card) => {
      cy.wrap($card).find("input[type=checkbox]").click();
    });
    // validate the stats and damages after
    testStats(carlottaOnlyResonanceChainsStats, cy);
    testAttacks(carlottaOnlyResonanceChainsDamages, cy);
  });
});
