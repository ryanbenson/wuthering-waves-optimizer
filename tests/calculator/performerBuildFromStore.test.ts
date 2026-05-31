import { describe, it, expect } from "vitest";
import { computeCharacterBuildFromStore } from "../../src/calculator/computeCharacterBuildFromStore";
import { config } from "../../cypress/e2e/calculator/data/Chisa/data";

function loadChisaFixture() {
  const parsed =
    typeof config.data.character === "string"
      ? JSON.parse(config.data.character)
      : config.data.character;
  const chisa = parsed.characters.Chisa as Record<string, unknown>;
  const inventory =
    typeof config.data.inventory === "string"
      ? JSON.parse(config.data.inventory)
      : config.data.inventory;
  const getEchoById = (id: string) =>
    inventory.echoes.find(
      (echo: { echoId?: string }) => echo.echoId === id,
    );
  return { chisa, getEchoById };
}

describe("computeCharacterBuildFromStore", () => {
  it("processes custom buff store percents like the UI", async () => {
    const { chisa, getEchoById } = loadChisaFixture();
    const chisaNoCustom = { ...chisa, customBuffs: {} };

    const withoutCustom = await computeCharacterBuildFromStore(
      "Chisa",
      chisaNoCustom,
      { Chisa: chisaNoCustom },
      getEchoById,
    );
    const withRawCustom = await computeCharacterBuildFromStore(
      "Chisa",
      chisa,
      { Chisa: chisa },
      getEchoById,
    );

    expect(withRawCustom.calculated.finalStats.totalAtk).toBeGreaterThan(
      withoutCustom.calculated.finalStats.totalAtk,
    );
    expect(withRawCustom.calculated.finalStats.totalAtk).toBeLessThan(
      withoutCustom.calculated.finalStats.totalAtk * 1.05,
    );
  });

  it("uses active character party tab config for teammate team buffs", async () => {
    const { chisa, getEchoById } = loadChisaFixture();
    const chisaWithoutPartyBuffs = {
      ...chisa,
      teamBuffs: {
        selectedCharacter1: null,
        selectedCharacter2: null,
        buffs: {},
      },
    };
    const deniaPartyConfig = JSON.parse(JSON.stringify(chisa.teamBuffs));

    const buildFromChisaParty = await computeCharacterBuildFromStore(
      "Chisa",
      chisaWithoutPartyBuffs,
      {
        Chisa: chisaWithoutPartyBuffs,
        Denia: { teamBuffs: deniaPartyConfig },
      },
      getEchoById,
    );
    const buildFromDeniaParty = await computeCharacterBuildFromStore(
      "Chisa",
      chisaWithoutPartyBuffs,
      {
        Chisa: chisaWithoutPartyBuffs,
        Denia: { teamBuffs: deniaPartyConfig },
      },
      getEchoById,
      { partyConfigCharacterKey: "Denia" },
    );

    expect(buildFromDeniaParty.calculated.finalStats.totalAtk).toBeGreaterThan(
      buildFromChisaParty.calculated.finalStats.totalAtk,
    );
  });

  it("loses most echo ATK% without inventory echo lookup", async () => {
    const { chisa, getEchoById } = loadChisaFixture();

    const withInventory = await computeCharacterBuildFromStore(
      "Chisa",
      chisa,
      { Chisa: chisa },
      getEchoById,
    );
    const withoutInventory = await computeCharacterBuildFromStore(
      "Chisa",
      chisa,
      { Chisa: chisa },
    );

    expect(withInventory.echoStats.ATK).toBeGreaterThan(
      withoutInventory.echoStats.ATK ?? 0,
    );
    expect(withInventory.calculated.finalStats.totalAtk).toBeGreaterThan(
      withoutInventory.calculated.finalStats.totalAtk,
    );
  });
});
