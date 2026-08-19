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
    cy.richSelect("[data-test-character-select]", "Carlotta");
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

    // add an action — newly-added actions auto-open for editing (see
    // CalculatorRotation.vue's addAction -> toggleEdit()), so there's no
    // need to click into it first; doing so would just toggle it shut again
    cy.get(`[data-test-rotation-action-add="Test001"]`).click();
    cy.get(`[data-test-rotation-action-by-attack-key="none"]`).should(
      "be.visible",
    );
    // find and change the skill used
    cy.get(`[data-test-rotation-action-skill-input="none"]`).should(
      "be.visible",
    );
    cy.richSelect(
      `[data-test-rotation-action-skill-input="none"]`,
      "BasicAttackStage1DMG",
    );
    // create second action
    cy.get(`[data-test-rotation-action-add="Test001"]`).click();
    cy.get(`[data-test-rotation-action-by-attack-key="none"]`).should(
      "be.visible",
    );
    // find and change the skill used
    cy.get(`[data-test-rotation-action-skill-input="none"]`).should(
      "be.visible",
    );
    cy.richSelect(
      `[data-test-rotation-action-skill-input="none"]`,
      "FatalFinaleDMG",
    );
    // Manual buffs live behind "Configure Stats" now, separate from the
    // "choose attack" edit form that clicking the row opens
    cy.get(`[data-test-rotation-action-skill-input="FatalFinaleDMG"]`)
      .closest(".rotation__action")
      .find("[data-test-rotation-action-configure-stats]")
      .click();
    // add a buff to the second action
    cy.get(`[data-test-action-add-buff="FatalFinaleDMG"]`).should("be.visible");
    cy.get(`[data-test-action-add-buff="FatalFinaleDMG"]`).click();
    cy.get(`[data-test-action-buff-input="none"]`).should("be.visible");
    cy.richSelect(`[data-test-action-buff-input="none"]`, "CritRate");
    cy.get(`[data-test-action-buff-value-input="CritRate"]`).should(
      "be.visible",
    );
    cy.get(`[data-test-action-buff-value-input="CritRate"]`).clear().type("50");
    // make the BasicAttackStage1DMG have 5 instances of hits
    cy.get(`[data-test-rotation-action-hits-input="BasicAttackStage1DMG"]`)
      .clear()
      .type("5"); // this is causing 51, not 5. don't care to fix it now
    // TODO: Fix this so it's just 5, not 51

    // validate the stats and damages after, stats should be default even with custom buff
    testStats(carlottaRotationStats, cy);
    testAttacks(carlottaRotationTest001Damages, cy);
  });

  it("should let an action's buffs be configured independently via the advanced buff panel", () => {
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible");
    cy.get('[data-test-calculator-nav="rotations"]').click();

    cy.get(`[data-test-rotations-action="create"]`).click();
    cy.get(`[data-test-rotation-item-by-name="Untitled Rotation"]`).click();

    cy.get(`[data-test-rotation-name-input="Untitled Rotation"]`)
      .clear()
      .type("BuffPanelTest");
    cy.get(`[data-test-rotation-action-add="BuffPanelTest"]`).click();
    cy.get(`[data-test-rotation-action-skill-input="none"]`).should(
      "be.visible",
    );
    cy.richSelect(
      `[data-test-rotation-action-skill-input="none"]`,
      "BasicAttackStage1DMG",
    );

    cy.get(`[data-test-rotation-action-skill-input="BasicAttackStage1DMG"]`)
      .closest(".rotation__action")
      .as("action1");

    // Untouched actions show a "synced" pill.
    cy.get("@action1")
      .find("[data-test-rotation-action-sync-status]")
      .should("contain.text", "Synced with character");

    // Old "Exclude team buffs"/"Exclude weapon buffs" checkboxes are gone;
    // "Configure Buffs" opens the same per-buff toggle panel Team Rotations
    // uses. The resync button only exists once the panel is open.
    cy.get("@action1").find("[data-test-rotation-action-configure-buffs]").click();
    cy.get("[data-test-team-rotation-advanced-buffs]").should("be.visible");
    cy.get("@action1").find("[data-test-rotation-action-resync]").should("be.disabled");
    cy.get("[data-test-advanced-buff-toggle]").first().as("firstToggle");
    cy.get("@firstToggle")
      .invoke("prop", "checked")
      .then((wasChecked) => {
        cy.get("@firstToggle").click({ force: true });
        cy.get("@firstToggle")
          .invoke("prop", "checked")
          .should("eq", !wasChecked);
      });

    // Toggling a buff doesn't blow up the rest of the page — damages still render.
    testStats(carlottaRotationStats, cy);

    // The pill flips to "customized" and the resync button becomes usable.
    cy.get("@action1")
      .find("[data-test-rotation-action-sync-status]")
      .should("contain.text", "Customized buffs");
    cy.get("@action1")
      .find("[data-test-rotation-action-resync]")
      .should("be.enabled")
      .click();

    // "Stay synced with character" clears the override and restores the pill.
    cy.get("@action1")
      .find("[data-test-rotation-action-sync-status]")
      .should("contain.text", "Synced with character");
    cy.get("@action1")
      .find("[data-test-rotation-action-resync]")
      .should("be.disabled");
  });
});
