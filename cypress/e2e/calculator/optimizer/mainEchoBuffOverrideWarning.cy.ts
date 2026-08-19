// The Optimizer's Rotation target can't honor a per-action main-echo-buff
// advancedConfig override (see optimizer.ts's computeOverrideBuffVariants) —
// unlike every other override category, which it fully supports. This
// verifies that gap is surfaced to the user via a visible warning rather than
// silently producing a number that doesn't reflect the override.
describe("Optimizer: main-echo-buff override warning", () => {
  it("shows the warning when the selected rotation has an action overriding the main echo buff", () => {
    const config = {
      meta: { version: "3", source: "WutheringTools" },
      data: {
        character: JSON.stringify({
          characters: {
            Calcharo: {
              echoes: [{}, {}, {}, {}, {}],
              mainEcho: { echo: null, rank: 5 },
              rotations: [
                {
                  id: "r1",
                  name: "Test Rotation",
                  description: "",
                  duration: null,
                  actions: [
                    {
                      id: "a1",
                      order: 1,
                      type: "basic",
                      key: "Part1Damage",
                      count: 1,
                      isDisabled: false,
                      advancedConfig: { mainEchoBuff: { isEnabled: true } },
                    },
                  ],
                },
              ],
            },
          },
          activeCharacter: "Calcharo",
        }),
        inventory: JSON.stringify({ echoes: [], equipped: {} }),
      },
    };

    cy.visit("/");
    cy.importCharacterData(config);
    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__selection.Calcharo").should("exist");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get(".screen--optimizer").should("be.visible");
    cy.contains("Choose your optimization target")
      .parent()
      .find("input, [role='combobox'], .app-rich-select")
      .first()
      .click({ force: true });
    cy.contains("Test Rotation").click({ force: true });
    cy.get("[data-test-optimizer-main-echo-buff-override-warning]").should(
      "contain.text",
      "override the main echo buff",
    );
  });

  // The buff panel snapshots a character's entire current buff state
  // (main echo included) onto an action the moment any single buff is first
  // toggled, so advancedConfig.mainEchoBuff is present on nearly every
  // customized action even when its value matches the character's own
  // current default — this shouldn't count as a real override (issue #401
  // follow-up).
  it("doesn't show the warning when the action's mainEchoBuff override matches the character's own current setting", () => {
    const config = {
      meta: { version: "3", source: "WutheringTools" },
      data: {
        character: JSON.stringify({
          characters: {
            Calcharo: {
              echoes: [{}, {}, {}, {}, {}],
              mainEcho: { echo: "Jué", rank: 5, isEnabled: true },
              rotations: [
                {
                  id: "r1",
                  name: "Test Rotation",
                  description: "",
                  duration: null,
                  actions: [
                    {
                      id: "a1",
                      order: 1,
                      type: "basic",
                      key: "Part1Damage",
                      count: 1,
                      isDisabled: false,
                      advancedConfig: {
                        buffs: { StatBonusATK1: { isEnabled: false } },
                        mainEchoBuff: { isEnabled: true },
                      },
                    },
                  ],
                },
              ],
            },
          },
          activeCharacter: "Calcharo",
        }),
        inventory: JSON.stringify({ echoes: [], equipped: {} }),
      },
    };

    cy.visit("/");
    cy.importCharacterData(config);
    cy.get("[data-test-nav-calculator]").click();
    cy.get(".character__selection.Calcharo").should("exist");
    cy.get('[data-test-calculator-nav="optimizer"]').click();
    cy.get(".screen--optimizer").should("be.visible");
    cy.contains("Choose your optimization target")
      .parent()
      .find("input, [role='combobox'], .app-rich-select")
      .first()
      .click({ force: true });
    cy.contains("Test Rotation").click({ force: true });
    cy.get("[data-test-optimizer-main-echo-buff-override-warning]").should("not.exist");
  });
});
