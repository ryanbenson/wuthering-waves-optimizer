import { config, dataAttacks, dataStats } from "../data/Jinhsi/data";
import { testAttacks } from "../utils/attackUtils";
import { testStats } from "../utils/statUtils";

describe("Calculator Data Verification: Jinhsi", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should import data then verify stats and damages", () => {
    cy.importCharacterData(config);
    cy.get("[data-test-nav-calculator]").click();
    // ensure it's Jinhsi before we validate
    cy.get(".character__selection.Jinhsi").should("be.visible");

    // validate the stats and damages after
    testStats(dataStats, cy);
    testAttacks(dataAttacks, cy);
  });
});
