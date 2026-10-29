// Frame-data rotation timing (ADR 0047): the length and DPS worked out from
// wuwalab's frame data, shown beside the optional typed duration. Behind the
// `frameTiming` Settings > Labs flag.

// Classic UI, like cypress/support/e2e.ts's default, plus the lab.
function visitWithFrameTiming(isEnabled: boolean) {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: { useClassicUi: true }, labs: { frameTiming: { isEnabled } } }),
      );
    },
  });
}

function openSuomingPreset() {
  cy.richSelect("[data-test-character-select]", "Suoming");
  cy.get(".character__self-buffs").should("be.visible");
  cy.get('[data-test-calculator-nav="rotations"]').click();
  cy.get('[data-test="rotations-overflow-menu"]').click();
  cy.get('[data-test-rotations-action="presets"]').click();
  cy.get("[data-test-rotations-presets]").contains("button", "Import").first().click();
  cy.get("[data-test-rotation-item-by-name]").first().click();
}

// The intro plays out over 103 frames; swapping out at its NoSwap (90f) saves
// 13. The Standard DPS preset is 790 game frames
// (tests/calculator/rotationTiming.test.ts snapshot), on its own or in a team.
function swapOutOfIntroAndReset() {
  cy.get('[data-test-rotation-action-by-attack-key="IntroSkillFurledCanopyFlashRiftDMG"]')
    .find("[data-test-rotation-action-frames]")
    .should("contain.text", "103f")
    .click();
  cy.get("[data-test-rotation-action-end-type]").select("swap");
  cy.get("[data-test-rotation-action-end-frame]").type("90");
  cy.get("[data-test-rotation-action-end-frame]").blur();
  cy.get("[data-test-rotation-frame-length]").should("contain.text", "777f");

  cy.get("[data-test-rotation-action-end-reset]").click();
  cy.get("[data-test-rotation-frame-length]").should("contain.text", "790f");
}

describe("Calculator rotation frame timing", () => {
  it("shows the frame-data length beside the typed one and updates when an action ends early", () => {
    visitWithFrameTiming(true);
    openSuomingPreset();

    cy.get("[data-test-rotation-frame-length]").should("contain.text", "13.17s").and("contain.text", "790f");
    cy.get("[data-test-rotation-frame-dps]").invoke("text").should("not.equal", "—");
    // The preset has a typed 13s too, so both DPS values show.
    cy.get("[data-test-rotation-typed-length]").should("contain.text", "13s");
    cy.get("[data-test-rotation-typed-dps]").invoke("text").should("not.equal", "—");
    cy.contains("[data-test-rotation-frame-timing] a", "wuwalab").should("have.attr", "href", "https://wuwalab.com");

    swapOutOfIntroAndReset();
  });

  it("stays hidden while the Labs flag is off", () => {
    visitWithFrameTiming(false);
    openSuomingPreset();

    cy.get('[data-test-rotation-action-by-attack-key="IntroSkillFurledCanopyFlashRiftDMG"]').should("exist");
    cy.get("[data-test-rotation-frame-timing]").should("not.exist");
    cy.get("[data-test-rotation-action-frames]").should("not.exist");
  });
});

describe("Team rotation frame timing", () => {
  it("times an imported character rotation and updates when an action ends early", () => {
    visitWithFrameTiming(true);
    cy.richSelect("[data-test-character-select]", "Suoming");
    cy.get(".character__self-buffs").should("be.visible");

    cy.get("[data-test-nav-team-rotations]").click();
    cy.get("[data-test-team-rotations-new]").click();
    cy.selectTeamRotationSlotCharacter(0, "Suoming");
    cy.get('[data-test-team-rotation-slot="0"]').should("contain.text", "Suoming");

    cy.get('[data-test-team-rotation-import-rotation-open="0"]').click();
    cy.get('[data-test-team-rotation-import-preset="Standard DPS Rotation"]')
      .find("[data-test-team-rotation-import-append]")
      .click();
    cy.get("[data-test-team-rotation-import-modal]").should("not.have.attr", "open");

    cy.get("[data-test-rotation-frame-length]").should("contain.text", "790f");
    cy.get("[data-test-rotation-frame-dps]").invoke("text").should("not.equal", "—");

    swapOutOfIntroAndReset();
  });
});
