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
    cy.get("@richSelectTrigger")
      .closest(".app-rich-select")
      .should("have.class", "dropdown-open");

    // Menu is teleported to <body>, so query the open portal menu.
    cy.get("[data-test-rich-select-menu]:visible")
      .should("have.length", 1)
      .within(() => {
        cy.root().then(($menu) => {
          const $search = $menu.find("[data-test-rich-select-search]");
          if ($search.length) {
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
