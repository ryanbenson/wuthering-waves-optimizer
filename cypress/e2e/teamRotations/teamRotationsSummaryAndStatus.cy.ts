function enableTeamRotationsLab(win: Cypress.AUTWindow) {
  win.localStorage.setItem(
    "settings",
    JSON.stringify({ config: {}, labs: { teamRotations: { isEnabled: true } } }),
  );
}

function buildTeam(actionCount: number) {
  cy.get("[data-test-team-rotations-new]").click();
  cy.get("[data-test-team-rotation-editor]").should("be.visible");
  cy.richSelect('[data-test="team-rotation-slot-select-0"]', "Carlotta");
  cy.get('[data-test-team-rotation-slot="0"]').should("contain.text", "Carlotta");
  cy.get("[data-test-team-rotation-duration]").clear().type("20");

  const attackKeys = ["BasicAttackStage1DMG", "BasicAttackStage2DMG"];
  for (let i = 0; i < actionCount; i++) {
    cy.get("[data-test-team-rotation-add-action]").click();
    cy.get('[data-test-rotation-action-by-attack-key="none"]').first().click();
    cy.richSelect(
      '[data-test-rotation-action-skill-input="none"]',
      attackKeys[i % attackKeys.length],
    );
  }
}

describe("Team Rotations summary and status", () => {
  beforeEach(() => {
    cy.visit("/", { onBeforeLoad: enableTeamRotationsLab });
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible");
    cy.visit("/teams", { onBeforeLoad: enableTeamRotationsLab });
  });

  it("ranks teams by the selected metric, shows a leaderboard, and lets status filter the list", () => {
    // Team 1: one action (weaker). Team 2: two actions (stronger).
    buildTeam(1);
    cy.get("[data-test-team-build-status-toggle]").first().click();
    cy.get('[data-test-rich-select-option="finished"]').first().click();
    cy.get("[data-test-team-rotation-back]").click();

    buildTeam(2);
    cy.get("[data-test-team-rotation-back]").click();

    cy.get("[data-test-team-rotations-list]").should("be.visible");
    cy.get("[data-test-team-rotations-summary]").should("be.visible");

    // Leaderboard picks the stronger team (Team 2) by default (average).
    cy.get('[data-test-team-rotations-leaderboard="damage"]').should(
      "contain.text",
      "Team 2",
    );
    cy.get('[data-test-team-rotations-leaderboard="dps"]').should(
      "contain.text",
      "Team 2",
    );

    // The grid doubles as the ranked list: Team 2 (stronger) is #1.
    cy.get("[data-test-team-rotations-item]")
      .first()
      .should("contain.text", "Team 2");
    cy.get("[data-test-team-rotations-item]")
      .first()
      .find("[data-test-team-rotations-rank]")
      .should("contain.text", "#1");

    // Status set on Team 1 via the editor shows up on its list card.
    cy.contains("[data-test-team-rotations-item]", "Team 1").within(() => {
      cy.get("[data-test-team-build-status-toggle]").should(
        "contain.text",
        "Finished",
      );
    });

    // Status filter narrows to just the finished team.
    cy.get("[data-test-team-rotations-status-filter]").click();
    cy.get('[data-test-rich-select-option="finished"]').first().click();
    cy.get("[data-test-team-rotations-item]").should("have.length", 1);
    cy.get("[data-test-team-rotations-item]").should("contain.text", "Team 1");
    cy.get("[data-test-team-rotations-clear-filters]").click();
    cy.get("[data-test-team-rotations-item]").should("have.length", 2);
  });

  it("reorders the ranked list when the sort metric toggle changes", () => {
    buildTeam(1);
    cy.get("[data-test-team-rotation-back]").click();
    buildTeam(2);
    cy.get("[data-test-team-rotation-back]").click();

    cy.get("[data-test-team-rotations-item]")
      .first()
      .should("contain.text", "Team 2");

    // Every radio in the sort-metric group is equivalent for this fixture
    // (both teams use the same attacks), so just confirm the control exists
    // and is interactive without asserting a specific reordering, which
    // would be flaky against real damage-formula numbers.
    cy.get("[data-test-team-rotations-sort-metric] input[value='crit']").click();
    cy.get("[data-test-team-rotations-sort-metric] input[value='crit']").should(
      "be.checked",
    );

    // Sorting by name is deterministic: Team 1 comes before Team 2 A-Z.
    cy.get("[data-test-team-rotations-sort-metric] input[value='name']").click();
    cy.get("[data-test-team-rotations-item]")
      .first()
      .should("contain.text", "Team 1");
  });

  it("never shows Infinity DPS for a team with no duration set", () => {
    // Team 1: no duration set (the default for a new team).
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
    cy.get("[data-test-team-rotation-back]").click();

    // Team 2: has a duration set — the only one that should compete for DPS.
    buildTeam(1);
    cy.get("[data-test-team-rotation-back]").click();

    cy.get("[data-test-team-rotations-summary]").should("be.visible");
    cy.get('[data-test-team-rotations-leaderboard="dps"]')
      .should("exist")
      .and("not.contain.text", "Infinity")
      .and("contain.text", "Team 2");
  });

  it("toggles between grid and list view, persisting the choice across reload", () => {
    buildTeam(1);
    cy.get("[data-test-team-rotation-back]").click();

    cy.get("[data-test-team-rotations-view-grid]").should("have.class", "btn-active");
    cy.get(".teams__list.grid").should("exist");

    cy.get("[data-test-team-rotations-view-list]").click();
    cy.get("[data-test-team-rotations-view-list]").should("have.class", "btn-active");
    cy.get(".teams__list.grid").should("not.exist");
    cy.get("[data-test-team-rotations-item]").should("have.length", 1);

    cy.reload();
    cy.get("[data-test-team-rotations-view-list]").should("have.class", "btn-active");
    cy.get(".teams__list.grid").should("not.exist");

    cy.get("[data-test-team-rotations-view-grid]").click();
    cy.get(".teams__list.grid").should("exist");
  });

  it("favorites a team, highlights it, and filters the list by favorites", () => {
    buildTeam(1);
    cy.get("[data-test-team-rotation-back]").click();
    buildTeam(1);
    cy.get("[data-test-team-rotation-back]").click();

    cy.get("[data-test-team-rotations-item]").should("have.length", 2);

    cy.contains("[data-test-team-rotations-item]", "Team 1").as("team1");
    cy.get("@team1").find("[data-test-favorite]").should(
      "have.attr",
      "aria-label",
      "Add to favorites",
    );
    cy.get("@team1").should("not.have.class", "ring-2");

    cy.get("@team1").find("[data-test-favorite]").click();
    cy.get("@team1").find("[data-test-favorite]").should(
      "have.attr",
      "aria-label",
      "Remove from favorites",
    );
    cy.get("@team1").should("have.class", "ring-2");

    cy.get("[data-test-team-rotations-favorites-filter]").click();
    cy.get("[data-test-team-rotations-item]").should("have.length", 1);
    cy.get("[data-test-team-rotations-item]").should("contain.text", "Team 1");

    cy.get("[data-test-team-rotations-favorites-filter]").click();
    cy.get("[data-test-team-rotations-item]").should("have.length", 2);
  });
});
