describe("Team Rotations per-slot build override (issue #278)", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  function readSlotAtk(slot: number) {
    return cy
      .get(`[data-test-team-rotation-slot="${slot}"]`)
      .find('[data-test-team-rotation-slot-stat="atk"] span')
      .invoke("text")
      .then((text) => Number(text.replace(/,/g, "")));
  }

  function openBuildPickerForSlot(slot: number) {
    cy.get(`[data-test="team-rotation-slot-build-select-${slot}"]`).click();
    cy.get("#modal-manage-builds").should("be.visible");
  }

  function pickBuildByName(name: string) {
    cy.get(`[data-test-manage-builds-row="${name}"]`).find("[data-test-build-picker-select]").click();
    cy.get("#modal-manage-builds").should("not.be.visible");
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
    cy.get("[data-test-weapon-browser-filters] [data-test-filter-panel-toggle]").click();
    cy.get('[data-test-weapon-browser-filter-rarity="5"]').click();
    cy.get('[data-test-weapon-browser-list="TheLastDance"]').click();
    cy.get("[data-test-weapon-select]").should("contain.text", "The Last Dance");

    // Switch back to Default (weaponless) as the active build.
    cy.get('[data-test-calculator-nav="character"]').click();
    cy.get("[data-test-build-select]").click({ force: true });
    cy.get("[data-test-build-select]")
      .closest(".app-rich-select")
      .should("have.class", "dropdown-open")
      .within(() => {
        cy.contains("[data-test-rich-select-option]", "Default build").click({ force: true });
      });
    cy.get("[data-test-build-select]").should("contain.text", "Default build");

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

    // Pin this slot to "Burst Build" via the shared build-picker modal — the
    // character's own active build must stay Default throughout.
    openBuildPickerForSlot(0);
    cy.contains("[data-test-manage-builds-row]", "Burst Build")
      .find("[data-test-build-preview-weapon]")
      .should("contain.text", "The Last Dance");
    pickBuildByName("Burst Build");
    cy.get(`[data-test="team-rotation-slot-build-select-0"]`).should("contain.text", "Burst Build");

    // recompute() rebuilds the slot's context asynchronously — use a
    // retrying assertion (not a one-shot read) so this waits for it rather
    // than racing it.
    cy.get("@baselineAtk").then((baselineAtk) => {
      cy.get('[data-test-team-rotation-slot="0"]')
        .find('[data-test-team-rotation-slot-stat="atk"] span')
        .should(($span) => {
          const atk = Number($span.text().replace(/,/g, ""));
          expect(atk).to.be.greaterThan(baselineAtk as unknown as number);
        });
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
    cy.get("[data-test-build-select]").should("contain.text", "Default build");
    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.get("[data-test-weapon-select]").should("contain.text", "Choose a weapon");
  });

  it("doesn't list the active build a second time in the picker, and 'Follow active build' un-pins a slot", () => {
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible");

    // Three builds total (Default, Build B, Build C), each duplicate-created
    // from — and so auto-equipping — the previous one, ending with "Build C"
    // active.
    cy.get("[data-test-manage-builds-open]").click();
    cy.get("[data-test-manage-builds-new-name]").type("Build B");
    cy.get("[data-test-manage-builds-create-active]").click();
    cy.get("[data-test-manage-builds-new-name]").type("Build C");
    cy.get("[data-test-manage-builds-create-active]").click();
    cy.get("[data-test-manage-builds-close]").click();
    cy.get("[data-test-build-select]").should("contain.text", "Build C");

    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-new]").click();
    cy.get("[data-test-team-rotation-editor]").should("be.visible");
    cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");
    cy.get('[data-test-team-rotation-slot="0"]').should("contain.text", "Carlotta");

    // Trigger label reflects the real active build...
    cy.get('[data-test="team-rotation-slot-build-select-0"]').should(
      "contain.text",
      "Build C (active)",
    );

    // ...and the picker lists all three builds exactly once each — Build C
    // (active) appears via its "Active" badge, not as a duplicate entry.
    openBuildPickerForSlot(0);
    cy.get("[data-test-build-picker-active-option]").should("contain.text", "Build C");
    cy.get("[data-test-manage-builds-row]").should("have.length", 3);
    cy.get('[data-test-build-picker-select]').should("have.length", 3);
    cy.contains("[data-test-manage-builds-row]", "Build C")
      .find(".badge")
      .should("contain.text", "Active");

    // Pin to "Build B", then switch back to "Follow active build".
    pickBuildByName("Build B");
    cy.get(`[data-test="team-rotation-slot-build-select-0"]`).should("contain.text", "Build B");

    openBuildPickerForSlot(0);
    cy.get("[data-test-build-picker-active-option]").click();
    cy.get("#modal-manage-builds").should("not.be.visible");
    cy.get(`[data-test="team-rotation-slot-build-select-0"]`).should(
      "contain.text",
      "Build C (active)",
    );
  });
});
