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

export {};
