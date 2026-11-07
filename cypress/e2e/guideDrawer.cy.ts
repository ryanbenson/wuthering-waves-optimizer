// In-app help (ADR 0055): v3 screens open guides in a drawer beside them, and empty
// screens say how to start. Classic keeps its modals, covered by the classic specs.
function visitV3(path: string) {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem("settings", JSON.stringify({ config: {}, labs: {} }));
    },
  });
}

// The calculator re-renders while it settles after a ?section= link (it drops the query),
// so wait for that before clicking anything on the screen.
function visitScreen(section: string) {
  visitV3(`/?section=${section}`);
  cy.location("search").should("eq", "");
  cy.get(`.screen--${section}`).should("be.visible");
}

describe("Guide drawer", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("opens the Optimizer guide beside the screen and closes with Escape, returning focus", () => {
    visitScreen("optimizer");
    cy.get("[data-test-optimizer-workspace-guide-btn]").click();
    cy.get("#guide-drawer-title").should("be.visible").and("have.text", "Find your best loadout");
    cy.focused().should("have.attr", "data-test-guide-drawer-close");
    cy.get("body").type("{esc}");
    cy.get("[data-test-guide-drawer]").should("not.exist");
    cy.focused().should("have.attr", "data-test-optimizer-workspace-guide-btn");
    cy.get(".screen--optimizer").should("be.visible");
  });

  it("closes from the overlay and the close button", () => {
    visitScreen("optimizer");
    cy.get("[data-test-optimizer-workspace-guide-btn]").click();
    cy.get("[data-test-guide-drawer-close]").click();
    cy.get("[data-test-guide-drawer]").should("not.exist");

    cy.get("[data-test-optimizer-workspace-guide-btn]").click();
    cy.get("[data-test-guide-drawer-root] .drawer-overlay").click("left", { force: true });
    cy.get("[data-test-guide-drawer]").should("not.exist");
  });

  it("goes to the full guide and closes on the way", () => {
    visitScreen("optimizer");
    cy.get("[data-test-optimizer-workspace-guide-btn]").click();
    cy.get("[data-test-guide-drawer-full]").click();
    cy.location("pathname").should("eq", "/info/guides/best-loadout");
    cy.get("[data-test-guide-drawer]").should("not.exist");
    cy.get("body").should("not.have.css", "overflow", "hidden");
  });

  it("opens the rating and presets guides from the Echoes screen", () => {
    visitScreen("echoes");
    // A real click focuses the trigger, and Cypress's focus scroll closes the menu (it closes on scroll).
    cy.get('[data-test="calculator-echoes-overflow-menu"]:visible').trigger("click");
    cy.contains("button", "Rating Guide").should("be.visible");
    // The menu repositions itself while Cypress acts on it, so click the element directly.
    cy.contains("button", "Rating Guide").then(($button) => $button[0].click());
    cy.get("[data-test-guide-drawer]").should("contain.text", "How echo grades work");
    cy.get("[data-test-guide-drawer-close]").click();

    cy.get("[data-test-echoes-presets-trigger]").trigger("click");
    cy.get("[data-test-echoes-presets-guide]").then(($button) => $button[0].click());
    cy.get("[data-test-guide-drawer]").should("contain.text", "How presets work");
  });

  it("opens the Convene method from the page", () => {
    visitV3("/convene");
    cy.get("[data-test-convene-intro]").should("be.visible");
    cy.get("[data-test-convene-method]").click();
    cy.get("[data-test-guide-drawer]").should("contain.text", "pity curve");
  });

  it("fills the screen on a phone", () => {
    cy.viewport(390, 844);
    visitV3("/convene");
    cy.get("[data-test-convene-method]").click();
    cy.get("[data-test-guide-drawer]").should(($el) => {
      expect($el[0].getBoundingClientRect().width).to.be.closeTo(390, 2);
    });
  });
});

describe("Empty states", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("offers the ways to fill an empty inventory", () => {
    visitV3("/inventory");
    cy.get("[data-test-inventory-empty-state]").should("be.visible");
    cy.get('[data-test-inventory-empty-way="build-card"]').click();
    cy.get("[data-test-echo-import-save-toggle], dialog[open]").should("exist");
  });

  it("links an empty inventory's Wavescan option to its section", () => {
    visitV3("/inventory");
    cy.get('[data-test-inventory-empty-way="wavescan"]').click();
    cy.location("pathname").should("eq", "/scanners");
    cy.location("hash").should("eq", "#wavescan");
  });

  it("shows how to start when a character has no rotations", () => {
    visitScreen("rotations");
    cy.get("[data-test-rotations-empty-state]").should("be.visible");
    cy.get("[data-test-rotations-empty-presets]").click();
    cy.get("[data-test-rotations-presets]").contains("button", "Import").should("exist");
  });

  it("opens the rotations guide from an empty rotations screen", () => {
    visitScreen("rotations");
    cy.get("[data-test-rotations-empty-guide]").click();
    cy.get("[data-test-guide-drawer]").should("contain.text", "Build a rotation");
  });
});
