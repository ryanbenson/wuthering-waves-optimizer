/**
 * Builds an optimizer search for one character from stored data (not the
 * Calculator page's reactive state), and scores a loadout the way the Team
 * page does, so tests can check the optimizer's score against the page.
 *
 * Copied from the team optimizer's helpers when that feature was parked on the
 * `labs/team-optimizer` branch (#748): the regular optimizer's accuracy tests
 * still need them, and the app no longer does.
 */
import { applyMainEchoBuffEffects } from "../../../src/echoes/applyMainEchoBuffEffects";
import { resolveSetBonusStats } from "../../../src/echoes/echoSetPassives";
import { mainEchoesData } from "../../../src/echoes/index";
import { getMainEchoBuffs, mergeMainEchoBuffStats } from "../../../src/echoes/mainEchoBuffs";
import {
  getSetBonusEffects,
  getSetsFromEchoes,
  setBonusEffectsOne,
  setBonusEffectsOnePiece,
  setBonusEffectsTwo,
} from "../../../src/echoes/sets";
import {
  buildCharacterCalculationContext,
  resolveEnemyResistForElement,
  type TeamEnemyConfig,
} from "../../../src/calculator/buildCharacterContext";
import type { OptimizerContext } from "../../../src/calculator/optimizer";
import {
  getCalculatorMainEchoBuffEntry,
  getMainEchoBuffEntry,
  resolveOptimizerBuff,
  type OptimizerBuffEntry,
} from "../../../src/calculator/optimizerBuffStatus";
import { buildOptimizerRotationData, type OptimizerRotationData } from "../../../src/calculator/rotationData";
import { resolveActiveStance } from "../../../src/calculator/stances";
import { calcTeamRotationDamage, type TeamRotationInput } from "../../../src/calculator/teamRotation";

export interface OptimizerEchoBuffs {
  /** Every set passive's effective setting: the optimizer's, else the calculator's. */
  echoSetPassives: Record<string, OptimizerBuffEntry>;
  /** Stats by set bonus label, the shape `computeLoadoutFinalStats` reads. */
  echoSetPassiveBuffs: Record<string, Record<string, unknown>>;
  /** Stats by main echo key, for the echoes being searched. */
  mainEchoStats: Record<string, Record<string, unknown>>;
  /** Effective per-buff settings by main echo key. */
  mainEchoBuffConfigs: Record<string, Record<string, OptimizerBuffEntry>>;
}

/**
 * Resolves the same settings the optimizer's buff rows show (ADR 0040) without
 * needing them mounted, since most characters never open their drawer.
 */
export function resolveOptimizerEchoBuffs(
  characterId: string,
  characterData: Record<string, any>,
  mainEchoKeys: string[],
  talentData: Record<string, any>,
): OptimizerEchoBuffs {
  const optimizer = characterData?.optimizer ?? {};
  const allDefs = {
    ...setBonusEffectsOnePiece,
    ...setBonusEffectsOne,
    ...setBonusEffectsTwo,
  } as Record<string, any>;

  const echoSetPassives: Record<string, OptimizerBuffEntry> = {};
  for (const def of Object.values(allDefs)) {
    for (const passive of def?.passives ?? []) {
      const resolved = resolveOptimizerBuff({
        optimizerEntry: optimizer.echoSetPassives?.[passive.key],
        calculatorEntry: characterData?.echoSetPassives?.[passive.key],
        hasStacks: Boolean(passive.hasStacks),
        alwaysEnabled: Boolean(passive.alwaysEnabled),
        calculatorFallback: true,
      });
      echoSetPassives[passive.key] = {
        isEnabled: resolved.isEnabled,
        stacks: resolved.stacks,
      };
    }
  }

  const echoSetPassiveBuffs: Record<string, Record<string, unknown>> = {};
  for (const [label, def] of Object.entries(allDefs)) {
    echoSetPassiveBuffs[label] = resolveSetBonusStats(
      def,
      echoSetPassives,
      talentData,
    );
  }

  const mainEchoStats: Record<string, Record<string, unknown>> = {};
  const mainEchoBuffConfigs: Record<
    string,
    Record<string, OptimizerBuffEntry>
  > = {};
  for (const echoKey of mainEchoKeys) {
    const def = (mainEchoesData as Record<string, any>)[echoKey];
    const statsByBuff: Record<string, Record<string, unknown>> = {};
    const config: Record<string, OptimizerBuffEntry> = {};
    for (const buff of getMainEchoBuffs(def)) {
      const resolved = resolveOptimizerBuff({
        optimizerEntry: getMainEchoBuffEntry(
          optimizer.mainEchoBuffs?.[echoKey],
          buff.key,
        ),
        calculatorEntry: getCalculatorMainEchoBuffEntry(
          characterData?.mainEcho,
          echoKey,
          buff.key,
        ),
        hasStacks: Boolean(buff.hasStacks),
        alwaysEnabled: Boolean(buff.alwaysEnabled),
        calculatorFallback: true,
      });
      config[buff.key] = {
        isEnabled: resolved.isEnabled,
        stacks: resolved.stacks,
      };
      if (!resolved.isEnabled) continue;
      statsByBuff[buff.key] = applyMainEchoBuffEffects({
        effects: buff.effects,
        character: characterId,
        hasStacks: buff.hasStacks,
        stacks: resolved.stacks,
        talentData,
      });
    }
    mainEchoStats[echoKey] = mergeMainEchoBuffStats(statsByBuff, {}) as Record<
      string,
      unknown
    >;
    mainEchoBuffConfigs[echoKey] = config;
  }

  return {
    echoSetPassives,
    echoSetPassiveBuffs,
    mainEchoStats,
    mainEchoBuffConfigs,
  };
}

/** The character's record as it would be with this loadout equipped. */
export function applyLoadoutToCharacterData(
  characterData: Record<string, any>,
  loadout: any[],
  echoBuffs: Pick<
    OptimizerEchoBuffs,
    "echoSetPassives" | "mainEchoBuffConfigs"
  >,
): Record<string, any> {
  const bonuses = getSetBonusEffects(getSetsFromEchoes(loadout));
  const main = loadout[0];
  const allDefs = {
    ...setBonusEffectsOnePiece,
    ...setBonusEffectsOne,
    ...setBonusEffectsTwo,
  } as Record<string, any>;
  // Only the sets this loadout activates, so other sets' saved settings stay as they are.
  const activePassives: Record<string, OptimizerBuffEntry> = {};
  for (const label of [
    bonuses.setBonusOnePiece,
    bonuses.setBonusOne,
    bonuses.setBonusTwo,
  ]) {
    for (const passive of (label ? allDefs[label]?.passives : null) ?? []) {
      const entry = echoBuffs.echoSetPassives[passive.key];
      if (entry) activePassives[passive.key] = entry;
    }
  }
  const echoes: Record<number, { echoId: string | null }> = {};
  for (let index = 0; index < 5; index++) {
    echoes[index] = { echoId: loadout[index]?.echoId ?? null };
  }
  const isSameMain = characterData?.mainEcho?.echo === main?.echo;
  return {
    ...characterData,
    echoes,
    echoSetBonus: {
      setBonusOnePiece: bonuses.setBonusOnePiece,
      setBonusOne: bonuses.setBonusOne,
      setBonusTwo: bonuses.setBonusTwo,
    },
    echoSetPassives: { ...characterData?.echoSetPassives, ...activePassives },
    mainEcho: {
      echo: main?.echo ?? null,
      rank: isSameMain ? characterData?.mainEcho?.rank : (main?.rank ?? 5),
      buffs: echoBuffs.mainEchoBuffConfigs[main?.echo] ?? {},
    },
  };
}

/**
 * The `OptimizerContext` for any character, built from stored data rather than
 * the Calculator page's reactive state, against the team's enemy.
 */
export async function buildOptimizerContextForCharacter(
  characterId: string,
  characterData: Record<string, any>,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[],
): Promise<OptimizerContext> {
  // A one-character map, so the context sent to each worker stays small.
  const characters = { [characterId]: characterData };
  const built = await buildCharacterCalculationContext(
    characterId,
    characters,
    enemyConfig,
    inventoryEchoes,
  );
  const basic = built.chosenChar?.basic ?? {};
  return {
    chosenChar: built.chosenChar,
    character: characterId,
    characterLevel: built.characterLevel,
    talentData: built.talentData,
    baseHp: built.baseHp,
    baseAtk: built.baseAtk,
    baseDef: built.baseDef,
    weaponData: {
      ...built.weaponData,
      // Per-action buff overrides re-resolve weapon passives from these. They
      // aren't in the calculation context, and leaving them out silently loses
      // those passives on every override action.
      weaponPassiveDefs: built.definitions.weaponPassives,
      refinement: String(
        characterData?.weapons?.[characterData?.weapon]?.refinement ?? "1",
      ),
    },
    charBuffsData: built.charBuffsData,
    charResonanceChainsData: built.charResonanceChainsData,
    teamBuffsData: built.teamBuffsData,
    customBuffs: built.customBuffs,
    echoSetPassivesConfig: characterData?.echoSetPassives ?? {},
    echoStats: built.echoStats,
    enemyLevel: enemyConfig.enemyLevel,
    enemyResist: resolveEnemyResistForElement(enemyConfig, basic.element),
    enemyType: enemyConfig.enemyType,
    isSpectroFrazzleEnabled: Boolean(basic.spectroFrazzle),
    spectroFrazzleStacks: enemyConfig.spectroFrazzleStacks ?? 0,
    isAeroErosionEnabled: Boolean(basic.aeroErosion),
    aeroErosionStacks: enemyConfig.aeroErosionStacks ?? 0,
    isFusionBurstEnabled: Boolean(basic.fusionBurst),
    fusionBurstStacks: enemyConfig.fusionBurstStacks ?? 0,
    isElectroFlareEnabled: Boolean(basic.electroFlare),
    electroFlareStacks: enemyConfig.electroFlareStacks ?? 0,
    electroRageStacks: enemyConfig.electroRageStacks ?? 0,
    isGlacioChafeEnabled: Boolean(basic.glacioChafe),
    glacioChafeStacks: enemyConfig.glacioChafeStacks ?? 0,
    havocBaneStacks: enemyConfig.havocBaneStacks ?? 0,
    strainStacks: enemyConfig.strainStacks ?? 0,
    mainEcho: built.mainEcho,
    mainEchoRank: built.mainEchoRank,
    rotationsList: [],
    Glacio: built.finalStats?.Glacio ?? 0,
    Fusion: built.finalStats?.Fusion ?? 0,
    Electro: built.finalStats?.Electro ?? 0,
    Aero: built.finalStats?.Aero ?? 0,
    Spectro: built.finalStats?.Spectro ?? 0,
    Havoc: built.finalStats?.Havoc ?? 0,
    characters,
    activeCharacterBuffs: characterData?.buffs ?? {},
    activeCharacterResonanceChains: characterData?.resonanceChains ?? {},
    activeStance:
      characterData?.activeStance ??
      resolveActiveStance(
        built.chosenChar?.basic?.stances,
        undefined,
        characterData?.buffs,
      ),
    getRotationById: () => null,
  };
}

export interface OptimizerSlotPlan {
  slot: number;
  characterId: string;
  context: OptimizerContext;
  rotationData: OptimizerRotationData;
  target: string;
  echoBuffs: OptimizerEchoBuffs;
}

export async function buildOptimizerSlotPlan(input: {
  team: TeamRotationInput;
  slot: number;
  characterId: string;
  characterData: Record<string, any>;
  enemyConfig: TeamEnemyConfig;
  inventoryEchoes: any[];
  mainEchoKeys: string[];
}): Promise<OptimizerSlotPlan> {
  const {
    team,
    slot,
    characterId,
    characterData,
    enemyConfig,
    inventoryEchoes,
    mainEchoKeys,
  } = input;
  // Resolved first so the per-action override path, which rebuilds from the
  // stored record, starts from the same settings as the plain path.
  const talents = {
    basic: characterData?.talents?.basic ?? 10,
    skill: characterData?.talents?.skill ?? 10,
    forte: characterData?.talents?.forte ?? 10,
    liberation: characterData?.talents?.liberation ?? 10,
    intro: characterData?.talents?.intro ?? 10,
  };
  const echoBuffs = resolveOptimizerEchoBuffs(
    characterId,
    characterData,
    mainEchoKeys,
    talents,
  );
  const searchData = {
    ...characterData,
    echoSetPassives: {
      ...characterData?.echoSetPassives,
      ...echoBuffs.echoSetPassives,
    },
  };
  const context = await buildOptimizerContextForCharacter(
    characterId,
    searchData,
    enemyConfig,
    inventoryEchoes,
  );
  const actions = team.actions
    .filter((action) => action.slot === slot && !action.isDisabled)
    .sort((a, b) => a.order - b.order);
  const id = `slot-${slot}`;
  return {
    slot,
    characterId,
    context,
    echoBuffs,
    target: `Rotation:${id}`,
    rotationData: buildOptimizerRotationData(
      {
        id,
        name: team.name ?? "Team Rotation",
        duration: team.duration,
        actions,
      },
      context.chosenChar,
      context.characterLevel,
    ),
  };
}

/** One character's average rotation damage on the Team page with `loadout` equipped. */
export async function teamPageDamage(input: {
  team: TeamRotationInput;
  characterId: string;
  characterData: Record<string, any>;
  loadout: any[];
  echoBuffs: Pick<OptimizerEchoBuffs, "echoSetPassives" | "mainEchoBuffConfigs">;
  enemyConfig: TeamEnemyConfig;
  inventoryEchoes: any[];
}): Promise<number> {
  const { team, characterId, characterData, loadout, echoBuffs, enemyConfig, inventoryEchoes } = input;
  const characters = { [characterId]: applyLoadoutToCharacterData(characterData, loadout, echoBuffs) };
  const result = await calcTeamRotationDamage(team, characters, enemyConfig, inventoryEchoes);
  return result.perCharacter[characterId]?.damageAggregation?.avgDamage ?? 0;
}
