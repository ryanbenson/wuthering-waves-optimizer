import { changliLevel80, changliLevel80Stats } from "./data/changli-level-80";
import {
  calcharoLevel90,
  calcharoLevel90AllSelfBonuses,
  calcharoLevel90BaseStats,
  calcharoLevel90AllSelfBonusesStats,
} from "./data/calcharo-level-90";
import { testAttacks } from "./utils/attackUtils";
import { testStats } from "./utils/statUtils";

describe("Home E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the homepage successfully and have the correct title", () => {
    cy.title().should("eq", "Wuthering Waves Calculator & Optimizer");
  });

  it("should display the navigation bar with current chunks", () => {
    cy.get(".navbar").should("be.visible");
    cy.get(".navbar-start").should("be.visible");
    cy.get(".navbar-end").should("be.visible");
    cy.get(".navbar-center").should("be.visible");
  });

  it("should have an accessible damage calculator page", () => {
    cy.get(".calculator__content").should("be.visible");
  });

  it("should have the stats results table", () => {
    cy.get(".stat-atk").should("contain.text", "Attack");
    cy.get(".stat-hp").should("contain.text", "HP");
    cy.get(".stat-def").should("contain.text", "Defense");
    cy.get(".stat-cr").should("contain.text", "Crit Rate");
    cy.get(".stat-cd").should("contain.text", "Crit DMG");
    cy.get(".stat-er").should("contain.text", "Energy Regen");
    cy.get(".stat-basic").should("contain.text", "Basic Attack DMG Bonus");
    cy.get(".stat-heavy").should("contain.text", "Heavy Attack DMG Bonus");
    cy.get(".stat-skill").should("contain.text", "Resonance Skill DMG Bonus");
    cy.get(".stat-liberation").should(
      "contain.text",
      "Resonance Liberation DMG Bonus",
    );
    cy.get(".stat-glacio").should("contain.text", "Glacio DMG Bonus");
    cy.get(".stat-fusion").should("contain.text", "Fusion DMG Bonus");
    cy.get(".stat-electro").should("contain.text", "Electro DMG Bonus");
    cy.get(".stat-aero").should("contain.text", "Aero DMG Bonus");
    cy.get(".stat-spectro").should("contain.text", "Spectro DMG Bonus");
    cy.get(".stat-havoc").should("contain.text", "Havoc DMG Bonus");
    cy.get(".stat-healing").should("contain.text", "Healing Bonus");
  });

  it("should have the main titles of all attack groups for the character", () => {
    cy.get(".damage__title")
      .should("contain.text", "Basic Attacks: Gnawing Fangs")
      .and("contain.text", "Resonance Skill: Extermination Order")
      .and("contain.text", "Resonance Liberation: Phantom Etching")
      .and("contain.text", "Forte Circuit: Hunting Mission")
      .and("contain.text", "Intro Skill: Wanted Outlaw")
      .and("contain.text", "Outro Skill: Shadowy Raid")
      .and("contain.text", "Echo Attacks");
  });

  it("should enable a user to change character, and also update all of the damages and stats after the change", () => {
    cy.get(".character__selection__form--character select").select("Changli");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
    cy.get(".character__selection.Changli").should("be.visible");
    cy.get("select[name=characterLevel]").select("80");
    cy.get(".character__buffs").should("be.visible");
    cy.get(".data-input--talents").should("be.visible");
    // Changli stats calculations
    testStats(changliLevel80Stats, cy);
    // Damages validations
    testAttacks(changliLevel80, cy);
  });

  it("should calculate and display the correct damage output and stats", () => {
    // Stats calculations
    testStats(calcharoLevel90BaseStats, cy);
    // Damages validations
    testAttacks(calcharoLevel90, cy);
  });

  it("should enable character buffs and it affects the stats and damages", () => {
    cy.get(".character__self-buffs .character__buffs .card").each(($card) => {
      cy.wrap($card).find("input[type=checkbox]").click();
    });
    // Stats calculations
    testStats(calcharoLevel90AllSelfBonusesStats, cy);
    // Damages validations
    testAttacks(calcharoLevel90AllSelfBonuses, cy);
  });

  it("should display correctly on various screen sizes", () => {
    const sizes = ["iphone-6", "ipad-2", [1024, 768]];
    sizes.forEach((size) => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
      } else {
        cy.viewport(size);
      }
      cy.get(".navbar").should("be.visible");
      cy.get(".calculator__content").should("be.visible");
    });
  });
});
