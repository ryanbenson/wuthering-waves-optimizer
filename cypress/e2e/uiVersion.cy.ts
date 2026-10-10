// v3 is the default UI; classic is an opt-in from the theme menu or Settings (ADR 0038).
// cypress/support/e2e.ts seeds classic for specs without settings, so these specs
// remove or replace that seed to see what a real user gets.

function visitAsNewUser(path = "/") {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.removeItem("settings");
    },
  });
}

function storedConfig() {
  return cy
    .window()
    .its("localStorage")
    .invoke("getItem", "settings")
    .then((raw) => JSON.parse((raw as string) ?? "{}").config ?? {});
}

describe("UI version (v3 default, classic opt-in)", () => {
  it("shows v3 to a new user", () => {
    visitAsNewUser();
    cy.get("[data-test-workspace-avatar]").should("exist");
  });

  it("shows v3 to someone who turned the old beta lab off", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "settings",
          JSON.stringify({ config: {}, labs: { liveResultBar: { isEnabled: false } } }),
        );
      },
    });
    cy.get("[data-test-workspace-avatar]").should("exist");
  });

  it("switches to classic and back from the theme menu", () => {
    visitAsNewUser();
    cy.get("[data-test-workspace-avatar]").should("exist");

    cy.get('[aria-label="Change Theme"]').first().click();
    cy.get('[data-set-ui="classic"]').first().click({ force: true });
    cy.get("[data-test-workspace-avatar]").should("not.exist");
    storedConfig().its("useClassicUi").should("equal", true);

    cy.get('[aria-label="Change Theme"]').first().click();
    cy.get('[data-set-ui="v3"]').first().click({ force: true });
    cy.get("[data-test-workspace-avatar]").should("exist");
    storedConfig().its("useClassicUi").should("equal", false);
  });

  it("switches to classic from Settings → Preferences, and the choice survives a reload", () => {
    visitAsNewUser("/settings");
    cy.get("[data-test-use-classic-ui]").should("not.be.checked").check({ force: true });
    storedConfig().its("useClassicUi").should("equal", true);

    cy.reload();
    cy.get("[data-test-use-classic-ui]").should("be.checked");
    // The classic settings page is the tabbed one with an <h1>.
    cy.get("h1").should("contain.text", "Settings");
  });

  it("announces v3 with a 'See what's new' modal", () => {
    visitAsNewUser();
    cy.get("[data-test-update-banner]").should("contain.text", "v3");
    cy.get("[data-test-update-banner-changelog]").click();
    cy.get("[data-test-whats-new-v3-modal]").should("have.attr", "open");
    cy.get("[data-test-whats-new-use-classic]").should("exist");
  });
});
