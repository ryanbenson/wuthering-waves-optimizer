// The logo in the top bar goes to the calculator, and back to its main
// (Character) screen when the calculator is already open.
describe("Nav logo", () => {
  it("returns to the calculator's Character screen", () => {
    cy.visit("/");
    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.get(".screen--weapon").should("be.visible");
    cy.get("[data-test-nav-logo]").click();
    cy.get(".screen--character").should("be.visible");
  });

  it("goes to the calculator from another page", () => {
    cy.visit("/inventory");
    cy.get("[data-test-nav-logo]").click();
    cy.location("pathname").should("eq", "/");
  });

  it("is hidden on phones, where the bar is out of room", () => {
    cy.viewport(375, 700);
    cy.visit("/");
    cy.get("[data-test-nav-logo]").should("not.be.visible");
  });
});
