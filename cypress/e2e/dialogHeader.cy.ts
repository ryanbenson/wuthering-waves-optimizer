// #632: every dialog's title and close (X) share one header row that stays put while the
// dialog's body scrolls (AppModal, ADR 0043).
describe("Dialog header", () => {
  it("keeps the Optimizer Guide's title and X in place while its body scrolls", () => {
    cy.visit("/");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get("[data-test-optimizer-guide-btn]").click();

    cy.get(".modal[open] .app-modal__box").as("box");
    // The header is the box's first row; the guide's own body has h3s too.
    cy.get("@box").children().first().find("h3").should("have.text", "Optimizer Guide");
    cy.get("@box").find(".app-modal__body").as("body");
    cy.get("@body").should(($body) => {
      expect($body[0].scrollHeight, "guide is long enough to scroll").to.be.greaterThan($body[0].clientHeight);
    });

    const headerOffsets = ($box: JQuery<HTMLElement>) => {
      const box = $box[0].getBoundingClientRect();
      const title = $box[0].querySelector("h3")!.getBoundingClientRect();
      const close = $box[0].querySelector('button[aria-label="Close"]')!.getBoundingClientRect();
      return { title: title.top - box.top, close: close.top - box.top, sameRow: Math.abs(title.top + title.height / 2 - (close.top + close.height / 2)) < 2 };
    };

    cy.get("@box").then(($box) => {
      const atTop = headerOffsets($box);
      expect(atTop.sameRow, "title and X on one row").to.equal(true);
      cy.get("@body").scrollTo("bottom");
      cy.get("@body").should(($body) => expect($body[0].scrollTop).to.be.greaterThan(0));
      cy.get("@box").should(($scrolled) => {
        const scrolled = headerOffsets($scrolled);
        expect(scrolled.title).to.be.closeTo(atTop.title, 1);
        expect(scrolled.close).to.be.closeTo(atTop.close, 1);
      });
    });

    cy.get('.modal[open] button[aria-label="Close"]').click();
    cy.get(".modal[open]").should("not.exist");
  });

  it("leaves the dialog open when clicking just below the header", () => {
    cy.visit("/");
    cy.get('[data-test-calculator-nav="echoes"]').click();
    cy.get('[data-test="calculator-echoes-overflow-menu"]').filter(":visible").click();
    cy.contains("button", "Customize Weights").click();

    // 8px into the body, mid-width.
    cy.get(".modal[open] .app-modal__body").then(($body) => {
      cy.wrap($body).click($body[0].clientWidth / 2, 8);
    });
    cy.get(".modal[open] .app-modal__box").should("be.visible");
  });
});
