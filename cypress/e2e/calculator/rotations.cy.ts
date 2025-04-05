import {
  carlottaRotationStats,
  carlottaRotationTest001Damages,
} from "./data/Carlotta/index";
import { testAttacks } from "./utils/attackUtils";
import { testStats } from "./utils/statUtils";

describe("Calculator Rotations", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should enable basic rotations with action buffs", () => {
    cy.get(".character__selection__form--character select").select("Carlotta");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
    cy.get(".character__selection.Carlotta").should("be.visible");
    cy.get('[data-test-calculator-nav="rotations"]').click();

    cy.get(`[data-test-rotations-action="create"]`).should("be.visible");
    cy.get(`[data-test-rotations-action="import"]`).should("be.visible");
    cy.get(`[data-test-rotations-action="presets"]`).should("be.visible");

    // create basic rotation
    cy.get(`[data-test-rotations-action="create"]`).click();
    // should get default untitled rotation
    cy.get(`[data-test-rotation-item-by-name="Untitled Rotation"]`).should(
      "be.visible",
    );

    // click into and setup basic rotation
    cy.get(`[data-test-rotation-item-by-name="Untitled Rotation"]`).click();
    // change the name
    cy.get(`[data-test-rotation-name-input="Untitled Rotation"]`)
      .clear()
      .type("Test001");

    // add an action
    cy.get(`[data-test-rotation-action-add="Test001"]`).click();
    // find first action that's empty and click to get into it
    cy.get(`[data-test-rotation-action-by-attack-key="none"]`).should(
      "be.visible",
    );
    cy.get(`[data-test-rotation-action-by-attack-key="none"]`).click();
    // find and change the skill used
    cy.get(`[data-test-rotation-action-skill-input="none"]`).should(
      "be.visible",
    );
    cy.get(`[data-test-rotation-action-skill-input="none"]`).select(
      "BasicAttackStage1DMG",
    );
    // create second action
    cy.get(`[data-test-rotation-action-add="Test001"]`).click();
    // find first action that's empty and click to get into it
    cy.get(`[data-test-rotation-action-by-attack-key="none"]`).should(
      "be.visible",
    );
    cy.get(`[data-test-rotation-action-by-attack-key="none"]`).click();
    // find and change the skill used
    cy.get(`[data-test-rotation-action-skill-input="none"]`).should(
      "be.visible",
    );
    cy.get(`[data-test-rotation-action-skill-input="none"]`).select(
      "FatalFinaleDMG",
    );
    // add a buff to the second action
    cy.get(`[data-test-action-add-buff="FatalFinaleDMG"]`).should("be.visible");
    cy.get(`[data-test-action-add-buff="FatalFinaleDMG"]`).click();
    cy.get(`[data-test-action-buff-input="none"]`).should("be.visible");
    cy.get(`[data-test-action-buff-input="none"]`).select("CritRate");
    cy.get(`[data-test-action-buff-value-input="CritRate"]`).should(
      "be.visible",
    );
    cy.get(`[data-test-action-buff-value-input="CritRate"]`).clear().type("50");

    // validate the stats and damages after, stats should be default even with custom buff
    testStats(carlottaRotationStats, cy);
    testAttacks(carlottaRotationTest001Damages, cy);
  });
});
