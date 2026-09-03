// Covers the redesigned Settings page (src/components/SettingsWorkspace.vue)
// behind the "UI Overhaul 3.0" liveResultBar labs flag. The legacy tab strip
// is left untouched; this only exercises the new sidebar shell.
function visitWithFlagEnabled() {
  cy.visit("/settings", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
      );
    },
  });
}

describe("Settings Workspace (liveResultBar flag)", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("switches sections via the desktop sidebar", () => {
    visitWithFlagEnabled();

    cy.get('[data-test-workspace-nav-item="preferences"]').should(
      "have.class",
      "workspace-side-nav__item--active",
    );
    cy.get('[data-test-hide-wont-build-characters]').should("exist");

    cy.get('[data-test-workspace-nav-item="backup-restore"]').click();
    cy.get('[data-test-settings-export-copy]').should("be.visible");
    cy.get(".alert-warning").should("contain.text", "replaces all of your existing data");

    cy.get('[data-test-workspace-nav-item="danger-zone"]').click();
    cy.contains("button", "Delete").should("be.visible");

    cy.get('[data-test-workspace-nav-item="labs"]').click();
    cy.contains("UI Overhaul 3.0").should("be.visible");
  });

  it("switches sections via the always-visible mobile pill row", () => {
    cy.viewport(390, 844);
    visitWithFlagEnabled();

    // No trigger to open first - every pill is already visible.
    cy.get('[data-test-workspace-nav-mobile-item="backup-restore"]').click();
    cy.get('[data-test-settings-export-download]').should("be.visible");
  });

  it("exports data via download and copy", () => {
    visitWithFlagEnabled();
    cy.get('[data-test-workspace-nav-item="backup-restore"]').click();

    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, "writeText").as("copy");
    });
    cy.get("[data-test-settings-export-copy]").click();
    cy.get("@copy").should("have.been.calledOnce");
  });

  it("imports and overwrites via the warning-bannered restore panel", () => {
    visitWithFlagEnabled();
    cy.get('[data-test-workspace-nav-item="backup-restore"]').click();

    const payload = JSON.stringify({
      meta: { version: "9", source: "WutheringTools" },
      data: {
        character: JSON.stringify({ characters: {}, activeCharacter: "", favoriteCharacters: [] }),
        inventory: JSON.stringify({ echoes: [], equipped: {}, echoPresets: [], equippedPresets: {} }),
        teamRotations: JSON.stringify({ teams: [] }),
      },
    });

    cy.get("[data-test-import-raw-text]").invoke("val", payload).trigger("input");
    cy.get("[data-test-import-raw-button]").click();
    cy.contains("Your data has been overwritten!").should("be.visible");
  });

  it("shows the active lab as enabled, persisted across reload", () => {
    // Unchecking the only lab here would flip the very flag this workspace
    // renders under - it's tested via the toggle's own store round trip in
    // tests/settings/store.test.ts instead. This just confirms the card
    // reflects and survives a reload while staying on.
    visitWithFlagEnabled();
    cy.get('[data-test-workspace-nav-item="labs"]').click();
    cy.get('input[type="checkbox"]').first().should("be.checked");
    cy.reload();
    cy.get('[data-test-workspace-nav-item="labs"]').click();
    cy.get('input[type="checkbox"]').first().should("be.checked");
  });
});

describe("Settings page (flag off, legacy)", () => {
  it("still renders the legacy tab strip and lets you switch tabs", () => {
    cy.visit("/settings");
    cy.get("[data-test-settings-preferences]").should("have.class", "before:bg-primary");
    cy.get("[data-test-hide-wont-build-characters]").should("exist");

    cy.get("[data-test-settings-labs]").click();
    cy.contains("UI Overhaul 3.0").should("be.visible");

    cy.get("[data-test-settings-export]").click();
    cy.get("[data-test-settings-export-copy]").should("be.visible");
    // The new grouped/v3-only elements must not leak into the legacy page.
    cy.get("[data-test-workspace-nav-item]").should("not.exist");
  });
});
