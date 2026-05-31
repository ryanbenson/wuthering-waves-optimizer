import { getCharByName } from "../characters/characters";
import { calculateAllStats } from "./stats";
import { filterBuffsForStance, resolveActiveStance } from "./stances";
import type { EchoObject } from "../echoes/stats";
import {
  buildEchoStatsFromCharacterStore,
  buildWeaponDataFromCharacterStore,
} from "./rotationPerformer";
import { computeTeamBuffsDataFromStore } from "./teamBuffsFromStore";

type CharacterStoreEntry = Record<string, unknown>;

export type CharacterBuildFromStore = {
  echoStats: Record<string, number>;
  weaponData: {
    attack: number;
    modifier: string | null;
    modifierValue: number;
    weaponPassiveStats: Record<string, unknown>;
  };
  teamBuffsData: Record<string, unknown>;
  calculated: ReturnType<typeof calculateAllStats>;
};

/**
 * Rebuilds a character's full stat pipeline from Pinia store data only.
 * Single source of truth for teammate / rotation performer builds.
 */
export async function computeCharacterBuildFromStore(
  characterKey: string,
  charStore: CharacterStoreEntry,
  charactersStore: Record<string, CharacterStoreEntry>,
  getEchoById?: (echoId: string) => EchoObject | undefined,
): Promise<CharacterBuildFromStore> {
  const chosenChar = (await getCharByName(characterKey)) as Record<
    string,
    unknown
  >;
  const echoStats = buildEchoStatsFromCharacterStore(
    characterKey,
    charStore,
    getEchoById,
  );
  const weaponData = await buildWeaponDataFromCharacterStore(
    characterKey,
    charStore,
    chosenChar,
  );
  const teamBuffsData = computeTeamBuffsDataFromStore(
    characterKey,
    charactersStore,
  );
  const storeTalents = (charStore.talents ?? {}) as Record<string, string | number>;
  const talentData = {
    basic: storeTalents.basic ?? 10,
    skill: storeTalents.skill ?? 10,
    forte: storeTalents.forte ?? 10,
    liberation: storeTalents.liberation ?? 10,
    intro: storeTalents.intro ?? 10,
  };
  const stances = (chosenChar?.basic as { stances?: unknown })?.stances ?? [];
  const activeStance =
    resolveActiveStance(
      stances as never,
      (charStore.activeStance as string | undefined) ?? undefined,
      charStore.buffs as Record<string, { isEnabled?: boolean }> | undefined,
    ) ?? undefined;
  const characterLevel = String(charStore.characterLevel ?? "90");
  const baseLevelStats =
    (
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
    };
  const calculated = calculateAllStats({
    baseHp: baseLevelStats.hp,
    baseAtk: baseLevelStats.attack,
    baseDef: baseLevelStats.defense,
    weaponAtk: weaponData.attack,
    weaponModifier: weaponData.modifier,
    weaponModifierValue: weaponData.modifierValue,
    weaponPassiveData: weaponData.weaponPassiveStats,
    buffsConfig: charStore.buffs ?? {},
    resonanceChainsConfig: charStore.resonanceChains ?? {},
    customBuffs: (charStore.customBuffs ?? {}) as Record<string, unknown>,
    teamBuffsData,
    echoStats,
    buffsCharInfo: filterBuffsForStance(
      (chosenChar.buffs ?? []) as never,
      activeStance,
    ),
    resonanceChainsCharInfo: filterBuffsForStance(
      (chosenChar.resonanceChains ?? []) as never,
      activeStance,
    ),
    character: characterKey,
    talentData,
    activeStance,
  });

  return {
    echoStats,
    weaponData,
    teamBuffsData,
    calculated,
  };
}
