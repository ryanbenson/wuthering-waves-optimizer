// The Scanners page (ADR 0045): every way to get echoes in, and links that
// open the in-browser scanner and the build card importer in the inventory.
describe("Scanners page", () => {
  it("lists the four options and jumps to each", () => {
    cy.visit("/scanners");
    cy.get("[data-test-scanners-option]").should("have.length", 4);
    cy.get('[data-test-scanners-option="build-card"]').click();
    cy.get('[data-test-scanners-section="build-card"]').should(($el) => {
      const top = $el[0].getBoundingClientRect().top;
      expect(top).to.be.lessThan(200);
    });
    cy.get('[data-test-scanners-section="privacy"]').should("contain.text", "never leaves your device");
  });

  it("opens the scanner in the inventory", () => {
    cy.visit("/scanners");
    cy.get("[data-test-scanners-open-scanner]").click();
    cy.location("pathname").should("eq", "/inventory");
    cy.get("dialog[open] [data-test-scanner-guide], dialog[open] .modal-box").should("be.visible");
    // The query is dropped, so a reload doesn't reopen it.
    cy.location("search").should("eq", "");
  });

  it("opens the build card importer in the inventory", () => {
    cy.visit("/scanners");
    cy.get("[data-test-scanners-open-importer]").click();
    cy.location("pathname").should("eq", "/inventory");
    cy.get("dialog[open]").should("contain.text", "/create");
    cy.location("search").should("eq", "");
  });
});
