// Covers the redesigned Settings page (src/components/SettingsWorkspace.vue),
// the v3 UI's default. The classic tab strip is covered at the bottom.
function visitSettings() {
  cy.visit("/settings", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: {} }),
      );
    },
  });
}

describe("Settings Workspace (v3 UI)", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("switches sections via the tab row", () => {
    visitSettings();

    cy.get('[data-test-settings-nav="preferences"]').should("have.attr", "aria-current", "page");
    cy.get('[data-test-hide-wont-build-characters]').should("exist");

    cy.get('[data-test-settings-nav="backup-restore"]').click();
    cy.get('[data-test-settings-export-copy]').should("be.visible");
    cy.get(".alert-warning").should("contain.text", "replaces all of your existing data");

    cy.get('[data-test-settings-nav="danger-zone"]').click();
    cy.contains("button", "Delete").should("be.visible");

    cy.get('[data-test-settings-nav="labs"]').click();
    cy.contains("Rotation timing from frame data").should("be.visible");
    cy.get("[data-test-settings-labs-empty]").should("contain.text", "More experiments will land here");
  });

  it("switches sections via the phone section menu", () => {
    cy.viewport(390, 844);
    visitSettings();

    cy.get("[data-test-nav-section-switcher]").click();
    cy.get('[data-test-settings-mobile-nav="backup-restore"]').click();
    cy.get('[data-test-settings-export-download]').should("be.visible");
    cy.get("[data-test-nav-section-title]").should("have.text", "Backup & Restore");
  });

  it("opens the Wavescan section from the Scanners page's link", () => {
    cy.visit("/settings?section=wavescan", {
      onBeforeLoad(win) {
        win.localStorage.setItem("settings", JSON.stringify({ config: {}, labs: {} }));
      },
    });
    cy.get('[data-test-settings-nav="wavescan"]').should("have.attr", "aria-current", "page");
  });

  it("exports data via download and copy", () => {
    visitSettings();
    cy.get('[data-test-settings-nav="backup-restore"]').click();

    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, "writeText").as("copy");
    });
    cy.get("[data-test-settings-export-copy]").click();
    cy.get("@copy").should("have.been.calledOnce");
  });

  it("imports and overwrites via the warning-bannered restore panel", () => {
    visitSettings();
    cy.get('[data-test-settings-nav="backup-restore"]').click();

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

});

describe("Settings page (classic UI)", () => {
  it("still renders the legacy tab strip and lets you switch tabs", () => {
    cy.visit("/settings");
    cy.get("[data-test-settings-preferences]").should("have.class", "before:bg-primary");
    cy.get("[data-test-hide-wont-build-characters]").should("exist");

    cy.get("[data-test-settings-labs]").click();
    cy.contains("Rotation timing from frame data").should("be.visible");

    cy.get("[data-test-settings-export]").click();
    cy.get("[data-test-settings-export-copy]").should("be.visible");
    // The new grouped/v3-only elements must not leak into the legacy page.
    cy.get("[data-test-settings-nav]").should("not.exist");
  });
});
