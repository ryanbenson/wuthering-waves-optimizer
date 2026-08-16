// Import necessary functions and types
import { getAttackData } from "../characters/characters";
import { getCombinedEchoStats } from "../echoes/stats";
import {
  getSetsFromEchoes,
  getSetBonusEffects,
  setBonusEffectsOnePiece,
  setBonusEffectsOne,
  setBonusEffectsTwo,
} from "../echoes/sets";
import { resolveSetBonusStats } from "../echoes/echoSetPassives";
import {
  computeSelfBuffs,
  computeResonanceChainsBuffs,
  calculateFinalStatsFromBuffs,
} from "../calculator/stats";
import { processAttacks, getCalculationContext, aggregateRotationDamage } from "../calculator/attacks";
import {
  buildOptimizerRotationData,
  type OptimizerRotationData,
  type OptimizerRotationOverrideAction,
} from "../calculator/rotationData";
import { applyAdvancedOverrides } from "./rotationAdvancedBuffs";
import { resolveTeamBuffInstance, aggregateTeamBuffStats, type TeamBuffDef } from "../buffs/teamBuffs";
import { buffsByCharacter } from "../buffs/index";
import { computeWeaponPassiveStats } from "../weapons/weaponPassives";
import { randomString } from "../utils/strings";
import { meetsMinStatThreshold } from "./meetsMinStatThreshold";

/** Echo cost as a number (coerced). Non-numeric types must not participate in `+` with numbers (string concat bugs). */
function echoCost(echo: { type?: unknown }): number {
  const n = Number(echo?.type);
  return Number.isFinite(n) ? n : 0;
}

export type OptimizerLoadoutFormat = "Any" | "43311" | "44111";

const LOADOUT_FORMAT_COST_COUNTS: Record<
  Exclude<OptimizerLoadoutFormat, "Any">,
  Record<number, number>
> = {
  "43311": { 4: 1, 3: 2, 1: 2 },
  "44111": { 4: 2, 1: 3 },
};

export function normalizeLoadoutFormat(
  value: unknown,
): OptimizerLoadoutFormat {
  if (value === "Any" || value === "43311" || value === "44111") {
    return value;
  }
  return "Any";
}

function getFormatCostCounts(
  format: OptimizerLoadoutFormat,
): Record<number, number> | null {
  if (format === "Any") {
    return null;
  }
  return { ...LOADOUT_FORMAT_COST_COUNTS[format] };
}

function canUseEchoForFormat(
  remainingCosts: Record<number, number> | null,
  cost: number,
): boolean {
  if (!remainingCosts) {
    return true;
  }
  return (remainingCosts[cost] ?? 0) > 0;
}

function consumeFormatCost(
  remainingCosts: Record<number, number> | null,
  cost: number,
): void {
  if (!remainingCosts) {
    return;
  }
  remainingCosts[cost] -= 1;
}

function restoreFormatCost(
  remainingCosts: Record<number, number> | null,
  cost: number,
): void {
  if (!remainingCosts) {
    return;
  }
  remainingCosts[cost] += 1;
}

function isCompleteFormatLoadout(
  remainingCosts: Record<number, number> | null,
  comboLength: number,
): boolean {
  if (!remainingCosts) {
    return false;
  }
  if (comboLength !== 5) {
    return false;
  }
  return Object.values(remainingCosts).every((count) => count === 0);
}

export function filterEchoesForOptimizer(echoes: unknown[]): unknown[] {
  if (!Array.isArray(echoes)) {
    return [];
  }
  return echoes.filter(
    (echo) => !(echo as { ignoreFromOptimizer?: boolean })?.ignoreFromOptimizer,
  );
}

/** Why an optimize run finished with zero ranked loadouts. */
export type OptimizerEmptyReason =
  | "no-inventory"
  | "no-set-echoes"
  | "filtered"
  | "none-found";

export const OPTIMIZER_EMPTY_REASON_MESSAGES: Record<
  OptimizerEmptyReason,
  string
> = {
  "no-inventory": "There are no echoes in your inventory",
  "no-set-echoes": "There are no echoes with the sets you chose",
  filtered:
    "There are no loadouts based on your filtering, such as minimum stat requirements",
  "none-found": "No loadouts were found",
};

/**
 * Pick the most specific empty-result explanation.
 * Call only when the run completed with zero results.
 */
export function resolveOptimizerEmptyReason(input: {
  inventoryCount: number;
  setFilteredCount: number;
  generatedCount: number;
}): OptimizerEmptyReason {
  if (input.inventoryCount <= 0) {
    return "no-inventory";
  }
  if (input.setFilteredCount <= 0) {
    return "no-set-echoes";
  }
  if (input.generatedCount > 0) {
    return "filtered";
  }
  return "none-found";
}

function echoOptimizerSignature(echo: any): string {
  if (!echo) return "";

  return [
    echo.echo ?? "",
    echo.echoSet ?? "",
    echo.type ?? "",
    echo.rank ?? "",
    echo.stat ?? "",
    echo.echoSubStatsType1 ?? "",
    echo.echoSubStatsValue1 ?? "",
    echo.echoSubStatsType2 ?? "",
    echo.echoSubStatsValue2 ?? "",
    echo.echoSubStatsType3 ?? "",
    echo.echoSubStatsValue3 ?? "",
    echo.echoSubStatsType4 ?? "",
    echo.echoSubStatsValue4 ?? "",
    echo.echoSubStatsType5 ?? "",
    echo.echoSubStatsValue5 ?? "",
  ]
    .map(String)
    .join(":");
}

export function normalizeOptimizerLoadout(loadout: any[]): any[] {
  if (!Array.isArray(loadout) || loadout.length <= 1) {
    return loadout;
  }

  const [mainEcho, ...otherEchoes] = loadout;
  return [
    mainEcho,
    ...otherEchoes
      .slice()
      .sort((a, b) =>
        echoOptimizerSignature(a).localeCompare(echoOptimizerSignature(b)),
      ),
  ];
}

export function getOptimizerLoadoutKey(loadout: any[]): string {
  const normalizedLoadout = normalizeOptimizerLoadout(loadout);
  return normalizedLoadout.map(echoOptimizerSignature).join("|");
}

/**
 * 53-bit string hash (the "cyrb53" algorithm), used so dedupe Sets store
 * compact values instead of retaining long keys. Deliberately avoids BigInt:
 * this runs once per generated loadout (10M+ times per optimizer run, across
 * every worker thread), and BigInt is heap-allocated/immutable in JS — every
 * multiply/xor here would allocate a new object. Profiling a real run showed
 * that allocation traffic dominating time in the native allocator's lock
 * (contended across all worker threads) rather than in loadout calculation.
 * This version uses only primitive int32 ops (Math.imul, xor, shifts) with
 * zero heap allocation, and the 53-bit output is small enough to store
 * exactly as a JS number (Set<number>, no boxing/string key needed) while
 * keeping collision risk negligible at this scale (birthday-bound expected
 * collisions across 10M loadouts is ~0.006, i.e. effectively never).
 */
export function hashOptimizerLoadoutKey(key: string): number {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < key.length; i++) {
    const ch = key.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/** Signature-equivalent uniqueness key stored as a compact numeric hash. */
export function getOptimizerLoadoutHash(loadout: any[]): number {
  return hashOptimizerLoadoutKey(getOptimizerLoadoutKey(loadout));
}

export function* generateLoadouts(
  echoes: any,
  mainEchoKeys: string[] = [],
  start = 0,
  combo: any[] = [],
  cost = 0,
  usedEchoIds: Set<unknown> = new Set(),
  usedEchoes: Set<unknown> = new Set(),
  loadoutFormat: OptimizerLoadoutFormat = "Any",
  remainingCosts?: Record<number, number> | null,
  /** Only process the shardIndex-th slice (mod shardCount) of the top-level branches. Used to
   * partition generation across multiple generator workers; defaults are a no-op for single-shard use. */
  shardIndex = 0,
  shardCount = 1,
): any {
  const format = normalizeLoadoutFormat(loadoutFormat);
  // Initialize remaining cost budget on the root call only
  let costsRemaining: Record<number, number> | null =
    remainingCosts === undefined ? getFormatCostCounts(format) : remainingCosts;

  // If we have main echo keys and combo is empty, we need to start with one of those
  if (mainEchoKeys.length > 0 && combo.length === 0) {
    // Find all echoes that match the main echo keys
    // @ts-ignore
    const mainEchoCopies = echoes.filter((e) => mainEchoKeys.includes(e.echo));

    // For each copy of the main echo, start a new combination
    for (let mainEchoIndex = 0; mainEchoIndex < mainEchoCopies.length; mainEchoIndex++) {
      if (shardCount > 1 && mainEchoIndex % shardCount !== shardIndex) continue;
      const mainEcho = mainEchoCopies[mainEchoIndex];
      // the main echo isn't guaranteed to be 4, sometimes it's an elite, so 3
      const mainCost = echoCost(mainEcho);
      if (!canUseEchoForFormat(costsRemaining, mainCost)) {
        continue;
      }
      const nextCost = cost + mainCost;
      if (nextCost <= 12) {
        // Create a fresh usedEchoIds Set for each main echo group
        const groupUsedEchoIds = new Set([mainEcho.echoId]);
        // add the main echo to the list of echoes already used so we dont try to use
        // another copy of the same echo
        const groupUsedEchoes = new Set([mainEcho.echo]);
        const groupRemainingCosts = costsRemaining
          ? { ...costsRemaining }
          : null;
        consumeFormatCost(groupRemainingCosts, mainCost);
        yield* generateLoadouts(
          echoes,
          mainEchoKeys,
          0,
          // @ts-ignore
          [mainEcho],
          nextCost,
          groupUsedEchoIds,
          groupUsedEchoes,
          format,
          groupRemainingCosts,
        );
      }
    }
    return;
  }

  // Format-constrained mode: only yield complete matching 5-echo loadouts
  if (costsRemaining) {
    if (isCompleteFormatLoadout(costsRemaining, combo.length)) {
      yield combo;
    }
  } else if (combo.length > 0 && combo.length <= 5 && cost <= 12) {
    // Any non-empty loadout with ≤5 echoes and total cost ≤12 is valid (cost may be under 12 even with
    // all five slots filled; it only must not exceed the 12 budget).
    yield combo;
  }

  // Stop exploring if combo already too big
  if (combo.length === 5 || cost >= 12) return;

  // If we have main echo keys and combo is empty, we've already handled the first slot
  if (mainEchoKeys.length > 0 && combo.length === 0) return;

  // Shard only the true root call (no main echo keys, nothing chosen yet) — nested recursive
  // calls always have a non-empty combo and must process every branch beneath their anchor.
  const isRootCall = mainEchoKeys.length === 0 && start === 0 && combo.length === 0;

  for (let i = start; i < echoes.length; i++) {
    if (isRootCall && shardCount > 1 && i % shardCount !== shardIndex) continue;
    const next = echoes[i];
    // Skip if already used
    if (usedEchoIds.has(next.echoId)) continue;
    // Skip if the echo has
    if (usedEchoes.has(next.echo)) continue;

    const nextEchoCost = echoCost(next);
    if (!canUseEchoForFormat(costsRemaining, nextEchoCost)) continue;

    const nextCost = cost + nextEchoCost;
    if (nextCost <= 12) {
      // Add to used set instead of filtering
      usedEchoIds.add(next.echoId);
      // Add the echo key instead of filtering
      usedEchoes.add(next.echo);
      consumeFormatCost(costsRemaining, nextEchoCost);
      // @ts-ignore
      combo.push(next); // Mutate instead of creating new array
      yield* generateLoadouts(
        echoes,
        mainEchoKeys,
        i + 1, // Can keep original index since we're not filtering
        combo,
        nextCost,
        usedEchoIds,
        usedEchoes,
        format,
        costsRemaining,
      );
      combo.pop(); // Backtrack
      usedEchoIds.delete(next.echoId); // Backtrack
      usedEchoes.delete(next.echo);
      restoreFormatCost(costsRemaining, nextEchoCost);
    }
  }
}

/**
 * Splits a user-chosen total worker count into generator vs. processor workers.
 * The generator's search-space partitioning only pays off with a few shards; most
 * of the budget should go to processor workers, which do the expensive per-loadout
 * stat/damage evaluation.
 */
export function splitOptimizerWorkerCount(total: number): {
  generatorCount: number;
  processorCount: number;
} {
  const generatorCount = total >= 32 ? 4 : total >= 16 ? 2 : 1;
  return { generatorCount, processorCount: Math.max(1, total - generatorCount) };
}

// Optimizer context interface - all data needed for optimization
export interface OptimizerContext {
  // Character data
  chosenChar: any;
  character: string;
  characterLevel: string | number;
  talentData: {
    basic: number;
    skill: number;
    forte: number;
    liberation: number;
    intro: number;
  };

  // Base stats
  baseHp: number;
  baseAtk: number;
  baseDef: number;

  // Weapon data
  weaponData: {
    attack: number;
    modifier: string | null;
    modifierValue: number;
    weaponPassiveStats: Record<string, any>;
    /** Raw passive definitions — only needed to resolve an advancedConfig-overridden weaponPassives config. */
    weaponPassiveDefs?: any[];
    refinement?: string;
  };

  // Buffs
  charBuffsData: Record<string, any>;
  charResonanceChainsData: Record<string, any>;
  teamBuffsData: Record<string, any>;
  customBuffs: Record<string, any>;
  echoSetPassivesConfig?: Record<string, { isEnabled?: boolean; stacks?: number }>;

  // Echo data
  echoStats: Record<string, any>;

  // Enemy data
  enemyLevel: number;
  enemyResist: number;
  enemyType: string;
  isSpectroFrazzleEnabled: boolean;
  spectroFrazzleStacks: number;
  isAeroErosionEnabled: boolean;
  aeroErosionStacks: number;
  isFusionBurstEnabled: boolean;
  fusionBurstStacks: number;
  isElectroFlareEnabled: boolean;
  electroFlareStacks: number;
  electroRageStacks: number;
  isGlacioChafeEnabled: boolean;
  glacioChafeStacks: number;
  havocBaneStacks: number;
  strainStacks: number;

  // Main echo
  mainEcho: string;
  mainEchoRank: number;

  // Rotations
  rotationsList: any[];

  // Computed stats (for fallback values)
  Glacio: number;
  Fusion: number;
  Electro: number;
  Aero: number;
  Spectro: number;
  Havoc: number;

  // Global data
  characters: Record<string, any>;

  // Character store data (for resonance chains and buffs config)
  activeCharacterBuffs: Record<string, any>;
  activeCharacterResonanceChains: Record<string, any>;
  activeStance?: string | null;

  // Helper function to get rotation by ID
  getRotationById: (character: string, rotationId: string) => any;

  // Progress callback (optional, for web workers)
  onProgress?: (processed: number) => void;
}

export interface OptimizerLoadoutStats {
  finalStats: any;
  combinedEchoBuffs: Record<string, number>;
  /** Loadout's own raw echo substats/main-stats — echoes only, no set bonuses or main-echo buff. */
  echoStats: Record<string, number>;
  /** The loadout's main echo's buff contribution, at the character's normal (non-overridden) config. */
  mainEchoBuff: Record<string, number>;
  setBonusOnePiece: string | null;
  setBonusOne: string | null;
  setBonusTwo: string | null;
}

/** Sums multiple `{ stat: value }` buff objects into one, key by key. */
function combineBuffObjects(...sources: Record<string, unknown>[]): Record<string, number> {
  const combined: Record<string, number> = {};
  sources.forEach((buffs) => {
    Object.keys(buffs ?? {}).forEach((key) => {
      combined[key] = (combined[key] ?? 0) + (Number(buffs[key]) || 0);
    });
  });
  return combined;
}

/**
 * Resolves one echo loadout's final stats: combines the loadout's own echo
 * stats/set bonuses/main-echo buff into `combinedEchoBuffs`, then runs the
 * shared `calculateFinalStatsFromBuffs` pipeline (stats.ts) against
 * loadout-independent buff data (`selfBuffsData`/`resonanceChainsBuffsData`,
 * computed once per optimizer run by the caller — see `optimize`). Shared by
 * `optimize()` here and `processor.worker.ts`'s `processLoadout`, which
 * previously each re-implemented this block independently and had drifted
 * (see the Augusta/`EchoDMGBonus` handling `calculateFinalStatsFromBuffs` now
 * owns for both).
 */
export function computeLoadoutFinalStats(
  loadout: any[],
  context: OptimizerContext,
  selfBuffsData: any,
  resonanceChainsBuffsData: any,
  echoSetPassiveBuffs: Record<string, any>,
  mainEchoStats: Record<string, any>,
): OptimizerLoadoutStats {
  const echoStats = getCombinedEchoStats(loadout);
  const echoSets = getSetsFromEchoes(loadout);
  const echoSetBonuses = getSetBonusEffects(echoSets);
  const setBonusOnePiece = echoSetBonuses?.setBonusOnePiece ?? null;
  const setBonusOne = echoSetBonuses?.setBonusOne ?? null;
  const setBonusTwo = echoSetBonuses?.setBonusTwo ?? null;
  const mainEchoKey = loadout[0]?.echo;
  const mainEchoBuff = mainEchoStats?.[mainEchoKey] ?? {};

  const setBonusOnePieceBuffs = echoSetPassiveBuffs?.[setBonusOnePiece as string] ?? {};
  const setBonusOneBuffs = echoSetPassiveBuffs?.[setBonusOne as string] ?? {};
  const setBonusTwoBuffs = echoSetPassiveBuffs?.[setBonusTwo as string] ?? {};
  const combinedEchoBuffs = combineBuffObjects(
    echoStats,
    mainEchoBuff,
    setBonusOnePieceBuffs,
    setBonusOneBuffs,
    setBonusTwoBuffs,
  );

  const { finalStats } = calculateFinalStatsFromBuffs({
    baseHp: context.baseHp,
    baseAtk: context.baseAtk,
    baseDef: context.baseDef,
    weaponAtk: context.weaponData?.attack,
    weaponModifier: context.weaponData?.modifier,
    weaponModifierValue: context.weaponData?.modifierValue,
    weaponPassiveData: context.weaponData?.weaponPassiveStats ?? {},
    buffsConfig: context.activeCharacterBuffs ?? {},
    resonanceChainsConfig: context.activeCharacterResonanceChains ?? {},
    customBuffs: context.customBuffs,
    teamBuffsData: context.teamBuffsData,
    echoStats: context.echoStats,
    buffsCharInfo: context.chosenChar?.buffs ?? [],
    resonanceChainsCharInfo: context.chosenChar?.resonanceChains ?? [],
    character: context.character ?? "",
    activeStance: context.activeStance ?? null,
    ignoreBuffs: { ignoreEchoes: true },
    setBonusLabels: [setBonusOnePiece, setBonusOne, setBonusTwo],
    echoSetPassivesConfig: context.echoSetPassivesConfig ?? {},
    selfBuffsData,
    resonanceChainsBuffsData,
    injectEchoStats: combinedEchoBuffs,
  });

  return {
    finalStats,
    combinedEchoBuffs,
    echoStats,
    mainEchoBuff,
    setBonusOnePiece,
    setBonusOne,
    setBonusTwo,
  };
}

/**
 * The one call site for `getCalculationContext`'s 50+ positional args, used
 * by both the `Attack` and `Rotation` optimizer targets (previously
 * duplicated verbatim between them, and again between `optimize()` and
 * `processor.worker.ts`).
 */
export function buildOptimizerCalculationContext(
  context: OptimizerContext,
  finalStats: any,
  combinedEchoBuffs: any,
): any {
  return getCalculationContext(
    context.chosenChar,
    combinedEchoBuffs, // use combinedEchoBuffs instead of echoStats
    context.teamBuffsData,
    context.talentData,
    context.isSpectroFrazzleEnabled,
    context.spectroFrazzleStacks,
    context.isAeroErosionEnabled,
    context.aeroErosionStacks,
    context.isFusionBurstEnabled,
    context.fusionBurstStacks,
    context.isElectroFlareEnabled,
    context.electroFlareStacks,
    context.electroRageStacks,
    context.isGlacioChafeEnabled,
    context.glacioChafeStacks,
    context.characterLevel,
    context.mainEcho,
    context.mainEchoRank,
    context.rotationsList,
    context.charResonanceChainsData,
    context.charBuffsData,
    context.baseHp,
    context.baseAtk,
    context.baseDef,
    context.weaponData,
    context.customBuffs,
    finalStats.glacio ?? context.Glacio,
    finalStats.fusion ?? context.Fusion,
    finalStats.electro ?? context.Electro,
    finalStats.aero ?? context.Aero,
    finalStats.spectro ?? context.Spectro,
    finalStats.havoc ?? context.Havoc,
    finalStats.totalDef,
    finalStats.totalHp,
    finalStats.energyRegen,
    finalStats.totalAtk,
    finalStats.basicAttackDMGBonus,
    finalStats.heavyAttackDMGBonus,
    finalStats.resonanceSkillDMGBonus,
    finalStats.introSkillDMGBonus,
    finalStats.outroSkillDMGBonus,
    finalStats.resonanceLiberationDMGBonus,
    finalStats.echoDMGBonus,
    finalStats.healingBonus,
    finalStats.shieldBonus,
    finalStats.totalCritRate,
    finalStats.totalCritDMG,
    finalStats.DefIgnore,
    context.havocBaneStacks,
    finalStats.resistReduction,
    finalStats.totalDeepenEffect,
    context.enemyLevel,
    context.enemyResist,
    context.characters,
    context.character,
    context.enemyType,
    context.strainStacks,
  );
}

/** Loadout-independent buff data for one rotation action's per-buff `advancedConfig` override. */
export interface OverrideBuffVariant {
  selfBuffsData: any;
  resonanceChainsBuffsData: any;
  teamBuffsData: any;
  weaponPassiveStats: Record<string, any>;
  echoSetPassivesConfig: Record<string, { isEnabled?: boolean; stacks?: number }>;
}

/**
 * Precomputes one buff-data variant per override action — once per optimizer
 * run, not per loadout — by merging the action's `advancedConfig` onto the
 * character's stored build data (`applyAdvancedOverrides`, the same
 * mechanism `characterRotation.ts` uses) and re-resolving self buffs,
 * resonance chains, team buffs, and weapon passives against the merged
 * config. Mirrors `buildCharacterContext.ts`'s team-buff resolution exactly
 * so results agree with what the Character Rotation display would show for
 * the same override. Echo set passives are only merged as raw *config* here
 * (`echoSetPassivesConfig`) — which set-bonus definitions actually apply
 * depends on the loadout under test, so resolving them into stats happens
 * per loadout in `scoreOptimizerRotation` instead.
 */
export function computeOverrideBuffVariants(
  overrideActions: OptimizerRotationOverrideAction[],
  context: OptimizerContext,
): Map<string, OverrideBuffVariant> {
  const variants = new Map<string, OverrideBuffVariant>();
  const characterData = context.characters?.[context.character] ?? {};

  for (const { actionId, advancedConfig } of overrideActions) {
    const merged = applyAdvancedOverrides(characterData, advancedConfig);

    const selfBuffsData = computeSelfBuffs(
      merged.buffs ?? {},
      context.chosenChar?.buffs ?? [],
      merged.resonanceChains ?? {},
      context.talentData ?? {},
      context.character ?? "",
      context.activeStance ?? null,
      { havocBaneStacks: context.havocBaneStacks ?? 0 },
    );
    const resonanceChainsBuffsData = computeResonanceChainsBuffs(
      merged.resonanceChains ?? {},
      context.chosenChar?.resonanceChains ?? [],
      context.talentData ?? {},
      context.activeStance ?? null,
    );

    // Team buffs: mirrors buildCharacterContext.ts's resolution exactly —
    // resolve every buff def from both selected teammates against the
    // merged per-buff config, then aggregate.
    const teamBuffsConfig = merged.teamBuffs ?? {};
    const teamBuffsBuffsConfig: Record<string, any> = teamBuffsConfig.buffs ?? {};
    const char1Buffs: TeamBuffDef[] = teamBuffsConfig.selectedCharacter1
      ? ((buffsByCharacter as Record<string, TeamBuffDef[]>)[teamBuffsConfig.selectedCharacter1] ?? [])
      : [];
    const char2Buffs: TeamBuffDef[] = teamBuffsConfig.selectedCharacter2
      ? ((buffsByCharacter as Record<string, TeamBuffDef[]>)[teamBuffsConfig.selectedCharacter2] ?? [])
      : [];
    const resolvedTeamBuffs = [...char1Buffs, ...char2Buffs].map((def) =>
      resolveTeamBuffInstance(
        def,
        teamBuffsBuffsConfig[def.key],
        context.character ?? "",
        {},
        teamBuffsBuffsConfig,
      ),
    );
    const teamBuffsData = aggregateTeamBuffStats(resolvedTeamBuffs);

    const weaponPassiveStats = computeWeaponPassiveStats(
      merged.weapon ?? null,
      context.weaponData?.weaponPassiveDefs ?? [],
      merged.weaponPassives ?? {},
      context.weaponData?.refinement ?? "1",
    );

    variants.set(actionId, {
      selfBuffsData,
      resonanceChainsBuffsData,
      teamBuffsData,
      weaponPassiveStats,
      echoSetPassivesConfig: merged.echoSetPassives ?? {},
    });
  }

  return variants;
}

/**
 * Scores one loadout's rotation damage: `plainAttacks` share the loadout's
 * already-computed `loadoutStats` via one batched `processAttacks` call
 * (the existing fast path, unchanged cost); each `overrideActions` entry
 * gets its own rebuilt `finalStats`/context using its precomputed
 * `OverrideBuffVariant` — recombining that loadout's raw echo stats/main-echo
 * buff with the override's echo-set-passive config (the only loadout-
 * dependent piece of an override) — and is scored as a single-attack call.
 * Results are merged back into `rotationData.actionOrder` before summing
 * aggregations, mirroring `characterRotation.ts`'s
 * `calcCharacterRotationDamage` exactly (order matters for the Optimizer's
 * results-panel breakdown too, not just the live Character Rotation display).
 */
export function scoreOptimizerRotation(
  rotationData: OptimizerRotationData,
  loadout: any[],
  loadoutStats: OptimizerLoadoutStats,
  context: OptimizerContext,
  overrideBuffVariants: Map<string, OverrideBuffVariant>,
): { attacks: any[]; damageAggregation: ReturnType<typeof aggregateRotationDamage> } {
  const { finalStats, combinedEchoBuffs } = loadoutStats;
  const attacksById = new Map<string, any>();
  let normalDamage: number | null = null;
  let avgDamage: number | null = null;
  let critDamage: number | null = null;
  let healing: number | null = null;
  let shield: number | null = null;

  const addAggregation = (agg: ReturnType<typeof aggregateRotationDamage>) => {
    if (agg.normalDamage != null) normalDamage = (normalDamage ?? 0) + agg.normalDamage;
    if (agg.avgDamage != null) avgDamage = (avgDamage ?? 0) + agg.avgDamage;
    if (agg.critDamage != null) critDamage = (critDamage ?? 0) + agg.critDamage;
    if (agg.healing != null) healing = (healing ?? 0) + agg.healing;
    if (agg.shield != null) shield = (shield ?? 0) + agg.shield;
  };

  if (rotationData.plainAttacks.length) {
    const optimizerContext = buildOptimizerCalculationContext(context, finalStats, combinedEchoBuffs);
    const attacks = processAttacks(
      rotationData.plainAttacks,
      optimizerContext,
      null,
      false,
      true,
      false,
      finalStats,
      combinedEchoBuffs,
    );
    attacks.forEach((attack: any) => attacksById.set(attack.id, attack));
    addAggregation(aggregateRotationDamage(attacks));
  }

  if (rotationData.overrideActions.length) {
    // Loadout-dependent but override-independent — computed once per
    // loadout, reused across every override action in this rotation.
    const echoSets = getSetsFromEchoes(loadout);
    const echoSetBonuses = getSetBonusEffects(echoSets);
    const setBonusOnePieceDef = echoSetBonuses?.setBonusOnePiece
      ? (setBonusEffectsOnePiece as Record<string, any>)[echoSetBonuses.setBonusOnePiece]
      : null;
    const setBonusOneDef = echoSetBonuses?.setBonusOne
      ? (setBonusEffectsOne as Record<string, any>)[echoSetBonuses.setBonusOne]
      : null;
    const setBonusTwoDef = echoSetBonuses?.setBonusTwo
      ? (setBonusEffectsTwo as Record<string, any>)[echoSetBonuses.setBonusTwo]
      : null;

    for (const { actionId, attack } of rotationData.overrideActions) {
      const variant = overrideBuffVariants.get(actionId);
      if (!variant) continue;

      const overrideCombinedEchoBuffs = combineBuffObjects(
        loadoutStats.echoStats,
        loadoutStats.mainEchoBuff,
        resolveSetBonusStats(setBonusOnePieceDef, variant.echoSetPassivesConfig, context.talentData),
        resolveSetBonusStats(setBonusOneDef, variant.echoSetPassivesConfig, context.talentData),
        resolveSetBonusStats(setBonusTwoDef, variant.echoSetPassivesConfig, context.talentData),
      );

      const { finalStats: overrideFinalStats } = calculateFinalStatsFromBuffs({
        baseHp: context.baseHp,
        baseAtk: context.baseAtk,
        baseDef: context.baseDef,
        weaponAtk: context.weaponData?.attack,
        weaponModifier: context.weaponData?.modifier,
        weaponModifierValue: context.weaponData?.modifierValue,
        weaponPassiveData: variant.weaponPassiveStats,
        buffsConfig: context.activeCharacterBuffs ?? {},
        resonanceChainsConfig: context.activeCharacterResonanceChains ?? {},
        customBuffs: context.customBuffs,
        teamBuffsData: variant.teamBuffsData,
        echoStats: context.echoStats,
        buffsCharInfo: context.chosenChar?.buffs ?? [],
        resonanceChainsCharInfo: context.chosenChar?.resonanceChains ?? [],
        character: context.character ?? "",
        activeStance: context.activeStance ?? null,
        ignoreBuffs: { ignoreEchoes: true },
        setBonusLabels: [
          loadoutStats.setBonusOnePiece,
          loadoutStats.setBonusOne,
          loadoutStats.setBonusTwo,
        ],
        echoSetPassivesConfig: variant.echoSetPassivesConfig,
        selfBuffsData: variant.selfBuffsData,
        resonanceChainsBuffsData: variant.resonanceChainsBuffsData,
        injectEchoStats: overrideCombinedEchoBuffs,
      });

      const optimizerContext = buildOptimizerCalculationContext(
        context,
        overrideFinalStats,
        overrideCombinedEchoBuffs,
      );
      const attacks = processAttacks(
        [attack],
        optimizerContext,
        null,
        false,
        true,
        false,
        overrideFinalStats,
        overrideCombinedEchoBuffs,
      );
      attacks.forEach((a: any) => attacksById.set(a.id, a));
      addAggregation(aggregateRotationDamage(attacks));
    }
  }

  const orderedAttacks = rotationData.actionOrder
    .map((actionId) => attacksById.get(actionId))
    .filter((attack) => attack !== undefined);

  return {
    attacks: orderedAttacks,
    damageAggregation: { normalDamage, avgDamage, critDamage, healing, shield },
  };
}

export function optimize(
  echoes: any[],
  context: OptimizerContext,
  // TODO: allowedSets is unused
  // @ts-ignore
  allowedSets: string[] = [],
  topN: number = 5,
  mainEchoKeys: string[] = [],
  minStats: any[] = [],
  echoSetPassiveBuffs: Record<string, any> = {},
  mainEchoStats: Record<string, any> = {},
  target: string = "ATK",
  damageType: string = "Average",
) {
  // Min-heap for topN results
  const heap: any[] = [];
  const seenCombinations = new Set<number>(); // Track unique combinations

  // get info on our target
  const targetElements = target.split(":");
  const [targetType, targetObject] = targetElements;
  // if it's an attack, get the attack info, the targetObject is Type|skillkey
  let attackData;
  if (targetType === "Attack") {
    const [attackType, attackKey] = targetObject.split("|");
    const attackInfo = getAttackData(context.chosenChar, attackType, attackKey);
    let actionTypeForAttackData;
    switch (attackType) {
      case "basicAttacks":
        actionTypeForAttackData = "basic";
        break;
      case "skillAttacks":
        actionTypeForAttackData = "skill";
        break;
      case "forteCircuitAttacks":
        actionTypeForAttackData = "forte";
        break;
      case "liberationAttacks":
        actionTypeForAttackData = "liberation";
        break;
      case "introAttacks":
        actionTypeForAttackData = "intro";
        break;
      case "tuneBreakAttacks":
        actionTypeForAttackData = "tuneBreak";
        break;
      case "outroAttacks":
        actionTypeForAttackData = "outro";
        break;
    }
    attackData = {
      actionType: actionTypeForAttackData,
      buffs: null,
      count: 1,
      excludeTeamBuffs: false,
      excludeWeaponBuffs: false,
      key: attackKey,
      label: attackInfo.label,
      talents: attackInfo.talents,
      talent: attackInfo?.talent,
      type: attackInfo.type,
      subType: attackInfo.subType,
      element: attackInfo.element,
      attribute: attackInfo?.attribute ?? null,
      alwaysCrit: attackInfo?.alwaysCrit ?? false,
    };
    if (!attackData) {
      console.error("Could not find the attack data chosen");
      return;
    }
  }

  let rotationData: OptimizerRotationData | undefined;
  if (targetType === "Rotation") {
    const rotationId = targetObject;
    const rotation = context.getRotationById(context.character, rotationId);
    rotationData = buildOptimizerRotationData(
      { ...rotation, id: rotationId },
      context.chosenChar,
      context.characterLevel,
    );
  }

  // get the mapping of the damage target
  // we'll use this to get the damage out of the damage calculation (Normal/Avg/Crit)
  // default to average if we didn't match anything
  let damageTargetReference;
  if (targetType === "Attack") {
    const damageTargetMap = {
      Normal: "totalDamage",
      Average: "avgDamage",
      Crit: "critDamage",
    };
    // @ts-ignore
    damageTargetReference = damageTargetMap[damageType] ?? "avgDamage";
    // @ts-ignore
    if (targetType === "Attack" && attackData.type === "Shield") {
      damageTargetReference = "shieldAmount";
    }
    // @ts-ignore
    if (targetType === "Attack" && attackData.type === "Healing") {
      damageTargetReference = "healAmount";
    }
  }
  if (targetType === "Rotation") {
    const damageTargetMap = {
      Normal: "normalDamage",
      Average: "avgDamage",
      Crit: "critDamage",
    };
    // @ts-ignore
    damageTargetReference = damageTargetMap[damageType] ?? "avgDamage";
  }

  // Echo-independent buffs — compute once for the whole run
  const resonanceChainsBuffsData = computeResonanceChainsBuffs(
    context.activeCharacterResonanceChains ?? {},
    context.chosenChar?.resonanceChains ?? [],
    context.talentData ?? {},
    context.activeStance ?? null,
  );
  const selfBuffsData = computeSelfBuffs(
    context.activeCharacterBuffs ?? {},
    context.chosenChar?.buffs ?? [],
    context.activeCharacterResonanceChains ?? {},
    context.talentData ?? {},
    context.character ?? null,
    context.activeStance ?? null,
    { havocBaneStacks: context.havocBaneStacks ?? 0 },
  );
  const overrideBuffVariants = rotationData?.overrideActions.length
    ? computeOverrideBuffVariants(rotationData.overrideActions, context)
    : new Map<string, OverrideBuffVariant>();

  // @ts-ignore
  for (const loadout of generateLoadouts(echoes, mainEchoKeys)) {
    const combinationHash = getOptimizerLoadoutHash(loadout);

    // Skip if we've already seen this combination
    if (seenCombinations.has(combinationHash)) {
      continue;
    }

    const loadoutStats = computeLoadoutFinalStats(
      loadout,
      context,
      selfBuffsData,
      resonanceChainsBuffsData,
      echoSetPassiveBuffs,
      mainEchoStats,
    );
    const { finalStats, combinedEchoBuffs } = loadoutStats;

    // if we have some min stats, check them before we add them to the list of usable loadouts
    let isMeetingMinRequirements = true;
    if (minStats.length > 0) {
      for (const minStat of minStats) {
        const statValue = finalStats?.[minStat.stat];
        if (
          !meetsMinStatThreshold(statValue, minStat.minValue, minStat.stat)
        ) {
          isMeetingMinRequirements = false;
          break;
        }
      }
    }
    // drop this loadout if it didnt meet the min requirements
    if (!isMeetingMinRequirements) {
      continue;
    }

    seenCombinations.add(combinationHash);

    let targetValue = 0;
    let resultContext: any = {
      finalStats,
      targetType,
      targetObject,
    };
    // normalizeOptimizerLoadout already returns a fresh array (not the
    // generator's mutable backtracking `combo`), so no clone is needed to
    // protect against later push/pop — see the same fix in processor.worker.ts.
    const loadoutArr = normalizeOptimizerLoadout(loadout);
    if (targetType === "Stat") {
      // get the stat wer'e looking for from our final stats
      targetValue = finalStats?.[targetObject] ?? 0;
    } else if (targetType === "Attack") {
      // TODO: We need to pass in the stats we have on-hand from the loadout
      // and not use the stats that the current user has
      // INFO: It works as it is right now, and the damages match, which is good
      // Build context from optimizer's finalStats
      const optimizerContext = buildOptimizerCalculationContext(
        context,
        finalStats,
        combinedEchoBuffs,
      );
      const attacks = processAttacks(
        [attackData], // attacks list, just the one since we're just doing 1 attack to optimize
        optimizerContext,
        null, // talentType = null since it will be figured out dynamically
        false, // hasNoTalentType = no, unless it's outro (TODO)
        true, // dynamicTalentType = yes, this will figure out the talent data for us
        false, // excludeDisabledAttacks = no, unless we need to (TODO)
        finalStats, // give our stats, it will use this instead of the global state
        combinedEchoBuffs, // provide the echoes so we can exclude them if needed
      );
      targetValue = attacks?.[0]?.damage?.[damageTargetReference] ?? 0;
      resultContext.attacks = attacks;
      // console.log(
      //   targetValue,
      //   attacks,
      //   JSON.parse(JSON.stringify(loadout)),
      //   finalStats,
      // );
      // console.log("==============================");
    } else if (targetType === "Rotation" && rotationData) {
      const { attacks, damageAggregation } = scoreOptimizerRotation(
        rotationData,
        loadout,
        loadoutStats,
        context,
        overrideBuffVariants,
      );
      const rotationInfo: any = {
        id: rotationData.id,
        name: rotationData.name,
        description: rotationData.description,
        duration: rotationData.duration ?? null,
        echo: rotationData.echo ?? null,
        attacks,
        damageAggregation,
      };
      targetValue = (damageAggregation as any)?.[damageTargetReference] ?? 0;
      resultContext.attacks = rotationInfo;
    }
    // Call progress callback if provided
    if (context.onProgress) {
      context.onProgress(seenCombinations.size);
    }

    if (heap.length < topN) {
      heap.push({
        loadout: loadoutArr,
        targetValue,
        context: resultContext,
        id: randomString(),
      });
      heap.sort((a, b) => a.targetValue - b.targetValue); // min at index 0
    } else if (targetValue > heap[0].targetValue) {
      heap[0] = {
        loadout: loadoutArr,
        targetValue,
        context: resultContext,
        id: randomString(),
      };
      heap.sort((a, b) => a.targetValue - b.targetValue);
    }
  }

  return heap.sort((a, b) => b.targetValue - a.targetValue); // descending
}
