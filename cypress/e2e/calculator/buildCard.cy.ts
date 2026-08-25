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

  it("shows a real equipped echo's set icon, CV, and Substat Score", () => {
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
      // The RV badge is hidden (redundant with the Substat Score); the
      // per-character Substat Score badge (e.g. "SS 78%") is what shows now.
      cy.contains(/^[A-Z]{1,3} \d+%\*?$/).should("exist");
      cy.get("img.FrostyResolve").should("exist");
    });
  });

  it("keeps a long character name on a single line", () => {
    // Regression test: the identity panel's name wrapper used to cap out at
    // max-w-[65%], which could wrap a long name like "Yangyang: Xuanling"
    // onto a second line even though the panel had room to spare.
    cy.richSelect("[data-test-character-select]", "YangyangXuanling", {
      search: "Xuanling",
    });
    cy.get(".character__self-buffs").should("be.visible");

    cy.get('[data-test-calculator-nav="buildCard"]').click();
    cy.get("[data-test-build-card-name]")
      .should("contain.text", "Yangyang: Xuanling")
      .should(($el) => {
        // clientHeight (not getBoundingClientRect) because the card is
        // rendered at a fixed 1920x1080 layout size and visually scaled
        // down via CSS transform to fit the preview pane — the bounding
        // rect reflects that visual shrink, but clientHeight reflects the
        // untransformed layout box, matching what gets exported.
        const el = $el[0];
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        expect(el.clientHeight).to.be.closeTo(lineHeight, 2);
      });
  });

  it("does not truncate a long substat label", () => {
    // Regression test: "Resonance Liberation DMG Bonus" is the longest
    // substat label in the game and used to overflow its row by ~1px,
    // triggering a truncate ellipsis that's barely visible live but got
    // hard-clipped (no "...") once exported to an image.
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
          ResonanceLiberationDMGBonus: 11.6,
        },
      },
      cy,
    );

    cy.get('[data-test-calculator-nav="buildCard"]').click();
    cy.contains(
      "[data-test-build-card-echo-substats] span",
      "Resonance Liberation DMG Bonus",
    ).should(($el) => {
      const el = $el[0];
      expect(el.scrollWidth).to.be.at.most(el.clientWidth);
    });
  });

  it("does not truncate any substat label across a full 5-echo build", () => {
    // Regression test: the single-echo case above passed even while a real
    // build (weapon equipped + all 5 echo slots filled) still truncated
    // labels in production — the extra DOM/image weight of a full build
    // apparently mattered in ways a single populated slot didn't exercise.
    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.richSelect("[data-test-weapon-select]", "TheLastDance");

    cy.get('[data-test-calculator-nav="echoes"]').click();
    const subStats = {
      CritRate: 6.3,
      CritDMG: 16.2,
      ATK: 9.4,
      ATK_FLAT: 50,
      ResonanceLiberationDMGBonus: 8.6,
    };
    configureEcho(
      0,
      { mainEcho: "SentryConstruct", mainStat: "CritRate", set: "FrostyResolve", subStats },
      cy,
    );
    configureEcho(
      1,
      { mainEcho: "AbyssalMercator", mainStat: "Glacio", set: "FrostyResolve", subStats },
      cy,
    );
    configureEcho(
      2,
      { mainEcho: "CuddleWuddle", mainStat: "Glacio", set: "FrostyResolve", subStats },
      cy,
    );
    configureEcho(
      3,
      { mainEcho: "ChestMimic", mainStat: "ATK", set: "FrostyResolve", subStats },
      cy,
    );
    configureEcho(
      4,
      { mainEcho: "LottieLost", mainStat: "ATK", set: "FrostyResolve", subStats },
      cy,
    );

    cy.get('[data-test-calculator-nav="buildCard"]').click();
    cy.get("[data-test-build-card-echoes] .echo__item").should(
      "have.length",
      5,
    );
    cy.get("[data-test-build-card-echo-substats] span.truncate").should(
      ($labels) => {
        $labels.each((_, el) => {
          expect(
            el.scrollWidth,
            `"${el.textContent}" should not overflow its row`,
          ).to.be.at.most(el.clientWidth);
        });
      },
    );
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

    cy.get("[data-test-filter-panel-toggle]").click();
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
