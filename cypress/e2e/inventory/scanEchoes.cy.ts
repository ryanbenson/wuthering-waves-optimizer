// The in-app echo scanner (ADR 0032) is out of Labs: everyone gets the
// "Scan echoes" button in the inventory, with no flag to turn on.
describe("Scan echoes in the inventory", () => {
  it("opens the scanner without any lab turned on", () => {
    cy.visit("/inventory", {
      onBeforeLoad(win) {
        win.localStorage.setItem("settings", JSON.stringify({ config: {}, labs: {} }));
      },
    });
    cy.get("[data-test-inventory-scan-echoes]").should("be.visible").click();
    cy.get("dialog[open] .modal-box").should("be.visible");
  });
});
