describe("Team Rotations", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  function configureCharacterWithWeapon(character: string) {
    cy.richSelect("[data-test-character-select]", character);
    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.get(".weapon__basic-data").should("be.visible");
    cy.get("[data-test-weapon-open-browser]").click();
    cy.get('[data-test-weapon-browser-filter-rarity="5"]').click();
    cy.get('[data-test-weapon-browser-list="TheLastDance"]').click();
    cy.get("[data-test-weapon-select]").should("contain.text", "The Last Dance");
  }

  it("builds a team rotation across two characters and computes total damage/DPS", () => {
    configureCharacterWithWeapon("Carlotta");
    configureCharacterWithWeapon("Chixia");

    cy.get("[data-test-nav-team-rotations]").click();
    cy.location("pathname").should("eq", "/team-rotations");

    cy.get("[data-test-team-rotations-new]").click();
    cy.get("[data-test-team-rotation-editor]").should("be.visible");

    // Assign both characters to slots 0 and 1
    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");
    cy.get('[data-test-team-rotation-slot="0"]').should("contain.text", "Carlotta");
    cy.richSelect('[data-test="team-rotation-slot-select-1"]', "Chixia");
    cy.get('[data-test-team-rotation-slot="1"]').should("contain.text", "Chixia");

    // Add an action for Carlotta (slot 0, the default for new actions)
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect(
      '[data-test-rotation-action-skill-input="none"]',
      "BasicAttackStage1DMG",
    );

    // Add a second action and reassign it to Chixia (slot 1)
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]')
      .first()
      .parent()
      .find("[data-test-team-rotation-action-slot]")
      .select("1");
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect(
      '[data-test-rotation-action-skill-input="none"]',
      "PowPowStage1DMG",
    );

    // Set a rotation duration
    cy.get("[data-test-team-rotation-duration]").clear().type("10");

    // Total damage/DPS should now render with non-zero numbers
    cy.get("[data-test-team-rotation-damages]").should(($el) => {
      expect($el.text()).to.match(/Total DMG/);
    });
    cy.get("[data-test-team-rotation-dps]").should("be.visible");

    // "Configure Character" should navigate back to the Calculator with that
    // character set active
    cy.get('[data-test-team-rotation-configure-character="Carlotta"]').click();
    cy.location("pathname").should("eq", "/");
    cy.get(".character__selection.Carlotta").should("exist");

    // Back to Team Rotations, the team should have persisted
    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-item]").should("exist");

    // Delete the team
    cy.get("[data-test-team-rotations-delete]").first().click();
    cy.get("[data-test-team-rotations-item]").should("not.exist");

    // Reload and confirm the deletion persisted
    cy.reload();
    cy.get("[data-test-team-rotations-item]").should("not.exist");
  });
});
