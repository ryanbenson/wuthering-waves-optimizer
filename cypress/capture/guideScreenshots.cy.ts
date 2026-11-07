/* eslint-disable cypress/no-unnecessary-waiting, cypress/unsafe-to-chain-command -- screenshots need the page settled, and this never runs in CI. */
// Captures the Guides pages' screenshots. Not part of the E2E suite: run it with
// `npm run guides:screenshots` against a dev server. Sizes are the CSS pixels of each
// clip, doubled by the capture's device scale; src/content/guides/images.ts must match.
import { configOptimizer } from "../e2e/calculator/data/Lupa/data";

const RAIL_WIDTH = 64;
const FULL = { x: RAIL_WIDTH, y: 0, width: 1376, height: 900 };

function seedAndVisit(path: string) {
  cy.visit(path, {
    onBeforeLoad(win) {
      const { character, inventory } = configOptimizer.data;
      if (character) win.localStorage.setItem("character", character);
      if (inventory) win.localStorage.setItem("inventory", inventory);
      win.localStorage.setItem("settings", JSON.stringify({ config: { theme: "dark", density: "comfy" } }));
    },
  });
  // Character art and icons come from the asset CDN.
  cy.wait(2500);
}

function shot(name: string, clip: Cypress.ScreenshotOptions["clip"] = FULL) {
  cy.screenshot(`guide-${name}`, { capture: "viewport", clip, overwrite: true, disableTimersAndAnimations: true });
}

function openScreen(section: string) {
  cy.get(`[data-test-calculator-nav="${section}"]`).click();
  // The clicked tab would otherwise show its keyboard focus ring in the shot.
  cy.focused().blur();
  cy.wait(1200);
}

describe("guide screenshots", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    // Lupa's resonance chain handler can reject on first load, before her buffs panel
    // mounts. It doesn't affect what's captured.
    cy.on("uncaught:exception", () => false);
  });

  it("calculator screens", () => {
    seedAndVisit("/");
    shot("character");
    shot("stat-bar", { x: 905, y: 70, width: 320, height: 65 });

    openScreen("echoes");
    shot("echoes");
    shot("echo-equipped", { x: RAIL_WIDTH + 31, y: 225, width: 620, height: 325 });
    shot("build-score", { x: RAIL_WIDTH + 655, y: 225, width: 690, height: 590 });

    openScreen("buildCard");
    shot("build-card");

    openScreen("rotations");
    cy.get(".screen--rotations").contains("10 actions").click();
    cy.wait(1500);
    shot("rotations");
  });

  it("optimizer", () => {
    seedAndVisit("/");
    openScreen("optimizer");
    shot("optimizer-setup");
    cy.get("[data-test-optimizer-workspace-optimize-btn]").click();
    cy.contains(/evaluated/i, { timeout: 60000 }).should("be.visible");
    cy.wait(1000);
    shot("optimizer-results");
    shot("optimizer-top5", { x: RAIL_WIDTH + 31, y: 235, width: 1300, height: 340 });
  });

  it("inventory", () => {
    seedAndVisit("/inventory");
    cy.contains("button", "Filters").click();
    cy.wait(600);
    shot("inventory", { x: RAIL_WIDTH, y: 186, width: 1376, height: 520 });
    shot("echo-inventory", { x: RAIL_WIDTH + 31, y: 190, width: 660, height: 325 });
  });

  it("tuning planner", () => {
    seedAndVisit("/info/tuning-odds");
    cy.get("[data-test-tuning-planner-preset]").first().click();
    cy.wait(500);
    shot("tuning");
  });

  it("convene", () => {
    seedAndVisit("/convene");
    cy.get("[data-test-convene-astrite]").clear().type("12000");
    cy.get("[data-test-convene-wishes]").clear().type("20");
    cy.wait(2500);
    cy.window().then((win) => win.scrollTo(0, 380));
    cy.wait(500);
    shot("convene", { x: RAIL_WIDTH + 785, y: 92, width: 560, height: 645 });
  });

  it("team rotation", () => {
    seedAndVisit("/teams");
    cy.get('[data-test="team-rotations-overflow-menu"]').click();
    cy.get("[data-test-team-rotations-toggle-presets]").click();
    cy.get("[data-test-team-rotations-preset-import]").first().click();
    // Give each character a rotation, so the chart shows the whole team.
    [0, 1, 2].forEach((slot) => {
      cy.get(`[data-test-team-rotation-import-rotation-open="${slot}"]`).click();
      cy.get("[data-test-team-rotation-import-modal] [data-test-team-rotation-import-append]").first().click();
      cy.wait(500);
    });
    cy.get("[data-test-team-rotation-duration]").clear().type("25");
    // Long enough for the "imported" toasts to clear.
    cy.wait(7000);
    shot("team");
  });
});
