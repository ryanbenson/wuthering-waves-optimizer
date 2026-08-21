import { getCharByName } from "../characters/characters";
import { isStatBonusBuff } from "../characters/statBonusBuffs";
import { getWeaponByName } from "../weapons/weapons";
import { computeWeaponPassiveStats } from "../weapons/weaponPassives";
import { getCombinedEchoStats } from "../echoes/stats";
import { resolveSetBonusStats } from "../echoes/echoSetPassives";
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
export function resolveCharacterEchoes(
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

function namePassivesWithSet(setBonusDef: { name?: string; passives?: any[] } | null | undefined): any[] {
  return (setBonusDef?.passives ?? []).map((passive) => ({ ...passive, name: setBonusDef?.name }));
}

export interface BuildCharacterContextOptions {
  /**
   * Resolve only stat contributions that are permanently active — base
   * character/weapon/echo stats plus weapon passives, echo set bonuses, and
   * the main-echo buff whose definitions carry `alwaysEnabled: true` (no
   * user-facing toggle exists for these; they're forced on unconditionally),
   * plus "Stat Bonus" self-buffs and `isPermanent` resonance chain nodes,
   * both resolved with the build's *real* stored toggle state rather than
   * forced. Stat Bonus buffs represent permanently-unlocked
   * ascension/inherent-skill tiers (see `isStatBonusBuff`); `isPermanent`
   * resonance chain nodes represent an unconditional bonus from a sequence
   * node with no further combat trigger (e.g. a flat stat increase) —
   * unlike weapon passives, a resonance chain's toggle is the only signal
   * this app has for whether the player actually owns that sequence, so it
   * must never be forced on regardless of the stored value. Every other
   * character self-buff, resonance chain node, team buff, and custom buff is
   * always situational/toggled, so those are dropped entirely rather than
   * filtered. Used by the build card, which represents equipment + permanent
   * unlocks alone (see issue #383).
   */
  alwaysEnabledOnly?: boolean;
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
  options: BuildCharacterContextOptions = {},
): Promise<CharacterCalculationContext> {
  const { alwaysEnabledOnly = false } = options;
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
      const passiveDataForCalc = ((chosenWeapon.info?.passiveData ?? []) as any[]).filter(
        (passive) => !alwaysEnabledOnly || Boolean(passive.alwaysEnabled),
      );
      weaponPassiveStats = computeWeaponPassiveStats(
        weaponKey,
        passiveDataForCalc,
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
  const setBonusOnePieceStats = resolveSetBonusStats(
    setBonusOnePieceDef,
    echoSetPassivesConfig,
    talentData,
    alwaysEnabledOnly,
  );
  const setBonusOneStats = resolveSetBonusStats(setBonusOneDef, echoSetPassivesConfig, talentData, alwaysEnabledOnly);
  const setBonusTwoStats = resolveSetBonusStats(setBonusTwoDef, echoSetPassivesConfig, talentData, alwaysEnabledOnly);

  const mainEchoConfig = characterData.mainEcho ?? {};
  const mainEchoDef = mainEchoConfig.echo
    ? ((mainEchoesData as Record<string, any>)?.[mainEchoConfig.echo] ?? null)
    : null;
  // Mirrors CalculatorEchoes.vue's updateTotalStats: resolve each enabled
  // main-echo buff's effects independently, then merge them all together —
  // a main echo can have more than one independently-toggleable buff. For
  // the always-enabled-only view, only buffs flagged `alwaysEnabled: true`
  // are included (forced on regardless of the stored toggle), mirroring
  // weapon passives/echo set bonuses above; conditional buffs are dropped
  // entirely even if the user currently has them toggled on.
  const mainEchoBuffStatsByKey: Record<string, Record<string, unknown>> = {};
  for (const buff of getMainEchoBuffs(mainEchoDef)) {
    const isEnabled = alwaysEnabledOnly ? buff.alwaysEnabled : isMainEchoBuffEnabled(mainEchoConfig, buff.key);
    if (!isEnabled) {
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

  const resonanceChainDefs: any[] = chosenChar?.resonanceChains ?? [];

  const { finalStats, selfBuffsData, resonanceChainsBuffsData } = calculateAllStats({
    baseHp,
    baseAtk,
    baseDef,
    weaponAtk: weaponData.attack,
    weaponModifier: weaponData.modifier,
    weaponModifierValue: weaponData.modifierValue,
    weaponPassiveData: weaponData.weaponPassiveStats,
    buffsConfig: characterData.buffs ?? {},
    // A resonance chain node's stored toggle is this app's only signal for
    // whether the player actually owns that sequence (there's no separate
    // "sequence level" field), so — unlike weapon passives/echo set
    // bonuses/main echo buffs above, which have no user-facing toggle at
    // all for their `alwaysEnabled` entries and are forced on — it is
    // always read from the real stored config, never forced. Team buffs and
    // custom buffs are always situational/toggled, so the always-enabled-only
    // view drops them entirely. Character self-buffs are almost all
    // situational too, except "Stat Bonus" entries (key starting with
    // `StatBonus`) — those represent permanently-unlocked
    // ascension/inherent-skill stat tiers rather than a combat condition
    // (see CalculatorCharacterBuffs.vue's stat-bonus grid), so they're kept
    // and resolved with the build's real toggle state (whether the player
    // has actually unlocked that tier), same as the Results tab. Resonance
    // chain nodes get the same treatment for entries flagged
    // `isPermanent: true` on their definition — a node with no further
    // combat trigger beyond having the sequence unlocked (e.g. a flat stat
    // increase) — while ordinary conditional nodes are dropped entirely,
    // even if currently toggled on.
    resonanceChainsConfig: characterData.resonanceChains ?? {},
    customBuffs: alwaysEnabledOnly ? {} : customBuffs,
    teamBuffsData: alwaysEnabledOnly ? {} : teamBuffsData,
    echoStats,
    buffsCharInfo: alwaysEnabledOnly
      ? (chosenChar?.buffs ?? []).filter((buff: { key: string }) => isStatBonusBuff(buff.key))
      : (chosenChar?.buffs ?? []),
    resonanceChainsCharInfo: alwaysEnabledOnly
      ? resonanceChainDefs.filter((chain: { isPermanent?: boolean }) => Boolean(chain.isPermanent))
      : resonanceChainDefs,
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
