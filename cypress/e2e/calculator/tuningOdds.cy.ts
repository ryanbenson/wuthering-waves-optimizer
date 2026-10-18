// Echo tuning odds in the Calculator's Echoes tab: each tile's small "Odds"
// button opens a dialog (docs/adr/0044-echo-tuning-odds.md). A partly tuned
// echo shows its Tune odds; a fully tuned one shows the chance a fresh echo
// beats its Substat Score. The inventory side and the planner are in
// cypress/e2e/inventory/tuningOdds.cy.ts; numbers here are pinned in
// tests/echoes/tuningOdds.test.ts.

function seededEcho(subs: Array<[string, number]>) {
  const echo: Record<string, unknown> = {
    echo: "BellBorneGeochelone",
    echoSet: "VoidThunder",
    type: 4,
    rank: "5",
    stat: "CritRate",
  };
  subs.forEach(([type, value], i) => {
    echo[`echoSubStatsType${i + 1}`] = type;
    echo[`echoSubStatsValue${i + 1}`] = value;
  });
  return echo;
}

function openBrantEchoesTab() {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem("settings", JSON.stringify({ config: {} }));
      win.localStorage.setItem(
        "character",
        JSON.stringify({
          activeCharacter: "Brant",
          favoriteCharacters: [],
          characters: {
            Brant: {
              echoes: {
                // Fully tuned: CR and CD at tier 4, ATK% at tier 4, the rest
                // weighted 0 for Brant — 40 weighted points.
                0: seededEcho([
                  ["CritRate", 8.1],
                  ["CritDMG", 16.2],
                  ["ATK", 8.6],
                  ["HP", 7.9],
                  ["DEF_FLAT", 50],
                ]),
                // +10: two substats in.
                1: seededEcho([
                  ["CritRate", 8.1],
                  ["ATK", 8.6],
                ]),
              },
            },
          },
        }),
      );
    },
  });
  cy.selectWorkspaceCharacter("Brant");
  cy.get('[data-test-calculator-nav="echoes"]').click();
}

describe("Echo tuning odds — Calculator Echoes tab", () => {
  it("a fully tuned echo's Odds shows the chance a fresh echo beats it", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item-odds="0"]').click();
    cy.get('[data-test-echo-item="0"]').should("have.attr", "aria-expanded", "false");

    cy.get("[data-test-echo-better-odds]").should("be.visible");
    cy.get("[data-test-echo-better-odds-chance]").should("contain.text", "7.8%");
    cy.get("[data-test-echo-better-odds]").should("contain.text", "about 1 in 13 fresh echoes");
    // No goal to reach on a finished echo.
    cy.get("[data-test-echo-tune-odds-chance]").should("not.exist");

    cy.get("[data-test-echo-odds-close]").click();
    cy.get("[data-test-echo-better-odds]").should("not.exist");
  });

  it("a partly tuned echo's Odds shows its Tune odds and breakdown", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item-odds="1"]').click();
    cy.get("[data-test-echo-better-odds]").should("not.exist");
    // Double crit: Crit DMG must show up in the last 3 tunes from 11.
    cy.get("[data-test-echo-tune-odds-chance]").should("contain.text", "27.3%");
    cy.get('[data-test-echo-tune-odds-line="CritDMG"]').should("contain.text", "3 / 11 draws");
  });

  it("the character's top substats are a goal preset", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item-odds="1"]').click();
    cy.get('[data-test-tuning-goal-preset="character-weights"]')
      .should("contain.text", "Brant's top 3")
      .click();
    cy.get('[data-test-tuning-goal-line="BasicAttackDMGBonus"]').should("exist");
  });

  it("Edit weights closes the odds and opens this character's weights editor", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item-odds="0"]').click();
    cy.get("[data-test-echo-tune-odds-edit-weights]").click();
    cy.get("[data-test-echo-better-odds]").should("not.exist");
    cy.get("#modal-echo-rating-weights-editor").should("be.visible");
  });

  it("the expanded editor has an Odds button and no Stats / Tune odds tabs", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item="1"]').click();
    cy.get('[data-test-echo-item="1"] [data-test-echo-edit-tab]').should("not.exist");
    cy.get('[data-test-echo-item="1"] [data-test-echo-item-odds="1"]').click();
    cy.get("[data-test-echo-tune-odds]").should("be.visible");
  });
});
