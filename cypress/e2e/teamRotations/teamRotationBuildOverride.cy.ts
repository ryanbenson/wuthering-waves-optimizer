describe("Team Rotations per-slot build override (issue #278)", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  // Every mounted AppRichSelect renders its dropdown menu even when closed,
  // so interactions must scope from the specific trigger's own
  // `.app-rich-select` wrapper (same approach as the `richSelect` custom
  // command) rather than a bare global selector — needed here since a
  // build's id (the option's real value) is random, unlike `cy.richSelect`
  // which targets options by value.
  function pickRichSelectOptionByLabel(triggerSelector: string, label: string) {
    cy.get(triggerSelector).first().as("trigger");
    cy.get("@trigger").scrollIntoView().click({ force: true });
    cy.get("@trigger")
      .closest(".app-rich-select")
      .should("have.class", "dropdown-open")
      .within(() => {
        cy.contains("[data-test-rich-select-option]", label).click({ force: true });
      });
  }

  function readSlotAtk(slot: number) {
    return cy
      .get(`[data-test-team-rotation-slot="${slot}"]`)
      .find('[data-test-team-rotation-slot-stat="atk"] span')
      .invoke("text")
      .then((text) => Number(text.replace(/,/g, "")));
  }

  it("pins a slot to a non-active build, reflecting that build's stats/damage without changing the character's own active build", () => {
    // Default build: no weapon.
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible");

    // Create "Burst Build" (duplicates the still-weaponless Default build)
    // and give it a real weapon while it's active.
    cy.get("[data-test-manage-builds-open]").click();
    cy.get("[data-test-manage-builds-new-name]").type("Burst Build");
    cy.get("[data-test-manage-builds-create-active]").click();
    cy.get("[data-test-manage-builds-close]").click();

    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.get("[data-test-weapon-open-browser]").click();
    cy.get('[data-test-weapon-browser-filter-rarity="5"]').click();
    cy.get('[data-test-weapon-browser-list="TheLastDance"]').click();
    cy.get("[data-test-weapon-select]").should("contain.text", "The Last Dance");

    // Switch back to Default (weaponless) as the active build.
    cy.get('[data-test-calculator-nav="character"]').click();
    pickRichSelectOptionByLabel("[data-test-build-select]", "Default");
    cy.get("[data-test-build-select]").should("contain.text", "Default");

    // Build a team, assign Carlotta to slot 0.
    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-new]").click();
    cy.get("[data-test-team-rotation-editor]").should("be.visible");
    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");
    cy.get('[data-test-team-rotation-slot="0"]').should("contain.text", "Carlotta");

    // Baseline: slot follows Carlotta's active build (Default, no weapon).
    readSlotAtk(0).then((baselineAtk) => {
      cy.wrap(baselineAtk).as("baselineAtk");
    });

    // Pin this slot to "Burst Build" — the character's own active build must
    // stay Default throughout.
    pickRichSelectOptionByLabel(
      '[data-test="team-rotation-slot-build-select-0"]',
      "Burst Build",
    );

    cy.get("@baselineAtk").then((baselineAtk) => {
      readSlotAtk(0).should("be.greaterThan", baselineAtk as unknown as number);
    });

    // Add a rotation action for this slot and confirm the damage number
    // reflects the pinned build too, not just the stat preview.
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect(
      '[data-test-rotation-action-skill-input="none"]',
      "BasicAttackStage1DMG",
    );
    cy.get("[data-test-team-rotation-duration]").clear().type("10");
    cy.get("[data-test-team-rotation-summary-view-damages]").click();
    cy.get('[data-test-team-rotation-action-damage="Basic Attack Stage 1 DMG"]')
      .invoke("text")
      .then((text) => {
        expect(Number(text.replace(/[^0-9.]/g, ""))).to.be.greaterThan(0);
      });

    // The character's own active build was never touched by any of this.
    cy.get("[data-test-team-rotation-damages-close]").click();
    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__self-buffs").should("be.visible");
    cy.get("[data-test-build-select]").should("contain.text", "Default");
    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.get("[data-test-weapon-select]").should("contain.text", "Choose a weapon");
  });
});
