describe("Team Rotation Summary", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("shows a full damage report and returns to the editor", () => {
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible");
    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.get(".weapon__basic-data").should("be.visible");
    cy.get("[data-test-weapon-open-browser]").click();
    cy.get('[data-test-weapon-browser-filter-rarity="5"]').click();
    cy.get('[data-test-weapon-browser-list="TheLastDance"]').click();
    cy.get("[data-test-weapon-select]").should("contain.text", "The Last Dance");

    cy.visit("/teams");
    cy.get("[data-test-team-rotations-new]").click();
    cy.get("[data-test-team-rotation-editor]").should("be.visible");

    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");
    cy.get('[data-test-team-rotation-slot="0"]').should("contain.text", "Carlotta");
    cy.get("[data-test-team-rotation-duration]").clear().type("20");

    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect(
      '[data-test-rotation-action-skill-input="none"]',
      "BasicAttackStage1DMG",
    );

    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect(
      '[data-test-rotation-action-skill-input="none"]',
      "BasicAttackStage2DMG",
    );

    cy.get("[data-test-team-rotation-summary-view-summary]").first().click();
    cy.get("[data-test-team-rotation-summary-page]").should("be.visible");

    // Stat cards
    cy.get("[data-test-team-rotation-summary-stats]").within(() => {
      cy.contains("Total DMG").should("be.visible");
      cy.contains("Normal:").should("be.visible");
      cy.contains("Average:").should("be.visible");
      cy.contains("Crit:").should("be.visible");
    });
    cy.get("[data-test-team-rotation-summary-dps]").should("be.visible");
    cy.get("[data-test-team-rotation-summary-strongest-hit]").should(
      "contain.text",
      "Carlotta",
    );

    // Timeline charts
    cy.get("[data-test-team-rotation-timeline-chart]").should("be.visible");
    cy.get("[data-test-team-rotation-timeline-chart] canvas").should("exist");
    cy.get("[data-test-team-rotation-character-timeline-chart]").should(
      "be.visible",
    );
    cy.get("[data-test-team-rotation-character-timeline-chart] canvas").should(
      "exist",
    );

    // Distribution + per-character card + enemy card
    cy.get("[data-test-team-rotation-damage-chart]").should("be.visible");
    cy.get("[data-test-team-rotation-cumulative-damage-chart]").should(
      "be.visible",
    );
    cy.get("[data-test-team-rotation-cumulative-damage-chart] canvas").should(
      "exist",
    );
    cy.get('[data-test-team-rotation-summary-character="0"]').should(
      "contain.text",
      "Carlotta",
    );
    cy.get('[data-test-team-rotation-summary-character="0"]').should(
      "contain.text",
      "The Last Dance",
    );
    cy.get("[data-test-team-rotation-summary-enemy]").should("be.visible");

    // Back navigation returns to the editor, not the team list
    cy.get("[data-test-team-rotation-summary-back]").click();
    cy.get("[data-test-team-rotation-editor]").should("be.visible");
  });

  it("shows an empty-state message for the timeline charts when there's no duration", () => {
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible");

    cy.visit("/teams");
    cy.get("[data-test-team-rotations-new]").click();
    cy.get("[data-test-team-rotation-editor]").should("be.visible");

    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");
    cy.get('[data-test-team-rotation-slot="0"]').should("contain.text", "Carlotta");

    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect(
      '[data-test-rotation-action-skill-input="none"]',
      "BasicAttackStage1DMG",
    );

    cy.get("[data-test-team-rotation-summary-view-summary]").first().click();
    cy.get("[data-test-team-rotation-summary-page]").should("be.visible");

    cy.get("[data-test-team-rotation-timeline-chart-empty]").should(
      "be.visible",
    );
    cy.get("[data-test-team-rotation-character-timeline-chart-empty]").should(
      "be.visible",
    );
    cy.get("[data-test-team-rotation-cumulative-damage-chart-empty]").should(
      "be.visible",
    );
  });
});
