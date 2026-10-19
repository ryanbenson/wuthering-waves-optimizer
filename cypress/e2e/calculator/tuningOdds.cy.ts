// Echo tuning odds in the Calculator's Echoes tab: each tile's small "Odds"
// button opens a dialog (docs/adr/0044-echo-tuning-odds.md), judged by the
// build character's Substat Score. A partly tuned echo shows where it can
// finish by grade; a fully tuned one shows the chance a fresh echo beats
// it, "better" defaulting to the next grade up. Numbers are pinned in
// tests/echoes/scoreOdds.test.ts. The inventory side and the planner are in
// cypress/e2e/inventory/tuningOdds.cy.ts.

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
                // weighted 0 for Brant — 40 of 120 weighted points, C.
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

    cy.get("[data-test-echo-score-percentile]").should("be.visible");
    cy.get("[data-test-echo-score-percentile]").should("contain.text", "C 33%").and("contain.text", "90%");
    // "Better" defaults to the next grade up: B.
    cy.get('[data-test-echo-score-target="B"]').should("have.attr", "aria-pressed", "true");
    cy.get("[data-test-echo-better-odds-chance]").should("contain.text", "4.41%");
    // Any higher score at all, by even a point, is more likely.
    cy.get('[data-test-echo-score-target="higher"]').click();
    cy.get("[data-test-echo-better-odds-chance]").should("contain.text", "7.8%");
    cy.get("[data-test-echo-better-odds]").should("contain.text", "about 1 in 13 fresh echoes");
    cy.get('[data-test-echo-resource-cost-row="each"]').should("exist");
    cy.get('[data-test-echo-resource-cost-row="per-better-fed"]').scrollIntoView();
    cy.get('[data-test-echo-resource-cost-row="per-better-fed"]').should("be.visible");
    // No goal to reach on a finished echo.
    cy.get("[data-test-echo-tune-odds-chance]").should("not.exist");

    cy.get("[data-test-echo-odds-close]").click();
    cy.get("[data-test-echo-better-odds]").should("not.exist");
  });

  it("a partly tuned echo's Odds shows where it can finish by grade", () => {
    openBrantEchoesTab();
    cy.get('[data-test-echo-item-odds="1"]').click();
    cy.get("[data-test-echo-better-odds]").should("not.exist");
    cy.get("[data-test-tuning-goal-preset]").should("not.exist");
    cy.get("[data-test-echo-score-odds]").should("be.visible");
    // D or better is locked in (no row); it makes C about half the time,
    // so the default target is the next grade up, B.
    cy.get('[data-test-echo-score-grade-row="D"]').should("not.exist");
    cy.get('[data-test-echo-score-grade-row="C"]').should("exist");
    cy.get('[data-test-echo-score-grade-row="B"]')
      .should("contain.text", "11.3%")
      .and("contain.text", "4.41%");
    cy.get("[data-test-echo-score-chance]").should("contain.text", "11.3%");
    cy.get('[data-test-echo-score-advice="keep"]').should("exist");

    cy.get('[data-test-echo-score-grade-row="A"]').click();
    cy.get("[data-test-echo-score-chance]").should("contain.text", "1.04%");
    cy.get('[data-test-echo-score-cost] [data-test-echo-resource-cost-row="from-here"]').should("exist");
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
    cy.get("[data-test-echo-score-odds]").should("be.visible");
  });
});
