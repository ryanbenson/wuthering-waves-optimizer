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

export {};
