// Covers the redesigned Updates page (src/components/UpdatesWorkspace.vue)
// behind the "UI Overhaul 3.0" liveResultBar labs flag.
function visitWithFlagEnabled() {
  cy.visit("/updates", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
      );
    },
  });
}

describe("Updates Workspace (liveResultBar flag)", () => {
  it("narrows results while searching, and clears back to the full grouped view", () => {
    visitWithFlagEnabled();

    cy.get("[data-test-updates-day]").should("have.length.greaterThan", 5);

    cy.get("[data-test-updates-search]").type("Jingran");
    cy.get("[data-test-updates-day]").should("have.length.greaterThan", 0);
    cy.get("[data-test-updates-day]").each(($card) => {
      cy.wrap($card).should("contain.text", "Jingran");
    });

    cy.get("[data-test-updates-search]").clear();
    cy.get("[data-test-updates-earlier]").should("exist");
  });

  it("shows an empty state for a query that matches nothing", () => {
    visitWithFlagEnabled();
    cy.get("[data-test-updates-search]").type("zzz-no-such-update-exists-zzz");
    cy.get("[data-test-updates-no-results]").should("be.visible");
    cy.get("[data-test-updates-day]").should("not.exist");
  });

  it("keeps a collapsed month's content in the DOM (not lazy-fetched) and Expand all reveals it, then Collapse all reverses it", () => {
    visitWithFlagEnabled();

    // Collapsed by default (native <details>, not a v-if) - its content is
    // still real DOM, not lazily fetched only on open. Asserted via the
    // `open` attribute directly rather than a rendered-visibility check,
    // since headless Electron doesn't reliably apply the native collapsed-
    // details rendering that real browsers do.
    cy.get("[data-test-updates-earlier]").should("not.have.attr", "open");
    cy.get("[data-test-updates-earlier] [data-test-updates-day]")
      .first()
      .should("exist");
    cy.get("[data-test-updates-expand-all]").should("contain.text", "Expand all");

    cy.get("[data-test-updates-expand-all]").click();
    cy.get("[data-test-updates-earlier]").should("have.attr", "open");
    cy.get("[data-test-updates-expand-all]").should("contain.text", "Collapse all");

    cy.get("[data-test-updates-expand-all]").click();
    cy.get("[data-test-updates-earlier]").should("not.have.attr", "open");
    cy.get("[data-test-updates-expand-all]").should("contain.text", "Expand all");
  });

  it("relabels to Collapse all when the section is opened by clicking its own summary directly", () => {
    visitWithFlagEnabled();

    cy.get("[data-test-updates-expand-all]").should("contain.text", "Expand all");
    cy.get("[data-test-updates-earlier] summary").click();
    cy.get("[data-test-updates-earlier]").should("have.attr", "open");
    cy.get("[data-test-updates-expand-all]").should("contain.text", "Collapse all");

    cy.get("[data-test-updates-earlier] summary").click();
    cy.get("[data-test-updates-earlier]").should("not.have.attr", "open");
    cy.get("[data-test-updates-expand-all]").should("contain.text", "Expand all");
  });

  it("hides the expand/collapse control while searching", () => {
    visitWithFlagEnabled();
    cy.get("[data-test-updates-expand-all]").should("be.visible");
    cy.get("[data-test-updates-search]").type("Jingran");
    cy.get("[data-test-updates-expand-all]").should("not.exist");
  });
});

describe("Updates page (flag off, legacy)", () => {
  it("still renders the full flat changelog article", () => {
    cy.visit("/updates");
    cy.get("article.page-updates h3").should("have.length.greaterThan", 100);
    cy.get("[data-test-updates-search]").should("not.exist");
  });
});
