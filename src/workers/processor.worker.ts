/**
 * Processor Worker
 *
 * This web worker processes batches of echo loadouts, calculating stats and damage
 * for each loadout to determine optimization target values (ATK, damage, rotations, etc.).
 * Multiple processor workers run in parallel to maximize throughput.
 *
 * Architecture:
 * - Runs in separate threads to parallelize computation
 * - Receives static optimizer config once on "init"
 * - Receives batches of loadouts from the main thread via slim "process" messages
 * - Keeps a local top-N heap and only returns candidates still retained in it at batch end
 * - Main thread merges candidates into the global top-N heap
 *
 * Message Flow:
 * 1. Main thread sends "init" with context and optimization parameters -> Worker responds with "ready"
 * 2. Main thread sends "process" with { batch, batchId } only
 * 3. Worker processes loadouts, updates local top-N, sends "result" with newly retained candidates
 * 4. Worker sends "error" if batch processing fails
 *
 * Processing Steps (for each loadout):
 * 1. Normalize non-main echo ordering
 * 2. Calculate echo stats and set bonuses
 * 3. Compute character stats with echo buffs
 * 4. Calculate buffs (self, resonance chains, additional base, crit overflow)
 * 5. Calculate final stats
 * 6. Check minimum stat requirements (if any)
 * 7. Calculate target value based on target type
 * 8. Try insert into local top-N heap; post only inserts still in the heap at batch end
 *
 * Performance Notes:
 * - Static context is cloned once at init, not per batch
 * - Only top-N candidates still retained this batch are posted back
 * - Errors in individual loadouts don't stop batch processing
 */

import { normalizeOptimizerLoadout } from "../calculator/optimizer";
import { getAttackData } from "../characters/characters";
import { getCombinedEchoStats } from "../echoes/stats";
import {
  getSetsFromEchoes,
  getSetBonusEffects,
  getEnabledAdditionalBasePassives,
} from "../echoes/sets";
import {
  calcCharStats,
  computeSelfBuffs,
  computeResonanceChainsBuffs,
  computeAdditionalBaseBuffs,
  computeAdditionalBaseFromPassives,
  mergeAdditionalBaseData,
  computeCritOverflowBuffs,
  applyCharacterStatEdgeCases,
} from "../calculator/stats";
import { processAttacks, getCalculationContext } from "../calculator/attacks";
import { meetsMinStatThreshold } from "../calculator/meetsMinStatThreshold";

/**
 * Static config stored after init (sent once per optimization run)
 */
interface ProcessorConfig {
  context: any;
  minStats: any[];
  echoSetPassiveBuffs: Record<string, any>;
  mainEchoStats: Record<string, any>;
  target: string;
  damageType: string;
  rotationData?: any;
  topN: number;
  /** Loadout-independent; computed once on init */
  selfBuffsData: any;
  /** Loadout-independent; computed once on init */
  resonanceChainsBuffsData: any;
}

/**
 * Message sent from main thread to processor worker
 */
interface ProcessorMessage {
  type: "init" | "process" | "stop";
  data?: {
    batch?: any[];
    batchId?: number;
    context?: any;
    minStats?: any[];
    echoSetPassiveBuffs?: Record<string, any>;
    mainEchoStats?: Record<string, any>;
    target?: string;
    damageType?: string;
    rotationData?: any;
    topN?: number;
  };
}

/**
 * Message sent from processor worker to main thread
 */
interface ProcessorResponse {
  type: "result" | "error" | "ready";
  batchId?: number;
  results?: any[];
  processed?: number;
  error?: string;
}

let processorConfig: ProcessorConfig | null = null;
/** Local min-heap of top-N results (index 0 = worst / minimum targetValue) */
let localHeap: any[] = [];

function tryInsertLocalHeap(result: any, topN: number): boolean {
  const targetValue = result.targetValue;
  if (typeof targetValue !== "number" || !Number.isFinite(targetValue)) {
    return false;
  }

  if (localHeap.length < topN) {
    localHeap.push(result);
    if (localHeap.length === topN) {
      localHeap.sort((a, b) => a.targetValue - b.targetValue);
    }
    return true;
  }

  if (targetValue <= localHeap[0].targetValue) {
    return false;
  }

  localHeap[0] = result;
  // Bubble down to restore min-heap property
  let idx = 0;
  while (true) {
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;
    let smallest = idx;

    if (
      left < localHeap.length &&
      localHeap[left].targetValue < localHeap[smallest].targetValue
    ) {
      smallest = left;
    }
    if (
      right < localHeap.length &&
      localHeap[right].targetValue < localHeap[smallest].targetValue
    ) {
      smallest = right;
    }

    if (smallest === idx) break;

    [localHeap[idx], localHeap[smallest]] = [
      localHeap[smallest],
      localHeap[idx],
    ];
    idx = smallest;
  }
  return true;
}

/**
 * Processes a single loadout and calculates its optimization target value.
 */
function processLoadout(
  loadout: any[],
  context: any,
  minStats: any[],
  echoSetPassiveBuffs: Record<string, any>,
  mainEchoStats: Record<string, any>,
  target: string,
  damageType: string,
  rotationData: any | undefined,
  selfBuffsData: any,
  resonanceChainsBuffsData: any,
): any | null {
  try {
    const normalizedLoadout = normalizeOptimizerLoadout(loadout);

    // Calculate echo stats and set bonuses
    const echoStats = getCombinedEchoStats(normalizedLoadout);
    const echoSets = getSetsFromEchoes(normalizedLoadout);
    const echoSetBonuses = getSetBonusEffects(echoSets);
    const setBonusOnePiece = echoSetBonuses?.setBonusOnePiece ?? null;
    const setBonusOne = echoSetBonuses?.setBonusOne ?? null;
    const setBonusTwo = echoSetBonuses?.setBonusTwo ?? null;
    const mainEchoKey = normalizedLoadout[0]?.echo;
    const mainEchoBuff = mainEchoStats?.[mainEchoKey] ?? {};

    const setBonusOnePieceBuffs =
      setBonusOnePiece && echoSetPassiveBuffs?.[setBonusOnePiece]
        ? echoSetPassiveBuffs[setBonusOnePiece]
        : {};
    const setBonusOneBuffs =
      setBonusOne && echoSetPassiveBuffs?.[setBonusOne]
        ? echoSetPassiveBuffs[setBonusOne]
        : {};
    const setBonusTwoBuffs =
      setBonusTwo && echoSetPassiveBuffs?.[setBonusTwo]
        ? echoSetPassiveBuffs[setBonusTwo]
        : {};
    const allBuffsToAdd = [
      echoStats,
      mainEchoBuff,
      setBonusOnePieceBuffs,
      setBonusOneBuffs,
      setBonusTwoBuffs,
    ];
    const combinedEchoBuffs: any = {};
    allBuffsToAdd.forEach((buffs) => {
      Object.keys(buffs).forEach((key) => {
        if (combinedEchoBuffs[key]) {
          combinedEchoBuffs[key] += buffs[key];
        } else {
          combinedEchoBuffs[key] = buffs[key];
        }
      });
    });

    // Intermediate stats with hoisted self/RC buffs (echo-dependent via combinedEchoBuffs)
    let intermediateStats = calcCharStats(
      "All",
      null,
      { ignoreEchoes: true },
      combinedEchoBuffs,
      null,
      {
        baseHp: context.baseHp,
        baseAtk: context.baseAtk,
        baseDef: context.baseDef,
      },
      {
        weaponAtk: context.weaponData?.attack,
        weaponModifier: context.weaponData?.modifier,
        weaponModifierValue: context.weaponData?.modifierValue,
        weaponPassiveData: context.weaponData?.weaponPassiveStats ?? {},
      },
      selfBuffsData,
      resonanceChainsBuffsData,
      context.echoStats,
      context.customBuffs,
      context.teamBuffsData,
    );

    const additionalBaseBuffsData = computeAdditionalBaseBuffs(
      context.activeCharacterBuffs ?? {},
      context.chosenChar?.buffs ?? [],
      context.activeCharacterResonanceChains ?? {},
      context.character ?? null,
      intermediateStats.energyRegen,
      intermediateStats.totalCritRate,
      context.activeStance ?? null,
    );

    const echoSetAdditionalBaseBuffsData = computeAdditionalBaseFromPassives(
      getEnabledAdditionalBasePassives(
        [setBonusOnePiece, setBonusOne, setBonusTwo],
        context.echoSetPassivesConfig ?? {},
      ),
      intermediateStats.energyRegen,
      intermediateStats.totalCritRate,
    );
    const mergedAdditionalBaseBuffsData = mergeAdditionalBaseData(
      additionalBaseBuffsData,
      echoSetAdditionalBaseBuffsData,
    );

    // Step 4b: Compute AdditionalBase buffs using intermediate stats (resonance chains)
    let additionalBaseBuffsDataFromResonanceChains = {
      CritRate: 0,
      CritDMG: 0,
      ATK: 0,
      ATK_FLAT: 0,
    };
    // ignore Augusta, as her additional based buffs for resonance chains are handled in self buffs
    // applying this for her will double the buffs
    if (context.character !== "Augusta") {
      additionalBaseBuffsDataFromResonanceChains = computeAdditionalBaseBuffs(
        context.activeCharacterResonanceChains ?? {},
        context.chosenChar.resonanceChains ?? [],
        context.activeCharacterResonanceChains ?? {},
        context.character ?? "",
        intermediateStats.energyRegen,
        intermediateStats.totalCritRate,
        context.activeStance ?? null,
      );
    }

    const critOverflowBuffsData = computeCritOverflowBuffs(
      context.activeCharacterBuffs ?? {},
      context.chosenChar?.buffs ?? [],
      context.activeCharacterResonanceChains ?? {},
      context.chosenChar?.resonanceChains ?? [],
      intermediateStats.totalCritRate,
      context.activeStance ?? null,
    );

    const mergedSelfBuffs = {
      ...selfBuffsData,
      CritRate:
        (selfBuffsData?.CritRate || 0) +
        (mergedAdditionalBaseBuffsData?.CritRate || 0),
      CritDMG:
        (selfBuffsData?.CritDMG || 0) +
        (mergedAdditionalBaseBuffsData?.CritDMG || 0) +
        (critOverflowBuffsData?.CritDMG || 0),
      ATK: (selfBuffsData?.ATK || 0) + (mergedAdditionalBaseBuffsData?.ATK || 0),
      ATK_FLAT:
        (selfBuffsData?.ATK_FLAT || 0) +
        (mergedAdditionalBaseBuffsData?.ATK_FLAT || 0),
      EchoDMGBonus:
        (selfBuffsData?.EchoDMGBonus || 0) +
        (mergedAdditionalBaseBuffsData?.EchoDMGBonus || 0),
    };

    // merge the specificTalentBuffs together
    mergedSelfBuffs.specificTalentBuffs = Object.assign(
      {},
      selfBuffsData?.specificTalentBuffs ?? {},
      mergedAdditionalBaseBuffsData?.specificTalentBuffs ?? {},
    );
    // Step 6b: Merge AdditionalBase and CritOverflow into self buffs (self buffs)
    // ignore augusta though, otherwise it doubles up her buffs
    let mergedResonanceChainsBuffsData = { ...resonanceChainsBuffsData };
    if (context.character !== "Augusta") {
      mergedResonanceChainsBuffsData = {
        ...resonanceChainsBuffsData,
        CritRate:
          (resonanceChainsBuffsData?.CritRate || 0) +
          (additionalBaseBuffsDataFromResonanceChains?.CritRate || 0),
        CritDMG:
          (resonanceChainsBuffsData?.CritDMG || 0) +
          (additionalBaseBuffsDataFromResonanceChains?.CritDMG || 0) +
          (critOverflowBuffsData?.CritDMG || 0),
        ATK:
          (resonanceChainsBuffsData?.ATK || 0) +
          (additionalBaseBuffsDataFromResonanceChains?.ATK || 0),
        ATK_FLAT:
          (resonanceChainsBuffsData?.ATK_FLAT || 0) +
          (additionalBaseBuffsDataFromResonanceChains?.ATK_FLAT || 0),
      };
    }

    const finalStats = calcCharStats(
      "All",
      null,
      { ignoreEchoes: true },
      combinedEchoBuffs,
      null,
      {
        baseHp: context.baseHp,
        baseAtk: context.baseAtk,
        baseDef: context.baseDef,
      },
      {
        weaponAtk: context.weaponData?.attack,
        weaponModifier: context.weaponData?.modifier,
        weaponModifierValue: context.weaponData?.modifierValue,
        weaponPassiveData: context.weaponData?.weaponPassiveStats ?? {},
      },
      mergedSelfBuffs,
      mergedResonanceChainsBuffsData,
      context.echoStats,
      context.customBuffs,
      context.teamBuffsData,
    );

    applyCharacterStatEdgeCases(
      finalStats,
      context.character ?? "",
      context.activeCharacterResonanceChains ?? {},
    );

    const weaponAtk = context.weaponData?.attack;
    finalStats.totalAtk =
      (context.baseAtk + weaponAtk) * (1 + finalStats.attackPercent / 100) +
      finalStats.attackFlat;
    finalStats.totalHp =
      context.baseHp * (1 + finalStats.hpPercent / 100) + finalStats.hpFlat;
    finalStats.totalDef =
      context.baseDef * (1 + finalStats.defPercent / 100) + finalStats.defFlat;
    finalStats.totalCritRate = finalStats.critRate / 100;
    finalStats.totalCritDMG = finalStats.critDMG / 100;
    finalStats.DefIgnore = finalStats.defIgnore / 100;

    // Check min stats
    if (minStats.length > 0) {
      for (const minStat of minStats) {
        const statValue = finalStats?.[minStat.stat];
        if (
          !meetsMinStatThreshold(statValue, minStat.minValue, minStat.stat)
        ) {
          return null; // Doesn't meet requirements
        }
      }
    }

    // Calculate target value
    const targetElements = target.split(":");
    const [targetType, targetObject] = targetElements;

    let targetValue = 0;
    const resultContext: any = {
      finalStats,
      targetType,
      targetObject,
    };
    const loadoutArr = JSON.parse(JSON.stringify(normalizedLoadout));

    if (targetType === "Stat") {
      targetValue = finalStats?.[targetObject] ?? 0;
      targetValue =
        typeof targetValue === "number"
          ? targetValue
          : Number(targetValue) || 0;
    } else if (targetType === "Attack") {
      const [attackType, attackKey] = targetObject.split("|");
      const attackInfo = getAttackData(
        context.chosenChar,
        attackType,
        attackKey,
      );

      if (!attackInfo) {
        return null;
      }

      let actionTypeForAttackData;
      switch (attackType) {
        case "basicAttacks":
          actionTypeForAttackData = "basic";
          break;
        case "skillAttacks":
          actionTypeForAttackData = "skill";
          break;
        case "forteCircuitAttacks":
          actionTypeForAttackData = "forte";
          break;
        case "liberationAttacks":
          actionTypeForAttackData = "liberation";
          break;
        case "introAttacks":
          actionTypeForAttackData = "intro";
          break;
        case "tuneBreakAttacks":
          actionTypeForAttackData = "tuneBreak";
          break;
        case "outroAttacks":
          actionTypeForAttackData = "outro";
          break;
      }
      const attackData = {
        actionType: actionTypeForAttackData,
        buffs: null,
        count: 1,
        excludeSelfBuffs: false,
        excludeTeamBuffs: false,
        excludeWeaponBuffs: false,
        key: attackKey,
        label: attackInfo.label,
        talents: attackInfo.talents,
        talent: attackInfo?.talent,
        type: attackInfo.type,
        subType: attackInfo.subType,
        element: attackInfo.element,
        attribute: attackInfo?.attribute ?? null,
        alwaysCrit: attackInfo?.alwaysCrit ?? false,
      };

      const damageTargetMap = {
        Normal: "totalDamage",
        Average: "avgDamage",
        Crit: "critDamage",
      };
      const damageTargetReference =
        damageTargetMap[damageType as keyof typeof damageTargetMap] ??
        "avgDamage";

      const optimizerContext = getCalculationContext(
        context.chosenChar,
        combinedEchoBuffs,
        context.teamBuffsData,
        context.talentData,
        context.isSpectroFrazzleEnabled,
        context.spectroFrazzleStacks,
        context.isAeroErosionEnabled,
        context.aeroErosionStacks,
        context.isFusionBurstEnabled,
        context.fusionBurstStacks,
        context.isElectroFlareEnabled,
        context.electroFlareStacks,
        context.electroRageStacks,
        context.isGlacioChafeEnabled,
        context.glacioChafeStacks,
        context.characterLevel,
        context.mainEcho,
        context.mainEchoRank,
        context.rotationsList,
        context.charResonanceChainsData,
        context.charBuffsData,
        context.baseHp,
        context.baseAtk,
        context.baseDef,
        context.weaponData,
        context.customBuffs,
        finalStats.glacio ?? context.Glacio,
        finalStats.fusion ?? context.Fusion,
        finalStats.electro ?? context.Electro,
        finalStats.aero ?? context.Aero,
        finalStats.spectro ?? context.Spectro,
        finalStats.havoc ?? context.Havoc,
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
        finalStats.totalCritRate,
        finalStats.totalCritDMG,
        finalStats.DefIgnore,
        context.havocBaneStacks,
        finalStats.resistReduction,
        finalStats.totalDeepenEffect,
        context.enemyLevel,
        context.enemyResist,
        context.characters,
        context.character,
        context.enemyType,
        context.strainStacks,
      );

      const attacks = processAttacks(
        [attackData],
        optimizerContext,
        null,
        false,
        true,
        false,
        finalStats,
        combinedEchoBuffs,
      );
      targetValue = attacks?.[0]?.damage?.[damageTargetReference] ?? 0;
      targetValue =
        typeof targetValue === "number"
          ? targetValue
          : Number(targetValue) || 0;
      resultContext.attacks = attacks;
    } else if (targetType === "Rotation") {
      // Rotation processing
      if (!rotationData) {
        return null;
      }

      const rotationInfo: any = {
        id: rotationData.id,
        name: rotationData.name,
        description: rotationData.description,
        duration: rotationData.duration ?? null,
        echo: rotationData.echo ?? null,
      };

      // Build context from optimizer's finalStats
      const optimizerContext = getCalculationContext(
        context.chosenChar,
        combinedEchoBuffs,
        context.teamBuffsData,
        context.talentData,
        context.isSpectroFrazzleEnabled,
        context.spectroFrazzleStacks,
        context.isAeroErosionEnabled,
        context.aeroErosionStacks,
        context.isFusionBurstEnabled,
        context.fusionBurstStacks,
        context.isElectroFlareEnabled,
        context.electroFlareStacks,
        context.electroRageStacks,
        context.isGlacioChafeEnabled,
        context.glacioChafeStacks,
        context.characterLevel,
        context.mainEcho,
        context.mainEchoRank,
        context.rotationsList,
        context.charResonanceChainsData,
        context.charBuffsData,
        context.baseHp,
        context.baseAtk,
        context.baseDef,
        context.weaponData,
        context.customBuffs,
        finalStats.glacio ?? context.Glacio,
        finalStats.fusion ?? context.Fusion,
        finalStats.electro ?? context.Electro,
        finalStats.aero ?? context.Aero,
        finalStats.spectro ?? context.Spectro,
        finalStats.havoc ?? context.Havoc,
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
        finalStats.totalCritRate,
        finalStats.totalCritDMG,
        finalStats.DefIgnore,
        context.havocBaneStacks,
        finalStats.resistReduction,
        finalStats.totalDeepenEffect,
        context.enemyLevel,
        context.enemyResist,
        context.characters,
        context.character,
        context.enemyType,
        context.strainStacks,
      );

      const attacks = processAttacks(
        rotationData.attacks, // process all attacks in this rotation
        optimizerContext,
        null, // talentType = null since it will be figured out dynamically
        false, // hasNoTalentType = no, unless it's outro (TODO)
        true, // dynamicTalentType = yes, this will figure out the talent data for us
        false, // excludeDisabledAttacks = no, unless we need to (TODO)
        finalStats, // give our stats, it will use this instead of the global state
        combinedEchoBuffs, // provide the echoes so we can exclude them if needed
      );

      // Aggregate damage from all attacks
      const damageAggregation = {
        normalDamage: null,
        avgDamage: null,
        critDamage: null,
        healing: null,
        shield: null,
      };

      attacks.forEach((attack: any) => {
        if (attack?.originalIsEnabled === false) {
          return;
        }
        if (
          attack.type === "ElementalEffect" &&
          attack?.damage?.damage !== undefined &&
          attack?.damage?.totalDamage === undefined
        ) {
          const v = attack.damage.damage;
          damageAggregation.normalDamage =
            (damageAggregation.normalDamage || 0) + v;
          damageAggregation.avgDamage =
            (damageAggregation.avgDamage || 0) + v;
          damageAggregation.critDamage =
            (damageAggregation.critDamage || 0) + v;
          return;
        }
        if (attack?.damage?.totalDamage !== undefined) {
          damageAggregation.normalDamage =
            (damageAggregation.normalDamage || 0) + attack?.damage?.totalDamage;
        }
        if (attack?.damage?.avgDamage !== undefined) {
          damageAggregation.avgDamage =
            (damageAggregation.avgDamage || 0) + attack?.damage?.avgDamage;
        }
        if (attack?.damage?.critDamage !== undefined) {
          damageAggregation.critDamage =
            (damageAggregation.critDamage || 0) + attack?.damage?.critDamage;
        }
        if (
          attack.type === "Healing" &&
          attack?.damage?.healAmount !== undefined
        ) {
          damageAggregation.healing =
            (damageAggregation.healing || 0) + attack?.damage?.healAmount;
        }
        if (
          attack.type === "Shield" &&
          attack?.damage?.shieldAmount !== undefined
        ) {
          damageAggregation.shield =
            (damageAggregation.shield || 0) + attack?.damage?.shieldAmount;
        }
      });

      const damageTargetMap = {
        Normal: "normalDamage",
        Average: "avgDamage",
        Crit: "critDamage",
      };
      const damageTargetReference =
        damageTargetMap[damageType as keyof typeof damageTargetMap] ??
        "avgDamage";

      // @ts-ignore
      targetValue = damageAggregation[damageTargetReference] ?? 0;

      // Ensure targetValue is a number
      targetValue =
        typeof targetValue === "number"
          ? targetValue
          : Number(targetValue) || 0;
      rotationInfo.attacks = attacks;
      rotationInfo.damageAggregation = damageAggregation;
      resultContext.rotation = rotationInfo;
    } else {
      return null;
    }

    // Ensure targetValue is a number before returning
    const finalTargetValue =
      typeof targetValue === "number" ? targetValue : Number(targetValue) || 0;

    return {
      loadout: loadoutArr,
      targetValue: finalTargetValue,
      context: resultContext,
    };
  } catch (error: any) {
    console.error("Error in processLoadout:", error);
    console.error("Loadout:", loadout);
    console.error(
      "Context keys:",
      context ? Object.keys(context) : "context is null",
    );
    throw error; // Re-throw to be caught by the batch processor
  }
}

self.onmessage = (e: MessageEvent<ProcessorMessage>) => {
  try {
    const { type, data } = e.data;

    if (type === "init") {
      localHeap = [];
      if (data?.context) {
        const context = data.context;
        processorConfig = {
          context,
          minStats: Array.isArray(data.minStats) ? data.minStats : [],
          echoSetPassiveBuffs: data.echoSetPassiveBuffs ?? {},
          mainEchoStats: data.mainEchoStats ?? {},
          target: data.target ?? "",
          damageType: data.damageType ?? "Average",
          rotationData: data.rotationData ?? null,
          topN: typeof data.topN === "number" && data.topN > 0 ? data.topN : 5,
          // Echo-independent buffs — compute once per run
          resonanceChainsBuffsData: computeResonanceChainsBuffs(
            context.activeCharacterResonanceChains ?? {},
            context.chosenChar?.resonanceChains ?? [],
            context.talentData ?? {},
            context.activeStance ?? null,
          ),
          selfBuffsData: computeSelfBuffs(
            context.activeCharacterBuffs ?? {},
            context.chosenChar?.buffs ?? [],
            context.activeCharacterResonanceChains ?? {},
            context.talentData ?? {},
            context.character ?? null,
            context.activeStance ?? null,
            { havocBaneStacks: context.havocBaneStacks ?? 0 },
          ),
        };
      } else {
        processorConfig = null;
      }
      self.postMessage({ type: "ready" } as ProcessorResponse);
      return;
    }

    if (type === "stop") {
      processorConfig = null;
      localHeap = [];
      return;
    }

    if (type === "process" && data) {
      const { batch, batchId } = data;

      if (!batch || !Array.isArray(batch) || batch.length === 0) {
        console.error("Processor worker: Invalid batch received", {
          batch,
          batchId,
        });
        self.postMessage({
          type: "error",
          batchId,
          error: "Invalid batch data",
          processed: 0,
        } as ProcessorResponse);
        return;
      }

      if (!processorConfig) {
        console.error("Processor worker: Missing config (init not called)", {
          batchId,
        });
        self.postMessage({
          type: "error",
          batchId,
          error: "Missing processor config",
          processed: 0,
        } as ProcessorResponse);
        return;
      }

      const {
        context,
        minStats,
        echoSetPassiveBuffs,
        mainEchoStats,
        target,
        damageType,
        rotationData,
        topN,
        selfBuffsData,
        resonanceChainsBuffsData,
      } = processorConfig;

      try {
        // Track inserts this batch; only post those still in the local heap at batch end
        // (avoids shipping soon-evicted candidates and re-cloning unchanged heap members)
        const enteredThisBatch = new Set<any>();
        let errorCount = 0;

        for (let i = 0; i < batch.length; i++) {
          const loadout = batch[i];
          try {
            const result = processLoadout(
              loadout,
              context,
              minStats,
              echoSetPassiveBuffs,
              mainEchoStats,
              target,
              damageType,
              rotationData,
              selfBuffsData,
              resonanceChainsBuffsData,
            );

            if (result && tryInsertLocalHeap(result, topN)) {
              enteredThisBatch.add(result);
            }
          } catch (loadoutError: any) {
            errorCount++;
            console.error(
              `Error processing loadout ${i} in batch ${batchId}:`,
              loadoutError,
            );
            console.error("Loadout:", loadout);
            // Continue processing other loadouts
          }
        }

        const candidates = localHeap.filter((result) =>
          enteredThisBatch.has(result),
        );

        // Only log errors
        if (errorCount > 0) {
          console.error(
            `Processor worker: Batch ${batchId} had ${errorCount} errors out of ${batch.length} loadouts`,
          );
        }

        self.postMessage({
          type: "result",
          batchId,
          results: candidates,
          processed: batch.length,
        } as ProcessorResponse);
      } catch (error: any) {
        console.error("Fatal error in processor worker:", error);
        self.postMessage({
          type: "error",
          batchId,
          error: error?.message || "Unknown error",
        } as ProcessorResponse);
      }
    } else {
      console.warn("Processor worker: Unknown message type:", type);
    }
  } catch (error: any) {
    console.error("Fatal error in processor worker message handler:", error);
    self.postMessage({
      type: "error",
      error: error?.message || "Unknown error in message handler",
    } as ProcessorResponse);
  }
};
