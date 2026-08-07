function enableTeamRotationsLab(win: Cypress.AUTWindow) {
  win.localStorage.setItem(
    "settings",
    JSON.stringify({ config: {}, labs: { teamRotations: { isEnabled: true } } }),
  );
}

describe("Team Rotations feature flag", () => {
  it("hides the nav link and blocks direct navigation while the Labs flag is off", () => {
    cy.visit("/");
    cy.get("[data-test-nav-team-rotations]").should("not.exist");

    cy.visit("/team-rotations");
    cy.location("pathname").should("eq", "/");
  });

  it("can be enabled from Settings > Labs, revealing the nav link", () => {
    cy.visit("/");
    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-settings]").click();
    cy.get("[data-test-settings-labs]").click();
    cy.contains("label", "Team Rotations")
      .find("input[type=checkbox]")
      .click();
    cy.get("[data-test-nav-calculator]").click();
    cy.get("[data-test-nav-team-rotations]").should("be.visible");
  });
});

describe("Team Rotations", () => {
  beforeEach(() => {
    cy.visit("/", { onBeforeLoad: enableTeamRotationsLab });
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
    cy.get("[data-test-team-rotations-empty]").should("be.visible");

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
      .closest("[data-test-team-rotation-action]")
      .find("[data-test-team-rotation-action-slot]")
      .as("slotTrigger");
    cy.get("@slotTrigger").click({ force: true });
    cy.get("@slotTrigger")
      .closest(".app-rich-select")
      .should("have.class", "dropdown-open")
      .within(() => {
        cy.get('[data-test-rich-select-option="1"]').click({ force: true });
      });
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

    // Changing a teammate can be backed out of without losing the current
    // pick or their actions
    cy.get('[data-test-team-rotation-slot-change="0"]').click();
    cy.get('[data-test-team-rotation-slot-cancel-change="0"]').click();
    cy.get('[data-test-team-rotation-slot="0"]').should("contain.text", "Carlotta");
    cy.get('[data-test-rotation-action-by-attack-key="BasicAttackStage1DMG"]').should(
      "exist",
    );

    // "Configure Character" should navigate back to the Calculator with that
    // character set active
    cy.get('[data-test-team-rotation-configure-character="Carlotta"]').click();
    cy.location("pathname").should("eq", "/");
    cy.get(".character__selection.Carlotta").should("exist");

    // Back to Team Rotations: the main page shows the team list, not the editor
    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-list]").should("be.visible");
    cy.get("[data-test-team-rotations-item]").should("exist").and("contain.text", "action");

    // Delete the team, with confirmation
    cy.get("[data-test-team-rotations-delete]").first().click();
    cy.get(".confirm-dialog .modal-action").contains("button", "Cancel").click();
    cy.get("[data-test-team-rotations-item]").should("exist");

    cy.get("[data-test-team-rotations-delete]").first().click();
    cy.get(".confirm-dialog .modal-action").contains("button", "Delete").click();
    cy.get("[data-test-team-rotations-item]").should("not.exist");
    cy.get("[data-test-team-rotations-empty]").should("be.visible");

    // Reload and confirm the deletion persisted
    cy.reload();
    cy.get("[data-test-team-rotations-item]").should("not.exist");
  });
});
