// Team optimizer (ADR 0052), behind the teamOptimizer Settings > Labs flag. The
// math is covered by tests/calculator/teamOptimizer.test.ts. This drives the real
// workers end to end: setup, run, results, saving as new builds.
import { rotations as suomingRotations } from "../../../src/characters/Suoming/presets";
import { rotations as hsinRotations } from "../../../src/characters/Hsin/presets";

const TEAM_NAME = "Optimizer Test Team";

function echo(echoId: string, name: string, type: number, stat: string, subType: string, subValue: number) {
  return {
    echoId,
    echo: name,
    type,
    rank: 5,
    stat,
    echoSet: "HeartofSwornVigil",
    echoSubStatsType1: subType,
    echoSubStatsValue1: subValue,
  };
}

const MAIN_ECHO = "ReminiscenceSuhsintheInevitable";

// Both characters want these, so they can't both take the best ones.
const inventoryEchoes = [
  echo("main-1", MAIN_ECHO, 4, "CritDMG", "ATK", 80),
  echo("main-2", MAIN_ECHO, 4, "CritDMG", "CritRate", 6),
  echo("four-a", "SentryConstruct", 4, "CritRate", "CritDMG", 15),
  echo("three-a", "FrostbiteColeoid", 3, "Electro", "ATK", 60),
  echo("three-b", "IceglintDancer", 3, "Electro", "CritRate", 9),
  echo("three-c", "Ironhoof", 3, "ATK", "CritDMG", 12),
  echo("three-d", "TremorWarrior", 3, "Electro", "CritRate", 6),
  echo("one-a", "ShadowStepper", 1, "ATK", "CritRate", 10),
  echo("one-b", "Hoochief", 1, "ATK", "CritDMG", 20),
  echo("one-c", "SnipSnap", 1, "ATK", "CritRate", 7),
  echo("one-d", "TickTack", 1, "HP", "ATK", 40),
];

function actionsFor(presets: any[], slot: number, startOrder: number) {
  return presets[0].data.actions.map((action: any, index: number) => ({
    ...action,
    id: `s${slot}-${index}`,
    slot,
    order: startOrder + index,
  }));
}

function seed(labOn: boolean) {
  const suomingActions = actionsFor(suomingRotations as any[], 0, 1);
  const hsinActions = actionsFor(hsinRotations as any[], 1, suomingActions.length + 1);
  const character = (weapon: string) => ({
    weapon,
    mainEcho: { echo: MAIN_ECHO, rank: 5, buffs: {} },
    optimizer: { echoSets: ["HeartofSwornVigil"], mainEchoes: [MAIN_ECHO] },
  });
  return (win: Window) => {
    win.localStorage.setItem(
      "settings",
      JSON.stringify({ config: {}, labs: { teamOptimizer: { isEnabled: labOn } } }),
    );
    win.localStorage.setItem(
      "character",
      JSON.stringify({
        characters: { Suoming: character("EmeraldOfGenesis"), Hsin: character("BloomingJadehaven") },
        activeCharacter: "Suoming",
        favoriteCharacters: [],
      }),
    );
    win.localStorage.setItem("inventory", JSON.stringify({ echoes: inventoryEchoes, equipped: {}, echoPresets: [], equippedPresets: {} }));
    win.localStorage.setItem(
      "teamRotations",
      JSON.stringify({
        teams: [
          {
            id: "team-optimizer-test",
            name: TEAM_NAME,
            characterIds: ["Suoming", "Hsin", null],
            buildIds: [null, null, null],
            actions: [...suomingActions, ...hsinActions],
            duration: 25,
            mode: "basic",
            enemyConfig: { enemyLevel: 90, enemyResist: 0.1, enemyType: "Calamity" },
          },
        ],
        favoriteTeamIds: [],
        favoritePresetNames: [],
      }),
    );
  };
}

function openTeam(labOn: boolean) {
  cy.visit("/teams", { onBeforeLoad: seed(labOn) });
  cy.get(`[data-test-team-rotations-item="${TEAM_NAME}"]`).contains(TEAM_NAME).click();
  cy.get("[data-test-team-rotation-editor]").should("be.visible");
}

describe("Team optimizer", () => {
  it("stays hidden until the lab is on", () => {
    openTeam(false);
    cy.get("[data-test-team-rotation-summary]").should("be.visible");
    cy.get("[data-test-team-rotation-summary-optimize]").should("not.exist");
  });

  it("runs from a prefilled setup, and saves results as new pinned builds", () => {
    cy.viewport(1280, 900);
    openTeam(true);
    cy.get("[data-test-team-rotation-summary-optimize]").first().click();

    cy.get("[data-test-team-optimizer-setup]").should("be.visible");
    cy.get('[data-test-team-optimizer-slot="0"]').should("contain.text", "Heart of Sworn Vigil");
    cy.get("[data-test-team-optimizer-size]").should("contain.text", "loadouts,");
    cy.get("[data-test-team-optimizer-run]").should("not.be.disabled");

    // Keeping both characters leaves nothing to search.
    cy.get('[data-test-team-optimizer-goal-keep="0"]').click();
    cy.get('[data-test-team-optimizer-goal-keep="1"]').click();
    cy.get("[data-test-team-optimizer-run]").should("be.disabled");
    cy.get('[data-test-team-optimizer-goal-damage="0"]').click();
    cy.get('[data-test-team-optimizer-goal-damage="1"]').click();

    // The drawer is the normal optimizer setup, minus the run bar and target.
    cy.get('[data-test-team-optimizer-edit="0"]').click();
    cy.get("[data-test-team-optimizer-drawer]").should("be.visible");
    cy.get("[data-test-team-optimizer-drawer] [data-test-optimizer-workspace-run-bar]").should("not.exist");
    cy.get("[data-test-team-optimizer-drawer-done]").click();
    cy.get("[data-test-team-optimizer-drawer]").should("not.be.visible");

    cy.get("[data-test-team-optimizer-run]").click();
    cy.get("[data-test-team-optimizer-results]", { timeout: 120000 }).should("be.visible");

    // The search's numbers agreed with the Team page's own calculation.
    cy.get("[data-test-team-optimizer-mismatch]").should("not.exist");
    cy.get("[data-test-team-optimizer-proof]").should("contain.text", "No better combination exists");
    cy.get("[data-test-team-optimizer-row]").should("have.length", 5);
    cy.get("[data-test-team-optimizer-detail]").should("have.length", 2);

    cy.get('[data-test-team-optimizer-row="1"]').click();
    cy.get('[data-test-team-optimizer-row="0"]').click();

    cy.get("[data-test-team-optimizer-total]")
      .invoke("text")
      .then((total) => {
        cy.get("[data-test-team-optimizer-save]").click();
        cy.get("[data-test-team-optimizer-confirm-save]").click();
        cy.get("[data-test-team-optimizer-saved]").should("contain.text", `now calculates ${total}`);

        // The saved builds are what the team now uses.
        cy.get("[data-test-team-optimizer-back]").click();
        cy.get("[data-test-team-rotation-editor]").should("be.visible");
        // The header prints the same number without separators.
        cy.get("[data-test-team-rotation-summary]").should("contain.text", `Average: ${total.replaceAll(",", "")}`);
        cy.window().then((win) => {
          const teams = JSON.parse(win.localStorage.getItem("teamRotations")!).teams;
          const characters = JSON.parse(win.localStorage.getItem("character")!).characters;
          expect(teams[0].buildIds[0]).to.equal(characters.Suoming.activeBuildId);
          expect(characters.Suoming.builds.at(-1).name).to.equal(`${TEAM_NAME} optimized`);
          expect(characters.Hsin.builds.at(-1).name).to.equal(`${TEAM_NAME} optimized`);
        });
      });
  });
});
