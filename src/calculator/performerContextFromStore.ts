import { getCharByName } from "../characters/characters";
import type { EchoObject } from "../echoes/stats";
import { computeCharacterBuildFromStore } from "./computeCharacterBuildFromStore";
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
};

type CharacterStoreEntry = Record<string, unknown>;

function getRotationPerformerConfig(
  characterKey: string,
  teamBuffs: TeamBuffsState,
): RotationPerformerConfig {
  return teamBuffs.rotationPerformers?.[characterKey] ?? {};
}

/** Store-only performer context (no Pinia / Vue). Safe for web workers. */
export async function buildPerformerAttackContextFromStore(
  performerCharacterKey: string,
  activeCharacterKey: string,
  charactersStore: Record<string, CharacterStoreEntry>,
  getEchoById: (echoId: string) => EchoObject | undefined,
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
  const storeTalents = (charStore.talents ?? {}) as Record<string, string | number>;
  const talentData = {
    basic: storeTalents.basic ?? 10,
    skill: storeTalents.skill ?? 10,
    forte: storeTalents.forte ?? 10,
    liberation: storeTalents.liberation ?? 10,
    intro: storeTalents.intro ?? 10,
  };

  let performerStats: Record<string, unknown>;
  let charBuffsData: Record<string, unknown> = {};
  let charResonanceChainsData: Record<string, unknown> = {};
  let performerTeamBuffsData: Record<string, unknown> = {};
  let performerCustomBuffs: Record<string, unknown> = {};
  let performerEchoStats: Record<string, unknown> = {};
  let performerWeaponPassiveStats: Record<string, unknown> = {};

  if (performerConfig.useSavedBuild !== false) {
    const build = await computeCharacterBuildFromStore(
      performerCharacterKey,
      charStore,
      charactersStore,
      getEchoById,
    );
    performerTeamBuffsData = build.teamBuffsData;
    performerCustomBuffs = (charStore.customBuffs ?? {}) as Record<
      string,
      unknown
    >;
    performerEchoStats = build.echoStats;
    performerWeaponPassiveStats = build.weaponData.weaponPassiveStats ?? {};
    performerStats = finalStatsToPerformerStats(build.calculated.finalStats);
    charBuffsData = build.calculated.selfBuffsData ?? {};
    charResonanceChainsData =
      build.calculated.resonanceChainsBuffsData ?? {};
  } else {
    performerStats = manualStatsToPerformerStats(
      performerConfig.manualStats ?? {},
    );
  }

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
  };
}
