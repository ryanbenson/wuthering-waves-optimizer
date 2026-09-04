// Covers the v3 chooser modals behind the "UI Overhaul 3.0" liveResultBar
// labs flag: WorkspaceCharacterBrowser, WorkspaceWeaponBrowser,
// WorkspaceEchoesBrowser and WorkspaceEnemyBrowser, all built on the shared
// AppChooserModal shell.
//
// The character browser deliberately keeps the same `data-test-character-*`
// selectors the legacy browser used, so `cy.selectWorkspaceCharacter` and the
// other shared commands in cypress/support/commands.ts keep working against
// it unmodified — every use of those commands here is itself that regression
// check.

function visitWithFlagEnabled() {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
      );
    },
  });
}

// Two cost-4 echoes differing only in ATK substat, so the swap-impact
// estimate has something real to separate them by.
function seedEcho(echoId: string, atk: number) {
  return {
    echoId,
    echo: "BellBorneGeochelone",
    echoSet: "FreezingFrost",
    rank: 5,
    stat: "CritRate",
    type: 4,
    echoSubStatsType1: "ATK",
    echoSubStatsValue1: atk,
    echoSubStatsType2: "none",
    echoSubStatsValue2: 0,
    echoSubStatsType3: "none",
    echoSubStatsValue3: 0,
    echoSubStatsType4: "none",
    echoSubStatsValue4: 0,
    echoSubStatsType5: "none",
    echoSubStatsValue5: 0,
  };
}

function visitWithSeededInventory() {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
      );
      win.localStorage.setItem(
        "inventory",
        JSON.stringify({
          echoes: [seedEcho("chooser-weak", 30), seedEcho("chooser-strong", 120)],
          equipped: {},
          echoPresets: [],
          equippedPresets: {},
        }),
      );
    },
  });
}

// Same shape as seedEcho, but on a different real set — MidnightVeil rather
// than FreezingFrost — for the impact-sort/set-filter regression below.
function seedOtherSetEcho(echoId: string, atk: number) {
  return { ...seedEcho(echoId, atk), echoSet: "MidnightVeil" };
}

function visitWithTwoSetInventory() {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
      );
      win.localStorage.setItem(
        "inventory",
        JSON.stringify({
          echoes: [
            seedEcho("chooser-weak", 30),
            seedEcho("chooser-strong", 120),
            seedOtherSetEcho("chooser-other-set", 80),
          ],
          equipped: {},
          echoPresets: [],
          equippedPresets: {},
        }),
      );
    },
  });
}

describe("v3 chooser modals (liveResultBar flag)", () => {
  it("picks a character through the shared shell, using the preserved selectors", () => {
    visitWithFlagEnabled();
    // Uses the shared command — proves the selector contract still holds.
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get("[data-test-workspace-avatar]").should("be.visible");
  });

  it("filters the character browser and switches between list and grid views", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta");

    cy.get("[data-test-workspace-avatar]").first().click();
    cy.get("[data-test-character-browser-count]").should("be.visible");

    // Search narrows the list, and the row action is reachable in list view.
    cy.get("[data-test-character-browser-view='list']").click();
    cy.get("[data-test-character-browser-search]").type("Jinhsi");
    cy.get("[data-test-character-browse-select='Jinhsi']").should("be.visible");
    cy.get("[data-test-character-browser-count]").should("contain.text", "1 character");

    // Back to grid, same filtered result, same action selector.
    cy.get("[data-test-character-browser-view='grid']").click();
    cy.get("[data-test-character-browse-select='Jinhsi']").should("be.visible");

    cy.get("[data-test-character-browser-close]").click({ force: true });
  });

  it("filters weapons by main stat and equips one", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta");

    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.get("[data-test-workspace-weapon-browse]").click();
    cy.get("[data-test-workspace-weapon-browser-list]").should("exist");

    // Search is part of the always-visible filter bar. Clicks inside the
    // <dialog> are forced for the same reason cypress/support/commands.ts
    // already documents: Cypress can't reliably resolve actionability inside
    // a fixed-position dialog scroll container.
    cy.get("[data-test-workspace-weapon-browser-search]").type("Static Mist", {
      force: true,
    });
    cy.get("[data-test-workspace-weapon-browser-count]").should(
      "contain.text",
      "1 weapon",
    );
    cy.get("[data-test-workspace-weapon-browser-row='StaticMist']").should("exist");
    cy.get("[data-test-workspace-weapon-browser-equip='StaticMist']").click({
      force: true,
    });
    cy.get("[data-test-workspace-weapon-browser-list]").should("not.exist");
    cy.get("[data-test-workspace-weapon-equipped]").should("contain.text", "Static Mist");
  });

  it("estimates echo swap impact and equips from the inventory browser", () => {
    visitWithSeededInventory();
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="echoes"]').click();

    // Open the slot editor, then its Browse action.
    cy.get('[data-test-echo-item="0"]').click();
    cy.get("[data-test-echo-edit-browse]").click({ force: true });
    cy.get("[data-test-workspace-echoes-browser-list]").should("exist");

    // Both seeded echoes are candidates for the empty slot, and each gets a
    // real damage-delta badge — the feature that did not exist before.
    cy.get("[data-test-workspace-echoes-browser-impact='chooser-strong']", {
      timeout: 15000,
    }).should("exist");
    cy.get("[data-test-workspace-echoes-browser-impact='chooser-weak']").should("exist");

    cy.get("[data-test-workspace-echoes-browser-use='chooser-strong']").click({
      force: true,
    });
    cy.get("[data-test-workspace-echoes-browser-list]").should("not.exist");
  });

  // Regression test for a reported bug. Reproduction needs a *reopen* in
  // the middle — opening the browse modal always wipes impactByEchoId (a
  // different, correct fix from earlier: a stale cache from the modal's
  // last session must never carry over), then repopulates only the
  // *current page*, not the full filtered list. So:
  //   1. Sort by impact, filter to set B, equip one of its echoes (closes
  //      the modal). At this point the full unfiltered list had already
  //      been widened once (the sortBy->"impact" transition), so set A's
  //      echoes were incidentally already cached too — not yet a visible
  //      bug.
  //   2. Reopen the browser for the same slot. impactByEchoId is wiped and
  //      only the current page (still filtered to set B) is recomputed —
  //      set A's cached deltas from step 1 are gone.
  //   3. Switch the filter to set A *without* touching sortBy or closing
  //      the modal. Nothing re-triggers a computation for set A's now-
  //      visible echoes: the page-level watcher bailed out whenever sortBy
  //      was "impact", and the sortBy watcher only re-runs when sortBy's
  //      own value changes, not when the filtered set does. Their badges
  //      never appear. Toggling the sort dropdown to "Inventory order" and
  //      back worked around it, which was the tell this was a watcher
  //      wiring bug, not a calculation bug.
  it("keeps showing impact badges after switching set filters while sorted by impact", () => {
    visitWithTwoSetInventory();
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="echoes"]').click();

    cy.get('[data-test-echo-item="0"]').click();
    cy.get("[data-test-echo-edit-browse]").click({ force: true });
    cy.get("[data-test-workspace-echoes-browser-list]").should("exist");

    cy.get("[data-test-workspace-echoes-browser-sort]").select("impact", { force: true });
    cy.get(".echo-filters__sets button.MidnightVeil").click({ force: true });
    cy.get("[data-test-workspace-echoes-browser-impact='chooser-other-set']", {
      timeout: 15000,
    }).should("exist");
    cy.get("[data-test-workspace-echoes-browser-use='chooser-other-set']").click({
      force: true,
    });
    cy.get("[data-test-workspace-echoes-browser-list]").should("not.exist");

    // Reopen for the same slot — this wipes the cache built up above.
    cy.get('[data-test-echo-item="0"]').click();
    cy.get("[data-test-echo-edit-browse]").click({ force: true });
    cy.get("[data-test-workspace-echoes-browser-list]").should("exist");

    // Filter changes to FreezingFrost without ever touching sortBy (still
    // "impact") or closing the modal — both of its echoes must still get
    // badges.
    cy.get(".echo-filters__sets button.MidnightVeil").click({ force: true });
    cy.get(".echo-filters__sets button.FreezingFrost").click({ force: true });
    cy.get("[data-test-workspace-echoes-browser-impact='chooser-strong']", {
      timeout: 15000,
    }).should("exist");
    cy.get("[data-test-workspace-echoes-browser-impact='chooser-weak']").should("exist");
  });

  it("shows resistance chips in the enemy browser and selects an enemy", () => {
    visitWithFlagEnabled();
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="enemy"]').click();

    cy.get("[data-test-enemy-workspace-browse-open]").click();
    cy.get("[data-test-enemy-browser-list]").should("exist");

    cy.get("[data-test-enemy-browser-search]").type("Bell-Borne", { force: true });
    // Carlotta is Glacio, so her own element leads the chip row — and this
    // enemy's Glacio resistance (40%) is exactly the thing worth seeing
    // before committing, which is the point of the chips.
    cy.get("[data-test-enemy-browser-resist='bellBorneGeochelone-Glacio']").should(
      "contain.text",
      "Glacio 40%",
    );
    cy.get("[data-test-enemy-browser-choose='bellBorneGeochelone']").click({
      force: true,
    });
    cy.get("[data-test-enemy-workspace-resist]").should("be.visible");
  });
});
