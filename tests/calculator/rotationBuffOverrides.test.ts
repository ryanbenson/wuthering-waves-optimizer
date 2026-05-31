import { describe, it, expect } from "vitest";
import {
  computeRotationActionBuildContext,
  createGetEchoByIdFromInventory,
} from "../../src/calculator/rotationBuffOverrides";
import { config } from "../../cypress/e2e/calculator/data/Chisa/data";

describe("rotation buff overrides with cached build stats", () => {
  const parsed =
    typeof config.data.character === "string"
      ? JSON.parse(config.data.character)
      : config.data.character;
  const inventory =
    typeof config.data.inventory === "string"
      ? JSON.parse(config.data.inventory)
      : config.data.inventory;
  const getEchoById = createGetEchoByIdFromInventory(inventory.echoes ?? []);

  const chisaBase = parsed.characters.Chisa;

  it("applies disabled weapon passive overrides despite cached weapon stats", async () => {
    const chisa = {
      ...chisaBase,
      cachedWeaponStats: {
        attack: 500,
        modifier: "CritRate",
        modifierValue: 0.36,
        weaponPassiveStats: {
          ATK: 0.24,
          AllElementAttributeBonus: 0.48,
        },
      },
      cachedEchoStats: {
        ATK: 71.8,
        ATK_FLAT: 500,
        Havoc: 10,
      },
    };

    const activeBaseline = {
      characterKey: "Chisa",
      baseHp: 12000,
      baseAtk: 337,
      baseDef: 1100,
      echoStats: { ...chisa.cachedEchoStats },
      weaponAtk: 500,
      weaponModifier: "CritRate",
      weaponModifierValue: 0.36,
      buffsCharInfo: [],
      resonanceChainsCharInfo: [],
    };

    const withPassives = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      {},
      {},
      {
        weaponPassives: {
          ThreadofFateATK: { isEnabled: false },
        },
      },
      undefined,
      activeBaseline,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );
    const withoutOverrides = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      {},
      {},
      null,
      undefined,
      activeBaseline,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );

    expect(
      withoutOverrides.performerWeaponPassiveStats?.ATK,
    ).toBeGreaterThan(0);
    expect(withPassives.performerWeaponPassiveStats?.ATK ?? 0).toBe(0);
    expect(withPassives.performerStats.totalAtk).toBeLessThan(
      withoutOverrides.performerStats.totalAtk as number,
    );
  });

  it("applies disabled echo set passive overrides despite cached echo stats", async () => {
    const chisa = {
      ...chisaBase,
      cachedEchoStats: {
        ATK: 91.8,
        ATK_FLAT: 500,
        Havoc: 30,
        ResonanceLiberationDMGBonus: 30,
      },
    };

    const withPassives = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      {},
      {},
      {
        echoSetPassives: {
          ThreadofSeveredFateATKLiberation: { isEnabled: false },
        },
      },
      undefined,
      undefined,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );
    const withoutOverrides = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      {},
      {},
      null,
      undefined,
      undefined,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );

    expect(withPassives.performerEchoStats?.ATK).toBeLessThan(
      withoutOverrides.performerEchoStats?.ATK as number,
    );
    expect(withPassives.performerStats.totalAtk).toBeLessThan(
      withoutOverrides.performerStats.totalAtk as number,
    );
  });

  it("applies disabled main echo override despite cached echo stats", async () => {
    const chisa = {
      ...chisaBase,
      cachedEchoStats: {
        ATK: 71.8,
        ATK_FLAT: 500,
        CritRate: 50,
      },
    };

    const disabledMainEcho = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      {},
      {},
      { mainEcho: { isEnabled: false } },
      undefined,
      undefined,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );
    const enabledMainEcho = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      {},
      {},
      { mainEcho: { isEnabled: true } },
      undefined,
      undefined,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );

    expect(disabledMainEcho.performerEchoStats?.Havoc ?? 0).toBeLessThan(
      enabledMainEcho.performerEchoStats?.Havoc as number,
    );
    expect(
      disabledMainEcho.performerStats.resonanceLiberationDMGBonus,
    ).toBeLessThan(
      enabledMainEcho.performerStats.resonanceLiberationDMGBonus as number,
    );
  });

  it("preserves ATK when disabling a non-ATK weapon passive on active baseline", async () => {
    const chisa = {
      ...chisaBase,
      cachedWeaponStats: {
        attack: 500,
        modifier: "CritRate",
        modifierValue: 0.36,
        weaponPassiveStats: {
          ATK: 0.24,
          AllElementAttributeBonus: 0.48,
        },
      },
      cachedEchoStats: {
        ATK: 71.8,
        ATK_FLAT: 500,
        Havoc: 10,
      },
    };

    const activeBaseline = {
      characterKey: "Chisa",
      baseHp: 12000,
      baseAtk: 337,
      baseDef: 1100,
      echoStats: { ...chisa.cachedEchoStats },
      weaponAtk: 500,
      weaponModifier: "CritRate",
      weaponModifierValue: 0.36,
      buffsCharInfo: [],
      resonanceChainsCharInfo: [],
    };

    const liveTeamBuffs = { ATK: 0.15 };

    const withoutOverrides = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      liveTeamBuffs,
      {},
      null,
      undefined,
      activeBaseline,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );
    const disabledAllAttribute = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      liveTeamBuffs,
      {},
      {
        weaponPassives: {
          ThreadofFateAllAttribute: { isEnabled: false },
        },
      },
      undefined,
      activeBaseline,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );
    const reenabledAllAttribute = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      liveTeamBuffs,
      {},
      {
        weaponPassives: {
          ThreadofFateAllAttribute: { isEnabled: true },
        },
      },
      undefined,
      activeBaseline,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );

    expect(withoutOverrides.performerStats.totalAtk).toBe(
      disabledAllAttribute.performerStats.totalAtk,
    );
    expect(reenabledAllAttribute.performerStats.totalAtk).toBe(
      withoutOverrides.performerStats.totalAtk,
    );
    expect(
      disabledAllAttribute.performerWeaponPassiveStats
        ?.AllElementAttributeBonus ?? 0,
    ).toBe(0);
    expect(
      reenabledAllAttribute.performerWeaponPassiveStats
        ?.AllElementAttributeBonus ?? 0,
    ).toBeGreaterThan(0);
  });
});
