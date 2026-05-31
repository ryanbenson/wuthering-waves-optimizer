import { getCharByName } from "../characters/characters";
import type { EchoObject } from "../echoes/stats";
import { computeCharacterBuildFromStore } from "./computeCharacterBuildFromStore";
import { processCustomBuffsFromStore } from "./customBuffsFromStore";
import type { PerformerBuildDebug } from "./performerBuildDebug";
import {
  finalStatsToPerformerStats,
  manualStatsToPerformerStats,
  type RotationPerformerManualStats,
} from "./performerStatsMapping";

export type RotationPerformerConfig = {
  useSavedBuild?: boolean;
  mainEcho?: string | null;
  mainEchoRank?: number | string | null;
  manualStats?: RotationPerformerManualStats | null;
};

export type TeamBuffsState = {
  selectedCharacter1?: string | null;
  selectedCharacter2?: string | null;
  rotationPerformers?: Record<string, RotationPerformerConfig>;
};

export type PerformerAttackContext = {
  performerCharacterKey: string;
  performerStats: Record<string, unknown>;
  performerTalentData: {
    basic: string | number;
    skill: string | number;
    forte: string | number;
    liberation: string | number;
    intro: string | number;
  };
  performerBuffs: {
    charBuffsData: Record<string, unknown>;
    charResonanceChainsData: Record<string, unknown>;
  };
  performerChosenChar: Record<string, unknown>;
  performerMainEcho: string | null;
  performerMainEchoRank: number | string;
  performerTeamBuffsData?: Record<string, unknown>;
  performerCustomBuffs?: Record<string, unknown>;
  performerEchoStats?: Record<string, unknown>;
  performerWeaponPassiveStats?: Record<string, unknown>;
  performerBuildDebug?: PerformerBuildDebug;
};

type CharacterStoreEntry = Record<string, unknown>;

export function getRotationPerformerConfig(
  characterKey: string,
  teamBuffs: TeamBuffsState,
): RotationPerformerConfig {
  return teamBuffs.rotationPerformers?.[characterKey] ?? {};
}

/** Manual rotation performer stats (party tab override). */
export async function buildManualPerformerContextFromStore(
  performerCharacterKey: string,
  charStore: CharacterStoreEntry,
  performerConfig: RotationPerformerConfig,
): Promise<PerformerAttackContext | null> {
  if (performerConfig.useSavedBuild !== false) {
    return null;
  }
  const chosenChar = (await getCharByName(performerCharacterKey)) as Record<
    string,
    unknown
  >;
  const storeTalents = (charStore.talents ?? {}) as Record<string, string | number>;
  const talentData = {
    basic: storeTalents.basic ?? 10,
    skill: storeTalents.skill ?? 10,
    forte: storeTalents.forte ?? 10,
    liberation: storeTalents.liberation ?? 10,
    intro: storeTalents.intro ?? 10,
  };
  const performerMainEcho =
    performerConfig.mainEcho ??
    ((charStore.mainEcho as { echo?: string })?.echo ?? null);
  const performerMainEchoRank =
    performerConfig.mainEchoRank ??
    (charStore.mainEcho as { rank?: number })?.rank ??
    5;

  return {
    performerCharacterKey,
    performerStats: manualStatsToPerformerStats(
      performerConfig.manualStats ?? {},
    ),
    performerTalentData: talentData,
    performerBuffs: {
      charBuffsData: {},
      charResonanceChainsData: {},
    },
    performerChosenChar: chosenChar,
    performerMainEcho,
    performerMainEchoRank,
    performerTeamBuffsData: {},
    performerCustomBuffs: {},
    performerEchoStats: {},
    performerWeaponPassiveStats: {},
  };
}

/** Store-only performer context (no Pinia / Vue). Safe for web workers. */
export async function buildPerformerAttackContextFromStore(
  performerCharacterKey: string,
  activeCharacterKey: string,
  charactersStore: Record<string, CharacterStoreEntry>,
  getEchoById: (echoId: string) => EchoObject | undefined,
  activeTeamBuffsData?: Record<string, unknown>,
): Promise<PerformerAttackContext | null> {
  if (!performerCharacterKey || performerCharacterKey === activeCharacterKey) {
    return null;
  }
  const charStore = charactersStore[performerCharacterKey] ?? {};
  const chosenChar = (await getCharByName(performerCharacterKey)) as Record<
    string,
    unknown
  >;
  const teamBuffs = (charactersStore[activeCharacterKey]?.teamBuffs ??
    {}) as TeamBuffsState;
  const performerConfig = getRotationPerformerConfig(
    performerCharacterKey,
    teamBuffs,
  );
  if (performerConfig.useSavedBuild === false) {
    const manual = await buildManualPerformerContextFromStore(
      performerCharacterKey,
      charStore,
      performerConfig,
    );
    if (manual) {
      return manual;
    }
  }

  const build = await computeCharacterBuildFromStore(
    performerCharacterKey,
    charStore,
    charactersStore,
    getEchoById,
    activeTeamBuffsData !== undefined
      ? { teamBuffsDataOverride: activeTeamBuffsData }
      : undefined,
  );
  const storeTalents = (charStore.talents ?? {}) as Record<string, string | number>;
  const talentData = {
    basic: storeTalents.basic ?? 10,
    skill: storeTalents.skill ?? 10,
    forte: storeTalents.forte ?? 10,
    liberation: storeTalents.liberation ?? 10,
    intro: storeTalents.intro ?? 10,
  };

  const performerTeamBuffsData = build.teamBuffsData;
  const performerCustomBuffs = processCustomBuffsFromStore(
    charStore.customBuffs as Record<string, unknown> | undefined,
  );
  const performerEchoStats = build.echoStats;
  const performerWeaponPassiveStats = build.weaponData.weaponPassiveStats ?? {};
  const performerStats = finalStatsToPerformerStats(build.calculated.finalStats);
  const charBuffsData = build.calculated.selfBuffsData ?? {};
  const charResonanceChainsData =
    build.calculated.resonanceChainsBuffsData ?? {};
  const performerBuildDebug = build.buildDebug;

  const performerMainEcho =
    performerConfig.mainEcho ??
    ((charStore.mainEcho as { echo?: string })?.echo ?? null);
  const performerMainEchoRank =
    performerConfig.mainEchoRank ??
    (charStore.mainEcho as { rank?: number })?.rank ??
    5;

  return {
    performerCharacterKey,
    performerStats,
    performerTalentData: talentData,
    performerBuffs: {
      charBuffsData,
      charResonanceChainsData,
    },
    performerChosenChar: chosenChar,
    performerMainEcho,
    performerMainEchoRank,
    performerTeamBuffsData,
    performerCustomBuffs,
    performerEchoStats,
    performerWeaponPassiveStats,
    performerBuildDebug,
  };
}
