import { getCharByName } from "../characters/characters";
import { getWeaponByName } from "../weapons/weapons";
import { computeWeaponPassiveStats } from "../weapons/weaponPassives";
import { getCombinedEchoStats } from "../echoes/stats";
import {
  aggregateEchoSetPassiveStats,
  resolveEchoSetPassiveInstance,
  type EchoSetPassiveResult,
} from "../echoes/echoSetPassives";
import { resolveMainEchoBuffStats, combineEchoStats } from "../echoes/mainEcho";
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
  if (weaponKey) {
    const chosenWeapon = await getWeaponByName(weaponType, weaponKey);
    if (chosenWeapon) {
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
  const combinedEchoStats = getCombinedEchoStats(characterData.echoes ?? []);
  const echoSetBonus = characterData.echoSetBonus ?? {};
  const echoSetPassivesConfig = characterData.echoSetPassives ?? {};
  const setBonusOnePieceStats = resolveSetBonusStats(
    echoSetBonus.setBonusOnePiece
      ? (setBonusEffectsOnePiece as Record<string, any>)[echoSetBonus.setBonusOnePiece]
      : null,
    echoSetPassivesConfig,
    talentData,
  );
  const setBonusOneStats = resolveSetBonusStats(
    echoSetBonus.setBonusOne ? (setBonusEffectsOne as Record<string, any>)[echoSetBonus.setBonusOne] : null,
    echoSetPassivesConfig,
    talentData,
  );
  const setBonusTwoStats = resolveSetBonusStats(
    echoSetBonus.setBonusTwo ? (setBonusEffectsTwo as Record<string, any>)[echoSetBonus.setBonusTwo] : null,
    echoSetPassivesConfig,
    talentData,
  );

  const mainEchoConfig = characterData.mainEcho ?? {};
  const mainEchoBuffStats = resolveMainEchoBuffStats(characterId, mainEchoConfig);

  const echoStats = combineEchoStats(
    combinedEchoStats,
    setBonusOnePieceStats,
    setBonusOneStats,
    setBonusTwoStats,
    mainEchoBuffStats,
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
  };
}
