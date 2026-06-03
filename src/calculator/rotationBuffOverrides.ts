import { processCustomBuffsFromStore } from "./customBuffsFromStore";
import { calculateAllStats } from "./stats";
import { filterBuffsForStance, resolveActiveStance } from "./stances";
import { getCharByName } from "../characters/characters";
import {
  buildEchoStatsFromCharacterStore,
  buildWeaponDataFromCharacterStore,
  finalStatsToPerformerStats,
  type PerformerAttackContext,
} from "./rotationPerformer";
import { computeTeamBuffsDataFromStore } from "./teamBuffsFromStore";
import type { EchoObject } from "../echoes/stats";
import {
  clampSelfBuffStacks,
  type BuffConfigSlice,
} from "./effectiveSelfBuffStacks";
import {
  buildPerformerBuildDebug,
  countResolvedEchoSlots,
} from "./performerBuildDebug";

export function createGetEchoByIdFromInventory(
  inventoryEchoes: Array<{ echoId?: string | null } & Record<string, unknown>>,
): (echoId: string) => EchoObject | undefined {
  const byId = new Map<string, EchoObject>();
  for (const echo of inventoryEchoes) {
    const echoId = echo?.echoId;
    if (echoId) {
      byId.set(String(echoId), echo as EchoObject);
    }
  }
  return (echoId: string) => byId.get(echoId);
}

export type BuffOverrideEntry = {
  isEnabled?: boolean;
  stacks?: number;
};

export type RotationActionBuffOverrides = {
  selfBuffs?: Record<string, BuffOverrideEntry>;
  resonanceChains?: Record<string, BuffOverrideEntry>;
  weaponPassives?: Record<string, BuffOverrideEntry>;
  echoSetPassives?: Record<string, BuffOverrideEntry>;
  mainEcho?: BuffOverrideEntry;
};

type StoreBuffConfig = Record<
  string,
  { isEnabled?: boolean; stacks?: number }
>;

export function mergeBuffConfigWithOverrides(
  storeConfig: StoreBuffConfig = {},
  overrides?: Record<string, BuffOverrideEntry>,
  disableAll = false,
): StoreBuffConfig {
  const result: StoreBuffConfig = JSON.parse(JSON.stringify(storeConfig ?? {}));
  const keys = new Set([
    ...Object.keys(result),
    ...Object.keys(overrides ?? {}),
  ]);
  keys.forEach((key) => {
    if (!result[key]) {
      result[key] = {};
    }
    if (disableAll) {
      result[key].isEnabled = false;
      return;
    }
    const entry = overrides?.[key];
    if (!entry) {
      return;
    }
    if (entry.isEnabled !== undefined) {
      result[key].isEnabled = entry.isEnabled;
    }
    if (entry.stacks !== undefined) {
      result[key].stacks = entry.stacks;
    }
  });
  return result;
}

export function legacyExcludesToOverrides(action: Record<string, unknown>): {
  overrides: RotationActionBuffOverrides;
  hasLegacy: boolean;
} {
  const overrides: RotationActionBuffOverrides = {};
  let hasLegacy = false;
  if (action.excludeSelfBuffs) {
    overrides.selfBuffs = { __disableAll: { isEnabled: false } };
    hasLegacy = true;
  }
  if (action.excludeWeaponBuffs) {
    overrides.weaponPassives = { __disableAll: { isEnabled: false } };
    hasLegacy = true;
  }
  return { overrides, hasLegacy };
}

export function actionNeedsCustomBuild(action: Record<string, unknown>): boolean {
  const buffOverrides = action.buffOverrides as
    | RotationActionBuffOverrides
    | undefined;
  if (buffOverrides) {
    if (
      buffOverrides.selfBuffs &&
      Object.keys(buffOverrides.selfBuffs).length > 0
    ) {
      return true;
    }
    if (
      buffOverrides.resonanceChains &&
      Object.keys(buffOverrides.resonanceChains).length > 0
    ) {
      return true;
    }
    if (
      buffOverrides.weaponPassives &&
      Object.keys(buffOverrides.weaponPassives).length > 0
    ) {
      return true;
    }
    if (
      buffOverrides.echoSetPassives &&
      Object.keys(buffOverrides.echoSetPassives).length > 0
    ) {
      return true;
    }
    if (buffOverrides.mainEcho !== undefined) {
      return true;
    }
  }
  return Boolean(action.excludeSelfBuffs || action.excludeWeaponBuffs);
}

function countOverrideMap(
  map?: Record<string, BuffOverrideEntry>,
): number {
  if (!map) {
    return 0;
  }
  if (map.__disableAll) {
    return 1;
  }
  return Object.keys(map).filter((k) => k !== "__disableAll").length;
}

export function countBuildOverrideEntries(
  overrides: RotationActionBuffOverrides,
): number {
  let count = 0;
  count += countOverrideMap(overrides.selfBuffs);
  count += countOverrideMap(overrides.resonanceChains);
  count += countOverrideMap(overrides.weaponPassives);
  count += countOverrideMap(overrides.echoSetPassives);
  if (overrides.mainEcho !== undefined) {
    count += 1;
  }
  return count;
}

/** True when this action uses per-action build overrides (including legacy exclude flags). */
export function hasActiveBuildOverrides(
  action: Record<string, unknown>,
): boolean {
  if (action.excludeSelfBuffs || action.excludeWeaponBuffs) {
    return true;
  }
  const overrides = action.buffOverrides as
    | RotationActionBuffOverrides
    | undefined;
  if (!overrides) {
    return false;
  }
  return countBuildOverrideEntries(overrides) > 0;
}

function resolveMainEchoForBuild(
  charStore: Record<string, unknown>,
  overrides?: RotationActionBuffOverrides,
): { echo?: string; isEnabled?: boolean; stacks?: number } {
  const mainEchoEntry = (charStore.mainEcho ?? {}) as {
    echo?: string;
    isEnabled?: boolean;
    stacks?: number;
  };
  const mainOverride = overrides?.mainEcho;
  if (!mainOverride) {
    return mainEchoEntry;
  }
  return {
    ...mainEchoEntry,
    isEnabled:
      mainOverride.isEnabled !== undefined
        ? mainOverride.isEnabled
        : mainEchoEntry.isEnabled,
    stacks:
      mainOverride.stacks !== undefined
        ? mainOverride.stacks
        : mainEchoEntry.stacks,
  };
}

function clampSelfBuffsConfigForAction(
  characterKey: string,
  buffsConfig: StoreBuffConfig,
  resonanceChainsConfig: BuffConfigSlice,
  buffDefinitions: Array<{
    key: string;
    maxStacks?: number;
    minStacks?: number;
  }>,
): StoreBuffConfig {
  const result: StoreBuffConfig = JSON.parse(JSON.stringify(buffsConfig));
  buffDefinitions.forEach((def) => {
    const entry = result[def.key];
    if (!entry) {
      return;
    }
    const currentStacks = entry.stacks ?? 0;
    entry.stacks = clampSelfBuffStacks(
      {
        character: characterKey,
        buffKey: def.key,
        baseMaxStacks: def.maxStacks,
        baseMinStacks: def.minStacks,
        buffsConfig: result,
        resonanceChainsConfig,
      },
      currentStacks,
    );
  });
  return result;
}

function applyCategoryDisableAll(
  overrides: Record<string, BuffOverrideEntry> | undefined,
): { perBuff: Record<string, BuffOverrideEntry>; disableAll: boolean } {
  if (!overrides) {
    return { perBuff: {}, disableAll: false };
  }
  if (overrides.__disableAll) {
    return { perBuff: {}, disableAll: true };
  }
  return { perBuff: overrides, disableAll: false };
}

/**
 * Full character build for one rotation action: store data + per-action overrides,
 * always computed fresh (no cached stat snapshots).
 */
export async function computeRotationActionBuildContext(
  characterKey: string,
  charStore: Record<string, unknown>,
  liveTeamBuffsData: Record<string, unknown>,
  liveCustomBuffs: Record<string, unknown>,
  buffOverrides?: RotationActionBuffOverrides | null,
  legacyAction?: Record<string, unknown>,
  charactersStore?: Record<string, Record<string, unknown>>,
  activeCharacterKey?: string,
  getEchoById?: (echoId: string) => EchoObject | undefined,
): Promise<PerformerAttackContext> {
  const chosenChar = (await getCharByName(characterKey)) as Record<
    string,
    unknown
  >;
  const mergedLegacy = legacyAction
    ? legacyExcludesToOverrides(legacyAction)
    : { overrides: {}, hasLegacy: false };
  const effectiveOverrides: RotationActionBuffOverrides = {
    ...(mergedLegacy.hasLegacy ? mergedLegacy.overrides : {}),
    ...buffOverrides,
  };

  const selfCat = applyCategoryDisableAll(effectiveOverrides.selfBuffs);
  const chainCat = applyCategoryDisableAll(effectiveOverrides.resonanceChains);
  const weaponCat = applyCategoryDisableAll(effectiveOverrides.weaponPassives);
  const echoSetCat = applyCategoryDisableAll(effectiveOverrides.echoSetPassives);

  const isActivePerformer =
    !activeCharacterKey || characterKey === activeCharacterKey;

  const resonanceChainsConfig = mergeBuffConfigWithOverrides(
    (charStore.resonanceChains ?? {}) as StoreBuffConfig,
    chainCat.perBuff,
    chainCat.disableAll,
  );
  let buffsConfig = mergeBuffConfigWithOverrides(
    (charStore.buffs ?? {}) as StoreBuffConfig,
    selfCat.perBuff,
    selfCat.disableAll,
  );
  buffsConfig = clampSelfBuffsConfigForAction(
    characterKey,
    buffsConfig,
    resonanceChainsConfig,
    (chosenChar.buffs ?? []) as Array<{
      key: string;
      maxStacks?: number;
      minStacks?: number;
    }>,
  );
  const weaponPassivesConfig = mergeBuffConfigWithOverrides(
    (charStore.weaponPassives ?? {}) as StoreBuffConfig,
    weaponCat.perBuff,
    weaponCat.disableAll,
  );
  const echoSetPassivesConfig = mergeBuffConfigWithOverrides(
    (charStore.echoSetPassives ?? {}) as StoreBuffConfig,
    echoSetCat.perBuff,
    echoSetCat.disableAll,
  );

  const characterLevel = String(charStore.characterLevel ?? "90");
  const storeTalents = (charStore.talents ?? {}) as Record<string, string | number>;
  const stances = (chosenChar?.basic as { stances?: unknown })?.stances ?? [];
  const talentData = {
    basic: storeTalents.basic ?? 10,
    skill: storeTalents.skill ?? 10,
    forte: storeTalents.forte ?? 10,
    liberation: storeTalents.liberation ?? 10,
    intro: storeTalents.intro ?? 10,
  };
  const activeStance =
    resolveActiveStance(
      stances as never,
      (charStore.activeStance as string | undefined) ?? undefined,
      charStore.buffs as Record<string, { isEnabled?: boolean }> | undefined,
    ) ?? undefined;

  const baseLevelStats = ((
    chosenChar as {
      getCharacterStatsByLevel?: (level: string) => {
        hp: number;
        attack: number;
        defense: number;
      };
    }
  )?.getCharacterStatsByLevel?.(characterLevel) ?? {
    hp: 0,
    attack: 0,
    defense: 0,
  });

  const resolveEchoById = getEchoById ?? (() => undefined);
  const mainEchoState = resolveMainEchoForBuild(charStore, effectiveOverrides);
  const storeForEchoWeapon = {
    ...charStore,
    mainEcho: mainEchoState,
    echoSetPassives: echoSetPassivesConfig,
    weaponPassives: weaponPassivesConfig,
  };

  const echoStats = buildEchoStatsFromCharacterStore(
    characterKey,
    storeForEchoWeapon,
    resolveEchoById,
  );

  const weaponData = await buildWeaponDataFromCharacterStore(
    characterKey,
    storeForEchoWeapon,
    chosenChar,
  );

  const performerTeamBuffsData = isActivePerformer
    ? liveTeamBuffsData
    : charactersStore
      ? computeTeamBuffsDataFromStore(characterKey, charactersStore, {
          partyConfigCharacterKey:
            activeCharacterKey && activeCharacterKey !== characterKey
              ? activeCharacterKey
              : characterKey,
        })
      : {};
  const performerCustomBuffs = isActivePerformer
    ? liveCustomBuffs
    : processCustomBuffsFromStore(
        charStore.customBuffs as Record<string, unknown> | undefined,
      );

  const buffsCharInfo = filterBuffsForStance(
    (chosenChar.buffs ?? []) as never,
    activeStance,
  );
  const resonanceChainsCharInfo = filterBuffsForStance(
    (chosenChar.resonanceChains ?? []) as never,
    activeStance,
  );

  const calculated = calculateAllStats({
    baseHp: baseLevelStats.hp,
    baseAtk: baseLevelStats.attack,
    baseDef: baseLevelStats.defense,
    weaponAtk: weaponData.attack,
    weaponModifier: weaponData.modifier,
    weaponModifierValue: weaponData.modifierValue,
    weaponPassiveData: weaponData.weaponPassiveStats,
    buffsConfig,
    resonanceChainsConfig,
    customBuffs: performerCustomBuffs,
    teamBuffsData: performerTeamBuffsData,
    echoStats,
    buffsCharInfo,
    resonanceChainsCharInfo,
    character: characterKey,
    talentData,
    activeStance,
  });

  const { resolvedEchoSlotCount, inventoryEchoLookups } = countResolvedEchoSlots(
    charStore,
    resolveEchoById,
  );

  return {
    performerCharacterKey: characterKey,
    performerStats: finalStatsToPerformerStats(calculated.finalStats),
    performerTalentData: talentData,
    performerBuffs: {
      charBuffsData: calculated.selfBuffsData ?? {},
      charResonanceChainsData: calculated.resonanceChainsBuffsData ?? {},
    },
    performerChosenChar: chosenChar,
    performerMainEcho: mainEchoState.echo ?? null,
    performerMainEchoRank:
      (charStore.mainEcho as { rank?: number })?.rank ?? 5,
    performerTeamBuffsData,
    performerCustomBuffs,
    performerEchoStats: echoStats,
    performerWeaponPassiveStats: weaponData.weaponPassiveStats ?? {},
    performerBuildDebug: buildPerformerBuildDebug({
      performerCharacterKey: characterKey,
      echoStatsSource: "computed",
      weaponStatsSource: "computed",
      resolvedEchoSlotCount,
      inventoryEchoLookups,
      finalStats: calculated.finalStats as Record<string, unknown>,
      echoStats,
      weaponData,
      selfBuffsData: (calculated.selfBuffsData ?? {}) as Record<string, unknown>,
      resonanceChainsBuffsData: (calculated.resonanceChainsBuffsData ??
        {}) as Record<string, unknown>,
      teamBuffsData: performerTeamBuffsData,
    }),
  };
}
