// The v3 header (ADR 0045): labeled main sections, the page's own sections as
// a second row on desktop and a bottom bar on phones, and the Scanners page.
const visitV3 = (path: string) =>
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: { useClassicUi: false }, labs: {} }),
      );
    },
  });

describe("v3 header", () => {
  it("switches main sections and calculator sections on desktop", () => {
    visitV3("/");
    cy.get("[data-test-nav-calculator]").should("have.attr", "aria-current", "page");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get(".screen--optimizer").should("be.visible");
    cy.get('[data-test-calculator-nav="optimizer"]').should("have.attr", "aria-current", "page");

    // The logo goes back to the calculator's Character screen.
    cy.get("[data-test-nav-logo]").click();
    cy.get(".screen--character").should("be.visible");

    cy.get("[data-test-nav-inventory]").click();
    cy.location("pathname").should("eq", "/inventory");
    cy.get('[data-test-inventory-nav="presets"]').should("be.visible");
  });

  it("links to the Scanners page, which sends people to wavescan.app", () => {
    visitV3("/");
    cy.get("[data-test-nav-wavescan]").click();
    cy.location("pathname").should("eq", "/scanners");
    cy.get("[data-test-scanners-get-wavescan]")
      .should("have.attr", "href", "https://wavescan.app")
      .and("have.attr", "target", "_blank");

    // "I already have a file" opens Settings on the Wavescan section.
    cy.get("[data-test-scanners-import]").click();
    cy.location("pathname").should("eq", "/settings");
    cy.get("[data-test-wavescan-paste]").should("be.visible");
  });

  it("uses a section switcher and a bottom bar on phones", () => {
    cy.viewport(390, 844);
    visitV3("/");
    cy.get('[data-test-calculator-nav="optimizer"]').should("not.be.visible");

    cy.get('[data-test-calculator-mobile-nav="optimizer"]').click();
    cy.get(".screen--optimizer").should("be.visible");

    // Sections not in the bar sit behind "All".
    cy.get("[data-test-nav-bottom-all]").click();
    cy.get('[data-test-calculator-mobile-nav="weapon"]').click();
    cy.get(".screen--weapon").should("be.visible");
    cy.get("[data-test-nav-bottom-all]").should("contain", "Weapon");

    cy.get("[data-test-nav-section-switcher]").click();
    cy.get("[data-test-nav-switcher-scanners]").click();
    cy.location("pathname").should("eq", "/scanners");
    cy.get("[data-test-nav-section-switcher]").should("contain", "Scanners");
  });
});

describe("Scanners in the classic UI", () => {
  it("is in the utility menu", () => {
    cy.visit("/");
    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-scanners]").click();
    cy.location("pathname").should("eq", "/scanners");
    cy.get("[data-test-scanners-page]").should("be.visible");
  });
});
