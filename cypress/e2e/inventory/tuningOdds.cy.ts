// Echo tuning odds end to end in the inventory: the Odds dialog (from a
// tile, the edit panel's header, or a "Finish these first" tag), that
// filter itself, and the /info/tuning-odds planner — see docs/adr/0044-echo-tuning-odds.md. Numbers asserted here are
// pinned exactly in tests/echoes/tuningOdds.test.ts; this spec checks they
// reach the screen and that the three surfaces hand off to each other.

function seedEcho(echoId: string, subs: Array<[string, number]>) {
  const echo: Record<string, unknown> = {
    echoId,
    echo: "BellBorneGeochelone",
    echoSet: "VoidThunder",
    rank: 5,
    stat: "CritRate",
    type: 4,
  };
  for (let i = 0; i < 5; i++) {
    echo[`echoSubStatsType${i + 1}`] = subs[i]?.[0] ?? "none";
    echo[`echoSubStatsValue${i + 1}`] = subs[i]?.[1] ?? 0;
  }
  return echo;
}

function visitInventory(activeCharacter?: string) {
  cy.visit("/inventory", {
    onBeforeLoad(win) {
      if (activeCharacter) {
        win.localStorage.setItem(
          "character",
          JSON.stringify({ activeCharacter, favoriteCharacters: [], characters: {} }),
        );
      }
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: { density: "comfy" }, labs: { liveResultBar: { isEnabled: true } } }),
      );
      win.localStorage.setItem(
        "inventory",
        JSON.stringify({
          echoes: [
            seedEcho("tune-fodder", [["HP", 7.9], ["DEF_FLAT", 50]]),
            seedEcho("tune-fresh", []),
            seedEcho("tune-keep", [["CritRate", 8.1], ["ATK", 8.6]]),
            seedEcho("tune-done", [
              ["HP", 7.9], ["DEF", 9], ["ATK", 7.1], ["HP_FLAT", 430], ["DEF_FLAT", 50],
            ]),
          ],
          equipped: {},
          echoPresets: [],
          equippedPresets: {},
        }),
      );
    },
  });
}

function editEcho(echoId: string) {
  cy.get(`[data-test-echo-select="${echoId}"]`, { timeout: 20000 })
    .closest(".echo__item-wrap")
    .find('[data-test-echo-action-edit], button[aria-label="Edit"]')
    .first()
    .click();
}

describe("Echo tuning odds", () => {
  it("the edit panel's Odds button shows the echo's odds for the double-crit goal", () => {
    visitInventory();
    editEcho("tune-keep");
    cy.get("[data-test-echo-edit-panel]").should("be.visible");
    cy.get("[data-test-echo-edit-tab]").should("not.exist");

    cy.get("[data-test-echo-edit-odds]").click();
    cy.get("[data-test-echo-tune-odds]").should("be.visible");
    cy.get('[data-test-echo-tune-odds-tuned="CritRate"]').should("contain.text", "8.1%");
    // Needs Crit DMG in the last 3 tunes from 11 substats: 3/11.
    cy.get("[data-test-echo-tune-odds-chance]").should("contain.text", "27.3%");
    cy.get('[data-test-echo-tune-odds-advice="keep"]').scrollIntoView();
    cy.get('[data-test-echo-tune-odds-advice="keep"]').should("be.visible");

    // Raising the bar lowers the chance: 3/11 × P(Crit DMG ≥ 15.0).
    cy.get('[data-test-tuning-goal-line="CritDMG"] select').select("15");
    cy.get("[data-test-echo-tune-odds-chance]").should("contain.text", "14.5%");
  });

  it("finished echoes have no Odds: beating one depends on a character's weights", () => {
    // Even with a character selected — the inventory has no build to score it for.
    visitInventory("Brant");
    cy.get('[data-test-echo-action-odds="tune-keep"]', { timeout: 20000 }).should("exist");
    cy.get('[data-test-echo-action-odds="tune-done"]').should("not.exist");
    editEcho("tune-done");
    cy.get("[data-test-echo-edit-panel]").should("be.visible");
    cy.get("[data-test-echo-edit-odds]").should("not.exist");
  });

  it("Finish these first ranks unfinished echoes and its tags open their odds", () => {
    visitInventory();
    cy.get("[data-test-find-unfinished]", { timeout: 20000 }).click();
    cy.get("[data-test-unfinished-goal]").should("be.visible");
    cy.get("[data-test-unfinished-fresh-chance]").should("contain.text", "12.8%");

    cy.get('[data-test-echo-select="tune-done"]').should("not.exist");
    cy.get("[data-test-echo-select]").then(($inputs) => {
      const order = $inputs.toArray().map((el) => el.getAttribute("data-test-echo-select"));
      expect(order).to.deep.equal(["tune-keep", "tune-fresh", "tune-fodder"]);
    });
    // The fresh-echo divider sits between the Keep tiles and the rest.
    cy.get("[data-test-unfinished-divider]")
      .should("have.length", 1)
      .and("contain.text", "Fresh echo · 12.8%")
      .next(".echo__item-wrap")
      .find('[data-test-echo-select="tune-fresh"]')
      .should("exist");
    cy.get("[data-test-unfinished-divider]")
      .prev(".echo__item-wrap")
      .find('[data-test-echo-select="tune-keep"]')
      .should("exist");
    cy.get('[data-test-echo-select="tune-keep"]')
      .closest(".echo__item-wrap")
      .find('[data-test-unfinished-tag="keep"]')
      .should("contain.text", "27.3%");
    cy.get('[data-test-echo-select="tune-fresh"]')
      .closest(".echo__item-wrap")
      .find('[data-test-unfinished-tag="baseline"]')
      .should("exist");
    cy.get('[data-test-echo-select="tune-fodder"]')
      .closest(".echo__item-wrap")
      .find('[data-test-unfinished-tag="fodder"]')
      .should("exist");

    cy.get('[data-test-echo-select="tune-keep"]')
      .closest(".echo__item-wrap")
      .find('[data-test-unfinished-tag="keep"]')
      .click();
    cy.get("[data-test-echo-tune-odds-chance]").should("contain.text", "27.3%");
  });

  it("the goal carries from the inventory to the Odds dialog and on to the planner", () => {
    visitInventory();
    cy.get("[data-test-find-unfinished]", { timeout: 20000 }).click();
    cy.get('[data-test-unfinished-goal] [data-test-tuning-goal-preset="good-double-crit"]').click();
    cy.get("[data-test-unfinished-fresh-chance]").should("not.contain.text", "12.8%");

    cy.get('[data-test-echo-action-odds="tune-keep"]').click();
    cy.get('[data-test-tuning-goal-preset="good-double-crit"]').should("have.attr", "aria-pressed", "true");
    cy.get("[data-test-echo-tune-odds-planner-link]").click();

    cy.location("pathname").should("eq", "/info/tuning-odds");
    cy.location("search").should("contain", "CritRate:8.1");
    cy.get('[data-test-tuning-planner-min="CritDMG:16.2"]').should("have.attr", "aria-pressed", "true");
  });

  it("planner: presets, picks and minimum rolls update the chance and the URL", () => {
    cy.visit("/info/tuning-odds", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "settings",
          JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
        );
      },
    });
    // First paint after a cold visit can be slow on the dev server.
    cy.get("[data-test-tuning-planner]", { timeout: 20000 }).should("be.visible");
    cy.get("[data-test-tuning-planner-chance]").should("contain.text", "12.8%");

    cy.get('[data-test-tuning-planner-stat="EnergyRegen"]').click();
    cy.get("[data-test-tuning-planner-chance]").should("not.contain.text", "12.8%");
    cy.location("search").should("contain", "EnergyRegen");

    cy.get("[data-test-tuning-planner-clear]").click();
    cy.get("[data-test-tuning-planner-chance]").should("contain.text", "100%");

    cy.get('[data-test-tuning-planner-stat="CritRate"]').click();
    // One substat at any roll: 5/13.
    cy.get("[data-test-tuning-planner-chance]").should("contain.text", "38.5%");
    cy.get('[data-test-tuning-planner-min="CritRate:21"]').should("not.exist");
    cy.get('[data-test-tuning-planner-min="CritRate:10.5"]').click();
    cy.get("[data-test-tuning-planner-levers]").should("exist");
    cy.location("search").should("contain", "CritRate:10.5");

    // A fresh visit of the shared link restores the goal from the URL.
    cy.visit("/info/tuning-odds?goal=CritRate:10.5");
    cy.get('[data-test-tuning-planner-min="CritRate:10.5"]', { timeout: 20000 }).should("have.attr", "aria-pressed", "true");
  });
});
