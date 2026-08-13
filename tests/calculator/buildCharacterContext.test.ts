import { describe, it, expect } from "vitest";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import { getCombinedEchoStats } from "../../src/echoes/stats";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";

const enemyConfig: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

describe("buildCharacterCalculationContext", () => {
  it("resolves base stats and empty equipment for an unconfigured character", async () => {
    const characters = { Calcharo: {} };
    const result = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);

    expect(result.baseHp).toBe(10500);
    expect(result.baseAtk).toBe(437);
    expect(result.baseDef).toBe(1185);
    expect(result.weaponData).toEqual({
      attack: 0,
      modifier: null,
      modifierValue: 0,
      weaponPassiveStats: {},
    });
    expect(result.echoStats).toEqual({});
    expect(result.finalStats.totalAtk).toBeCloseTo(437);
    expect(result.finalStats.totalHp).toBeCloseTo(10500);
    expect(result.finalStats.totalDef).toBeCloseTo(1185);
  });

  it("combines base echo stats identically to getCombinedEchoStats when no set bonuses/main echo are configured", async () => {
    const echoes = [
      { type: "4", rank: "5", stat: "CritRate", echoSubStatsType1: "ATK", echoSubStatsValue1: 30 },
    ];
    const characters = { Calcharo: { echoes } };
    const result = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
    const expectedBase = getCombinedEchoStats(echoes as any);

    expect(result.echoStats).toEqual(expectedBase);
  });

  it("builds a ready-to-use CalculationContext scoped to the requested character", async () => {
    const characters = { Calcharo: {} };
    const result = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);

    expect(result.context.character.characterKey).toBe("Calcharo");
    expect(result.context.character.chosenChar).toBeTruthy();
    expect(result.context.enemy.enemyLevel).toBe(90);
    expect(result.context.enemy.enemyResist).toBeCloseTo(0.1);
    expect(result.context.rotationsList).toEqual([]);
  });

  it("resolves echo stats from the inventory store when character.echoes only holds an echoId pointer", async () => {
    // Mirrors the real persisted shape once an echo is equipped from the
    // Inventory page: characters[id].echoes is an object keyed by slot
    // index (not an array), and each slot's own type/rank/stat/substat
    // fields are null placeholders — the real data lives in the inventory
    // store's echoes list, joined by echoId.
    const characters = {
      Hiyuki: {
        echoes: {
          0: {
            echo: null,
            type: null,
            rank: null,
            stat: null,
            echoId: "inv-echo-1",
            echoSubStatsType1: null,
            echoSubStatsValue1: null,
          },
        },
      },
    };
    const inventoryEchoes = [
      {
        echoId: "inv-echo-1",
        echo: "ReminiscenceThrenodianVoidborneConstruct",
        type: 4,
        rank: 5,
        stat: "CritDMG",
        echoSubStatsType1: "CritRate",
        echoSubStatsValue1: 6.9,
        echoSubStatsType2: "ATK_FLAT",
        echoSubStatsValue2: 50,
      },
    ];

    const withInventory = await buildCharacterCalculationContext(
      "Hiyuki",
      characters,
      enemyConfig,
      inventoryEchoes,
    );
    const withoutInventory = await buildCharacterCalculationContext(
      "Hiyuki",
      characters,
      enemyConfig,
      [],
    );

    // Without the inventory join, the slot resolves to all-null fields and
    // contributes nothing (the bug) — with it, the real echo's main stat +
    // substats come through.
    expect(withoutInventory.echoStats).toEqual({});
    expect(withInventory.echoStats.CritRate).toBeCloseTo(6.9);
    // 150 guaranteed flat ATK bonus for a rank-5 cost-4 echo + the 50 substat
    expect(withInventory.echoStats.ATK_FLAT).toBeCloseTo(200);
    expect(withInventory.finalStats.totalAtk).toBeGreaterThan(withoutInventory.finalStats.totalAtk);
  });

  it("defaults a missing echo rank to 5 (max), matching CalculatorEcho.vue's live behavior", async () => {
    // Echoes pasted/OCR'd directly onto the character record (rather than
    // equipped via the Inventory page) carry full embedded stats but often
    // have no explicit `rank` field at all. The live Calculator page
    // defaults a missing rank to 5 when computing an echo's main stat and
    // guaranteed flat bonus (CalculatorEcho.vue's `rank` computed getter);
    // this must match exactly, or a real echo's biggest stat contributions
    // silently disappear.
    const echoes = {
      0: {
        type: 3,
        echo: "Glommoth",
        stat: "Glacio",
        echoSubStatsType1: "ATK",
        echoSubStatsValue1: 8.6,
      },
    };
    const characters = { Calcharo: { echoes } };

    const result = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
    const expected = getCombinedEchoStats({ 0: { ...echoes[0], rank: 5 } } as any);

    expect(result.echoStats).toEqual(expected);
    // Sanity check the main stat itself came through, not just the substat.
    expect(result.echoStats.Glacio).toBeGreaterThan(0);
  });

  it("resolves weapon attack and an alwaysEnabled passive even with no stored passive config", async () => {
    const characters = {
      Calcharo: {
        weapon: "TrainingBroadblade",
        weapons: { TrainingBroadblade: { weaponLevel: "70", refinement: "1" } },
      },
    };
    const result = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);

    expect(result.weaponData.attack).toBeGreaterThan(0);
    // TrainingBroadblade's "Persevere" passive is alwaysEnabled and grants +4%
    // ATK at refinement 1, with no stored weaponPassives config needed.
    expect(result.weaponData.weaponPassiveStats.ATK).toBeCloseTo(0.04);
  });

  it("attaches a display name to weapon-passive and echo-set-passive definitions, which don't carry their own", async () => {
    // passiveData/set-passive entries only have a `details` description, not
    // a `name` — Team Rotations' advanced buff editor needs a title to show
    // alongside it, so buildCharacterCalculationContext attaches the
    // weapon's/set's own name to each entry.
    const characters = {
      Calcharo: {
        weapon: "TrainingBroadblade",
        weapons: { TrainingBroadblade: { weaponLevel: "70", refinement: "1" } },
        echoSetBonus: { setBonusOne: "Freezing Frost 2 Set" },
      },
    };
    const result = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);

    expect(result.definitions.weaponPassives.length).toBeGreaterThan(0);
    for (const def of result.definitions.weaponPassives) {
      expect(def.name).toBeTruthy();
    }

    expect(result.definitions.echoSetPassivesOne.length).toBeGreaterThan(0);
    for (const def of result.definitions.echoSetPassivesOne) {
      expect(def.name).toBe("Freezing Frost");
    }
  });

  describe("alwaysEnabledOnly (build card — issue #383)", () => {
    it("keeps an alwaysEnabled weapon passive but drops a conditional one, even when the conditional one is toggled on", async () => {
      const characters = {
        Iuno: {
          weapon: "PulsationBracer",
          weapons: { PulsationBracer: { weaponLevel: "90", refinement: "1" } },
          // Barrier Breacher: alwaysEnabled 12% ATK + conditional stacked
          // Basic Attack DMG Bonus — toggle the conditional one on so the
          // filtered view dropping it isn't just a case of it already
          // being off by default.
          weaponPassives: { PulsationBracerBasic: { isEnabled: true, stacks: 4 } },
        },
      };
      const full = await buildCharacterCalculationContext("Iuno", characters, enemyConfig);
      const filtered = await buildCharacterCalculationContext("Iuno", characters, enemyConfig, [], {
        alwaysEnabledOnly: true,
      });

      expect(full.weaponData.weaponPassiveStats.ATK).toBeCloseTo(0.12);
      expect(full.weaponData.weaponPassiveStats.BasicAttackDMGBonus).toBeCloseTo(0.24);
      expect(filtered.weaponData.weaponPassiveStats.ATK).toBeCloseTo(0.12);
      expect(filtered.weaponData.weaponPassiveStats.BasicAttackDMGBonus ?? 0).toBeCloseTo(0);
    });

    it("drops character self-buffs, resonance chains, and custom buffs entirely, even when toggled on", async () => {
      const characters = {
        Calcharo: {
          resonanceChains: { chain1: { isEnabled: true } },
          customBuffs: { ATK_FLAT: 500 },
        },
      };
      const full = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
      const filtered = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig, [], {
        alwaysEnabledOnly: true,
      });

      expect(full.finalStats.totalAtk).toBeGreaterThan(filtered.finalStats.totalAtk);
      expect(filtered.finalStats.totalAtk).toBeCloseTo(filtered.baseAtk);
    });

    it("keeps an alwaysEnabled echo set bonus", async () => {
      const characters = { Calcharo: { echoSetBonus: { setBonusOne: "Freezing Frost 2 Set" } } };
      const filtered = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig, [], {
        alwaysEnabledOnly: true,
      });

      expect(filtered.echoStats.Glacio).toBeCloseTo(10);
    });

    it("drops a conditional echo set bonus, even when the user has it toggled on", async () => {
      const characters = {
        Calcharo: {
          echoSetBonus: { setBonusOnePiece: "Shadow of Shattered Dreams 1 Set" },
          echoSetPassives: { ShadowofShatteredDreams1Set: { isEnabled: true } },
        },
      };
      const full = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
      const filtered = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig, [], {
        alwaysEnabledOnly: true,
      });

      expect(full.echoStats.BasicAttackDMGBonus).toBeCloseTo(35);
      expect(filtered.echoStats).toEqual({});
    });

    it("keeps an alwaysEnabled main-echo buff even when the user has it toggled off", async () => {
      // Abyssal Patricius's "12% Glacio DMG Bonus while equipped in the main
      // slot" is unconditional (see src/echoes/index.ts), so it should show
      // up on the build card regardless of the stored toggle state.
      const characters = { Calcharo: { mainEcho: { echo: "AbyssalPatricius", isEnabled: false } } };
      const filtered = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig, [], {
        alwaysEnabledOnly: true,
      });

      expect(filtered.echoStats.Glacio).toBeCloseTo(12);
    });

    it("drops a conditional main-echo buff, even when the user has it toggled on", async () => {
      // Bell-Borne Geochelone's DMG Bonus is a triggered/combat effect, not
      // an unconditional main-slot bonus, so it has no alwaysEnabled flag.
      const characters = { Calcharo: { mainEcho: { echo: "BellBorneGeochelone", isEnabled: true } } };
      const full = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
      const filtered = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig, [], {
        alwaysEnabledOnly: true,
      });

      expect(full.echoStats.DMGBonus).toBeCloseTo(10);
      expect(filtered.echoStats.DMGBonus).toBeUndefined();
    });

    it("includes a toggled-on Stat Bonus self-buff (a permanent unlock), but drops other toggled-on self-buffs", async () => {
      const characters = {
        Calcharo: {
          buffs: {
            StatBonusATK1: { isEnabled: true },
            // Any real non-StatBonus self-buff key works here — the point is
            // it must stay excluded even when the user has it toggled on.
            SomeCombatConditionalBuff: { isEnabled: true },
          },
        },
      };
      const full = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
      const filtered = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig, [], {
        alwaysEnabledOnly: true,
      });

      expect(full.finalStats.totalAtk).toBeCloseTo(filtered.finalStats.totalAtk);
      expect(filtered.finalStats.totalAtk).toBeGreaterThan(filtered.baseAtk);
    });
  });
});
