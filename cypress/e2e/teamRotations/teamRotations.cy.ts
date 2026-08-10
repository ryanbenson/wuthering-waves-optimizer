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
    cy.get('[data-test-rotation-action-by-attack-key="none"]')
      .first()
      .closest("[data-test-team-rotation-action]")
      .find("[data-test-rotation-action-remove]")
      .click({ force: true });

    // Set a rotation duration
    cy.get("[data-test-team-rotation-duration]").clear().type("10");

    // The sticky summary header shows a quick aggregate + distribution bar
    // even before opening the full damages drawer
    cy.get("[data-test-team-rotation-summary]").should("be.visible");
    cy.get("[data-test-team-rotation-damage-bar]").should("be.visible");

    // Damages live in a slideout, not always on-screen — open it to see the
    // full total damage/DPS breakdown
    cy.get("[data-test-team-rotation-summary-view-damages]").click();
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

    // The drawer's own explicit close (✕) button works too, not just
    // clicking outside — and while open, nothing else on the page (like the
    // main nav) should be able to render or receive clicks above it
    cy.window().then((win) => {
      const nav = win.document.querySelector("#navbar-container");
      const drawerSide = win.document.querySelector(".drawer-side");
      expect(nav).to.exist;
      expect(drawerSide).to.exist;
      const navZ = Number(win.getComputedStyle(nav as Element).zIndex);
      const drawerZ = Number(win.getComputedStyle(drawerSide as Element).zIndex);
      expect(drawerZ).to.be.greaterThan(navZ);
    });
    cy.get("[data-test-team-rotation-damages-close]").click();
    cy.get("[data-test-team-rotation-damages]").should("not.be.visible");
    cy.get("[data-test-team-rotation-summary-view-damages]").click();
    cy.get("[data-test-team-rotation-damages]").should("be.visible");

    // Close the drawer before returning to the main config — its panel
    // overlaps the right side of the page while open
    cy.get(".drawer-overlay").click();
    cy.get("[data-test-team-rotation-damages]").should("not.be.visible");

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
      expect($el.text()).to.match(/Total DMG:\s*Normal:\s*\d.*Average:\s*\d.*Crit:\s*\d/);
    });

    // Filtering by a character in the team keeps it visible; filtering by one
    // that isn't on any team hides it
    cy.richSelect("[data-test-team-rotations-filter]", "Carlotta");
    cy.get("[data-test-team-rotations-item]").should("exist");
    cy.richSelect("[data-test-team-rotations-filter]", "Calcharo");
    cy.get("[data-test-team-rotations-item]").should("not.exist");
    cy.get("[data-test-team-rotations-no-matches]").should("be.visible");
    cy.get("[data-test-team-rotations-clear-filters]").click();
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

    // Damages live in a slideout, which overlaps the right side of the page
    // while open — open it just to read the baseline, then close it again
    // before configuring buffs in the main config area. DaisyUI's drawer
    // has a fixed 300ms slide transition, so pause briefly after each
    // open/close to let it settle before the next interaction.
    cy.get("[data-test-team-rotation-summary-view-damages]").click();
    cy.wait(350);
    cy.get('[data-test-team-rotation-action-damage="Basic Attack Stage 1 DMG"]')
      .find("td")
      .eq(1)
      .invoke("text")
      .then((baselineText) => {
        const baseline = Number(baselineText.trim());
        expect(baseline).to.be.greaterThan(0);
        cy.get(".drawer-overlay").click();
        cy.wait(350);

        // Configuring a self buff for just this action changes its damage
        cy.get("[data-test-team-rotation-action-configure-buffs]").first().click();
        cy.get("[data-test-team-rotation-advanced-buffs]").should("be.visible");
        cy.get("[data-test-advanced-buff-toggle]").first().click({ force: true });

        cy.get("[data-test-team-rotation-summary-view-damages]").click();
        cy.wait(350);
        cy.get('[data-test-team-rotation-action-damage="Basic Attack Stage 1 DMG"]')
          .find("td")
          .eq(1)
          .invoke("text")
          .should((newText) => {
            expect(Number(newText.trim())).to.not.equal(baseline);
          });
        cy.get(".drawer-overlay").click();
        cy.wait(350);
      });

    // A second action can copy the first action's advanced buff config
    // instead of configuring everything from scratch — "Copy previous
    // action settings" lives inside the "Configure Buffs" panel now, since
    // it acts on that panel's own data
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get("[data-test-team-rotation-action-configure-buffs]").eq(1).click();
    cy.get("[data-test-team-rotation-action-copy-previous]").should("exist").click();

    // Clicking a damage row swaps the same slideout to the attack breakdown
    // used on the Calculator page, showing the attack's full formula
    cy.get("[data-test-team-rotation-summary-view-damages]").click();
    cy.wait(350);
    cy.get('[data-test-team-rotation-action-damage="Basic Attack Stage 1 DMG"]').first().click();
    cy.get(".damage-breakdown").should("be.visible").and("contain.text", "Basic Attack Stage 1 DMG");

    // "Back to damages" returns to the damages list without closing the drawer
    cy.get("[data-test-team-rotation-breakdown-back]").click();
    cy.get(".damage-breakdown").should("not.exist");
    cy.get("[data-test-team-rotation-damages]").should("be.visible");

    // Clicking outside the panel (the overlay) closes the whole drawer
    cy.get('[data-test-team-rotation-action-damage="Basic Attack Stage 1 DMG"]').first().click();
    cy.get(".damage-breakdown").should("be.visible");
    cy.get(".drawer-overlay").click();
    cy.wait(350);
    cy.get(".damage-breakdown").should("not.exist");
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

  it("bulk-applies a buff's on/off state across a range of actions via its Duration control", () => {
    configureCharacterWithWeapon("Carlotta");
    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-new]").click();
    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");
    cy.get("[data-test-team-rotation-mode-advanced]").click();

    const addActionWithAttack = (attackKey: string) => {
      cy.get("[data-test-team-rotation-add-action]").click();
      cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
      cy.richSelect('[data-test-rotation-action-skill-input="none"]', attackKey);
    };
    addActionWithAttack("BasicAttackStage1DMG");
    addActionWithAttack("ArtofViolenceDMG");
    addActionWithAttack("FatalFinaleDMG");

    // Turn on the first self buff for the first action, then use its
    // "Duration" control to carry that same on/off state forward across all
    // three actions at once, instead of configuring each one individually.
    cy.get("[data-test-team-rotation-action-configure-buffs]").eq(0).click();
    cy.get("[data-test-advanced-buff-toggle]").first().should("not.be.checked");
    cy.get("[data-test-advanced-buff-toggle]").first().click({ force: true });
    cy.get("[data-test-advanced-buff-duration-open]").first().click();
    cy.get("[data-test-advanced-buff-duration-panel]").first().should("be.visible");
    cy.get("[data-test-advanced-buff-duration-count]").first().clear().type("3");
    cy.get("[data-test-advanced-buff-duration-apply]").first().click();
    // Collapse the first action's panel again before inspecting the others
    cy.get("[data-test-team-rotation-action-configure-buffs]").eq(0).click();

    cy.get("[data-test-team-rotation-action-configure-buffs]").eq(1).click();
    cy.get("[data-test-advanced-buff-toggle]").first().should("be.checked");
    cy.get("[data-test-team-rotation-action-configure-buffs]").eq(1).click();

    cy.get("[data-test-team-rotation-action-configure-buffs]").eq(2).click();
    cy.get("[data-test-advanced-buff-toggle]").first().should("be.checked");
  });

  it("lets the Duration control's 'until action' range reach across other characters' actions", () => {
    configureCharacterWithWeapon("Carlotta");
    configureCharacterWithWeapon("Chixia");
    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-new]").click();
    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");
    cy.richSelect('[data-test="team-rotation-slot-select-1"]', "Chixia");
    cy.get("[data-test-team-rotation-mode-advanced]").click();

    // Action 1: Carlotta
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect('[data-test-rotation-action-skill-input="none"]', "BasicAttackStage1DMG");

    // Action 2: switch to Chixia (slot 1)
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]')
      .first()
      .closest("[data-test-team-rotation-action]")
      .find('[data-test-team-rotation-action-slot-choice="1"]')
      .click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect('[data-test-rotation-action-skill-input="none"]', "PowPowStage1DMG");

    // Action 3: back to Carlotta (slot 0)
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]')
      .first()
      .closest("[data-test-team-rotation-action]")
      .find('[data-test-team-rotation-action-slot-choice="0"]')
      .click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect('[data-test-rotation-action-skill-input="none"]', "ArtofViolenceDMG");

    // Toggle on Carlotta's first self buff on action 1, then use "Until
    // action" to carry it through Chixia's action — but not into Carlotta's
    // later action 3, proving the range walks the *whole team's* timeline
    // (across characters) rather than only Carlotta's own actions.
    cy.get("[data-test-team-rotation-action-configure-buffs]").eq(0).click();
    cy.get("[data-test-advanced-buff-toggle]").first().click({ force: true });
    cy.get("[data-test-advanced-buff-duration-open]").first().click();
    cy.get("[data-test-advanced-buff-duration-panel]")
      .first()
      .within(() => {
        cy.contains("button", "Until action").click();
        cy.get('[data-test^="advanced-buff-duration-until-"]').click();
      });
    cy.contains("[data-test-rich-select-option]", "PowPowStage1DMG").click();
    cy.get("[data-test-advanced-buff-duration-apply]").first().click();
    cy.get("[data-test-team-rotation-action-configure-buffs]").eq(0).click();

    // Action 3 (Carlotta again) shouldn't have picked up the override —
    // "until Chixia's action" stopped the range there
    cy.get("[data-test-team-rotation-action-configure-buffs]").eq(2).click();
    cy.get("[data-test-advanced-buff-toggle]").first().should("not.be.checked");
  });

  it("sticks the summary header below the nav (in a simplified form) once scrolled past it", () => {
    configureCharacterWithWeapon("Carlotta");
    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-new]").click();
    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");

    // Add a real attack to the first action so the team has nonzero damage —
    // otherwise TeamRotationDamageBar's segments (filtered to value > 0) are
    // empty and the bar never renders at all, regardless of scroll position.
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect(
      '[data-test-rotation-action-skill-input="none"]',
      "BasicAttackStage1DMG",
    );

    // Add enough more actions that the page actually needs to scroll
    for (let i = 0; i < 7; i++) {
      cy.get("[data-test-team-rotation-add-action]").click();
    }

    // Clicking "+ Add Action" repeatedly (further down the page each time)
    // leaves the page auto-scrolled from Cypress bringing it into view —
    // start from a known scroll position. Scroll `window` directly rather
    // than cy.scrollTo() on a subject: this page's actual scroll position
    // lives on window/documentElement, and Cypress's own heuristics for
    // picking a scroll target against a non-scrolling `body` proved
    // unreliable here.
    const scrollWindowTo = (y: number) => cy.window().then((win) => win.scrollTo(0, y));

    scrollWindowTo(0);
    cy.get("[data-test-team-rotation-summary]").should(
      "have.attr",
      "data-test-team-rotation-summary-stuck",
      "false",
    );
    // The un-stuck header shows the roomier layout, not the compact one
    cy.get("[data-test-team-rotation-summary]").should("contain.text", "Total DMG");

    scrollWindowTo(600);
    cy.get("[data-test-team-rotation-summary]").should(
      "have.attr",
      "data-test-team-rotation-summary-stuck",
      "true",
    );
    // The stuck/simplified header shows the team name, character count, and
    // a one-line distribution bar, condensed into a single row
    cy.get("[data-test-team-rotation-summary]").should("contain.text", "Team 1");
    cy.get("[data-test-team-rotation-summary]").should("contain.text", "action");
    cy.get("[data-test-team-rotation-damage-bar]").should("be.visible");

    scrollWindowTo(0);
    cy.get("[data-test-team-rotation-summary]").should(
      "have.attr",
      "data-test-team-rotation-summary-stuck",
      "false",
    );
  });

  // The import modal is a native <dialog>, opened/closed via
  // showModal()/close() — those set/clear its `open` attribute
  // synchronously. Asserting on that attribute (rather than "be.visible",
  // which additionally waits on daisyUI's 200ms opacity/transform CSS
  // transition actually finishing) checks the state that matters without
  // depending on a CSS animation frame landing — "be.visible" alone proved
  // unreliable in CI's headless browser even with a 10s timeout, despite
  // never reproducing locally. Each of the three import scenarios below
  // also gets its own test (opening the dialog exactly once each) rather
  // than reusing one dialog instance across three open/close cycles in a
  // single test — simpler to reason about and removes any chance of a
  // leftover state from one cycle bleeding into the next.
  function buildTest001RotationAndTeam() {
    configureCharacterWithWeapon("Carlotta");

    // Build a saved rotation for Carlotta on her Calculator page first, so
    // there's something real for the team-side importer to list.
    cy.get('[data-test-calculator-nav="rotations"]').click();
    cy.get('[data-test-rotations-action="create"]').click();
    cy.get('[data-test-rotation-item-by-name="Untitled Rotation"]').click();
    cy.get('[data-test-rotation-name-input="Untitled Rotation"]').clear().type("Test001");
    // Calculator-page actions auto-open for editing when added (see
    // CalculatorRotation.vue's addAction -> toggleEdit()) — no need to click
    // into it first; doing so would just toggle it shut again.
    cy.get('[data-test-rotation-action-add="Test001"]').click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').should("be.visible");
    cy.richSelect('[data-test-rotation-action-skill-input="none"]', "BasicAttackStage1DMG");
    cy.get('[data-test-rotation-action-add="Test001"]').click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').should("be.visible");
    cy.richSelect('[data-test-rotation-action-skill-input="none"]', "FatalFinaleDMG");

    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-new]").click();
    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");
  }

  it("lists a character's own saved rotations and presets in the import dialog", () => {
    buildTest001RotationAndTeam();

    cy.get('[data-test-team-rotation-import-rotation-open="0"]').click();
    cy.get("[data-test-team-rotation-import-modal]").should("have.attr", "open");
    cy.contains("[data-test-team-rotation-import-modal] h4", "Your rotations")
      .parent()
      .contains("Test001")
      .should("exist");
    cy.contains("[data-test-team-rotation-import-modal] h4", "Presets")
      .parent()
      .contains("Kushy was here :3")
      .should("exist");
  });

  it("imports (appends) a saved rotation into an already-populated slot", () => {
    buildTest001RotationAndTeam();

    // Pre-populate the slot with one manual action so "append" has
    // something real to keep, distinct from importing onto an empty slot.
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect('[data-test-rotation-action-skill-input="none"]', "ArtofViolenceDMG");

    cy.get('[data-test-team-rotation-import-rotation-open="0"]').click();
    cy.get("[data-test-team-rotation-import-modal]").should("have.attr", "open");
    cy.contains(".card", "Test001")
      .find("[data-test-team-rotation-import-append]")
      .click();
    cy.get("[data-test-team-rotation-import-modal]").should("not.have.attr", "open");
    cy.get("[data-test-team-rotation-action]").should("have.length", 3);
    cy.get('[data-test-rotation-action-by-attack-key="ArtofViolenceDMG"]').should("exist");
    cy.get('[data-test-rotation-action-by-attack-key="BasicAttackStage1DMG"]').should("exist");
    cy.get('[data-test-rotation-action-by-attack-key="FatalFinaleDMG"]').should("exist");
  });

  it("imports (overwrites) a saved rotation, replacing the slot's existing actions", () => {
    buildTest001RotationAndTeam();

    // Pre-populate the slot with one manual action that overwrite should
    // remove entirely.
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect('[data-test-rotation-action-skill-input="none"]', "ArtofViolenceDMG");

    cy.get('[data-test-team-rotation-import-rotation-open="0"]').click();
    cy.get("[data-test-team-rotation-import-modal]").should("have.attr", "open");
    cy.contains(".card", "Test001")
      .find("[data-test-team-rotation-import-overwrite]")
      .click();
    cy.get("[data-test-team-rotation-import-modal]").should("not.have.attr", "open");
    cy.get("[data-test-team-rotation-action]").should("have.length", 2);
    cy.get('[data-test-rotation-action-by-attack-key="ArtofViolenceDMG"]').should("not.exist");
    cy.get('[data-test-rotation-action-by-attack-key="BasicAttackStage1DMG"]').should("exist");
    cy.get('[data-test-rotation-action-by-attack-key="FatalFinaleDMG"]').should("exist");
  });
});

describe("Team Rotations export/import", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        enableTeamRotationsLab(win);
        cy.stub(win.navigator.clipboard, "writeText").as("writeText").resolves();
      },
    });
  });

  it("exports a team's config to the clipboard and re-imports it as a separate team", () => {
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-new]").click();
    cy.get("[data-test-team-rotation-name]").clear().type("My Export Team");
    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect('[data-test-rotation-action-skill-input="none"]', "BasicAttackStage1DMG");

    cy.get("[data-test-team-rotation-export-clipboard]").click();
    cy.get("@writeText").should("have.been.calledOnce");

    cy.get("@writeText").then((stub: any) => {
      const exported = stub.getCall(0).args[0] as string;
      const parsed = JSON.parse(exported);
      // Only the team's own config is exported — never the referenced
      // characters' full builds (those stay reference-only, as documented).
      expect(parsed.meta.type).to.equal("teamRotation");
      expect(parsed.data.name).to.equal("My Export Team");
      expect(parsed.data.characterIds[0]).to.equal("Carlotta");
      expect(parsed.data.actions).to.have.length(1);
      expect(parsed.data).not.to.have.property("weapon");

      cy.get("[data-test-team-rotation-back]").click();
      cy.get("[data-test-team-rotations-toggle-import]").click();
      cy.get("[data-test-team-rotations-import-text]").type(exported, {
        parseSpecialCharSequences: false,
      });
      cy.get("[data-test-team-rotations-import-text-button]").click();

      // Lands directly in the newly-imported team's editor, matching it
      cy.get("[data-test-team-rotation-editor]").should("be.visible");
      cy.get("[data-test-team-rotation-name]").should("have.value", "My Export Team");
      cy.get('[data-test-team-rotation-slot="0"]').should("contain.text", "Carlotta");
      cy.get('[data-test-rotation-action-by-attack-key="BasicAttackStage1DMG"]').should("exist");

      // The original team is untouched — import created a second, separate one
      cy.get("[data-test-team-rotation-back]").click();
      cy.get("[data-test-team-rotations-item]").should("have.length", 2);
    });
  });

  it("imports a team from an uploaded .json file", () => {
    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-toggle-import]").click();

    const payload = JSON.stringify({
      meta: { version: "1", source: "WutheringTools", type: "teamRotation" },
      data: {
        name: "From File",
        characterIds: ["Carlotta", null, null],
        actions: [],
        duration: 10,
        enemyConfig: { enemyLevel: 90, enemyResist: 0.1, enemyType: "Calamity" },
        mode: "basic",
      },
    });
    cy.get("[data-test-team-rotations-import-file]").selectFile(
      {
        contents: Cypress.Buffer.from(payload),
        fileName: "from-file.json",
        mimeType: "application/json",
      },
      { force: true },
    );

    cy.get("[data-test-team-rotation-editor]").should("be.visible");
    cy.get("[data-test-team-rotation-name]").should("have.value", "From File");
  });

  it("shows a clear error and doesn't create a team for unrecognizable input", () => {
    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-toggle-import]").click();
    cy.get("[data-test-team-rotations-import-text]").type("not json at all");
    cy.get("[data-test-team-rotations-import-text-button]").click();
    cy.get("[data-test-team-rotations-item]").should("not.exist");
  });

  it("the download button doesn't error", () => {
    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-new]").click();
    cy.get("[data-test-team-rotation-export-download]").click();
  });

  it("List Presets shows the empty state when no presets are defined yet", () => {
    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-toggle-presets]").click();
    cy.get("[data-test-team-rotations-presets]").should("contain.text", "No team presets");
  });
});
