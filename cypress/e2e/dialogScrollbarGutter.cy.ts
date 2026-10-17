// Opening a dialog must not reserve an empty scrollbar gutter on the page: daisyUI sets
// overflow: hidden + scrollbar-gutter: stable on :root while a modal is open, which drew a
// gray bar and shifted the layout on pages without a scrollbar (style.css reverts it).
describe("Dialog scrollbar gutter", () => {
  it("leaves the page's scrollbar gutter alone while a dialog is open", () => {
    cy.visit("/");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get("[data-test-optimizer-guide-btn]").click();
    cy.get(".modal[open]").should("exist");

    cy.document().then((doc) => {
      const root = getComputedStyle(doc.documentElement);
      expect(root.scrollbarGutter).to.eq("auto");
      expect(root.overflow).to.not.eq("hidden");
    });
  });
});
