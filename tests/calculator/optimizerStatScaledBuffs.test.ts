import { describe, it, expect } from "vitest";
import {
  buildTeamOptimizerSlotPlan,
  verifyTeamCombination,
  applyLoadoutToCharacterData,
} from "../../src/calculator/teamOptimizer";
import {
  computeLoadoutFinalStats,
  computeOverrideBuffVariants,
  normalizeOptimizerLoadout,
  optimize,
  scoreOptimizerRotation,
} from "../../src/calculator/optimizer";
import { computeResonanceChainsBuffs, computeSelfBuffs } from "../../src/calculator/stats";
import { buildCharacterCalculationContext, type TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";
import { getCharByName } from "../../src/characters/characters";

// A loadout's damage must not depend on what the character is wearing when the
// search runs. Buffs that scale off a stat used to be read from the worn build,
// so a Mornye with no echoes scored every loadout as if at her base Energy Regen,
// and re-running after equipping gave the same loadout a different score.

const enemyConfig: TeamEnemyConfig = { enemyLevel: 90, enemyResist: 0.1, enemyType: "Calamity" };
const MAIN_ECHO = "FallacyOfNoReturn";
const SET = "RejuvenatingGlow";

function echo(echoId: string, name: string, type: number, stat: string, subs: Array<[string, number]>) {
  const out: Record<string, unknown> = { echoId, echo: name, type, rank: 5, stat, echoSet: SET };
  subs.forEach(([subType, value], index) => {
    out[`echoSubStatsType${index + 1}`] = subType;
    out[`echoSubStatsValue${index + 1}`] = value;
  });
  return out;
}

/** Enough Energy Regen, HP and crit to move every scaling buff off its base value. */
function statHeavyLoadout(prefix: string, regen: number) {
  return [
    echo(`${prefix}-main`, MAIN_ECHO, 4, "EnergyRegen", [["EnergyRegen", regen], ["CritRate", 10.5], ["HP", 11.6]]),
    echo(`${prefix}-b`, "BellBorneGeochelone", 3, "EnergyRegen", [["EnergyRegen", regen], ["CritRate", 9.9], ["HP", 9.4]]),
    echo(`${prefix}-c`, "ChasmGuardian", 3, "EnergyRegen", [["EnergyRegen", regen], ["CritDMG", 21], ["HP", 8.6]]),
    echo(`${prefix}-d`, "RocksteadyGuardian", 1, "HP", [["EnergyRegen", regen], ["CritRate", 8.7], ["CritDMG", 15]]),
    echo(`${prefix}-e`, "Hoochief", 1, "HP", [["EnergyRegen", regen], ["CritRate", 7.5], ["HP_FLAT", 580]]),
  ];
}

const inventoryEchoes = [...statHeavyLoadout("high", 60), ...statHeavyLoadout("low", 1)];
const highRegen = inventoryEchoes.slice(0, 5);
const lowRegen = inventoryEchoes.slice(5);

function toggles(defs: any[] = []) {
  return Object.fromEntries(
    defs.map((def) => [def.key, { isEnabled: true, stacks: def.hasStacks ? def.maxStacks : 0 }]),
  );
}

function wearing(loadout: any[] | null) {
  return Object.fromEntries(
    Array.from({ length: 5 }, (_, index) => [index, { echoId: loadout?.[index]?.echoId ?? null }]),
  );
}

/** Every attack the character has, so a talent-scoped scaling buff can't be missed. */
function allAttacks(character: any, slot: number) {
  const groups = ["basicAttacks", "skillAttacks", "forteCircuitAttacks", "liberationAttacks", "introAttacks", "outroAttacks"];
  const types: Record<string, string> = {
    basicAttacks: "basic",
    skillAttacks: "skill",
    forteCircuitAttacks: "forteCircuit",
    liberationAttacks: "liberation",
    introAttacks: "intro",
    outroAttacks: "outro",
  };
  const actions: any[] = [];
  for (const group of groups) {
    for (const attack of character[group]?.attacks ?? []) {
      actions.push({ id: `a${actions.length}`, slot, order: actions.length + 1, key: attack.key, type: types[group], count: 1, buffs: [] });
    }
  }
  return actions;
}

function characterData(character: any, worn: any[] | null, weapon = "StarfieldCalibrator") {
  return {
    weapon,
    weapons: { [weapon]: { refinement: "1" } },
    echoes: wearing(worn),
    mainEcho: { echo: worn ? MAIN_ECHO : null, rank: 5, buffs: {} },
    buffs: toggles(character.buffs),
    resonanceChains: toggles(character.resonanceChains),
    optimizer: { echoSetPassives: {} },
  };
}

async function scoreAndPage(characterId: string, worn: any[] | null, loadoutRaw: any[], withOverride = false) {
  const character: any = await getCharByName(characterId);
  const data = characterData(character, worn);
  const actions = allAttacks(character, 0);
  if (withOverride) {
    // Turned off for one action only, so that action goes down the override path.
    const index = actions.findIndex((action) => action.key === "CriticalProtocolDMG");
    actions[index] = { ...actions[index], advancedConfig: { buffs: { OutroSkillRecursion: { isEnabled: false } } } };
  }
  const team: any = { name: "Test", characterIds: [characterId, null, null], buildIds: [null, null, null], actions, duration: null };
  const characters = { [characterId]: data };
  const loadout = normalizeOptimizerLoadout(loadoutRaw);
  const plan = await buildTeamOptimizerSlotPlan({
    team,
    slot: 0,
    characterId,
    characterData: data,
    enemyConfig,
    inventoryEchoes,
    mainEchoKeys: [MAIN_ECHO],
  });
  const { context, rotationData, echoBuffs } = plan;
  const self = computeSelfBuffs(
    context.activeCharacterBuffs,
    context.chosenChar?.buffs ?? [],
    context.activeCharacterResonanceChains,
    context.talentData,
    characterId,
    context.activeStance ?? null,
    { havocBaneStacks: context.havocBaneStacks },
  );
  const chains = computeResonanceChainsBuffs(
    context.activeCharacterResonanceChains,
    context.chosenChar?.resonanceChains ?? [],
    context.talentData,
    context.activeStance ?? null,
  );
  const stats = computeLoadoutFinalStats(loadout, context, self, chains, echoBuffs.echoSetPassiveBuffs, echoBuffs.mainEchoStats);
  const variants = rotationData.overrideActions.length
    ? computeOverrideBuffVariants(rotationData.overrideActions, context)
    : new Map();
  const { damageAggregation } = scoreOptimizerRotation(rotationData, loadout, stats, context, variants);
  const verified = await verifyTeamCombination({
    team,
    characters,
    loadoutBySlot: [loadout, null, null],
    echoBuffsBySlot: [echoBuffs, null, null],
    enemyConfig,
    inventoryEchoes,
    damageType: "Average",
    expectedTotal: 1,
  });
  return {
    score: damageAggregation.avgDamage ?? 0,
    page: verified.perCharacter[characterId],
    overrides: rotationData.overrideActions.length,
    context,
    stats,
    echoBuffs,
    self,
    chains,
    data,
  };
}

// Every character with a self or resonance chain buff that scales off a stat.
const STAT_SCALED_CHARACTERS = ["Brant", "Jingran", "Mornye", "Qiuyuan", "Roccia", "Shorekeeper", "Sigrika"];

describe("optimizer scoring with stat-scaled buffs", () => {
  it("scores Mornye the same whatever she's wearing", async () => {
    const naked = await scoreAndPage("Mornye", null, highRegen);
    const lowWorn = await scoreAndPage("Mornye", lowRegen, highRegen);
    const highWorn = await scoreAndPage("Mornye", highRegen, highRegen);
    expect(naked.score).toBeGreaterThan(0);
    expect(lowWorn.score).toBeCloseTo(naked.score, 6);
    expect(highWorn.score).toBeCloseTo(naked.score, 6);
    expect(naked.score).toBeCloseTo(naked.page, 6);
  });

  it("gives Mornye more damage from Energy Regen, as her buffs say it should", async () => {
    const high = await scoreAndPage("Mornye", null, highRegen);
    const low = await scoreAndPage("Mornye", null, lowRegen);
    expect(high.score).toBeGreaterThan(low.score);
  });

  it("scores a per-action override at the loadout's stats too", async () => {
    const naked = await scoreAndPage("Mornye", null, highRegen, true);
    const worn = await scoreAndPage("Mornye", lowRegen, highRegen, true);
    expect(naked.overrides).toBe(1);
    expect(worn.score).toBeCloseTo(naked.score, 6);
    expect(naked.score).toBeCloseTo(naked.page, 6);
  });

  it("scores a single attack target at the loadout's stats", async () => {
    // The main-thread path; processor.worker.ts passes the same loadout buff data.
    const character: any = await getCharByName("Mornye");
    const score = async (worn: any[] | null) => {
      const { context, echoBuffs } = await scoreAndPage("Mornye", worn, highRegen);
      const [best] = optimize(
        highRegen as any[],
        { ...context, chosenChar: character },
        [],
        1,
        [MAIN_ECHO],
        [],
        echoBuffs.echoSetPassiveBuffs,
        echoBuffs.mainEchoStats,
        "Attack:liberationAttacks|CriticalProtocolDMG",
        "Average",
      ) as any[];
      return best.targetValue;
    };
    const naked = await score(null);
    expect(naked).toBeGreaterThan(0);
    expect(await score(lowRegen)).toBeCloseTo(naked, 6);
    expect(await score(highRegen)).toBeCloseTo(naked, 6);
  });

  it.each(STAT_SCALED_CHARACTERS)("%s scores the same as the Team page, whatever's worn", async (characterId) => {
    const naked = await scoreAndPage(characterId, null, highRegen);
    const worn = await scoreAndPage(characterId, lowRegen, highRegen);
    expect(naked.score).toBeGreaterThan(0);
    expect(worn.score).toBeCloseTo(naked.score, 6);
    expect(naked.score).toBeCloseTo(naked.page, 6);
    expect(worn.score).toBeCloseTo(worn.page, 6);
  });

  it("keeps the loadout buff data on the same shape the Team page's context uses", async () => {
    const { stats, data } = await scoreAndPage("Mornye", null, highRegen);
    const applied = applyLoadoutToCharacterData(data, highRegen, (await scoreAndPage("Mornye", null, highRegen)).echoBuffs);
    const built = await buildCharacterCalculationContext("Mornye", { Mornye: applied }, enemyConfig, inventoryEchoes);
    expect(stats.loadoutBuffData.selfBuffsData.DMGBonus).toBeCloseTo((built.charBuffsData as any).DMGBonus, 8);
    expect(stats.loadoutBuffData.resonanceChainsBuffsData.CritDMG).toBeCloseTo(
      (built.charResonanceChainsData as any).CritDMG,
      8,
    );
  });
});
