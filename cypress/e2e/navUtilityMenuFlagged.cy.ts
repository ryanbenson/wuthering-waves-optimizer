// Covers the redesigned utility nav dropdown (src/components/navigation/Nav.vue)
// behind the "UI Overhaul 3.0" liveResultBar labs flag. The flag-off legacy
// flat list is left untouched and not re-tested here (no prior coverage
// existed for it either).
function visitWithFlagEnabled() {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: true } } }),
      );
    },
  });
}

describe("Utility nav dropdown (liveResultBar flag)", () => {
  it("groups links into Workspace/Resources/Community and every link still navigates", () => {
    visitWithFlagEnabled();

    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-menu-v3]").should("be.visible");
    cy.get("[data-test-options-menu-v3] .subnav__eyebrow").should(($eyebrows) => {
      const text = $eyebrows.toArray().map((el) => el.textContent);
      expect(text).to.deep.equal(["Workspace", "Resources", "Community"]);
    });

    cy.get("[data-test-options-settings]").click();
    cy.location("pathname").should("eq", "/settings");

    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-menu-v3]").contains("a", "Info").click();
    cy.location("pathname").should("eq", "/info");

    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-menu-v3]").contains("a", "Updates").click();
    cy.location("pathname").should("eq", "/updates");

    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-menu-v3]").contains("a", "Privacy").click();
    cy.location("pathname").should("eq", "/privacy");

    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-menu-v3]").contains("a", "Legal").click();
    cy.location("pathname").should("eq", "/legal");
  });

  it("shows no badge, dot, or count anywhere in the menu", () => {
    visitWithFlagEnabled();
    cy.get("[data-test-options-menu]").click();
    cy.get("[data-test-options-menu-v3]").find(".badge, [class*='badge-']").should("not.exist");
  });
});
