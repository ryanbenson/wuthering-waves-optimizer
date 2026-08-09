import { getCharByName } from "../characters/characters";
import { getWeaponByName } from "../weapons/weapons";
import { computeWeaponPassiveStats } from "../weapons/weaponPassives";
import { getCombinedEchoStats } from "../echoes/stats";
import {
  aggregateEchoSetPassiveStats,
  resolveEchoSetPassiveInstance,
  type EchoSetPassiveResult,
} from "../echoes/echoSetPassives";
import { combineEchoStats } from "../echoes/mainEcho";
import {
  getMainEchoBuffs,
  isMainEchoBuffEnabled,
  getMainEchoBuffStacks,
  mergeMainEchoBuffStats,
} from "../echoes/mainEchoBuffs";
import { applyMainEchoBuffEffects } from "../echoes/applyMainEchoBuffEffects";
import { mainEchoesData } from "../echoes/index";
import { setBonusEffectsOnePiece, setBonusEffectsOne, setBonusEffectsTwo } from "../echoes/sets";
import {
  resolveTeamBuffInstance,
  aggregateTeamBuffStats,
  type TeamBuffDef,
  type TeamBuffInstanceResult,
} from "../buffs/teamBuffs";
import { buffsByCharacter, allEchoBuffs, allWeaponTeamBuffs } from "../buffs/index";
import { resolveActiveStance } from "./stances";
import { calculateAllStats } from "./stats";
import { getCalculationContext } from "./attacks";

export type CalculationContext = ReturnType<typeof getCalculationContext>;

export interface TeamEnemyConfig {
  enemyLevel: number;
  enemyResist: number;
  enemyType: string;
  spectroFrazzleStacks?: number;
  aeroErosionStacks?: number;
  havocBaneStacks?: number;
  fusionBurstStacks?: number;
  electroFlareStacks?: number;
  electroRageStacks?: number;
  glacioChafeStacks?: number;
  strainStacks?: number;
}

export interface CharacterCalculationContext {
  chosenChar: any;
  characterLevel: string | number;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  weaponData: {
    attack: number;
    modifier: string | null;
    modifierValue: number;
    weaponPassiveStats: Record<string, unknown>;
  };
  echoStats: Record<string, unknown>;
  talentData: { basic: number; skill: number; forte: number; liberation: number; intro: number };
  charBuffsData: Record<string, unknown>;
  charResonanceChainsData: Record<string, unknown>;
  teamBuffsData: Record<string, unknown>;
  customBuffs: Record<string, unknown>;
  finalStats: Record<string, any>;
  mainEcho: string;
  mainEchoRank: number;
  context: CalculationContext;
  /**
   * Raw buff/passive *definition* catalogs (not computed values) for this
   * character's current build — used by Team Rotations' advanced per-action
   * buff editor to list every toggle available for this character, without
   * duplicating the lookups already done above.
   */
  definitions: {
    buffs: any[];
    resonanceChains: any[];
    weaponPassives: any[];
    echoSetPassivesOnePiece: any[];
    echoSetPassivesOne: any[];
    echoSetPassivesTwo: any[];
    mainEchoDef: any | null;
    teamBuffs: TeamBuffDef[];
  };
}

/**
 * Resolves a character's 5 echo slots to their real stat data. A slot
 * stored on the character record (`characters[id].echoes[index]`) is often
 * just a pointer (`echoId`) into the shared inventory once an echo has been
 * equipped from the Inventory page — the character record's own
 * type/rank/stat/substat fields are stale placeholders in that case (they
 * were never written, or were written before the echo was last edited).
 * Mirrors CalculatorEcho.vue's `currentEcho`-priority getters exactly:
 * prefer the inventory echo matched by `echoId`, falling back to whatever
 * is inline on the character record only when there's no inventory match
 * (e.g. legacy data entered directly, with no linked inventory item).
 */
function resolveCharacterEchoes(
  characterEchoes: Record<string | number, any> | any[] | undefined,
  inventoryEchoes: any[],
): any[] {
  const echoesById = new Map(inventoryEchoes.map((echo) => [echo.echoId, echo]));
  const resolved: any[] = [];
  for (let index = 0; index < 5; index++) {
    const slot = (characterEchoes as Record<string, any> | undefined)?.[index] ?? null;
    const echoId = slot?.echoId ?? null;
    const inventoryEcho = echoId ? echoesById.get(echoId) : undefined;
    resolved.push(inventoryEcho ?? slot ?? {});
  }
  return resolved;
}

function resolveSetBonusStats(
  setBonusDef: { passives?: any[] } | null | undefined,
  echoSetPassivesConfig: Record<string, { isEnabled?: boolean; stacks?: number }>,
  talentData: Record<string, string | number | undefined>,
): Record<string, unknown> {
  const passives = setBonusDef?.passives ?? [];
  const resolved: EchoSetPassiveResult[] = passives.map((passive) =>
    resolveEchoSetPassiveInstance(
      String(passive.key ?? ""),
      passive.modifiers ?? [],
      echoSetPassivesConfig[String(passive.key ?? "")],
      Boolean(passive.hasStacks),
      Boolean(passive.alwaysEnabled),
      talentData,
    ),
  );
  return aggregateEchoSetPassiveStats(resolved);
}

function namePassivesWithSet(setBonusDef: { name?: string; passives?: any[] } | null | undefined): any[] {
  return (setBonusDef?.passives ?? []).map((passive) => ({ ...passive, name: setBonusDef?.name }));
}

/**
 * Builds a full calculation context for a single character directly from
 * stored build data (the character store's `characters[id]` record) —
 * independent of Vue/"active character" UI state. Mirrors the pipeline
 * Calculator.vue runs reactively for the currently active character
 * (computeAllBuffsWithBreakdown + calcAllDamages context assembly), so the
 * same character/build always produces identical `finalStats`/damage
 * regardless of which caller builds the context.
 *
 * No caching: call this fresh whenever the character's build or the shared
 * enemy config changes.
 */
export async function buildCharacterCalculationContext(
  characterId: string,
  characters: Record<string, any>,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[] = [],
): Promise<CharacterCalculationContext> {
  const characterData = characters?.[characterId] ?? {};
  const chosenChar = await getCharByName(characterId);

  const characterLevel = characterData.characterLevel ?? "90";
  const baseStats = chosenChar?.getCharacterStatsByLevel?.(characterLevel) ?? {};
  const baseHp = baseStats.hp ?? 0;
  const baseAtk = baseStats.attack ?? 0;
  const baseDef = baseStats.defense ?? 0;

  const talentData = {
    basic: characterData.talents?.basic ?? 10,
    skill: characterData.talents?.skill ?? 10,
    forte: characterData.talents?.forte ?? 10,
    liberation: characterData.talents?.liberation ?? 10,
    intro: characterData.talents?.intro ?? 10,
  };

  // Weapon
  const weaponKey: string | null = characterData.weapon ?? null;
  const weaponType = chosenChar?.basic?.weapon ?? "Swords";
  let weaponAttack = 0;
  let weaponModifier: string | null = null;
  let weaponModifierValue = 0;
  let weaponPassiveStats: Record<string, unknown> = {};
  let weaponPassiveDefs: any[] = [];
  if (weaponKey) {
    const chosenWeapon = await getWeaponByName(weaponType, weaponKey);
    if (chosenWeapon) {
      // passiveData entries don't carry their own display name — the
      // weapon's single passiveName (e.g. "Wallbreaker") applies to all of
      // them, so attach it for UIs (like Team Rotations' advanced buff
      // editor) that need a title alongside each passive's description.
      weaponPassiveDefs = ((chosenWeapon.info?.passiveData ?? []) as any[]).map((passive) => ({
        ...passive,
        name: chosenWeapon.info?.passiveName,
      }));
      const weaponLevel =
        characterData.weapons?.[weaponKey]?.weaponLevel ?? chosenWeapon.info?.maxLevel ?? "90";
      const refinement = characterData.weapons?.[weaponKey]?.refinement ?? "1";
      const weaponStats = chosenWeapon.getWeaponDataByLevel(weaponLevel) ?? {};
      weaponAttack = weaponStats.attack ?? 0;
      weaponModifier = weaponStats.modifier ?? null;
      weaponModifierValue = weaponStats.modifierValue ?? 0;
      weaponPassiveStats = computeWeaponPassiveStats(
        weaponKey,
        (chosenWeapon.info?.passiveData ?? []) as any[],
        characterData.weaponPassives ?? {},
        refinement,
      );
    }
  }
  const weaponData = {
    attack: weaponAttack,
    modifier: weaponModifier,
    modifierValue: weaponModifierValue,
    weaponPassiveStats,
  };

  // Echoes: base echo stats + set bonuses + main echo buff, combined exactly
  // like CalculatorEchoes.vue's updateTotalStats.
  const resolvedEchoes = resolveCharacterEchoes(characterData.echoes, inventoryEchoes);
  const combinedEchoStats = getCombinedEchoStats(resolvedEchoes);
  const echoSetBonus = characterData.echoSetBonus ?? {};
  const echoSetPassivesConfig = characterData.echoSetPassives ?? {};
  const setBonusOnePieceDef = echoSetBonus.setBonusOnePiece
    ? (setBonusEffectsOnePiece as Record<string, any>)[echoSetBonus.setBonusOnePiece]
    : null;
  const setBonusOneDef = echoSetBonus.setBonusOne
    ? (setBonusEffectsOne as Record<string, any>)[echoSetBonus.setBonusOne]
    : null;
  const setBonusTwoDef = echoSetBonus.setBonusTwo
    ? (setBonusEffectsTwo as Record<string, any>)[echoSetBonus.setBonusTwo]
    : null;
  const setBonusOnePieceStats = resolveSetBonusStats(setBonusOnePieceDef, echoSetPassivesConfig, talentData);
  const setBonusOneStats = resolveSetBonusStats(setBonusOneDef, echoSetPassivesConfig, talentData);
  const setBonusTwoStats = resolveSetBonusStats(setBonusTwoDef, echoSetPassivesConfig, talentData);

  const mainEchoConfig = characterData.mainEcho ?? {};
  const mainEchoDef = mainEchoConfig.echo
    ? ((mainEchoesData as Record<string, any>)?.[mainEchoConfig.echo] ?? null)
    : null;

  // Mirrors CalculatorEchoes.vue's updateTotalStats: resolve each enabled
  // main-echo buff's effects independently, then merge them all together —
  // a main echo can have more than one independently-toggleable buff.
  const mainEchoBuffStatsByKey: Record<string, Record<string, unknown>> = {};
  for (const buff of getMainEchoBuffs(mainEchoDef)) {
    if (!isMainEchoBuffEnabled(mainEchoConfig, buff.key)) {
      continue;
    }
    mainEchoBuffStatsByKey[buff.key] = applyMainEchoBuffEffects({
      effects: buff.effects,
      character: characterId,
      hasStacks: buff.hasStacks,
      stacks: getMainEchoBuffStacks(mainEchoConfig, buff.key),
      talentData,
    });
  }

  const echoStats = mergeMainEchoBuffStats(
    mainEchoBuffStatsByKey,
    combineEchoStats(combinedEchoStats, setBonusOnePieceStats, setBonusOneStats, setBonusTwoStats),
  );

  // Team buffs: mirrors CalculatorPartyBuffs.vue exactly, including the
  // quirk that `hasRefinements` is forced true only for weapon team buffs
  // (a template-level override, not a property of the buff definitions
  // themselves) and that `talentData` is always {} (never wired up live).
  const teamBuffsConfig = characterData.teamBuffs ?? {};
  const teamBuffsBuffsConfig: Record<string, { isEnabled?: boolean }> = teamBuffsConfig.buffs ?? {};
  const char1Buffs: TeamBuffDef[] = teamBuffsConfig.selectedCharacter1
    ? ((buffsByCharacter as Record<string, TeamBuffDef[]>)[teamBuffsConfig.selectedCharacter1] ?? [])
    : [];
  const char2Buffs: TeamBuffDef[] = teamBuffsConfig.selectedCharacter2
    ? ((buffsByCharacter as Record<string, TeamBuffDef[]>)[teamBuffsConfig.selectedCharacter2] ?? [])
    : [];
  const teamBuffDefs: TeamBuffDef[] = [
    ...char1Buffs.map((def) => ({ ...def, hasRefinements: false })),
    ...char2Buffs.map((def) => ({ ...def, hasRefinements: false })),
    ...(allEchoBuffs as TeamBuffDef[]).map((def) => ({ ...def, hasRefinements: false })),
    ...(allWeaponTeamBuffs as TeamBuffDef[]).map((def) => ({ ...def, hasRefinements: true })),
  ];
  const resolvedTeamBuffs: TeamBuffInstanceResult[] = teamBuffDefs.map((def) =>
    resolveTeamBuffInstance(def, teamBuffsBuffsConfig[def.key], characterId, {}, teamBuffsBuffsConfig),
  );
  const teamBuffsData = aggregateTeamBuffStats(resolvedTeamBuffs);

  const customBuffs = characterData.customBuffs ?? {};

  const activeStance =
    characterData.activeStance ??
    resolveActiveStance(chosenChar?.basic?.stances, undefined, characterData.buffs);

  const { finalStats, selfBuffsData, resonanceChainsBuffsData } = calculateAllStats({
    baseHp,
    baseAtk,
    baseDef,
    weaponAtk: weaponData.attack,
    weaponModifier: weaponData.modifier,
    weaponModifierValue: weaponData.modifierValue,
    weaponPassiveData: weaponData.weaponPassiveStats,
    buffsConfig: characterData.buffs ?? {},
    resonanceChainsConfig: characterData.resonanceChains ?? {},
    customBuffs,
    teamBuffsData,
    echoStats,
    buffsCharInfo: chosenChar?.buffs ?? [],
    resonanceChainsCharInfo: chosenChar?.resonanceChains ?? [],
    character: characterId,
    talentData,
    activeStance,
    ignoreBuffs: {},
    enemy: { havocBaneStacks: enemyConfig.havocBaneStacks ?? 0 },
    setBonusLabels: [echoSetBonus.setBonusOnePiece, echoSetBonus.setBonusOne, echoSetBonus.setBonusTwo],
    echoSetPassivesConfig,
  });

  const mainEcho = mainEchoConfig.echo ?? "";
  const mainEchoRank = mainEchoConfig.rank ?? 5;

  const context = getCalculationContext(
    chosenChar,
    echoStats,
    teamBuffsData,
    talentData,
    Boolean(chosenChar?.basic?.spectroFrazzle),
    enemyConfig.spectroFrazzleStacks ?? 0,
    Boolean(chosenChar?.basic?.aeroErosion),
    enemyConfig.aeroErosionStacks ?? 0,
    Boolean(chosenChar?.basic?.fusionBurst),
    enemyConfig.fusionBurstStacks ?? 0,
    Boolean(chosenChar?.basic?.electroFlare),
    enemyConfig.electroFlareStacks ?? 0,
    enemyConfig.electroRageStacks ?? 0,
    Boolean(chosenChar?.basic?.glacioChafe),
    enemyConfig.glacioChafeStacks ?? 0,
    characterLevel,
    mainEcho,
    mainEchoRank,
    [],
    resonanceChainsBuffsData,
    selfBuffsData,
    baseHp,
    baseAtk,
    baseDef,
    weaponData,
    customBuffs,
    finalStats.glacio,
    finalStats.fusion,
    finalStats.electro,
    finalStats.aero,
    finalStats.spectro,
    finalStats.havoc,
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
    finalStats.critRate / 100,
    finalStats.critDMG / 100,
    finalStats.defIgnore / 100,
    enemyConfig.havocBaneStacks ?? 0,
    finalStats.resistReduction,
    finalStats.totalDeepenEffect,
    enemyConfig.enemyLevel,
    enemyConfig.enemyResist,
    characters,
    characterId,
    enemyConfig.enemyType,
    enemyConfig.strainStacks ?? 0,
  );

  return {
    chosenChar,
    characterLevel,
    baseHp,
    baseAtk,
    baseDef,
    weaponData,
    echoStats,
    talentData,
    charBuffsData: selfBuffsData,
    charResonanceChainsData: resonanceChainsBuffsData,
    teamBuffsData,
    customBuffs,
    finalStats,
    mainEcho,
    mainEchoRank,
    context,
    definitions: {
      buffs: chosenChar?.buffs ?? [],
      resonanceChains: chosenChar?.resonanceChains ?? [],
      weaponPassives: weaponPassiveDefs,
      // Individual set-bonus passives don't carry their own display name —
      // the parent set's name (e.g. "Freezing Frost") applies to all of
      // them, so attach it for UIs that need a title alongside the
      // description (same reasoning as weaponPassives above).
      echoSetPassivesOnePiece: namePassivesWithSet(setBonusOnePieceDef),
      echoSetPassivesOne: namePassivesWithSet(setBonusOneDef),
      echoSetPassivesTwo: namePassivesWithSet(setBonusTwoDef),
      mainEchoDef,
      teamBuffs: teamBuffDefs,
    },
  };
}
