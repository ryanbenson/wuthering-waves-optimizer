import { describe, it, expect } from "vitest";
import {
  computeRotationActionBuildContext,
  createGetEchoByIdFromInventory,
} from "../../src/calculator/rotationBuffOverrides";
import { config } from "../../cypress/e2e/calculator/data/Chisa/data";

describe("rotation action build (always fresh from store)", () => {
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

  it("applies disabled weapon passive overrides", async () => {
    const chisa = { ...chisaBase };
    const withOverride = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      {},
      {},
      {
        weaponPassives: {
          ThreadofFateAllAttribute: { isEnabled: false },
        },
      },
      undefined,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );
    const withoutOverride = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      {},
      {},
      null,
      undefined,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );

    expect(
      withoutOverride.performerWeaponPassiveStats?.AllElementAttributeBonus,
    ).toBeGreaterThan(0);
    expect(
      withOverride.performerWeaponPassiveStats?.AllElementAttributeBonus ?? 0,
    ).toBe(0);
    expect(withOverride.performerStats.totalAtk).toBe(
      withoutOverride.performerStats.totalAtk,
    );
  });

  it("applies disabled echo set passive overrides", async () => {
    const chisa = { ...chisaBase };

    const withOverride = await computeRotationActionBuildContext(
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
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );
    const withoutOverride = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      {},
      {},
      null,
      undefined,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );

    expect(withOverride.performerEchoStats?.ATK).toBeLessThan(
      withoutOverride.performerEchoStats?.ATK as number,
    );
  });

  it("applies disabled main echo override", async () => {
    const chisa = { ...chisaBase };

    const disabledMainEcho = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      {},
      {},
      { mainEcho: { isEnabled: false } },
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
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );

    expect(disabledMainEcho.performerEchoStats?.Havoc ?? 0).toBeLessThan(
      enabledMainEcho.performerEchoStats?.Havoc as number,
    );
  });

  it("preserves ATK when toggling a non-ATK weapon passive with live team buffs", async () => {
    const chisa = { ...chisaBase };
    const liveTeamBuffs = { ATK: 0.15 };

    const baseline = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      liveTeamBuffs,
      {},
      null,
      undefined,
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
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );

    expect(baseline.performerStats.totalAtk).toBe(
      disabledAllAttribute.performerStats.totalAtk,
    );
    expect(reenabledAllAttribute.performerStats.totalAtk).toBe(
      baseline.performerStats.totalAtk,
    );
  });

  it("applies enabled self buffs from character store", async () => {
    const chisa = {
      ...chisaBase,
      buffs: {
        StatBonusATK1: { isEnabled: true },
      },
    };

    const ctx = await computeRotationActionBuildContext(
      "Chisa",
      chisa,
      {},
      {},
      null,
      undefined,
      { Chisa: chisa },
      "Chisa",
      getEchoById,
    );

    expect(ctx.performerBuildDebug?.selfBuffATK ?? 0).toBeCloseTo(1.8, 1);
  });
});
