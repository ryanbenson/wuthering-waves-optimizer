// The Guides pages and the visual Info pages (ADR 0053). Screenshots may not be uploaded
// where this runs: a missing one shows its description, so nothing here depends on them.
// These pages are v3 only, and specs that seed nothing get the classic UI.
function visitV3(path: string) {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem("settings", JSON.stringify({ config: {}, labs: {} }));
    },
  });
}

describe("Guides", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("reaches a guide from the tab row and keeps the Guides tab active", () => {
    visitV3("/info");
    cy.get('[data-test-info-nav="guides"]').click();
    cy.location("pathname").should("eq", "/info/guides");
    cy.title().should("contain", "Guides");
    cy.get("[data-test-guides-start-path] a").should("have.length", 3);
    cy.get('[data-test-guides-category="optimize"]').contains("Find your best loadout").click();
    cy.location("pathname").should("eq", "/info/guides/best-loadout");
    cy.title().should("contain", "Find your best loadout");
    cy.get('[data-test-info-nav="guides"]').should("have.attr", "aria-current", "page");
    cy.get("[data-test-guide-marker]").should("have.length", 8);
  });

  it("searches titles and guide text, with an empty state", () => {
    visitV3("/info/guides");
    cy.get("[data-test-guides-search]").type("Theorycrafter");
    cy.get("[data-test-guides-result]").should("have.length", 1).and("contain.text", "How presets work");
    cy.get("[data-test-guides-start-path]").should("not.exist");
    cy.get("[data-test-guides-search]").clear();
    cy.get("[data-test-guides-search]").type("zzz-no-such-guide");
    cy.get("[data-test-guides-no-results]").should("be.visible");
    cy.get("[data-test-guides-search]").clear();
    cy.get("[data-test-guides-start-path]").should("be.visible");
  });

  it("opens the calculator on the screen a guide links to, then forgets the link", () => {
    visitV3("/info/guides/best-loadout");
    cy.get("[data-test-guide-action]").click();
    cy.get(".screen--optimizer").should("be.visible");
    cy.location("search").should("eq", "");
    cy.get('[data-test-calculator-nav="optimizer"]').should("have.attr", "aria-current", "page");
  });

  it("ignores an unknown screen in the link", () => {
    visitV3("/?section=nope");
    cy.get(".screen--character").should("be.visible");
  });

  it("scrolls to the section a link names", () => {
    visitV3("/info/guides");
    cy.get('[data-test-guides-category="echoes"]').contains("Import a Discord build card").click();
    cy.location("hash").should("eq", "#build-card");
    cy.get("#build-card").should(($el) => {
      expect($el[0].getBoundingClientRect().top).to.be.lessThan(200);
    });
  });

  it("explains a guide it can't find", () => {
    visitV3("/info/guides/no-such-guide");
    cy.get("[data-test-guide-not-found]").should("be.visible");
  });

  it("shows a screenshot's description if the file is missing", () => {
    cy.intercept("GET", "**/wt-info/guide-*", { statusCode: 404 });
    visitV3("/info/guides/build-card");
    cy.get("[data-test-guide-screenshot-fallback]").should("contain.text", "Build Card");
  });

  it("switches to Guides from the phone section menu", () => {
    cy.viewport(390, 844);
    visitV3("/info");
    cy.get("[data-test-nav-section-switcher]").click();
    cy.get('[data-test-info-mobile-nav="guides"]').click();
    cy.location("pathname").should("eq", "/info/guides");
    cy.get("[data-test-nav-section-title]").should("have.text", "Guides");
  });
});

describe("Visual Info pages", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("links the overview to its tools", () => {
    visitV3("/info");
    cy.get('[data-test-overview-feature="optimizer"]').contains("Run the Optimizer").click();
    cy.get(".screen--optimizer").should("be.visible");
  });

  it("re-scores the sample echo when a roll is clicked", () => {
    visitV3("/info/cv-echo-rating");
    cy.get("[data-test-cv-points]").should("contain.text", "22");
    cy.get("[data-test-cv-grade]").should("contain.text", "S");
    cy.get("[data-test-cv-value]").should("have.text", "34.8%");

    cy.get('[data-test-cv-roll="CritRate:8"]').click();
    cy.get('[data-test-cv-roll="CritDMG:8"]').click();
    cy.get("[data-test-cv-points]").should("contain.text", "28");
    cy.get("[data-test-cv-grade]").should("contain.text", "SSS");
    // 10.5 × 2 + 21
    cy.get("[data-test-cv-value]").should("have.text", "42%");
  });

  it("recalculates the sample hit when a slider moves", () => {
    visitV3("/info/formulas");
    cy.get('[data-test-formula-step="Enemy resistance"] [data-test-formula-total]').should("contain.text", "9,385");
    cy.get("[data-test-formula-resist]").invoke("val", 0).trigger("input");
    cy.get('[data-test-formula-step="Enemy resistance"] [data-test-formula-total]').should("contain.text", "10,427");
  });

  it("keeps the full legal and privacy text on the page behind a disclosure", () => {
    visitV3("/privacy");
    cy.get("[data-test-privacy-diagram]").should("be.visible");
    cy.get("[data-test-privacy-full]").should("not.have.attr", "open");
    cy.get("[data-test-privacy-full] summary").click();
    cy.get("[data-test-privacy-full]").should("have.attr", "open");
    cy.get("[data-test-privacy-full]").should("contain.text", "stored only in your browser's local storage");

    visitV3("/legal");
    cy.get("[data-test-legal-summary]").should("be.visible");
    cy.get("[data-test-legal-full]").should("contain.text", "not affiliated with, endorsed by, sponsored by, or approved by Kuro");
  });

  it("labels recent updates without adding a filter", () => {
    visitV3("/updates");
    cy.get("[data-test-updates-tag]").should("have.length.greaterThan", 0);
    cy.get("[data-test-updates-search]").should("be.visible");
  });
});
