import { config, dataAttacks, dataStats } from "../data/Cartethyia/data";
import { testAttacks } from "../utils/attackUtils";
import { testStats } from "../utils/statUtils";

describe("Calculator Data Verification: Cartethyia", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should import data then verify stats and damages", () => {
    cy.importCharacterData(config);
    cy.get("[data-test-nav-calculator]").click();
    // ensure it's Cartethyia before we validate
    cy.get(".character__selection.Cartethyia").should("be.visible");

    // validate the stats and damages after
    testStats(dataStats, cy);
    testAttacks(dataAttacks, cy);
  });
});
