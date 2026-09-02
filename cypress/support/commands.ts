Cypress.Commands.add("importCharacterData", (data: object) => {
  cy.get("[data-test-options-menu]").click();
  cy.get("[data-test-options-settings]").click();
  cy.get("h1").should("contain.text", "Settings");
  cy.get("[data-test-settings-import]").click();
  cy.get("h3").should("contain.text", "Overwrite your existing data");
  cy.get("[data-test-import-raw-text]")
    .invoke("val", JSON.stringify(data))
    .trigger("input")
    .trigger("change");
  cy.get("[data-test-import-raw-button]").click();
  // Import shows a toast, then reloads after 1500ms.
  cy.wait(2000);
});

Cypress.Commands.add(
  "richSelect",
  (selector: string, value: string, options?: { search?: string }) => {
    cy.get(selector).first().as("richSelectTrigger");
    cy.get("@richSelectTrigger").scrollIntoView().click({ force: true });
    // Scope to this select — options stay mounted even when visually clipped
    // by calculator overflow panes (common in Linux CI).
    cy.get("@richSelectTrigger")
      .closest(".app-rich-select")
      .should("have.class", "dropdown-open")
      .within(() => {
        cy.root().then(($root) => {
          const $search = $root.find("[data-test-rich-select-search]");
          if ($search.length) {
            cy.wrap($search)
              .clear({ force: true })
              .type(options?.search ?? value, { force: true });
          }
        });
        cy.get(`[data-test-rich-select-option="${value}"]`).click({
          force: true,
        });
      });
  },
);

// Character Workspace (UI Overhaul 3.0 / liveResultBar Labs flag) has no
// select dropdown — switching character opens CalculatorCharacterBrowser's
// modal via the Command Bar's avatar, then picks a card from it.
Cypress.Commands.add("selectWorkspaceCharacter", (key: string) => {
  // Calculator.vue remounts the whole workspace (`:key="characterBuildKey"`)
  // once the initial character's active build id resolves shortly after
  // mount/switch. Clicking the avatar mid-remount silently no-ops — wait for
  // the currently-loaded character to finish settling first.
  cy.get("[data-test-workspace-buffs-enable-all]").should("be.visible");
  cy.get("[data-test-workspace-avatar]").first().click();
  // The browser's <dialog> is a fixed-position scroll container — Cypress
  // can't reliably auto-scroll a card into view inside it (its own
  // actionability check says as much), so force the click as this repo
  // already does for other fixed-position overlays.
  cy.get(`[data-test-character-browse-select="${key}"]`).click({
    force: true,
  });
});

export {};
