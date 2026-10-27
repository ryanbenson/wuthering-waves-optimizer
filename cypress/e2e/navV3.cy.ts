// The v3 nav (ADR 0045): a side rail and a row of the page's sections on
// desktop, a section switcher and a bottom bar on phones, and the Scanners page.
const visitV3 = (path: string) =>
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: { useClassicUi: false }, labs: {} }),
      );
    },
  });

describe("v3 nav", () => {
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
    cy.get("[data-test-nav-inventory]").should("have.attr", "aria-current", "page");

    // The rail's menus close when their button is clicked again.
    cy.get("[data-test-options-menu] [role=button]").click();
    cy.get("[data-test-options-settings]").should("be.visible");
    cy.get("[data-test-options-menu] [role=button]").click();
    cy.get("[data-test-options-settings]").should("not.be.visible");
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
    cy.get('[data-test-calculator-nav="optimizer"]').should("not.exist");

    cy.get("[data-test-nav-section-switcher]").click();
    cy.get('[data-test-calculator-mobile-nav="optimizer"]').click();
    cy.get(".screen--optimizer").should("be.visible");
    cy.get("[data-test-nav-section-title]").should("contain", "Optimizer");

    // Clicking the hamburger again closes it.
    cy.get("[data-test-nav-section-switcher]").click();
    cy.get('[data-test-calculator-mobile-nav="weapon"]').should("be.visible");
    cy.get("[data-test-nav-section-switcher]").click();
    cy.get('[data-test-calculator-mobile-nav="weapon"]').should("not.be.visible");

    // The main sections are in the bottom bar; everything else is under More.
    cy.get("[data-test-nav-inventory]").click();
    cy.location("pathname").should("eq", "/inventory");
    cy.get("[data-test-nav-section-title]").should("contain", "Echoes");

    cy.get("[data-test-nav-bottom-more]").click();
    cy.get("[data-test-options-scanners]").click();
    cy.location("pathname").should("eq", "/scanners");
    cy.get("[data-test-nav-bottom-more]").should("contain", "Scanners");
  });

  it("keeps the theme under More → Appearance on phones", () => {
    cy.viewport(390, 844);
    visitV3("/settings");
    cy.get('[aria-label="Change Theme"]').should("not.exist");

    cy.get("[data-test-nav-bottom-more]").click();
    cy.get("[data-test-options-appearance]").click();
    cy.get("[data-test-options-appearance-panel]").should("be.visible");
    cy.get("[data-test-options-settings]").should("not.be.visible");
    cy.get('[data-test-options-appearance-panel] [data-set-ui]').should("not.exist");
    cy.get('[data-set-theme="light"]').click();
    cy.get("html").should("have.attr", "data-theme", "light");
    // Still open, so you can try another.
    cy.get('[data-set-theme="dark"]').should("be.visible");

    cy.get("[data-test-options-appearance-back]").click();
    cy.get("[data-test-options-settings]").should("be.visible");

    // The saved theme still applies on phones without opening the menu.
    cy.reload();
    cy.get("html").should("have.attr", "data-theme", "light");
  });

  it("marks Scanners as new in the rail and the More menu until it expires", () => {
    // Only Date is faked; the app's timers run as normal.
    cy.clock(Date.UTC(2026, 10, 1), ["Date"]);
    visitV3("/");
    // Not "be.visible": the pill lets clicks through to the link
    // (pointer-events: none), so Cypress reads it as covered by the link.
    cy.get("[data-test-nav-scanners-new]").should("exist").and("contain.text", "New");

    cy.viewport(390, 844);
    cy.get("[data-test-nav-bottom-more]").click();
    cy.get("[data-test-options-scanners-new]").should("be.visible");
  });

  it("drops the new pill once the date has passed", () => {
    cy.clock(Date.UTC(2026, 11, 1), ["Date"]);
    visitV3("/");
    cy.get("[data-test-nav-wavescan]").should("be.visible");
    cy.get("[data-test-nav-scanners-new]").should("not.exist");
  });

  it("tucks the phone bottom bar away while scrolling down", () => {
    cy.viewport(390, 844);
    visitV3("/");
    cy.get(".screen--character").should("be.visible");
    cy.get("[data-test-nav-bottom-bar]").should("not.have.class", "nav-bottom-bar--tucked");

    cy.scrollTo(0, 600);
    cy.get("[data-test-nav-bottom-bar]").should("have.class", "nav-bottom-bar--tucked");
    cy.scrollTo(0, 400);
    cy.get("[data-test-nav-bottom-bar]").should("not.have.class", "nav-bottom-bar--tucked");

    // Not while its More menu is open.
    cy.scrollTo(0, 1000);
    cy.get("[data-test-nav-bottom-bar]").should("have.class", "nav-bottom-bar--tucked");
    cy.scrollTo(0, 900);
    cy.get("[data-test-nav-bottom-bar]").should("not.have.class", "nav-bottom-bar--tucked");
    cy.get("[data-test-nav-bottom-more]").click({ scrollBehavior: false });
    cy.scrollTo(0, 1400);
    cy.get("[data-test-options-settings]").should("be.visible");
    cy.get("[data-test-nav-bottom-bar]").should("not.have.class", "nav-bottom-bar--tucked");
  });

  it("starts each section and page at the top", () => {
    visitV3("/");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get(".calculations__screens").scrollTo(0, 400);
    cy.get(".calculations__screens").should(($el) => expect($el[0].scrollTop).to.be.gt(0));
    cy.get('[data-test-calculator-nav="echoes"]').click();
    cy.get(".calculations__screens").should(($el) => expect($el[0].scrollTop).to.eq(0));

    // Phones scroll the whole page.
    cy.viewport(390, 844);
    visitV3("/");
    cy.get(".screen--character").should("be.visible");
    cy.scrollTo(0, 600);
    cy.window().its("scrollY").should("be.gt", 0);
    cy.get("[data-test-nav-section-switcher]").click();
    cy.get('[data-test-calculator-mobile-nav="weapon"]').click();
    cy.window().its("scrollY").should("eq", 0);

    cy.get(".screen--weapon").should("be.visible");
    cy.scrollTo(0, 300);
    // Scrolling down tucks the bottom bar away; a small scroll up brings it back.
    cy.get("[data-test-nav-bottom-bar]").should("have.class", "nav-bottom-bar--tucked");
    cy.window().then((win) => win.scrollBy(0, -20));
    cy.get("[data-test-nav-bottom-bar]").should("not.have.class", "nav-bottom-bar--tucked");
    // Cypress's scroll-into-view before a click would tuck it away again.
    cy.get("[data-test-nav-inventory]").click({ scrollBehavior: false });
    cy.location("pathname").should("eq", "/inventory");
    cy.window().its("scrollY").should("eq", 0);
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
