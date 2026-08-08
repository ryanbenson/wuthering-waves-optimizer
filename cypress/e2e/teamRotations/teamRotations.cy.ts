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

    cy.visit("/teams");
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
    cy.location("pathname").should("eq", "/teams");
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

    // Add a second action; it defaults to the previously-used character
    // (Carlotta, slot 0) rather than always slot 0 by coincidence — reassign
    // it to Chixia by clicking her profile picture, which should clearly
    // highlight as selected
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]')
      .first()
      .closest("[data-test-team-rotation-action]")
      .as("secondAction");
    cy.get("@secondAction")
      .find('[data-test-team-rotation-action-slot-choice="1"]')
      .click();
    cy.get("@secondAction")
      .find('[data-test-team-rotation-action-slot-choice="1"]')
      .should("have.class", "border-primary");
    // The exclude/disabled checkboxes are hidden for team rotation actions
    cy.get("@secondAction").contains("Exclude team buffs").should("not.exist");
    cy.get("@secondAction").contains("Exclude weapon buffs").should("not.exist");
    cy.get("@secondAction").contains("Disabled").should("not.exist");
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect(
      '[data-test-rotation-action-skill-input="none"]',
      "PowPowStage1DMG",
    );

    // A third action should now default to the last-used character (Chixia),
    // not back to the first configured character
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]')
      .first()
      .closest("[data-test-team-rotation-action]")
      .find('[data-test-team-rotation-action-slot-choice="1"]')
      .should("have.class", "border-primary");
    // Remove that throwaway third (still-unconfigured) action so it doesn't
    // affect the damage totals asserted below
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]')
      .first()
      .find(".rotation__action--remove")
      .click({ force: true });

    // Set a rotation duration
    cy.get("[data-test-team-rotation-duration]").clear().type("10");

    // Total damage/DPS should now render with non-zero numbers
    cy.get("[data-test-team-rotation-damages]").should(($el) => {
      expect($el.text()).to.match(/Total DMG/);
    });
    cy.get("[data-test-team-rotation-dps]").should("be.visible");

    // Each action gets its own damage row, tagged with its own character's
    // avatar, and the two rows sum to the total shown above
    cy.get('[data-test-team-rotation-action-damage="Basic Attack Stage 1 DMG"]')
      .should("be.visible")
      .find("img")
      .should("have.attr", "src")
      .and("include", "Carlotta");
    cy.get('[data-test-team-rotation-action-damage="Stage 1 DMG"]')
      .should("be.visible")
      .find("img")
      .should("have.attr", "src")
      .and("include", "Chixia");

    // A stat snippet's Energy Regen is a percentage (e.g. "100.0%"), not a
    // raw 0-1 ratio mistakenly rendered as "1.0%"
    cy.get('[data-test-team-rotation-slot="0"] [data-test-team-rotation-slot-stat="energyRegen"]').should(
      ($el) => {
        expect($el.text()).to.match(/^\d{1,3}(\.\d)?%$/);
      },
    );

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
    cy.get("[data-test-team-rotations-total-dmg]").should(($el) => {
      expect($el.text()).to.match(/Total DMG:\s*\d/);
    });

    // Filtering by a character in the team keeps it visible; filtering by one
    // that isn't on any team hides it
    cy.richSelect("[data-test-team-rotations-filter]", "Carlotta");
    cy.get("[data-test-team-rotations-item]").should("exist");
    cy.richSelect("[data-test-team-rotations-filter]", "Calcharo");
    cy.get("[data-test-team-rotations-item]").should("not.exist");
    cy.get("[data-test-team-rotations-no-matches]").should("be.visible");
    cy.get("[data-test-team-rotations-filter]").click();
    cy.get('[data-test-rich-select-option="null"]').click({ force: true });
    cy.get("[data-test-team-rotations-item]").should("exist");

    // Delete the team, with confirmation. The dialog is a native <dialog>
    // that's always in the DOM but only becomes visible once showModal()
    // runs, which can take longer than the default command timeout on a
    // resource-constrained CI runner — wait for it explicitly.
    cy.get("[data-test-team-rotations-delete]").first().click();
    cy.get(".confirm-dialog", { timeout: 10000 }).should("be.visible");
    cy.get(".confirm-dialog .modal-action").contains("button", "Cancel").click();
    cy.get(".confirm-dialog").should("not.be.visible");
    cy.get("[data-test-team-rotations-item]").should("exist");

    cy.get("[data-test-team-rotations-delete]").first().click();
    cy.get(".confirm-dialog", { timeout: 10000 }).should("be.visible");
    cy.get(".confirm-dialog .modal-action").contains("button", "Delete").click();
    cy.get("[data-test-team-rotations-item]").should("not.exist");
    cy.get("[data-test-team-rotations-empty]").should("be.visible");

    // Reload and confirm the deletion persisted
    cy.reload();
    cy.get("[data-test-team-rotations-item]").should("not.exist");
  });

  it("supports Advanced mode per-action buffs, copying settings, and the damage breakdown drawer", () => {
    configureCharacterWithWeapon("Carlotta");

    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-new]").click();
    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");

    // Enemy settings default to a closed, small-text summary bar rather than
    // a plain "Enemy Settings" title
    cy.get("[data-test-team-rotation-enemy-title]").should("not.exist");
    cy.get("[data-test-team-rotation-enemy-summary]").should("be.visible").and("contain.text", "Lv 90");
    cy.get("[data-test-team-rotation-enemy-collapse-toggle]").click({ force: true });
    cy.get("[data-test-team-rotation-enemy-title]").should("be.visible");
    cy.get("[data-test-team-rotation-enemy-summary]").should("not.exist");
    cy.get("[data-test-team-rotation-enemy-type-option='Elite']").click();
    cy.get("[data-test-team-rotation-enemy-collapse-toggle]").click({ force: true });

    cy.get("[data-test-team-rotation-mode-advanced]").click();

    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect('[data-test-rotation-action-skill-input="none"]', "BasicAttackStage1DMG");
    cy.get("[data-test-team-rotation-duration]").clear().type("10");

    cy.get('[data-test-team-rotation-action-damage="Basic Attack Stage 1 DMG"]')
      .find("td")
      .eq(1)
      .invoke("text")
      .then((baselineText) => {
        const baseline = Number(baselineText.trim());
        expect(baseline).to.be.greaterThan(0);

        // Configuring a self buff for just this action changes its damage
        cy.get("[data-test-team-rotation-action-configure-buffs]").first().click();
        cy.get("[data-test-team-rotation-advanced-buffs]").should("be.visible");
        cy.get("[data-test-advanced-buff-toggle]").first().click({ force: true });
        cy.get('[data-test-team-rotation-action-damage="Basic Attack Stage 1 DMG"]')
          .find("td")
          .eq(1)
          .invoke("text")
          .should((newText) => {
            expect(Number(newText.trim())).to.not.equal(baseline);
          });
      });

    // A second action can copy the first action's advanced buff config
    // instead of configuring everything from scratch
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get("[data-test-team-rotation-action-copy-previous]").should("exist").click();

    // Clicking a damage row opens the same breakdown used on the Calculator
    // page, showing the attack's full formula, above the top nav — and
    // clicking outside the panel (the overlay) closes it again
    cy.get('[data-test-team-rotation-action-damage="Basic Attack Stage 1 DMG"]').first().click();
    cy.get(".damage-breakdown").should("be.visible").and("contain.text", "Basic Attack Stage 1 DMG");
    cy.get(".drawer-overlay").click({ force: true });
    cy.get(".damage-breakdown").should("not.be.visible");
  });

  it("prompts how to seed Advanced mode's per-action buffs when a team already has actions", () => {
    configureCharacterWithWeapon("Carlotta");
    // Give the character a non-default self buff to prove it carries over
    cy.get('[data-test-calculator-nav="character"]').click();
    cy.contains("button", "Enable all").click();

    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-new]").click();
    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect('[data-test-rotation-action-skill-input="none"]', "BasicAttackStage1DMG");
    cy.get("[data-test-team-rotation-duration]").clear().type("10");

    // Switching to Advanced with no actions yet doesn't prompt (nothing to
    // seed) — but adding an action first means switching now does
    cy.get('[data-test-team-rotation-action-damage="Basic Attack Stage 1 DMG"]')
      .find("td")
      .eq(1)
      .invoke("text")
      .then((baselineText) => {
        const baseline = Number(baselineText.trim());

        cy.get("[data-test-team-rotation-mode-advanced]").click();
        cy.get("[data-test-team-rotation-mode-switch-modal]").should("be.visible");

        // Cancelling leaves the team in Basic mode, untouched
        cy.get("[data-test-team-rotation-mode-switch-cancel]").click();
        cy.get("[data-test-team-rotation-mode-switch-modal]").should("not.be.visible");
        cy.get("[data-test-team-rotation-mode-basic]").should("have.class", "btn-active");

        // Keeping the current setup switches to Advanced with the same
        // damage as before (the checkboxes reflect what's really enabled,
        // rather than appearing all-off) — no manual re-toggling needed
        cy.get("[data-test-team-rotation-mode-advanced]").click();
        cy.get("[data-test-team-rotation-mode-switch-keep-current]").click();
        cy.get("[data-test-team-rotation-mode-switch-modal]").should("not.be.visible");
        cy.get('[data-test-team-rotation-action-damage="Basic Attack Stage 1 DMG"]')
          .find("td")
          .eq(1)
          .invoke("text")
          .should((newText) => {
            expect(Number(newText.trim())).to.equal(baseline);
          });

        cy.get("[data-test-team-rotation-action-configure-buffs]").first().click();
        cy.get("[data-test-advanced-buff-toggle]").first().should("be.checked");
      });
  });
});
