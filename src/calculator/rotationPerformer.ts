import { calculateAllStats } from "./stats";
import {
  getCombinedEchoStats,
  getEchoStats,
  type EchoObject,
} from "../echoes/stats";
import { getSetBonusEffects, getSetsFromEchoes } from "../echoes/sets";
import { setBonusEffectsOne, setBonusEffectsTwo } from "../echoes/sets";
import { getEchoData, mainEchoesData } from "../echoes";
import { getCharByName } from "../characters/characters";
import { getWeaponByName } from "../weapons/weapons";
import { filterBuffsForStance, resolveActiveStance } from "./stances";
import { useInventoryStore } from "../stores/inventory";

export type RotationPerformerId = "active" | "teammate1" | "teammate2";

export type RotationPerformerManualStats = {
  totalAtk?: number | null;
  totalHp?: number | null;
  totalDef?: number | null;
  critRate?: number | null;
  critDMG?: number | null;
  energyRegen?: number | null;
  glacio?: number | null;
  fusion?: number | null;
  electro?: number | null;
  aero?: number | null;
  spectro?: number | null;
  havoc?: number | null;
  basicAttackDMGBonus?: number | null;
  heavyAttackDMGBonus?: number | null;
  resonanceSkillDMGBonus?: number | null;
  introSkillDMGBonus?: number | null;
  outroSkillDMGBonus?: number | null;
  resonanceLiberationDMGBonus?: number | null;
  echoDMGBonus?: number | null;
};

export type RotationPerformerConfig = {
  useSavedBuild?: boolean;
  mainEcho?: string | null;
  mainEchoRank?: number | string | null;
  manualStats?: RotationPerformerManualStats | null;
};

export type RotationPerformersMap = Record<string, RotationPerformerConfig>;

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
};

type CharacterStoreEntry = Record<string, unknown>;

export type TeamBuffsState = {
  selectedCharacter1?: string | null;
  selectedCharacter2?: string | null;
  rotationPerformers?: RotationPerformersMap;
};

function mergeStats(
  target: Record<string, number>,
  source: Record<string, unknown>,
) {
  Object.entries(source).forEach(([stat, value]) => {
    if (stat === "EnableAttack") {
      target[stat] = value as number;
      return;
    }
    if (typeof value === "number") {
      target[stat] = (target[stat] || 0) + value;
    }
  });
}

function talentModifierValue(
  modifierItem: Record<string, unknown>,
  talentRefRaw: string | number | undefined,
): number | undefined {
  const map = modifierItem.modifierValue as Record<string, number> | undefined;
  if (!map) {
    return undefined;
  }
  return map[String(talentRefRaw ?? "10")];
}

function computeEchoSetPassiveStats(
  setBonusName: string | null | undefined,
  effectsMap: Record<string, { passives?: Array<Record<string, unknown>> }>,
  echoSetPassives: Record<string, { isEnabled?: boolean; stacks?: number }>,
  talentData: Record<string, string | number>,
  _characterKey: string,
): Record<string, unknown> {
  const stats: Record<string, unknown> = {};
  if (!setBonusName) {
    return stats;
  }
  const setData = effectsMap[setBonusName];
  if (!setData?.passives) {
    return stats;
  }
  setData.passives.forEach((passive) => {
    const passiveKey = String(passive.key ?? "");
    const passiveState = echoSetPassives[passiveKey] ?? {};
    const isEnabled = passive.alwaysEnabled || passiveState.isEnabled;
    if (!isEnabled) {
      return;
    }
    const stacks = passive.hasStacks ? (passiveState.stacks ?? 0) : 1;
    if (passive.hasStacks && stacks === 0) {
      return;
    }
    const modifiers = (passive.modifiers ?? []) as Array<Record<string, unknown>>;
    modifiers.forEach((modifierItem) => {
      if (modifierItem?.modifySpecificTalents) {
        if (!stats.modifySpecificTalents) {
          stats.modifySpecificTalents = [];
        }
        const modifierValueCalculated = Number(modifierItem.modifierValue) *
          (passive.hasStacks ? stacks : 1);
        (stats.modifySpecificTalents as Array<Record<string, unknown>>).push({
          ...modifierItem,
          modifierValueCalculated,
        });
      } else if (modifierItem.modifier === "Talent") {
        const talentRef =
          talentData?.[String(modifierItem.modifierValueTalentRef ?? "")] ?? "10";
        const talentVal = talentModifierValue(modifierItem, talentRef);
        if (modifierItem.modifierTalentKey != null && talentVal != null) {
          const key = String(modifierItem.modifierTalentKey);
          stats[key] =
            (Number(stats[key]) || 0) +
            talentVal * (passive.hasStacks ? stacks : 1);
        }
      } else if (modifierItem.modifier === "EnableAttack") {
        stats[modifierItem.modifier as string] = modifierItem.modifierValue;
      } else if (modifierItem.modifier) {
        const key = String(modifierItem.modifier);
        const totalValue =
          Number(modifierItem.modifierValue) * (passive.hasStacks ? stacks : 1);
        stats[key] = (Number(stats[key]) || 0) + totalValue;
      }
    });
  });
  return stats;
}

type EchoSlotRow = Record<string, unknown> & { echoId?: string | null };

/** Character echoes may be an array or a {0..4} object after partial store merges. */
function getEchoSlotsFromCharacterStore(
  charStore: CharacterStoreEntry,
): EchoSlotRow[] {
  const raw = charStore.echoes;
  if (!raw) {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw as EchoSlotRow[];
  }
  if (typeof raw === "object") {
    const record = raw as Record<string, EchoSlotRow>;
    const slots: EchoSlotRow[] = [];
    for (let i = 0; i < 5; i++) {
      const slot = record[i] ?? record[String(i)];
      if (slot) {
        slots.push(slot);
      }
    }
    if (slots.length > 0) {
      return slots;
    }
    return Object.values(record).filter(
      (slot) => slot && typeof slot === "object",
    );
  }
  return [];
}

function resolveEchoSlotForStats(
  echoSlot: EchoSlotRow | null | undefined,
  getEchoById?: (echoId: string) => EchoObject | null | undefined,
): EchoObject | null {
  if (!echoSlot) {
    return null;
  }
  if (echoSlot.echoId && getEchoById) {
    const fromInventory = getEchoById(echoSlot.echoId);
    if (fromInventory) {
      return fromInventory;
    }
  }
  if (echoSlot.echo && echoSlot.stat && echoSlot.type && echoSlot.rank) {
    return echoSlot as EchoObject;
  }
  return null;
}

function buildEquippedEchoStats(
  charStore: CharacterStoreEntry,
  getEchoById?: (echoId: string) => EchoObject | null | undefined,
): Record<string, number> {
  const stats: Record<string, number> = {};
  const echoes = getEchoSlotsFromCharacterStore(charStore);
  const resolvedEchoes: EchoObject[] = [];
  for (const echoSlot of echoes) {
    const resolved = resolveEchoSlotForStats(echoSlot, getEchoById);
    if (resolved) {
      resolvedEchoes.push(resolved);
      mergeStats(stats, getEchoStats(resolved));
    }
  }
  if (!resolvedEchoes.length && echoes.length) {
    mergeStats(stats, getCombinedEchoStats(echoes as EchoObject[]));
  }
  return stats;
}

export function buildEchoStatsFromCharacterStore(
  characterKey: string,
  charStore: CharacterStoreEntry,
  getEchoById?: (echoId: string) => EchoObject | null | undefined,
): Record<string, number> {
  const stats: Record<string, number> = {};
  const echoes = getEchoSlotsFromCharacterStore(charStore);
  const resolvedEchoes: EchoObject[] = [];
  for (const echoSlot of echoes) {
    const resolved = resolveEchoSlotForStats(echoSlot, getEchoById);
    if (resolved) {
      resolvedEchoes.push(resolved);
    }
  }
  mergeStats(stats, buildEquippedEchoStats(charStore, getEchoById));

  const computedSetBonuses = getSetBonusEffects(getSetsFromEchoes(resolvedEchoes));
  const storedSetBonus = (charStore.echoSetBonus ?? {}) as {
    setBonusOne?: string | null;
    setBonusTwo?: string | null;
  };
  const setBonusOne =
    storedSetBonus.setBonusOne ?? computedSetBonuses.setBonusOne ?? null;
  const setBonusTwo =
    storedSetBonus.setBonusTwo ?? computedSetBonuses.setBonusTwo ?? null;

  const talentData = (charStore.talents ?? {}) as Record<string, string | number>;
  const echoSetPassives = (charStore.echoSetPassives ?? {}) as Record<
    string,
    { isEnabled?: boolean; stacks?: number }
  >;

  mergeStats(
    stats,
    computeEchoSetPassiveStats(
      setBonusOne,
      setBonusEffectsOne,
      echoSetPassives,
      talentData,
      characterKey,
    ),
  );
  mergeStats(
    stats,
    computeEchoSetPassiveStats(
      setBonusTwo,
      setBonusEffectsTwo,
      echoSetPassives,
      talentData,
      characterKey,
    ),
  );

  const mainEchoEntry = (charStore.mainEcho ?? {}) as {
    echo?: string;
    isEnabled?: boolean;
    stacks?: number;
  };
  if (mainEchoEntry.echo && mainEchoEntry.isEnabled) {
    const echoData = getEchoData(mainEchoEntry.echo);
    const modifiers = echoData?.modifiers ?? [];
    modifiers.forEach((mainEchoBuff) => {
      const specificCharacters = mainEchoBuff?.specificCharacters ?? [];
      if (
        specificCharacters.length > 0 &&
        !specificCharacters.includes(characterKey)
      ) {
        return;
      }
      if (mainEchoBuff?.modifySpecificTalents) {
        if (!stats.specificTalentBuffs) {
          (stats as Record<string, unknown>).specificTalentBuffs = {};
        }
        const specificTalentBuffs = (stats as Record<string, unknown>)
          .specificTalentBuffs as Record<string, number>;
        mainEchoBuff.modifySpecificTalents.forEach((buffTalentName: string) => {
          specificTalentBuffs[buffTalentName] = mainEchoBuff.modifierValue ?? 0;
        });
      } else if (mainEchoBuff?.modifier) {
        const buffVal = (mainEchoBuff.modifierValue ?? 0) * 100;
        const hasStacks = echoData?.hasStacks ?? false;
        const maxStacks = echoData?.maxStacks ?? 0;
        const stacks = mainEchoEntry.stacks ?? 0;
        const appliedVal = hasStacks ? buffVal * Math.min(stacks, maxStacks) : buffVal;
        stats[mainEchoBuff.modifier] =
          (stats[mainEchoBuff.modifier] || 0) + appliedVal;
      }
    });
  }

  return stats;
}

async function buildWeaponDataFromCharacterStore(
  _characterKey: string,
  charStore: CharacterStoreEntry,
  chosenChar: Record<string, unknown>,
): Promise<{
  attack: number;
  modifier: string | null;
  modifierValue: number;
  weaponPassiveStats: Record<string, unknown>;
}> {
  const weapons = (charStore.weapons ?? {}) as Record<
    string,
    { weapon?: string; weaponLevel?: string; refinement?: string }
  >;
  const weaponType = String(
    (chosenChar?.info as { weaponType?: string } | undefined)?.weaponType ?? "",
  );
  const weaponEntry = weapons[weaponType];
  const weaponName = weaponEntry?.weapon;
  if (!weaponName || !weaponEntry?.weaponLevel) {
    return {
      attack: 0,
      modifier: null,
      modifierValue: 0,
      weaponPassiveStats: {},
    };
  }
  const chosenWeapon = (await getWeaponByName(weaponType, weaponName)) as {
    getWeaponDataByLevel: (level: string) => {
      attack: number;
      modifier: string | null;
      modifierValue: number;
    };
    passives?: Array<Record<string, unknown>>;
  };
  const { attack, modifier, modifierValue } = chosenWeapon.getWeaponDataByLevel(
    weaponEntry.weaponLevel,
  );
  const weaponPassivesState = (charStore.weaponPassives ?? {}) as Record<
    string,
    { isEnabled?: boolean; stacks?: number }
  >;
  const refinement = weaponEntry.refinement ?? "1";
  const weaponPassiveStats: Record<string, unknown> = {};
  (chosenWeapon.passives ?? []).forEach((passive) => {
    const passiveKey = String(passive.key ?? "");
    const passiveState = weaponPassivesState[passiveKey] ?? {};
    const isEnabled = passive.alwaysEnabled || passiveState.isEnabled;
    if (!isEnabled) {
      return;
    }
    const modifierByRefinement = (passive.modifierByRefinement ?? {}) as Record<
      string,
      number
    >;
    if (passive.hasStacks) {
      const stacks = passiveState.stacks ?? 0;
      if (stacks === 0) {
        return;
      }
      const value = (modifierByRefinement[refinement] ?? 0) * stacks;
      if (passive.modifier) {
        weaponPassiveStats[passive.modifier as string] =
          (Number(weaponPassiveStats[passive.modifier as string]) || 0) + value;
      }
    } else if (passive.modifier) {
      weaponPassiveStats[passive.modifier as string] =
        modifierByRefinement[refinement] ?? 0;
    }
  });
  return { attack, modifier, modifierValue, weaponPassiveStats };
}

export function finalStatsToPerformerStats(
  finalStats: Record<string, unknown>,
): Record<string, unknown> {
  return {
    totalAtk: finalStats.totalAtk,
    totalHp: finalStats.totalHp,
    totalDef: finalStats.totalDef,
    totalCritRate: finalStats.totalCritRate,
    totalCritDMG: finalStats.totalCritDMG,
    energyRegen: finalStats.energyRegen,
    glacio: finalStats.glacio,
    fusion: finalStats.fusion,
    electro: finalStats.electro,
    aero: finalStats.aero,
    spectro: finalStats.spectro,
    havoc: finalStats.havoc,
    basicAttackDMGBonus: finalStats.basicAttackDMGBonus,
    heavyAttackDMGBonus: finalStats.heavyAttackDMGBonus,
    resonanceSkillDMGBonus: finalStats.resonanceSkillDMGBonus,
    introSkillDMGBonus: finalStats.introSkillDMGBonus,
    outroSkillDMGBonus: finalStats.outroSkillDMGBonus,
    resonanceLiberationDMGBonus: finalStats.resonanceLiberationDMGBonus,
    echoDmgBonus: finalStats.echoDMGBonus,
    healingBonus: finalStats.healingBonus,
    shieldBonus: finalStats.shieldBonus,
    DefIgnore: finalStats.DefIgnore,
    ResistReduction: finalStats.resistReduction,
    TotalDeepenEffect: finalStats.totalDeepenEffect,
  };
}

export function manualStatsToPerformerStats(
  manual: RotationPerformerManualStats,
): Record<string, unknown> {
  return {
    totalAtk: Number(manual.totalAtk ?? 0),
    totalHp: Number(manual.totalHp ?? 0),
    totalDef: Number(manual.totalDef ?? 0),
    totalCritRate: Number(manual.critRate ?? 0) / 100,
    totalCritDMG: Number(manual.critDMG ?? 0) / 100,
    energyRegen: Number(manual.energyRegen ?? 100) / 100,
    glacio: Number(manual.glacio ?? 0),
    fusion: Number(manual.fusion ?? 0),
    electro: Number(manual.electro ?? 0),
    aero: Number(manual.aero ?? 0),
    spectro: Number(manual.spectro ?? 0),
    havoc: Number(manual.havoc ?? 0),
    basicAttackDMGBonus: Number(manual.basicAttackDMGBonus ?? 0),
    heavyAttackDMGBonus: Number(manual.heavyAttackDMGBonus ?? 0),
    resonanceSkillDMGBonus: Number(manual.resonanceSkillDMGBonus ?? 0),
    introSkillDMGBonus: Number(manual.introSkillDMGBonus ?? 0),
    outroSkillDMGBonus: Number(manual.outroSkillDMGBonus ?? 0),
    resonanceLiberationDMGBonus: Number(manual.resonanceLiberationDMGBonus ?? 0),
    echoDmgBonus: Number(manual.echoDMGBonus ?? 0),
  };
}

export function resolvePerformerCharacterKey(
  performer: RotationPerformerId | string | null | undefined,
  activeCharacterKey: string,
  teamBuffs: TeamBuffsState,
): string {
  if (!performer || performer === "active") {
    return activeCharacterKey;
  }
  if (performer === "teammate1") {
    return teamBuffs.selectedCharacter1 ?? activeCharacterKey;
  }
  if (performer === "teammate2") {
    return teamBuffs.selectedCharacter2 ?? activeCharacterKey;
  }
  return String(performer);
}

export function getRotationPerformerConfig(
  characterKey: string,
  teamBuffs: TeamBuffsState,
): RotationPerformerConfig {
  return teamBuffs.rotationPerformers?.[characterKey] ?? {};
}

export async function getPerformerAttackContext(
  performerCharacterKey: string,
  activeCharacterKey: string,
  charactersStore: Record<string, CharacterStoreEntry>,
  teamBuffsData: Record<string, unknown>,
  customBuffs: Record<string, unknown>,
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
  const characterLevel = String(charStore.characterLevel ?? "90");
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

  let performerStats: Record<string, unknown>;
  let charBuffsData: Record<string, unknown> = {};
  let charResonanceChainsData: Record<string, unknown> = {};

  if (performerConfig.useSavedBuild !== false) {
    const inventoryStore = useInventoryStore();
    const getEchoById = (echoId: string) =>
      inventoryStore.getEchoById(echoId) as EchoObject | undefined;
    const echoStats = buildEchoStatsFromCharacterStore(
      performerCharacterKey,
      charStore,
      getEchoById,
    );
    const weaponData = await buildWeaponDataFromCharacterStore(
      performerCharacterKey,
      charStore,
      chosenChar,
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
      buffsConfig: charStore.buffs ?? {},
      resonanceChainsConfig: charStore.resonanceChains ?? {},
      customBuffs: charStore.customBuffs ?? customBuffs ?? {},
      teamBuffsData,
      echoStats,
      buffsCharInfo,
      resonanceChainsCharInfo,
      character: performerCharacterKey,
      talentData,
      activeStance,
    });
    performerStats = finalStatsToPerformerStats(calculated.finalStats);
    charBuffsData = calculated.selfBuffsData ?? {};
    charResonanceChainsData = calculated.resonanceChainsBuffsData ?? {};
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
  };
}

export function getPerformerMainEchoForEchoAttacks(
  performerContext: PerformerAttackContext | null,
  rotationMainEcho: string | null,
  rotationMainEchoRank: number | string | null,
  actionMainEcho: string | null,
  actionMainEchoRank: number | null,
): { mainEcho: string | null; mainEchoRank: number | string | null } {
  if (actionMainEcho) {
    return {
      mainEcho: actionMainEcho,
      mainEchoRank: actionMainEchoRank ?? rotationMainEchoRank,
    };
  }
  if (performerContext?.performerMainEcho) {
    return {
      mainEcho: performerContext.performerMainEcho,
      mainEchoRank: performerContext.performerMainEchoRank,
    };
  }
  return { mainEcho: rotationMainEcho, mainEchoRank: rotationMainEchoRank };
}

export function getCharacterImageUrl(characterKey: string | null): string {
  if (!characterKey) {
    return "https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_002.png";
  }
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${characterKey}.png`;
}

export const MAIN_ECHO_OPTIONS = Object.values(mainEchoesData).map((echo) => ({
  key: echo.key,
  name: echo.name,
  image: echo.image,
}));
