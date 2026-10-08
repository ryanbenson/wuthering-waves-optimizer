// Toasts render in a top-layer popover (ToastLayer.vue). Regression: it used to
// be a <dialog> that switched to showModal() while another modal was open,
// making that modal ignore every click until the toast expired (4s).
describe("Toasts over an open modal", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.clipboard, "writeText").resolves();
      },
    });
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible");
    cy.get('[data-test-calculator-nav="character"]').click();
    cy.get("[data-test-manage-builds-open]").click();
    cy.get('[data-test-manage-builds-row="Default build"]').within(() => {
      cy.get("[data-test-manage-builds-export]").click();
    });
    cy.get("[data-test-manage-builds-export-clipboard]").click();
    cy.get(".toast-layer .alert").should("be.visible");
  });

  it("keeps the modal clickable while the toast is showing", () => {
    // Well under the toast's 4s lifetime: this must not wait for it to expire.
    cy.get("[data-test-manage-builds-toggle-import]", { timeout: 1000 }).click({ timeout: 1000 });
    cy.get("[data-test-manage-builds-import-text]").should("be.visible");
    cy.get(".toast-layer .alert").should("be.visible");
  });

  it("draws the toast above the modal, and its own dismiss button works", () => {
    cy.get(".toast-layer .alert").then(($alert) => {
      const r = $alert[0].getBoundingClientRect();
      const hit = $alert[0].ownerDocument.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      expect($alert[0].contains(hit), "toast is the topmost element at its own position").to.equal(true);
    });
    cy.get('.toast-layer .alert [aria-label="Dismiss"]').click({ timeout: 1000 });
    cy.get(".toast-layer .alert").should("not.exist");
  });

  it("moves the toast back onto the page when the modal closes, still clickable", () => {
    cy.get("#modal-manage-builds").then(($d) => ($d[0] as HTMLDialogElement).close());
    cy.get("#modal-manage-builds").should("not.have.attr", "open");
    cy.get(".toast-layer").parent().should("match", "body");
    cy.get(".toast-layer .alert").should("be.visible");
    cy.get('.toast-layer .alert [aria-label="Dismiss"]').click({ timeout: 1000 });
    cy.get(".toast-layer .alert").should("not.exist");
  });
});
