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
    cy.get("@richSelectTrigger").click();
    // Every rich select keeps its options mounted, so scope to this one.
    cy.get("@richSelectTrigger")
      .closest(".app-rich-select")
      .should("have.class", "dropdown-open")
      .within(() => {
        cy.root().then(($root) => {
          const $search = $root.find("[data-test-rich-select-search]");
          if ($search.length) {
            // Prefer an explicit search string; otherwise filter by value so
            // long lists don't leave the option clipped by overflow.
            cy.wrap($search)
              .clear()
              .type(options?.search ?? value);
          }
        });
        cy.get(`[data-test-rich-select-option="${value}"]`)
          .scrollIntoView()
          .should("be.visible")
          .click();
      });
  },
);

export {};
