import {
  getCombinedEchoStats,
  getEchoStats,
  type EchoObject,
} from "../echoes/stats";
import { getSetBonusEffects, getSetsFromEchoes } from "../echoes/sets";
import { setBonusEffectsOne, setBonusEffectsTwo } from "../echoes/sets";
import { getEchoData, mainEchoesData } from "../echoes";
import { getWeaponByName } from "../weapons/weapons";
import {
  buildPerformerAttackContextFromStore,
  type PerformerAttackContext,
  type TeamBuffsState,
} from "./performerContextFromStore";
import { useInventoryStore } from "../stores/inventory";

export type RotationPerformerId = "active" | "teammate1" | "teammate2";

export type { RotationPerformerManualStats } from "./performerStatsMapping";
export { finalStatsToPerformerStats, manualStatsToPerformerStats } from "./performerStatsMapping";
export type {
  PerformerAttackContext,
  RotationPerformerConfig,
  TeamBuffsState,
} from "./performerContextFromStore";
export { getRotationPerformerConfig } from "./performerContextFromStore";

export type RotationPerformersMap = Record<
  string,
  import("./performerContextFromStore").RotationPerformerConfig
>;

type CharacterStoreEntry = Record<string, unknown>;

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
    const isEnabled =
      passiveState.isEnabled === false
        ? false
        : Boolean(passive.alwaysEnabled || passiveState.isEnabled);
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

const DEFAULT_ECHO_SLOT_RANK = 5;

/** Inline echo rows saved on the character store (no inventory echoId). */
export function echoSlotHasInlineBuildData(slot: EchoSlotRow): boolean {
  return (
    Boolean(slot.echo) &&
    slot.stat != null &&
    slot.stat !== "" &&
    slot.type != null &&
    slot.type !== ""
  );
}

function echoSlotRankForStats(slot: EchoSlotRow): number {
  const rank = slot.rank;
  if (rank != null && rank !== "") {
    const numeric = Number(rank);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
  }
  return DEFAULT_ECHO_SLOT_RANK;
}

function normalizeEchoSlotForStats(slot: EchoSlotRow): EchoObject | null {
  if (!echoSlotHasInlineBuildData(slot)) {
    return null;
  }
  return {
    ...(slot as EchoObject),
    rank: echoSlotRankForStats(slot),
  };
}

/** Character echoes may be an array or a {0..4} object after partial store merges. */
export function getEchoSlotsFromCharacterStore(
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
  let resolved: EchoObject | null = null;
  if (echoSlot.echoId && getEchoById) {
    resolved = getEchoById(echoSlot.echoId) ?? null;
  }
  const inlineEcho = normalizeEchoSlotForStats(echoSlot);
  if (inlineEcho) {
    if (resolved) {
      return {
        ...resolved,
        echo: inlineEcho.echo ?? resolved.echo,
        type: inlineEcho.type ?? resolved.type,
        rank: inlineEcho.rank ?? resolved.rank,
        stat: inlineEcho.stat ?? resolved.stat,
        echoSubStatsType1:
          inlineEcho.echoSubStatsType1 ?? resolved.echoSubStatsType1,
        echoSubStatsValue1:
          inlineEcho.echoSubStatsValue1 ?? resolved.echoSubStatsValue1,
        echoSubStatsType2:
          inlineEcho.echoSubStatsType2 ?? resolved.echoSubStatsType2,
        echoSubStatsValue2:
          inlineEcho.echoSubStatsValue2 ?? resolved.echoSubStatsValue2,
        echoSubStatsType3:
          inlineEcho.echoSubStatsType3 ?? resolved.echoSubStatsType3,
        echoSubStatsValue3:
          inlineEcho.echoSubStatsValue3 ?? resolved.echoSubStatsValue3,
        echoSubStatsType4:
          inlineEcho.echoSubStatsType4 ?? resolved.echoSubStatsType4,
        echoSubStatsValue4:
          inlineEcho.echoSubStatsValue4 ?? resolved.echoSubStatsValue4,
        echoSubStatsType5:
          inlineEcho.echoSubStatsType5 ?? resolved.echoSubStatsType5,
        echoSubStatsValue5:
          inlineEcho.echoSubStatsValue5 ?? resolved.echoSubStatsValue5,
      };
    }
    return inlineEcho;
  }
  return resolved;
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

export type EchoSetPassiveDefinition = {
  key: string;
  name: string;
  setLabel: string;
  details?: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
};

/** Passive rows for the character's resolved 2pc / 5pc set bonuses (for rotation override UI). */
export function getResolvedEchoSetPassiveDefinitions(
  charStore: CharacterStoreEntry,
  getEchoById?: (echoId: string) => EchoObject | null | undefined,
): EchoSetPassiveDefinition[] {
  const echoes = getEchoSlotsFromCharacterStore(charStore);
  const resolvedEchoes: EchoObject[] = [];
  for (const echoSlot of echoes) {
    const resolved = resolveEchoSlotForStats(echoSlot, getEchoById);
    if (resolved) {
      resolvedEchoes.push(resolved);
    }
  }
  const computedSetBonuses = getSetBonusEffects(getSetsFromEchoes(resolvedEchoes));
  const storedSetBonus = (charStore.echoSetBonus ?? {}) as {
    setBonusOne?: string | null;
    setBonusTwo?: string | null;
  };
  const setBonusOne =
    storedSetBonus.setBonusOne ?? computedSetBonuses.setBonusOne ?? null;
  const setBonusTwo =
    storedSetBonus.setBonusTwo ?? computedSetBonuses.setBonusTwo ?? null;

  const definitions: EchoSetPassiveDefinition[] = [];
  const seenKeys = new Set<string>();

  const appendFromSet = (
    setKey: string | null,
    effectsMap: Record<
      string,
      { name?: string; passives?: Array<Record<string, unknown>> }
    >,
  ) => {
    if (!setKey) {
      return;
    }
    const setData = effectsMap[setKey];
    if (!setData?.passives) {
      return;
    }
    const setLabel = setData.name ?? setKey;
    setData.passives.forEach((passive) => {
      const key = String(passive.key ?? "");
      if (!key || seenKeys.has(key)) {
        return;
      }
      seenKeys.add(key);
      definitions.push({
        key,
        name: key,
        setLabel,
        details: String(passive.details ?? ""),
        alwaysEnabled: Boolean(passive.alwaysEnabled),
        hasStacks: Boolean(passive.hasStacks),
        minStacks: Number(passive.minStacks) || 0,
        maxStacks: Number(passive.maxStacks) || 0,
      });
    });
  };

  appendFromSet(setBonusOne, setBonusEffectsOne);
  appendFromSet(setBonusTwo, setBonusEffectsTwo);
  return definitions;
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

export type ResolvedEquippedWeapon = {
  weaponType: string;
  weaponName: string;
  weaponLevel: string;
  refinement: string;
};

export function getCharacterWeaponType(
  chosenChar: Record<string, unknown>,
): string {
  const basic = chosenChar?.basic as { weapon?: string } | undefined;
  if (basic?.weapon) {
    return basic.weapon;
  }
  const info = chosenChar?.info as
    | { weaponType?: string; weapon?: string }
    | undefined;
  return info?.weaponType ?? info?.weapon ?? "";
}

/** Reads equipped weapon from character store (weapon key + weapons[weaponKey] metadata). */
export function resolveEquippedWeaponFromStore(
  charStore: CharacterStoreEntry,
  chosenChar: Record<string, unknown>,
): ResolvedEquippedWeapon | null {
  const weaponType = getCharacterWeaponType(chosenChar);
  if (!weaponType) {
    return null;
  }
  const weapons = (charStore.weapons ?? {}) as Record<
    string,
    { weapon?: string; weaponLevel?: string; refinement?: string }
  >;

  const equippedWeaponKey = String((charStore.weapon as string) ?? "").trim();
  if (equippedWeaponKey) {
    const meta = weapons[equippedWeaponKey];
    return {
      weaponType,
      weaponName: equippedWeaponKey,
      weaponLevel: meta?.weaponLevel ?? "90",
      refinement: meta?.refinement ?? "1",
    };
  }

  const legacyEntry = weapons[weaponType];
  if (legacyEntry?.weapon && legacyEntry.weaponLevel) {
    return {
      weaponType,
      weaponName: legacyEntry.weapon,
      weaponLevel: legacyEntry.weaponLevel,
      refinement: legacyEntry.refinement ?? "1",
    };
  }

  return null;
}

function weaponPassiveDefinitionsFromChosenWeapon(
  chosenWeapon: Record<string, unknown>,
): Array<Record<string, unknown>> {
  const info = chosenWeapon.info as { passiveData?: Array<Record<string, unknown>> };
  if (info?.passiveData?.length) {
    return info.passiveData;
  }
  return (chosenWeapon.passives as Array<Record<string, unknown>>) ?? [];
}

export async function buildWeaponDataFromCharacterStore(
  _characterKey: string,
  charStore: CharacterStoreEntry,
  chosenChar: Record<string, unknown>,
): Promise<{
  attack: number;
  modifier: string | null;
  modifierValue: number;
  weaponPassiveStats: Record<string, unknown>;
}> {
  const resolved = resolveEquippedWeaponFromStore(charStore, chosenChar);
  if (!resolved) {
    return {
      attack: 0,
      modifier: null,
      modifierValue: 0,
      weaponPassiveStats: {},
    };
  }
  const { weaponType, weaponName, weaponLevel, refinement } = resolved;
  const chosenWeapon = (await getWeaponByName(weaponType, weaponName)) as {
    getWeaponDataByLevel: (level: string) => {
      attack: number;
      modifier: string | null;
      modifierValue: number;
    };
    info?: { passiveData?: Array<Record<string, unknown>> };
    passives?: Array<Record<string, unknown>>;
  };
  if (!chosenWeapon?.getWeaponDataByLevel) {
    return {
      attack: 0,
      modifier: null,
      modifierValue: 0,
      weaponPassiveStats: {},
    };
  }
  const { attack, modifier, modifierValue } =
    chosenWeapon.getWeaponDataByLevel(weaponLevel);
  const weaponPassivesState = (charStore.weaponPassives ?? {}) as Record<
    string,
    { isEnabled?: boolean; stacks?: number }
  >;
  const weaponPassiveStats: Record<string, unknown> = {};
  weaponPassiveDefinitionsFromChosenWeapon(
    chosenWeapon as Record<string, unknown>,
  ).forEach((passive) => {
    const passiveKey = String(passive.key ?? "");
    const passiveState = weaponPassivesState[passiveKey] ?? {};
    const isEnabled =
      passiveState.isEnabled === false
        ? false
        : Boolean(passive.alwaysEnabled || passiveState.isEnabled);
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
      const modifierKey = passive.modifier as string;
      weaponPassiveStats[modifierKey] =
        (Number(weaponPassiveStats[modifierKey]) || 0) +
        (modifierByRefinement[refinement] ?? 0);
    }
  });
  return { attack, modifier, modifierValue, weaponPassiveStats };
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

export async function getPerformerAttackContext(
  performerCharacterKey: string,
  activeCharacterKey: string,
  charactersStore: Record<string, CharacterStoreEntry>,
  _teamBuffsData: Record<string, unknown>,
  _customBuffs: Record<string, unknown>,
  options?: {
    getEchoById?: (echoId: string) => EchoObject | undefined;
  },
): Promise<PerformerAttackContext | null> {
  const getEchoById =
    options?.getEchoById ??
    ((echoId: string) => {
      const inventoryStore = useInventoryStore();
      return inventoryStore.getEchoById(echoId) as EchoObject | undefined;
    });
  return buildPerformerAttackContextFromStore(
    performerCharacterKey,
    activeCharacterKey,
    charactersStore,
    getEchoById,
    _teamBuffsData,
  );
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
