/**
 * Team optimizer (ADR 0052): the best builds for all of a team's characters at
 * once, for one team rotation.
 *
 * A character's damage only reads their own echoes, so a team's damage is the
 * sum of independent per-character scores. That lets each character be searched
 * with the normal optimizer against their own actions, after which
 * `combineTeamLoadouts` finds the best totals that never use an echo twice.
 *
 * What the engine can't see is what a support's build does for teammates: team
 * buffs read hand-entered values and toggles, not the buffer's real build.
 * `deriveTeamBuffGuards` turns those settings into constraints, so a search
 * can't quietly give up a buff the team's damage still counts.
 *
 * Pure: no Vue, no stores.
 */
import { buffsByCharacter, allEchoBuffs } from "../buffs/index";
import type { TeamBuffDef } from "../buffs/teamBuffs";
import { applyMainEchoBuffEffects } from "../echoes/applyMainEchoBuffEffects";
import { resolveSetBonusStats } from "../echoes/echoSetPassives";
import { mainEchoesData } from "../echoes/index";
import { getMainEchoBuffs, mergeMainEchoBuffStats } from "../echoes/mainEchoBuffs";
import {
  getSetBonusEffects,
  getSetsFromEchoes,
  setBonusEffectsOne,
  setBonusEffectsOnePiece,
  setBonusEffectsTwo,
} from "../echoes/sets";
import { echoSetLabelMap } from "../echoes/stats";
import {
  buildCharacterCalculationContext,
  resolveCharacterEchoes,
  resolveEnemyResistForElement,
  type TeamEnemyConfig,
} from "./buildCharacterContext";
import { resolveCharactersForBuild } from "./buildOverride";
import { meetsMinStatThreshold } from "./meetsMinStatThreshold";
import { filterEchoesForOptimizer, normalizeLoadoutFormat, type OptimizerContext } from "./optimizer";
import {
  getCalculatorMainEchoBuffEntry,
  getMainEchoBuffEntry,
  resolveOptimizerBuff,
  type OptimizerBuffEntry,
} from "./optimizerBuffStatus";
import { buildOptimizerRotationData, type OptimizerRotationData } from "./rotationData";
import { resolveActiveStance } from "./stances";
import {
  calcTeamRotationDamage,
  type DamageAggregation,
  type TeamRotationCharacterResult,
  type TeamRotationInput,
} from "./teamRotation";

/** How many of each character's best loadouts are kept for combining. */
export const TEAM_OPTIMIZER_LIST_DEPTH = 2000;
export const TEAM_OPTIMIZER_TOP_N = 5;
/** A character below this share of team damage keeps their build by default. */
export const KEEP_BUILD_DAMAGE_SHARE = 0.05;
/** Stops the combiner on the main thread if heavy echo conflicts blow up the search. */
const MAX_COMBINER_VISITS = 5_000_000;
/** A verified total further than this from the combiner's total is reported as a mismatch. */
const VERIFY_TOLERANCE = 1e-6;

export type TeamOptimizerDamageType = "Normal" | "Average" | "Crit";

const DAMAGE_AGGREGATION_KEY: Record<TeamOptimizerDamageType, keyof DamageAggregation> = {
  Normal: "normalDamage",
  Average: "avgDamage",
  Crit: "critDamage",
};

export function readTeamDamage(
  aggregation: DamageAggregation | null | undefined,
  damageType: TeamOptimizerDamageType,
): number {
  return aggregation?.[DAMAGE_AGGREGATION_KEY[damageType]] ?? 0;
}

export type TeamOptimizerGoal = "damage" | "keep";

export interface TeamOptimizerMinStat {
  stat: string;
  minValue: number;
}

/** What the player chose for one character. */
export interface TeamOptimizerChoice {
  goal: TeamOptimizerGoal;
  sets: string[];
  mainEchoes: string[];
  minStats: TeamOptimizerMinStat[];
  loadoutFormat: string;
  /** The optimizer's existing setting: skips echoes worn by characters outside this team. */
  ignoreOtherResonatorEchoes: boolean;
  protectTeamBuffs: boolean;
}

function wornEchoes(characterData: Record<string, any>, inventoryEchoes: any[]): any[] {
  return resolveCharacterEchoes(characterData?.echoes, inventoryEchoes).filter((echo) => echo?.echo);
}

/**
 * The prefill: the character's saved optimizer settings plus what they're wearing
 * now (sets with an active bonus, and the main echo's own set so it can be found).
 */
export function defaultTeamOptimizerChoice(
  characterData: Record<string, any>,
  inventoryEchoes: any[],
): Omit<TeamOptimizerChoice, "goal"> {
  const optimizer = characterData?.optimizer ?? {};
  const worn = wornEchoes(characterData, inventoryEchoes);
  const counts = new Map<string, number>();
  for (const echo of worn) {
    if (echo.echoSet) counts.set(echo.echoSet, (counts.get(echo.echoSet) ?? 0) + 1);
  }
  const wornSets = [...counts.entries()].filter(([, count]) => count >= 2).map(([set]) => set);
  const wornMain = characterData?.mainEcho?.echo ?? worn[0]?.echo ?? null;
  const wornMainSet = worn.find((echo) => echo.echo === wornMain)?.echoSet;
  if (wornMainSet && !wornSets.includes(wornMainSet)) wornSets.push(wornMainSet);

  return {
    // Always including what's worn keeps the current build in the search, so a
    // result can only fall below it because of echo conflicts or team buff guards.
    sets: [...new Set([...(optimizer.echoSets ?? []), ...wornSets])],
    mainEchoes: [...new Set([...(optimizer.mainEchoes ?? []), ...(wornMain ? [wornMain] : [])])],
    minStats: (optimizer.minStats ?? []).map((row: TeamOptimizerMinStat) => ({ ...row })),
    loadoutFormat: normalizeLoadoutFormat(optimizer.loadoutFormat),
    ignoreOtherResonatorEchoes: optimizer.ignoreOtherResonantorEchoes === true,
    protectTeamBuffs: true,
  };
}

export function defaultTeamOptimizerGoal(input: {
  hasActions: boolean;
  damageShare: number;
  hasEligibleEchoes: boolean;
}): TeamOptimizerGoal {
  if (!input.hasActions || !input.hasEligibleEchoes) return "keep";
  return input.damageShare < KEEP_BUILD_DAMAGE_SHARE ? "keep" : "damage";
}

export function eligibleTeamOptimizerEchoes(input: {
  inventoryEchoes: any[];
  sets: string[];
  requiredMainEcho?: string | null;
  requiredSetKeys?: string[];
  excludedEchoIds?: ReadonlySet<string>;
}): any[] {
  const allowed = new Set([...input.sets, ...(input.requiredSetKeys ?? [])]);
  const usable = (filterEchoesForOptimizer(input.inventoryEchoes) as any[]).filter(
    (echo) => !input.excludedEchoIds?.has(echo.echoId),
  );
  const required = input.requiredMainEcho;
  // A required main echo outside the chosen sets still has to be found, but only
  // reach outside them if no copy is inside.
  const reachOutside = Boolean(required) && !usable.some((echo) => echo.echo === required && allowed.has(echo.echoSet));
  return usable.filter((echo) => allowed.has(echo.echoSet) || (reachOutside && echo.echo === required));
}

/**
 * Echoes only worn outside the team, for the "ignore other resonators' echoes"
 * setting. Like the single-character optimizer's version, an echo a team member
 * wears stays available even if someone else wears it too.
 */
export function echoIdsWornOutsideTeam(
  equipped: Record<string, Record<string, number>>,
  teamCharacterIds: Array<string | null>,
): Set<string> {
  const team = new Set(teamCharacterIds);
  const ids = new Set<string>();
  for (const [echoId, wornBy] of Object.entries(equipped ?? {})) {
    const wearers = Object.keys(wornBy ?? {});
    if (wearers.length && !wearers.some((character) => team.has(character))) ids.add(echoId);
  }
  return ids;
}

// --- Team buff guards ----------------------------------------------------

const GUARDED_STATS: Record<string, { stat: string; label: string }> = {
  "Energy Regen": { stat: "energyRegen", label: "Energy Regen" },
  "Crit Rate": { stat: "totalCritRate", label: "Crit Rate" },
};

export interface TeamBuffGuardFloor extends TeamOptimizerMinStat {
  label: string;
}

export interface TeamBuffGuardDrift {
  label: string;
  teammateId: string;
  expected: number;
  actual: number;
}

export interface TeamBuffGuard {
  /** Stat floors a searched character must keep. */
  floors: TeamBuffGuardFloor[];
  /** Main echo the character has to keep for a teammate's enabled team buff. */
  requiredMainEcho: string | null;
  requiredSetBonusLabels: string[];
  requiredSetKeys: string[];
  /** A kept build falling short of what a teammate's buff assumes. */
  drifts: TeamBuffGuardDrift[];
}

export interface TeamBuffGuardSlot {
  characterId: string;
  characterData: Record<string, any>;
  goal: TeamOptimizerGoal;
  finalStats: Record<string, any> | null;
  inventoryEchoes: any[];
}

function emptyGuard(): TeamBuffGuard {
  return { floors: [], requiredMainEcho: null, requiredSetBonusLabels: [], requiredSetKeys: [], drifts: [] };
}

/**
 * The stat value a buff actually needs: what the teammate entered, capped at
 * the value that already reaches the buff's maximum. Null when the entered value
 * doesn't clear the buff's threshold, because then nothing depends on it.
 */
export function teamBuffStatFloor(def: TeamBuffDef, enteredValue: number): number | null {
  let needed: number | null = null;
  for (const modifier of def.modifiers ?? []) {
    const { modifierStep, modifierValue, maximumValue } = modifier;
    if (typeof modifierStep !== "number") continue;
    // No threshold means it scales from zero, as resolveTeamBuffInstance assumes.
    const minStatValue = modifier.minStatValue ?? 0;
    if (enteredValue <= minStatValue) continue;
    let floor = enteredValue;
    if (typeof modifierValue === "number" && modifierValue > 0 && typeof maximumValue === "number") {
      const atCap = minStatValue + (maximumValue / modifierValue) * modifierStep * 100;
      // Rounded because 0.125 / 0.001 * 0.01 style steps pick up float noise.
      floor = Math.min(floor, Math.round(atCap * 1e6) / 1e6);
    }
    needed = Math.max(needed ?? 0, floor);
  }
  return needed;
}

function setKeyOfTeamBuff(buffKey: string): string | null {
  // Variants like FlowerofTingedYearningUnison share their set's key as a prefix.
  return Object.keys(echoSetLabelMap).find((set) => buffKey === set || buffKey.startsWith(set)) ?? null;
}

function activeSetBonusLabel(worn: any[], setKey: string): string | null {
  const bonuses = getSetBonusEffects(getSetsFromEchoes(worn));
  const prefix = `${echoSetLabelMap[setKey]} `;
  return [bonuses.setBonusTwo, bonuses.setBonusOne, bonuses.setBonusOnePiece].find((label) => label?.startsWith(prefix)) ?? null;
}

/**
 * One guard per slot, from what each teammate has configured:
 * - an enabled "scales off the buffer's stat" team buff sets a stat floor
 * - an enabled echo or set team buff requires whichever teammate provides it to
 *   keep that main echo or set bonus. Nothing is required if a kept build
 *   already provides it, and a buff with no provider on the team is left alone.
 */
export function deriveTeamBuffGuards(slots: Array<TeamBuffGuardSlot | null>): Array<TeamBuffGuard | null> {
  const guards = slots.map((slot) => (slot ? emptyGuard() : null));

  slots.forEach((receiver, receiverIndex) => {
    if (!receiver) return;
    const teamBuffs = receiver.characterData?.teamBuffs ?? {};
    const config: Record<string, any> = teamBuffs.buffs ?? {};

    slots.forEach((provider, providerIndex) => {
      if (!provider || providerIndex === receiverIndex) return;
      const isSelected =
        teamBuffs.selectedCharacter1 === provider.characterId || teamBuffs.selectedCharacter2 === provider.characterId;
      if (!isSelected) return;
      const defs = (buffsByCharacter as Record<string, TeamBuffDef[]>)[provider.characterId] ?? [];
      for (const def of defs) {
        const entry = config[def.key];
        const guarded = def.modifierBasedOn ? GUARDED_STATS[def.modifierBasedOn] : undefined;
        if (!entry?.isEnabled || !def.inputBase || !guarded) continue;
        const floor = teamBuffStatFloor(def, Number(entry.baseAttrValue));
        if (floor === null) continue;
        const guard = guards[providerIndex]!;
        const actualRaw = provider.finalStats?.[guarded.stat];
        if (provider.goal === "keep") {
          if (actualRaw != null && !meetsMinStatThreshold(actualRaw, floor, guarded.stat)) {
            guard.drifts.push({
              label: guarded.label,
              teammateId: receiver.characterId,
              expected: floor,
              actual: Number(actualRaw) * 100,
            });
          }
          continue;
        }
        const existing = guard.floors.find((row) => row.stat === guarded.stat);
        if (existing) existing.minValue = Math.max(existing.minValue, floor);
        else guard.floors.push({ stat: guarded.stat, minValue: floor, label: guarded.label });
      }
    });

    for (const def of allEchoBuffs as TeamBuffDef[]) {
      if (!config[def.key]?.isEnabled) continue;
      const others = slots
        .map((slot, index) => ({ slot, index }))
        .filter(({ slot, index }) => slot && index !== receiverIndex);

      if ((mainEchoesData as Record<string, unknown>)[def.key]) {
        const providers = others.filter(({ slot }) => slot!.characterData?.mainEcho?.echo === def.key);
        if (!providers.length || providers.some(({ slot }) => slot!.goal === "keep")) continue;
        guards[providers[0].index]!.requiredMainEcho = def.key;
        continue;
      }

      const setKey = setKeyOfTeamBuff(def.key);
      if (!setKey) continue;
      const providers = others
        .map(({ slot, index }) => ({
          index,
          goal: slot!.goal,
          label: activeSetBonusLabel(wornEchoes(slot!.characterData, slot!.inventoryEchoes), setKey),
        }))
        .filter((provider) => provider.label);
      if (!providers.length || providers.some((provider) => provider.goal === "keep")) continue;
      const guard = guards[providers[0].index]!;
      if (!guard.requiredSetBonusLabels.includes(providers[0].label!)) {
        guard.requiredSetBonusLabels.push(providers[0].label!);
        guard.requiredSetKeys.push(setKey);
      }
    }
  });

  return guards;
}

/** The player's minimums plus the guard's floors, keeping the higher of each stat. */
export function mergeMinStats(
  minStats: TeamOptimizerMinStat[],
  floors: TeamOptimizerMinStat[],
): TeamOptimizerMinStat[] {
  const merged = minStats.map((row) => ({ stat: row.stat, minValue: row.minValue }));
  for (const floor of floors) {
    const existing = merged.find((row) => row.stat === floor.stat);
    if (existing) existing.minValue = Math.max(Number(existing.minValue), floor.minValue);
    else merged.push({ stat: floor.stat, minValue: floor.minValue });
  }
  return merged;
}

// --- Echo buff settings --------------------------------------------------

export interface TeamOptimizerEchoBuffs {
  /** Every set passive's effective setting: the optimizer's, else the calculator's. */
  echoSetPassives: Record<string, OptimizerBuffEntry>;
  /** Stats by set bonus label, the shape `computeLoadoutFinalStats` reads. */
  echoSetPassiveBuffs: Record<string, Record<string, unknown>>;
  /** Stats by main echo key, for the echoes being searched. */
  mainEchoStats: Record<string, Record<string, unknown>>;
  /** Effective per-buff settings by main echo key. */
  mainEchoBuffConfigs: Record<string, Record<string, OptimizerBuffEntry>>;
}

/**
 * Resolves the same settings the optimizer's buff rows show (ADR 0040) without
 * needing them mounted, since most characters never open their drawer.
 */
export function resolveTeamOptimizerEchoBuffs(
  characterId: string,
  characterData: Record<string, any>,
  mainEchoKeys: string[],
  talentData: Record<string, any>,
): TeamOptimizerEchoBuffs {
  const optimizer = characterData?.optimizer ?? {};
  const allDefs = { ...setBonusEffectsOnePiece, ...setBonusEffectsOne, ...setBonusEffectsTwo } as Record<string, any>;

  const echoSetPassives: Record<string, OptimizerBuffEntry> = {};
  for (const def of Object.values(allDefs)) {
    for (const passive of def?.passives ?? []) {
      const resolved = resolveOptimizerBuff({
        optimizerEntry: optimizer.echoSetPassives?.[passive.key],
        calculatorEntry: characterData?.echoSetPassives?.[passive.key],
        hasStacks: Boolean(passive.hasStacks),
        alwaysEnabled: Boolean(passive.alwaysEnabled),
        calculatorFallback: true,
      });
      echoSetPassives[passive.key] = { isEnabled: resolved.isEnabled, stacks: resolved.stacks };
    }
  }

  const echoSetPassiveBuffs: Record<string, Record<string, unknown>> = {};
  for (const [label, def] of Object.entries(allDefs)) {
    echoSetPassiveBuffs[label] = resolveSetBonusStats(def, echoSetPassives, talentData);
  }

  const mainEchoStats: Record<string, Record<string, unknown>> = {};
  const mainEchoBuffConfigs: Record<string, Record<string, OptimizerBuffEntry>> = {};
  for (const echoKey of mainEchoKeys) {
    const def = (mainEchoesData as Record<string, any>)[echoKey];
    const statsByBuff: Record<string, Record<string, unknown>> = {};
    const config: Record<string, OptimizerBuffEntry> = {};
    for (const buff of getMainEchoBuffs(def)) {
      const resolved = resolveOptimizerBuff({
        optimizerEntry: getMainEchoBuffEntry(optimizer.mainEchoBuffs?.[echoKey], buff.key),
        calculatorEntry: getCalculatorMainEchoBuffEntry(characterData?.mainEcho, echoKey, buff.key),
        hasStacks: Boolean(buff.hasStacks),
        alwaysEnabled: Boolean(buff.alwaysEnabled),
        calculatorFallback: true,
      });
      config[buff.key] = { isEnabled: resolved.isEnabled, stacks: resolved.stacks };
      if (!resolved.isEnabled) continue;
      statsByBuff[buff.key] = applyMainEchoBuffEffects({
        effects: buff.effects,
        character: characterId,
        hasStacks: buff.hasStacks,
        stacks: resolved.stacks,
        talentData,
      });
    }
    mainEchoStats[echoKey] = mergeMainEchoBuffStats(statsByBuff, {}) as Record<string, unknown>;
    mainEchoBuffConfigs[echoKey] = config;
  }

  return { echoSetPassives, echoSetPassiveBuffs, mainEchoStats, mainEchoBuffConfigs };
}

/** The character's record as it would be with this loadout equipped. */
export function applyLoadoutToCharacterData(
  characterData: Record<string, any>,
  loadout: any[],
  echoBuffs: Pick<TeamOptimizerEchoBuffs, "echoSetPassives" | "mainEchoBuffConfigs">,
): Record<string, any> {
  const bonuses = getSetBonusEffects(getSetsFromEchoes(loadout));
  const main = loadout[0];
  const allDefs = { ...setBonusEffectsOnePiece, ...setBonusEffectsOne, ...setBonusEffectsTwo } as Record<string, any>;
  // Only the sets this loadout activates, so other sets' saved settings stay as they are.
  const activePassives: Record<string, OptimizerBuffEntry> = {};
  for (const label of [bonuses.setBonusOnePiece, bonuses.setBonusOne, bonuses.setBonusTwo]) {
    for (const passive of (label ? allDefs[label]?.passives : null) ?? []) {
      const entry = echoBuffs.echoSetPassives[passive.key];
      if (entry) activePassives[passive.key] = entry;
    }
  }
  const echoes: Record<number, { echoId: string | null }> = {};
  for (let index = 0; index < 5; index++) {
    echoes[index] = { echoId: loadout[index]?.echoId ?? null };
  }
  const isSameMain = characterData?.mainEcho?.echo === main?.echo;
  return {
    ...characterData,
    echoes,
    echoSetBonus: {
      setBonusOnePiece: bonuses.setBonusOnePiece,
      setBonusOne: bonuses.setBonusOne,
      setBonusTwo: bonuses.setBonusTwo,
    },
    echoSetPassives: { ...characterData?.echoSetPassives, ...activePassives },
    mainEcho: {
      echo: main?.echo ?? null,
      rank: isSameMain ? characterData?.mainEcho?.rank : (main?.rank ?? 5),
      buffs: echoBuffs.mainEchoBuffConfigs[main?.echo] ?? {},
    },
  };
}

// --- Per-character search plan -------------------------------------------

/**
 * The `OptimizerContext` for any character, built from stored data rather than
 * the Calculator page's reactive state, against the team's enemy.
 */
export async function buildOptimizerContextForCharacter(
  characterId: string,
  characterData: Record<string, any>,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[],
): Promise<OptimizerContext> {
  // A one-character map, so the context sent to each worker stays small.
  const characters = { [characterId]: characterData };
  const built = await buildCharacterCalculationContext(characterId, characters, enemyConfig, inventoryEchoes);
  const basic = built.chosenChar?.basic ?? {};
  return {
    chosenChar: built.chosenChar,
    character: characterId,
    characterLevel: built.characterLevel,
    talentData: built.talentData,
    baseHp: built.baseHp,
    baseAtk: built.baseAtk,
    baseDef: built.baseDef,
    weaponData: {
      ...built.weaponData,
      // Per-action buff overrides re-resolve weapon passives from these. They
      // aren't in the calculation context, and leaving them out silently loses
      // those passives on every override action.
      weaponPassiveDefs: built.definitions.weaponPassives,
      refinement: String(characterData?.weapons?.[characterData?.weapon]?.refinement ?? "1"),
    },
    charBuffsData: built.charBuffsData,
    charResonanceChainsData: built.charResonanceChainsData,
    teamBuffsData: built.teamBuffsData,
    customBuffs: built.customBuffs,
    echoSetPassivesConfig: characterData?.echoSetPassives ?? {},
    echoStats: built.echoStats,
    enemyLevel: enemyConfig.enemyLevel,
    enemyResist: resolveEnemyResistForElement(enemyConfig, basic.element),
    enemyType: enemyConfig.enemyType,
    isSpectroFrazzleEnabled: Boolean(basic.spectroFrazzle),
    spectroFrazzleStacks: enemyConfig.spectroFrazzleStacks ?? 0,
    isAeroErosionEnabled: Boolean(basic.aeroErosion),
    aeroErosionStacks: enemyConfig.aeroErosionStacks ?? 0,
    isFusionBurstEnabled: Boolean(basic.fusionBurst),
    fusionBurstStacks: enemyConfig.fusionBurstStacks ?? 0,
    isElectroFlareEnabled: Boolean(basic.electroFlare),
    electroFlareStacks: enemyConfig.electroFlareStacks ?? 0,
    electroRageStacks: enemyConfig.electroRageStacks ?? 0,
    isGlacioChafeEnabled: Boolean(basic.glacioChafe),
    glacioChafeStacks: enemyConfig.glacioChafeStacks ?? 0,
    havocBaneStacks: enemyConfig.havocBaneStacks ?? 0,
    strainStacks: enemyConfig.strainStacks ?? 0,
    mainEcho: built.mainEcho,
    mainEchoRank: built.mainEchoRank,
    rotationsList: [],
    Glacio: built.finalStats?.Glacio ?? 0,
    Fusion: built.finalStats?.Fusion ?? 0,
    Electro: built.finalStats?.Electro ?? 0,
    Aero: built.finalStats?.Aero ?? 0,
    Spectro: built.finalStats?.Spectro ?? 0,
    Havoc: built.finalStats?.Havoc ?? 0,
    characters,
    activeCharacterBuffs: characterData?.buffs ?? {},
    activeCharacterResonanceChains: characterData?.resonanceChains ?? {},
    activeStance:
      characterData?.activeStance ??
      resolveActiveStance(built.chosenChar?.basic?.stances, undefined, characterData?.buffs),
    getRotationById: () => null,
  };
}

export interface TeamOptimizerSlotPlan {
  slot: number;
  characterId: string;
  context: OptimizerContext;
  rotationData: OptimizerRotationData;
  target: string;
  echoBuffs: TeamOptimizerEchoBuffs;
}

export async function buildTeamOptimizerSlotPlan(input: {
  team: TeamRotationInput;
  slot: number;
  characterId: string;
  characterData: Record<string, any>;
  enemyConfig: TeamEnemyConfig;
  inventoryEchoes: any[];
  mainEchoKeys: string[];
}): Promise<TeamOptimizerSlotPlan> {
  const { team, slot, characterId, characterData, enemyConfig, inventoryEchoes, mainEchoKeys } = input;
  // Resolved first so the per-action override path, which rebuilds from the
  // stored record, starts from the same settings as the plain path.
  const talents = {
    basic: characterData?.talents?.basic ?? 10,
    skill: characterData?.talents?.skill ?? 10,
    forte: characterData?.talents?.forte ?? 10,
    liberation: characterData?.talents?.liberation ?? 10,
    intro: characterData?.talents?.intro ?? 10,
  };
  const echoBuffs = resolveTeamOptimizerEchoBuffs(characterId, characterData, mainEchoKeys, talents);
  const searchData = {
    ...characterData,
    echoSetPassives: { ...characterData?.echoSetPassives, ...echoBuffs.echoSetPassives },
  };
  const context = await buildOptimizerContextForCharacter(characterId, searchData, enemyConfig, inventoryEchoes);
  const actions = team.actions
    .filter((action) => action.slot === slot && !action.isDisabled)
    .sort((a, b) => a.order - b.order);
  const id = `slot-${slot}`;
  return {
    slot,
    characterId,
    context,
    echoBuffs,
    target: `Rotation:${id}`,
    rotationData: buildOptimizerRotationData(
      { id, name: team.name ?? "Team Rotation", duration: team.duration, actions },
      context.chosenChar,
      context.characterLevel,
    ),
  };
}

// --- Combining -----------------------------------------------------------

export interface TeamOptimizerRow {
  echoIds: string[];
  score: number;
}

export interface TeamOptimizerList<Row extends TeamOptimizerRow = TeamOptimizerRow> {
  /** Best first. */
  rows: Row[];
  /** Rows below the kept ones exist, so the proof has to account for them. */
  isTruncated: boolean;
}

export interface TeamOptimizerCombination<Row extends TeamOptimizerRow = TeamOptimizerRow> {
  total: number;
  /** One row per list, in list order. */
  picks: Row[];
}

export interface TeamOptimizerCombineResult<Row extends TeamOptimizerRow = TeamOptimizerRow> {
  combinations: TeamOptimizerCombination<Row>[];
  /** True when no combination outside the kept rows could reach the top N. */
  isProven: boolean;
  visited: number;
}

/**
 * The top N totals that use no echo twice. Depth-first over score-sorted lists,
 * pruning any branch that can't beat the current Nth best.
 *
 * The proof: a combination using a row below a truncated list's last kept row
 * scores at most that row plus every other list's best. If the Nth best beats
 * that for every truncated list, nothing outside the lists could get in.
 */
export function combineTeamLoadouts<Row extends TeamOptimizerRow>(
  lists: TeamOptimizerList<Row>[],
  topN: number = TEAM_OPTIMIZER_TOP_N,
): TeamOptimizerCombineResult<Row> {
  if (!lists.length || lists.some((list) => list.rows.length === 0)) {
    return { combinations: [], isProven: lists.every((list) => !list.isTruncated), visited: 0 };
  }

  const best: TeamOptimizerCombination<Row>[] = [];
  const bestOfLaterLists = lists.map((_, index) =>
    lists.slice(index + 1).reduce((sum, list) => sum + list.rows[0].score, 0),
  );
  const used = new Set<string>();
  const picks: Row[] = [];
  let visited = 0;
  let isCapped = false;

  const threshold = () => (best.length < topN ? -Infinity : best[best.length - 1].total);

  const search = (listIndex: number, total: number) => {
    if (listIndex === lists.length) {
      best.push({ total, picks: [...picks] });
      best.sort((a, b) => b.total - a.total);
      if (best.length > topN) best.pop();
      return;
    }
    for (const row of lists[listIndex].rows) {
      if (visited >= MAX_COMBINER_VISITS) {
        isCapped = true;
        return;
      }
      visited++;
      // Rows are sorted, so nothing further down this list can do better.
      if (total + row.score + bestOfLaterLists[listIndex] <= threshold()) return;
      if (row.echoIds.some((id) => used.has(id))) continue;
      row.echoIds.forEach((id) => used.add(id));
      picks.push(row);
      search(listIndex + 1, total + row.score);
      picks.pop();
      row.echoIds.forEach((id) => used.delete(id));
    }
  };
  search(0, 0);

  const bestTotal = lists.reduce((sum, list) => sum + list.rows[0].score, 0);
  const unseenBound = lists.reduce((bound, list) => {
    if (!list.isTruncated) return bound;
    return Math.max(bound, bestTotal - list.rows[0].score + list.rows[list.rows.length - 1].score);
  }, -Infinity);
  const hasTruncatedList = lists.some((list) => list.isTruncated);
  const isProven =
    !isCapped &&
    (!hasTruncatedList || (best.length === topN && best[best.length - 1].total >= unseenBound));

  return { combinations: best, isProven, visited };
}

// --- Verifying -----------------------------------------------------------

type TeamRotationCharacterResultMap = Record<string, TeamRotationCharacterResult>;

export interface TeamOptimizerVerification {
  total: number;
  perCharacter: Record<string, number>;
  characterResults: TeamRotationCharacterResultMap;
  matches: boolean;
}

/**
 * Recalculates a combination through the Team page's own calculation, so what's
 * shown can't drift from it. `loadoutBySlot` entries are null for kept builds.
 */
export async function verifyTeamCombination(input: {
  team: TeamRotationInput;
  characters: Record<string, any>;
  loadoutBySlot: Array<any[] | null>;
  echoBuffsBySlot: Array<Pick<TeamOptimizerEchoBuffs, "echoSetPassives" | "mainEchoBuffConfigs"> | null>;
  enemyConfig: TeamEnemyConfig;
  inventoryEchoes: any[];
  damageType: TeamOptimizerDamageType;
  expectedTotal: number;
}): Promise<TeamOptimizerVerification> {
  const { team, loadoutBySlot, echoBuffsBySlot, enemyConfig, inventoryEchoes, damageType, expectedTotal } = input;
  let characters = input.characters;
  team.characterIds.forEach((characterId, slot) => {
    if (!characterId) return;
    characters = resolveCharactersForBuild(characters, characterId, team.buildIds?.[slot] ?? null);
    const loadout = loadoutBySlot[slot];
    const echoBuffs = echoBuffsBySlot[slot];
    if (loadout && echoBuffs) {
      characters = {
        ...characters,
        [characterId]: applyLoadoutToCharacterData(characters[characterId], loadout, echoBuffs),
      };
    }
  });

  const result = await calcTeamRotationDamage(
    { ...team, buildIds: [null, null, null] },
    characters,
    enemyConfig,
    inventoryEchoes,
  );
  const perCharacter: Record<string, number> = {};
  for (const [characterId, characterResult] of Object.entries(result.perCharacter)) {
    perCharacter[characterId] = readTeamDamage(characterResult.damageAggregation, damageType);
  }
  const total = readTeamDamage(result.total, damageType);
  const matches = expectedTotal > 0 && Math.abs(total / expectedTotal - 1) <= VERIFY_TOLERANCE;
  return { total, perCharacter, characterResults: result.perCharacter, matches };
}

/** How many echoes in `echoIds` aren't in `baseline`. */
export function countChangedEchoes(echoIds: string[], baseline: string[]): number {
  const base = new Set(baseline);
  return echoIds.filter((id) => !base.has(id)).length;
}

/** Characters outside the team also wearing these echoes, for the save confirmation. */
export function echoesSharedOutsideTeam(
  echoIds: string[],
  equipped: Record<string, Record<string, number>>,
  teamCharacterIds: Array<string | null>,
): string[] {
  const team = new Set(teamCharacterIds);
  const others = new Set<string>();
  for (const id of echoIds) {
    for (const character of Object.keys(equipped?.[id] ?? {})) {
      if (!team.has(character)) others.add(character);
    }
  }
  return [...others].sort();
}

/** Echoes worn twice across the team's current builds, which the game wouldn't allow. */
export function countEchoesSharedByTeam(echoIdsBySlot: string[][]): number {
  const all = echoIdsBySlot.flat();
  return all.length - new Set(all).size;
}
