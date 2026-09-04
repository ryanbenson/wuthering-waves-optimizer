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
