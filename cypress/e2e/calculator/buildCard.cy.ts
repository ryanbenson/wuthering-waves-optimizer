import { configureEcho } from "./utils/echoesUtils";

describe("Calculator Build Card", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
  });

  it("does not mount the build card until its tab is first visited", () => {
    // Every other screen is always mounted (v-show only), which let its echo
    // cards collide with `.echo__item` element counts on other screens. The
    // build card mounts lazily on first visit instead.
    cy.get("[data-test-build-card]").should("not.exist");

    cy.get('[data-test-calculator-nav="echoes"]').click();
    cy.get(".echo__item").should("have.length", 5);

    cy.get('[data-test-calculator-nav="buildCard"]').click();
    cy.get("[data-test-build-card]").should("be.visible");
  });

  it("shows a full-width card with no side stats panel", () => {
    cy.get('[data-test-calculator-nav="buildCard"]').click();

    cy.get("[data-test-build-card]").should("be.visible");
    cy.get(".results").should("not.be.visible");
    cy.get("[data-test-build-card-resonance]").should("be.visible");
    cy.get("[data-test-build-card-echoes] .echo__item").should(
      "have.length",
      5,
    );
  });

  it("shows a real equipped echo's set icon and CV/RV score", () => {
    cy.get('[data-test-calculator-nav="echoes"]').click();
    configureEcho(
      1,
      {
        mainEcho: "AbyssalMercator",
        mainStat: "Glacio",
        set: "FrostyResolve",
        subStats: {
          CritRate: 7.5,
          CritDMG: 16.2,
          ATK: 9.4,
          ATK_FLAT: 50,
          ResonanceSkillDMGBonus: 10.9,
        },
      },
      cy,
    );

    cy.get('[data-test-calculator-nav="buildCard"]').click();

    cy.get("[data-test-build-card-echoes]").within(() => {
      cy.contains("CV").should("exist");
      cy.contains("RV").should("exist");
      cy.get("img.FrostyResolve").should("exist");
    });
  });

  it("uploads a custom portrait and lets it be reset", () => {
    cy.get('[data-test-calculator-nav="buildCard"]').click();

    const fileName = "portrait.png";
    // 1x1 transparent PNG, inlined so this spec doesn't depend on a fixture file.
    const pngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

    cy.get("[data-test-build-card-portrait-input]").selectFile(
      {
        contents: Cypress.Buffer.from(pngBase64, "base64"),
        fileName,
        mimeType: "image/png",
      },
      { force: true },
    );

    cy.get("[data-test-build-card-portrait-image]")
      .should("have.css", "background-image")
      .and("match", /^url\("data:image\/jpeg;base64,/);

    cy.get("[data-test-build-card-portrait-reset]").click();
    cy.get("[data-test-build-card-portrait-image]")
      .should("have.css", "background-image")
      .and("not.match", /^url\("data:image/);
  });

  it("lets a background's style/scale/position be adjusted and reset", () => {
    cy.get('[data-test-calculator-nav="buildCard"]').click();

    const fileName = "background.png";
    // 1x1 transparent PNG, inlined so this spec doesn't depend on a fixture file.
    const pngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

    cy.get("[data-test-build-card-background-input]").selectFile(
      {
        contents: Cypress.Buffer.from(pngBase64, "base64"),
        fileName,
        mimeType: "image/png",
      },
      { force: true },
    );

    cy.get('[data-test-image-adjust-trigger="background"]').click();
    cy.get('[data-test-image-adjust-fit="background"]').select("repeat");
    cy.get('[data-test-image-adjust-scale="background"]')
      .invoke("val", 150)
      .trigger("input");

    cy.get(".build-card__background-layer")
      .should("have.css", "background-repeat", "repeat")
      .and("have.css", "transform")
      .and("match", /1\.5/);

    cy.get('[data-test-image-adjust-reset="background"]').click();
    cy.get(".build-card__background-layer").should(
      "have.css",
      "background-repeat",
      "no-repeat",
    );
  });

  it("downloads the build card as a PNG", () => {
    cy.get('[data-test-calculator-nav="buildCard"]').click();
    cy.get("[data-test-build-card-download]").click();
    cy.readFile(`${Cypress.config("downloadsFolder")}/Carlotta-build-card.png`, {
      timeout: 10000,
    }).should("exist");
  });
});
