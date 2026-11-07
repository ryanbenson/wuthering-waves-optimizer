/**
 * State and orchestration for the team optimizer (ADR 0052, 0053): lists who
 * could provide which team buff, scouts every resulting buff plan, then fully
 * searches the plans that could win through the normal optimizer workers, and
 * combines and verifies the results. The math lives in
 * src/calculator/teamOptimizer.ts and src/calculator/teamBuffPlans.ts.
 *
 * Choices live here rather than in a store: sets, main echoes and minimums are
 * the characters' existing `optimizer` settings, and goals are per-session.
 */
import { computed, onBeforeUnmount, reactive, ref, shallowRef, watch, type Ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useSettingsStore } from "../stores/settings";
import { useTeamRotationsStore } from "../stores/teamRotations";
import {
  buildCharacterCalculationContext,
  resolveCharacterEchoes,
  type TeamEnemyConfig,
} from "../calculator/buildCharacterContext";
import { resolveCharactersForBuild } from "../calculator/buildOverride";
import { calcTeamRotationDamage, type TeamRotationInput } from "../calculator/teamRotation";
import {
  TEAM_OPTIMIZER_LIST_DEPTH,
  TEAM_OPTIMIZER_TOP_N,
  applyLoadoutToCharacterData,
  buildTeamOptimizerSlotPlan,
  combineTeamLoadouts,
  countChangedEchoes,
  countEchoesSharedByTeam,
  defaultTeamOptimizerChoice,
  defaultTeamOptimizerGoal,
  deriveTeamBuffGuards,
  echoIdsWornOutsideTeam,
  echoesSharedOutsideTeam,
  eligibleTeamOptimizerEchoes,
  mergeMinStats,
  readTeamDamage,
  verifyTeamCombination,
  type TeamBuffGuard,
  type TeamOptimizerChoice,
  type TeamOptimizerDamageType,
  type TeamOptimizerEchoBuffs,
  type TeamOptimizerGoal,
  type TeamOptimizerRow,
} from "../calculator/teamOptimizer";
import {
  MAX_BUFF_PLANS,
  applyProvisionsToTeamBuffs,
  buildTeamBuffOptions,
  characterCanHeal,
  diffTeamBuffs,
  enumerateTeamBuffPlans,
  listTeamBuffOffers,
  pickVariedResults,
  provisionReceivers,
  shortlistPlans,
  teamBuffSetBonus,
  teamBuffsFromAbsentCharacters,
  teamBuffsSignature,
  type TeamBuffChange,
  type TeamBuffConfig,
  type TeamBuffOffer,
  type TeamBuffOption,
  type TeamBuffPlan,
} from "../calculator/teamBuffPlans";
import { getSetBonusEffects, getSetsFromEchoes } from "../echoes/sets";
import { getCharByName } from "../characters/characters";
import { resolveOptimizerWorkerCount } from "../utils/optimizerPreferences";
import { runOptimizerWorkers, serializeEchoes, type OptimizerRunHandle } from "../workers/optimizerRun";
import { trackEvent } from "../utils/analytics";

/** Counting stops here: past this, the exact number no longer changes the warning. */
const LOADOUT_COUNT_LIMIT = 5_000_000;
/**
 * Wall-clock time per loadout across all workers, measured on a real 340,000
 * loadout search (12 cores, about 0.5ms). Only used to word the size warning.
 */
const ESTIMATED_SECONDS_PER_LOADOUT = 0.0005;
/** Full searches a run usually needs when comparing plans, as on the 28-plan team this was measured on. */
const TYPICAL_SHORTLIST_SEARCHES = 5;
export const LARGE_SEARCH_LOADOUTS = 1_000_000;

export type TeamOptimizerPhase = "loading" | "setup" | "running" | "results";

export interface TeamOptimizerSlotView {
  slot: number;
  characterId: string;
  actionCount: number;
  currentDamage: number;
  damageShare: number;
  hasActions: boolean;
  choice: TeamOptimizerChoice;
  guard: TeamBuffGuard;
  /** The ways this character can be built, one per team buff they could provide. */
  options: TeamBuffOption[];
  /** Team buffs this character could provide that would change the team's damage. */
  offers: TeamOptimizerOffer[];
  /** Why this slot blocks a run, or null. */
  blocker: string | null;
}

export interface TeamOptimizerOffer extends TeamBuffOffer {
  /** Share of team damage this buff moves on the current builds. */
  effect: number;
  isTicked: boolean;
}

export interface TeamOptimizerProgress {
  stage: "scouting" | "searching";
  done: number;
  total: number;
}

export interface TeamOptimizerLane {
  slot: number;
  characterId: string;
  status: "kept" | "waiting" | "running" | "done";
  processed: number;
  generated: number;
  isSearchComplete: boolean;
}

export interface TeamOptimizerPick {
  slot: number;
  characterId: string;
  isKept: boolean;
  score: number;
  loadout: any[] | null;
  finalStats: Record<string, any>;
  /** Echoes that differ from the same character in the #1 result. */
  changedFromBest: number;
}

export interface TeamOptimizerResultRow {
  id: string;
  total: number;
  matchesTeamPage: boolean;
  combinerTotal: number;
  picks: TeamOptimizerPick[];
  characterResults: Record<string, any>;
  planId: string;
  /** Who provides which team buff in this result. */
  provisions: Array<{ characterId: string; defKey: string }>;
  /** How this result differs from the saved team buff settings. */
  buffChanges: TeamBuffChange[];
  teamBuffsBySlot: Record<number, TeamBuffConfig>;
  echoBuffsBySlot: Array<TeamOptimizerEchoBuffs | null>;
}

type SearchRow = TeamOptimizerRow & { loadout: any[] | null; finalStats: Record<string, any> };

export function useTeamOptimizer(teamId: Ref<string>) {
  const characterStore = useCharacterStore();
  const inventoryStore = useInventoryStore();
  const settingsStore = useSettingsStore();
  const teamStore = useTeamRotationsStore();
  const { characters } = storeToRefs(characterStore);

  const phase = ref<TeamOptimizerPhase>("loading");
  const damageType = ref<TeamOptimizerDamageType>("Average");
  const errorMessage = ref<string | null>(null);
  const choices = reactive<Record<number, TeamOptimizerChoice>>({});
  const baseline = shallowRef<Awaited<ReturnType<typeof calcTeamRotationDamage>> | null>(null);
  const baselineStats = shallowRef<Record<number, Record<string, any>>>({});
  const lanes = ref<TeamOptimizerLane[]>([]);
  const results = shallowRef<TeamOptimizerResultRow[]>([]);
  const isProven = ref(false);
  const totalEvaluated = ref(0);
  const elapsedMs = ref(0);
  const loadoutCounts = reactive<Record<number, { count: number; isCapped: boolean } | null>>({});
  /** Off means the older behavior: saved toggles stand, and guards protect them. */
  const linkTeamBuffs = ref(true);
  /** Full searches for every plan, not just the shortlist. Slower, but allows a proof. */
  const searchAllPlans = ref(false);
  const offersBySlot = shallowRef<Record<number, Array<TeamBuffOffer & { effect: number }>>>({});
  const tickedOffers = reactive<Record<number, string[]>>({});
  const progress = ref<TeamOptimizerProgress | null>(null);
  const plansCompared = ref(0);
  const plansSearched = ref(0);

  let activeRun: OptimizerRunHandle | null = null;
  let isCancelled = false;
  let countWorkers: Worker[] = [];
  let countTimer: ReturnType<typeof setTimeout> | null = null;

  const team = computed(() => teamStore.getTeamById(teamId.value) as any);
  const enemyConfig = computed<TeamEnemyConfig>(() => ({ ...team.value?.enemyConfig }));
  const inventoryEchoes = computed(() => (inventoryStore.echoes ?? []) as any[]);

  const teamInput = computed<TeamRotationInput>(() => ({
    name: team.value?.name,
    characterIds: team.value?.characterIds ?? [],
    buildIds: team.value?.buildIds,
    actions: team.value?.actions ?? [],
    duration: team.value?.duration ?? null,
  }));

  function slotData(slot: number): Record<string, any> {
    const characterId = team.value?.characterIds?.[slot];
    if (!characterId) return {};
    return (
      resolveCharactersForBuild(characters.value, characterId, team.value?.buildIds?.[slot] ?? null)[characterId] ?? {}
    );
  }

  function wornEchoIds(slot: number): string[] {
    return resolveCharacterEchoes(slotData(slot).echoes, inventoryEchoes.value)
      .map((echo) => echo?.echoId)
      .filter(Boolean);
  }

  function actionCount(slot: number): number {
    return (team.value?.actions ?? []).filter((action: any) => action.slot === slot && !action.isDisabled).length;
  }

  const occupiedSlots = computed(() =>
    [0, 1, 2].filter((slot) => team.value?.characterIds?.[slot]),
  );

  const guards = computed(() => {
    const slots = [0, 1, 2].map((slot) => {
      const characterId = team.value?.characterIds?.[slot];
      if (!characterId || !choices[slot]) return null;
      return {
        characterId,
        characterData: slotData(slot),
        goal: choices[slot].goal,
        finalStats: baselineStats.value[slot] ?? null,
        inventoryEchoes: inventoryEchoes.value,
      };
    });
    return deriveTeamBuffGuards(slots);
  });

  function effectiveGuard(slot: number): TeamBuffGuard {
    const guard = guards.value[slot];
    const empty = { requiredMainEcho: null, requiredSetBonusLabels: [], requiredSetKeys: [] };
    if (!guard || !choices[slot]?.protectTeamBuffs) {
      return { ...empty, floors: [], drifts: guard?.drifts ?? [] };
    }
    // With buffs linked, set and main echo buffs follow the plan, so only typed stats need guarding.
    return linkTeamBuffs.value ? { ...guard, ...empty } : guard;
  }

  /** Echoes a searched character can't use: kept teammates' builds, plus outside wearers if asked. */
  function excludedEchoIds(slot: number): Set<string> {
    const excluded = new Set<string>();
    for (const other of occupiedSlots.value) {
      if (other !== slot && choices[other]?.goal === "keep") {
        wornEchoIds(other).forEach((id) => excluded.add(id));
      }
    }
    if (choices[slot]?.ignoreOtherResonatorEchoes) {
      const outside = echoIdsWornOutsideTeam(
        inventoryStore.equipped as Record<string, Record<string, number>>,
        team.value?.characterIds ?? [],
      );
      outside.forEach((id) => excluded.add(id));
    }
    return excluded;
  }

  function usableEchoes(slot: number): any[] {
    const excluded = excludedEchoIds(slot);
    return inventoryEchoes.value.filter((echo) => !excluded.has(echo.echoId));
  }

  function eligibleEchoes(slot: number, option: TeamBuffOption): any[] {
    return eligibleTeamOptimizerEchoes({
      inventoryEchoes: inventoryEchoes.value,
      sets: option.sets,
      requiredMainEcho: option.requiredMainEcho,
      excludedEchoIds: excludedEchoIds(slot),
    });
  }

  function legacyOption(slot: number): TeamBuffOption {
    const choice = choices[slot];
    const guard = effectiveGuard(slot);
    const sets = [...new Set([...choice.sets, ...guard.requiredSetKeys])];
    const mainEchoes = guard.requiredMainEcho ? [guard.requiredMainEcho] : choice.mainEchoes;
    return {
      id: JSON.stringify([sets, mainEchoes]),
      provides: [],
      sets,
      mainEchoes,
      requiredSetBonusLabels: guard.requiredSetBonusLabels,
      requiredMainEcho: guard.requiredMainEcho,
    };
  }

  /** The highest-damage character only provides what they'd wear anyway. */
  const carrySlot = computed(() => {
    let best: number | null = null;
    let bestDamage = -1;
    for (const slot of occupiedSlots.value) {
      const damage = readTeamDamage(
        baseline.value?.perCharacter?.[team.value.characterIds[slot]]?.damageAggregation,
        damageType.value,
      );
      if (damage > bestDamage) {
        best = slot;
        bestDamage = damage;
      }
    }
    return best;
  });

  function slotOffers(slot: number): Array<TeamBuffOffer & { effect: number }> {
    const offers = offersBySlot.value[slot] ?? [];
    if (slot !== carrySlot.value) return offers;
    const choice = choices[slot];
    return offers.filter((offer) =>
      offer.source.kind === "set"
        ? choice?.sets.includes(offer.source.setKey)
        : choice?.mainEchoes.includes(offer.source.echoKey),
    );
  }

  function tickedSlotOffers(slot: number): TeamBuffOffer[] {
    const ticked = tickedOffers[slot] ?? [];
    return slotOffers(slot).filter((offer) => ticked.includes(offer.defKey));
  }

  /** A kept build provides what it's actually wearing, if the player counts that buff. */
  function keptOption(slot: number): TeamBuffOption {
    const data = slotData(slot);
    const worn = resolveCharacterEchoes(data.echoes, inventoryEchoes.value).filter((echo) => echo?.echo);
    const bonuses = getSetBonusEffects(getSetsFromEchoes(worn));
    const activeLabels = [bonuses.setBonusOnePiece, bonuses.setBonusOne, bonuses.setBonusTwo];
    const wornMain = data.mainEcho?.echo ?? worn[0]?.echo ?? null;
    const provides = tickedSlotOffers(slot)
      .filter((offer) =>
        offer.source.kind === "main"
          ? offer.source.echoKey === wornMain
          : activeLabels.includes(teamBuffSetBonus(offer.source.setKey)?.label ?? null),
      )
      .map((offer) => offer.defKey);
    return {
      id: JSON.stringify(["kept", provides]),
      provides,
      sets: [],
      mainEchoes: [],
      requiredSetBonusLabels: [],
      requiredMainEcho: null,
    };
  }

  function slotOptions(slot: number): TeamBuffOption[] {
    const choice = choices[slot];
    if (!choice) return [];
    if (!linkTeamBuffs.value) return [legacyOption(slot)];
    if (choice.goal === "keep") return [keptOption(slot)];
    return buildTeamBuffOptions({
      choiceSets: choice.sets,
      choiceMainEchoes: choice.mainEchoes,
      offers: tickedSlotOffers(slot),
      usableEchoes: usableEchoes(slot),
    });
  }

  const slots = computed<TeamOptimizerSlotView[]>(() => {
    const total = readTeamDamage(baseline.value?.total, damageType.value);
    return occupiedSlots.value
      .filter((slot) => choices[slot])
      .map((slot) => {
        const characterId = team.value.characterIds[slot];
        const choice = choices[slot];
        const currentDamage = readTeamDamage(baseline.value?.perCharacter?.[characterId]?.damageAggregation, damageType.value);
        const options = slotOptions(slot);
        const ticked = tickedOffers[slot] ?? [];
        const count = actionCount(slot);
        let blocker: string | null = null;
        if (choice.goal === "damage") {
          if (!count) blocker = "No actions in this rotation";
          else if (linkTeamBuffs.value) {
            if (!options.length) blocker = "Choose an echo set and main echo, or a team buff to provide";
            else if (!options.some((option) => eligibleEchoes(slot, option).length)) {
              blocker = "No echoes available in the chosen sets";
            }
          } else if (!choice.sets.length) blocker = "Choose at least one echo set";
          else if (!options[0].mainEchoes.length) blocker = "Choose a main echo";
          else if (!eligibleEchoes(slot, options[0]).length) blocker = "No echoes available in the chosen sets";
        }
        return {
          slot,
          characterId,
          actionCount: count,
          currentDamage,
          damageShare: total > 0 ? currentDamage / total : 0,
          hasActions: count > 0,
          choice,
          guard: effectiveGuard(slot),
          options,
          offers: slotOffers(slot).map((offer) => ({ ...offer, isTicked: ticked.includes(offer.defKey) })),
          blocker,
        };
      });
  });

  const searchedSlots = computed(() => slots.value.filter((slot) => slot.choice.goal === "damage"));
  const canRun = computed(() => searchedSlots.value.length > 0 && slots.value.every((slot) => !slot.blocker));

  const planEnumeration = computed(() =>
    enumerateTeamBuffPlans(
      slots.value.map((view) => ({ slot: view.slot, characterId: view.characterId, options: view.options })),
    ),
  );
  const planCount = computed(() => planEnumeration.value.plans.length);

  /** Saved kit buffs from characters who aren't on this team, which the team's total still counts. */
  const absentBuffSources = computed(() =>
    occupiedSlots.value
      .map((slot) => ({
        characterId: team.value.characterIds[slot] as string,
        absent: teamBuffsFromAbsentCharacters(slotData(slot), team.value.characterIds),
      }))
      .filter((entry) => entry.absent.length),
  );

  const totalLoadouts = computed(() => {
    let count = 0;
    let isCapped = false;
    let isCounting = false;
    for (const slot of searchedSlots.value) {
      const entry = loadoutCounts[slot.slot];
      if (!entry) isCounting = true;
      else {
        count += entry.count;
        isCapped = isCapped || entry.isCapped;
      }
    }
    return { count, isCapped, isCounting };
  });

  const workerCount = computed(() =>
    resolveOptimizerWorkerCount((settingsStore.config as { optimizerWorkerCount?: unknown })?.optimizerWorkerCount),
  );

  const estimatedSeconds = computed(() => {
    const plans = planCount.value;
    const searches = searchAllPlans.value ? plans : Math.min(plans, TYPICAL_SHORTLIST_SEARCHES);
    return totalLoadouts.value.count * ESTIMATED_SECONDS_PER_LOADOUT * Math.max(1, searches);
  });

  /** Echoes the current builds wear twice, which makes the "current" total impossible in-game. */
  const sharedEchoCount = computed(() =>
    countEchoesSharedByTeam(occupiedSlots.value.map((slot) => wornEchoIds(slot))),
  );

  async function loadBaseline() {
    const t = team.value;
    if (!t) return;
    baseline.value = await calcTeamRotationDamage(teamInput.value, characters.value, enemyConfig.value, inventoryEchoes.value);
    const stats: Record<number, Record<string, any>> = {};
    await Promise.all(
      occupiedSlots.value.map(async (slot) => {
        const characterId = t.characterIds[slot];
        const resolved = resolveCharactersForBuild(characters.value, characterId, t.buildIds?.[slot] ?? null);
        const built = await buildCharacterCalculationContext(characterId, resolved, enemyConfig.value, inventoryEchoes.value);
        stats[slot] = built.finalStats;
      }),
    );
    baselineStats.value = stats;
  }

  /** Team characters with any pinned builds resolved, so edits to them can't be replaced by the build. */
  function flatTeamCharacters(): Record<string, any> {
    let flat = characters.value as Record<string, any>;
    for (const slot of occupiedSlots.value) {
      flat = resolveCharactersForBuild(flat, team.value.characterIds[slot], team.value.buildIds?.[slot] ?? null);
    }
    return flat;
  }

  const flatTeamInput = computed<TeamRotationInput>(() => ({ ...teamInput.value, buildIds: [null, null, null] }));
  const isTeamFull = computed(() => occupiedSlots.value.length === 3);

  async function calcFlat(flat: Record<string, any>) {
    return calcTeamRotationDamage(flatTeamInput.value, flat, enemyConfig.value, inventoryEchoes.value);
  }

  /**
   * What each character could provide, dropping anything that wouldn't move the
   * team's damage (a Glacio buff on a Fusion team). That's what keeps the number
   * of plans small enough to compare them all.
   */
  async function loadOffers() {
    const flat = flatTeamCharacters();
    const bySlot: Record<number, Array<TeamBuffOffer & { effect: number }>> = {};
    const total = readTeamDamage(baseline.value?.total, damageType.value);
    for (const slot of occupiedSlots.value) {
      const others = occupiedSlots.value.filter((other) => other !== slot);
      const character = await getCharByName(team.value.characterIds[slot]);
      const offers = listTeamBuffOffers({
        usableEchoes: inventoryEchoes.value,
        teammateBuffConfigs: others.map((other) => flat[team.value.characterIds[other]]?.teamBuffs?.buffs),
        canHeal: characterCanHeal(character),
      });
      const withEffect: Array<TeamBuffOffer & { effect: number }> = [];
      for (const offer of offers) {
        const receivers = provisionReceivers({ slot, defKey: offer.defKey }, teamInput.value.actions, occupiedSlots.value);
        const setBuff = (isEnabled: boolean) => {
          let next = flat;
          for (const receiver of receivers) {
            const id = team.value.characterIds[receiver];
            const teamBuffs = applyProvisionsToTeamBuffs({
              teamBuffs: flat[id]?.teamBuffs,
              provided: isEnabled ? [offer.defKey] : [],
              isTeamFull: false,
            });
            if (!isEnabled) teamBuffs.buffs[offer.defKey] = { ...teamBuffs.buffs[offer.defKey], isEnabled: false };
            next = { ...next, [id]: { ...next[id], teamBuffs } };
          }
          return next;
        };
        const on = readTeamDamage((await calcFlat(setBuff(true))).total, damageType.value);
        const off = readTeamDamage((await calcFlat(setBuff(false))).total, damageType.value);
        if (on === off) continue;
        withEffect.push({ ...offer, effect: total > 0 ? (on - off) / total : 0 });
      }
      bySlot[slot] = withEffect.sort((a, b) => b.effect - a.effect);
      tickedOffers[slot] = withEffect.filter((offer) => offer.isPreselected).map((offer) => offer.defKey);
    }
    offersBySlot.value = bySlot;
  }

  async function initialize() {
    phase.value = "loading";
    await loadBaseline();
    await loadOffers();
    const total = readTeamDamage(baseline.value?.total, damageType.value);
    for (const slot of occupiedSlots.value) {
      const characterId = team.value.characterIds[slot];
      const data = slotData(slot);
      const base = defaultTeamOptimizerChoice(data, inventoryEchoes.value);
      const damage = readTeamDamage(baseline.value?.perCharacter?.[characterId]?.damageAggregation, damageType.value);
      const hasEligibleEchoes =
        eligibleTeamOptimizerEchoes({ inventoryEchoes: inventoryEchoes.value, sets: base.sets }).length > 0;
      choices[slot] = {
        ...base,
        goal: defaultTeamOptimizerGoal({
          hasActions: actionCount(slot) > 0,
          damageShare: total > 0 ? damage / total : 0,
          hasEligibleEchoes,
          canProvideTeamBuffs: slot !== carrySlot.value && (tickedOffers[slot] ?? []).length > 0,
        }),
      };
    }
    phase.value = "setup";
  }

  function setGoal(slot: number, goal: TeamOptimizerGoal) {
    if (choices[slot]) choices[slot].goal = goal;
  }

  function setOfferTicked(slot: number, defKey: string, isTicked: boolean) {
    const ticked = tickedOffers[slot] ?? [];
    tickedOffers[slot] = isTicked ? [...new Set([...ticked, defKey])] : ticked.filter((key) => key !== defKey);
  }

  function setProtectTeamBuffs(slot: number, value: boolean) {
    if (choices[slot]) choices[slot].protectTeamBuffs = value;
  }

  function updateChoice(
    slot: number,
    update: Partial<Pick<TeamOptimizerChoice, "sets" | "mainEchoes" | "minStats" | "ignoreOtherResonatorEchoes" | "loadoutFormat">>,
  ) {
    if (choices[slot]) Object.assign(choices[slot], update);
  }

  // --- Counting loadouts, off the main thread ----------------------------

  function stopCounting() {
    if (countTimer) clearTimeout(countTimer);
    countTimer = null;
    countWorkers.forEach((worker) => worker.terminate());
    countWorkers = [];
  }

  function startCounting() {
    stopCounting();
    for (const key of Object.keys(loadoutCounts)) loadoutCounts[Number(key)] = null;
    countTimer = setTimeout(() => {
      for (const view of searchedSlots.value) {
        if (view.blocker) {
          loadoutCounts[view.slot] = { count: 0, isCapped: false };
          continue;
        }
        let remaining = view.options.length;
        const tally = { count: 0, isCapped: false };
        for (const option of view.options) {
          const worker = new Worker(new URL("../workers/loadoutCount.worker.ts", import.meta.url), { type: "module" });
          countWorkers.push(worker);
          worker.onmessage = (e) => {
            tally.count += e.data.count;
            tally.isCapped = tally.isCapped || e.data.isCapped;
            remaining--;
            if (!remaining) loadoutCounts[view.slot] = { ...tally };
            worker.terminate();
          };
          worker.onerror = () => {
            worker.terminate();
          };
          worker.postMessage({
            echoes: serializeEchoes(eligibleEchoes(view.slot, option)),
            mainEchoKeys: [...option.mainEchoes],
            loadoutFormat: view.choice.loadoutFormat,
            limit: LOADOUT_COUNT_LIMIT,
          });
        }
      }
    }, 250);
  }

  const countInputs = computed(() =>
    JSON.stringify(
      searchedSlots.value.map((view) => [
        view.slot,
        view.options.map((option) => option.id),
        view.choice.loadoutFormat,
        [...excludedEchoIds(view.slot)].length,
      ]),
    ),
  );
  watch([countInputs, phase], () => {
    if (phase.value === "setup") startCounting();
    else stopCounting();
  });

  // --- Running -----------------------------------------------------------

  function searchSlot(
    view: TeamOptimizerSlotView,
    option: TeamBuffOption,
    data: Record<string, any>,
    lane: TeamOptimizerLane,
  ) {
    return new Promise<{ rows: SearchRow[]; isTruncated: boolean; echoBuffs: TeamOptimizerEchoBuffs; processed: number } | null>(
      (resolve, reject) => {
        const mains = option.mainEchoes;
        buildTeamOptimizerSlotPlan({
          team: teamInput.value,
          slot: view.slot,
          characterId: view.characterId,
          characterData: data,
          enemyConfig: enemyConfig.value,
          inventoryEchoes: inventoryEchoes.value,
          mainEchoKeys: mains,
        })
          .then((plan) => {
            if (isCancelled) return resolve(null);
            activeRun = runOptimizerWorkers(
              {
                echoes: eligibleEchoes(view.slot, option),
                context: plan.context,
                topN: TEAM_OPTIMIZER_LIST_DEPTH,
                mainEchoKeys: [...mains],
                minStats: mergeMinStats(view.choice.minStats, view.guard.floors),
                echoSetPassiveBuffs: plan.echoBuffs.echoSetPassiveBuffs,
                mainEchoStats: plan.echoBuffs.mainEchoStats,
                target: plan.target,
                damageType: damageType.value,
                rotationData: plan.rotationData,
                loadoutFormat: view.choice.loadoutFormat,
                workerCount: workerCount.value,
                slimResults: true,
                requiredSetBonusLabels: option.requiredSetBonusLabels,
              },
              {
                onProcessed: (processed) => {
                  lane.processed = processed;
                },
                onGenerated: (generated) => {
                  lane.generated = generated;
                },
                onSearchComplete: () => {
                  lane.isSearchComplete = true;
                },
                onAborted: () => reject(new Error("Could not start the search.")),
                onFinished: ({ results: found, totalProcessed }) => {
                  activeRun = null;
                  const rows: SearchRow[] = found.map((result: any) => ({
                    echoIds: result.loadout.map((echo: any) => echo.echoId),
                    score: result.targetValue,
                    loadout: result.loadout,
                    finalStats: result.context?.finalStats ?? {},
                  }));
                  resolve({
                    rows,
                    isTruncated: found.length >= TEAM_OPTIMIZER_LIST_DEPTH,
                    echoBuffs: plan.echoBuffs,
                    processed: totalProcessed,
                  });
                },
              },
            );
          })
          .catch(reject);
      },
    );
  }

  /** The team's characters as a plan would leave them: echo buffs on only where someone provides them. */
  function planCharacters(plan: TeamBuffPlan, views: TeamOptimizerSlotView[]): Record<string, any> {
    const flat = flatTeamCharacters();
    if (!linkTeamBuffs.value) return flat;
    const provided = new Map<number, string[]>();
    views.forEach((view, index) => {
      for (const defKey of plan.options[index].provides) {
        for (const receiver of provisionReceivers({ slot: view.slot, defKey }, teamInput.value.actions, occupiedSlots.value)) {
          provided.set(receiver, [...(provided.get(receiver) ?? []), defKey]);
        }
      }
    });
    const next = { ...flat };
    for (const view of views) {
      next[view.characterId] = {
        ...flat[view.characterId],
        teamBuffs: applyProvisionsToTeamBuffs({
          teamBuffs: flat[view.characterId]?.teamBuffs,
          provided: provided.get(view.slot) ?? [],
          isTeamFull: isTeamFull.value,
        }),
      };
    }
    return next;
  }

  async function run() {
    if (!canRun.value) return;
    const started = performance.now();
    isCancelled = false;
    errorMessage.value = null;
    results.value = [];
    progress.value = null;
    const views = slots.value;
    const { plans, isCapped } = planEnumeration.value;
    lanes.value = views.map((view) => ({
      slot: view.slot,
      characterId: view.characterId,
      status: view.choice.goal === "keep" ? "kept" : "waiting",
      processed: 0,
      generated: 0,
      isSearchComplete: false,
    }));
    phase.value = "running";

    try {
      type Searched = { rows: SearchRow[]; isTruncated: boolean; echoBuffs: TeamOptimizerEchoBuffs | null };
      // One search per character, option and set of received buffs, however many plans share it.
      const cache = new Map<string, Searched>();
      let evaluated = 0;
      let failedSlot: TeamOptimizerSlotView | null = null;

      const listFor = async (index: number, plan: TeamBuffPlan, flat: Record<string, any>): Promise<Searched | null> => {
        const view = views[index];
        const option = plan.options[index];
        const data = flat[view.characterId];
        const key = JSON.stringify([view.slot, option.id, teamBuffsSignature(data?.teamBuffs)]);
        const cached = cache.get(key);
        if (cached) return cached;
        let list: Searched;
        if (view.choice.goal === "keep") {
          const result = await calcFlat(flat);
          const score = readTeamDamage(result.perCharacter?.[view.characterId]?.damageAggregation, damageType.value);
          list = {
            rows: [{ echoIds: [], score, loadout: null, finalStats: baselineStats.value[view.slot] ?? {} }],
            isTruncated: false,
            echoBuffs: null,
          };
        } else {
          const lane = lanes.value[index];
          lane.status = "running";
          lane.processed = 0;
          lane.generated = 0;
          lane.isSearchComplete = false;
          const searched = await searchSlot(view, option, data, lane);
          if (!searched) return null;
          lane.status = "done";
          evaluated += searched.processed;
          list = { rows: searched.rows, isTruncated: searched.isTruncated, echoBuffs: searched.echoBuffs };
        }
        cache.set(key, list);
        return list;
      };

      // Scouting: each option's best build, then every plan's real total with those builds.
      let estimated: Array<TeamBuffPlan & { estimate: number }> = plans.map((plan) => ({ ...plan, estimate: 0 }));
      if (plans.length > 1) {
        const scoutPlan = plans[0];
        const scoutFlat = planCharacters(scoutPlan, views);
        const optionKey = (index: number, option: TeamBuffOption) => `${index}|${option.id}`;
        const scouts = new Map<string, Searched>();
        const optionTotal = views.reduce((sum, view) => sum + view.options.length, 0);
        progress.value = { stage: "scouting", done: 0, total: optionTotal };
        for (let index = 0; index < views.length; index++) {
          for (const option of views[index].options) {
            const scoutOptions = [...scoutPlan.options];
            scoutOptions[index] = option;
            const list = await listFor(index, { id: "", options: scoutOptions }, scoutFlat);
            if (isCancelled || !list) return;
            scouts.set(optionKey(index, option), list);
            progress.value = { stage: "scouting", done: progress.value.done + 1, total: optionTotal };
          }
        }
        const viable: typeof estimated = [];
        for (const plan of plans) {
          const lists = plan.options.map((option, index) => scouts.get(optionKey(index, option))!);
          if (lists.some((list) => !list.rows.length)) continue;
          let flat = planCharacters(plan, views);
          views.forEach((view, index) => {
            const row = lists[index].rows[0];
            const echoBuffs = lists[index].echoBuffs;
            if (row.loadout && echoBuffs) {
              flat = { ...flat, [view.characterId]: applyLoadoutToCharacterData(flat[view.characterId], row.loadout, echoBuffs) };
            }
          });
          const result = await calcFlat(flat);
          if (isCancelled) return;
          viable.push({ ...plan, estimate: readTeamDamage(result.total, damageType.value) });
        }
        estimated = viable;
      }

      const toSearch = searchAllPlans.value ? estimated : shortlistPlans(estimated);
      const candidates: Array<{ row: TeamOptimizerResultRow; rank: number }> = [];
      // The most any plan could hold beyond its kept rows, for proving the winner.
      let unseenBound = -Infinity;
      let isBoundKnown = true;
      let bestCombinerTotal = -Infinity;
      progress.value = { stage: "searching", done: 0, total: toSearch.length };

      for (const [planIndex, plan] of toSearch.entries()) {
        const flat = planCharacters(plan, views);
        const lists: Searched[] = [];
        for (let index = 0; index < views.length; index++) {
          const list = await listFor(index, plan, flat);
          if (isCancelled || !list) return;
          if (!list.rows.length) failedSlot = views[index];
          lists.push(list);
        }
        progress.value = { stage: "searching", done: planIndex + 1, total: toSearch.length };
        if (lists.some((list) => !list.rows.length)) continue;

        const combined = combineTeamLoadouts(lists, TEAM_OPTIMIZER_TOP_N);
        if (combined.unseenBound === null) isBoundKnown = false;
        else unseenBound = Math.max(unseenBound, combined.unseenBound);
        bestCombinerTotal = Math.max(bestCombinerTotal, combined.combinations[0]?.total ?? -Infinity);
        const echoBuffsBySlot: Array<TeamOptimizerEchoBuffs | null> = [null, null, null];
        const teamBuffsBySlot: Record<number, TeamBuffConfig> = {};
        const buffChanges: TeamBuffChange[] = [];
        const saved = flatTeamCharacters();
        views.forEach((view, index) => {
          echoBuffsBySlot[view.slot] = lists[index].echoBuffs;
          const teamBuffs = flat[view.characterId]?.teamBuffs;
          if (!linkTeamBuffs.value) return;
          const changes = diffTeamBuffs(view.characterId, saved[view.characterId]?.teamBuffs, teamBuffs ?? {});
          if (changes.length) teamBuffsBySlot[view.slot] = teamBuffs;
          buffChanges.push(...changes);
        });
        const provisions = views.flatMap((view, index) =>
          plan.options[index].provides.map((defKey) => ({ characterId: view.characterId, defKey })),
        );

        for (const [rank, combination] of combined.combinations.entries()) {
          const loadoutBySlot: Array<any[] | null> = [null, null, null];
          views.forEach((view, index) => {
            loadoutBySlot[view.slot] = combination.picks[index].loadout;
          });
          const verification = await verifyTeamCombination({
            team: flatTeamInput.value,
            characters: flat,
            loadoutBySlot,
            echoBuffsBySlot,
            enemyConfig: enemyConfig.value,
            inventoryEchoes: inventoryEchoes.value,
            damageType: damageType.value,
            expectedTotal: combination.total,
          });
          if (isCancelled) return;
          candidates.push({
            rank,
            row: {
              id: `team-result-${planIndex}-${rank}`,
              // Ranked and displayed by the Team page's numbers, never the search's.
              total: verification.total,
              combinerTotal: combination.total,
              matchesTeamPage: verification.matches,
              characterResults: verification.characterResults,
              planId: plan.id,
              provisions,
              buffChanges,
              teamBuffsBySlot,
              echoBuffsBySlot,
              picks: combination.picks.map((pick, index) => ({
                slot: views[index].slot,
                characterId: views[index].characterId,
                isKept: pick.loadout === null,
                score: verification.perCharacter[views[index].characterId] ?? pick.score,
                loadout: pick.loadout,
                finalStats: pick.finalStats,
                changedFromBest: 0,
              })),
            },
          });
        }
      }

      if (!candidates.length) {
        if (failedSlot) {
          const floors = failedSlot.guard.floors.map((floor) => `${floor.label} at least ${floor.minValue}%`);
          errorMessage.value =
            `${failedSlot.characterId} has no loadouts that fit these settings` +
            (floors.length ? ` (including ${floors.join(", ")}, kept for teammates' buffs).` : ".");
        } else {
          errorMessage.value = "No combination works without using an echo twice. Try allowing more sets.";
        }
        phase.value = "setup";
        return;
      }

      const shown = pickVariedResults(
        candidates.map(({ row }) => row),
        TEAM_OPTIMIZER_TOP_N,
      );
      const best = shown[0].picks;
      results.value = shown.map((row) => ({
        ...row,
        picks: row.picks.map((pick, index) => ({
          ...pick,
          changedFromBest: countChangedEchoes(
            (pick.loadout ?? []).map((echo) => echo.echoId),
            (best[index].loadout ?? []).map((echo) => echo.echoId),
          ),
        })),
      }));
      // Claims only that nothing beats #1, so a plan far behind needs no proof of its own top 5.
      // Never with a plan unsearched: a skipped plan could always hold something better.
      isProven.value =
        isBoundKnown && !isCapped && toSearch.length === estimated.length && bestCombinerTotal >= unseenBound;
      plansCompared.value = estimated.length;
      plansSearched.value = toSearch.length;
      totalEvaluated.value = evaluated;
      elapsedMs.value = performance.now() - started;
      progress.value = null;
      phase.value = "results";
      trackEvent("team-optimizer-run", { resultsFound: true, proven: isProven.value, plans: estimated.length });
    } catch (error: any) {
      console.error("Team optimizer failed:", error);
      errorMessage.value = error?.message || "The search failed. Try again.";
      phase.value = "setup";
    }
  }

  function cancel() {
    isCancelled = true;
    activeRun?.cancel();
    activeRun = null;
    phase.value = "setup";
  }

  function editSetup() {
    results.value = [];
    phase.value = "setup";
  }

  // --- Saving ------------------------------------------------------------

  /** Characters a result would add a build for: new echoes, or team buff settings to save. */
  function changedCharacters(row: TeamOptimizerResultRow): string[] {
    return row.picks
      .filter((pick) => pick.loadout || row.teamBuffsBySlot[pick.slot])
      .map((pick) => pick.characterId);
  }

  function outsideWearers(row: TeamOptimizerResultRow): string[] {
    const echoIds = row.picks.flatMap((pick) => (pick.loadout ?? []).map((echo) => echo.echoId));
    return echoesSharedOutsideTeam(
      echoIds,
      inventoryStore.equipped as Record<string, Record<string, number>>,
      team.value?.characterIds ?? [],
    );
  }

  /**
   * Saves each changed character's loadout and team buff settings as a new build
   * and pins it to the team slot, so the Team page agrees with what was shown.
   * Existing builds are never overwritten. Returns the team's total
   * read back through the real calculation, so the UI can confirm it landed.
   */
  async function saveAsBuilds(row: TeamOptimizerResultRow): Promise<{ total: number; matches: boolean }> {
    const name = `${team.value?.name ?? "Team"} optimized`;
    for (const pick of row.picks) {
      const teamBuffs = row.teamBuffsBySlot[pick.slot];
      if (!pick.loadout && !teamBuffs) continue;
      const pinned = team.value?.buildIds?.[pick.slot] ?? null;
      const character = characterStore.characters[pick.characterId] as any;
      // `createBuild` copies the active build, so start from the one this slot used.
      if (pinned && pinned !== character?.activeBuildId && character?.builds?.some((b: any) => b.id === pinned)) {
        characterStore.equipBuild(pick.characterId, pinned);
      }
      const build = characterStore.createBuild(pick.characterId, name);
      const loadout = pick.loadout;
      const echoBuffs = row.echoBuffsBySlot[pick.slot];
      if (loadout && echoBuffs) {
        const echoIds = loadout.map((echo) => echo.echoId);
        characterStore.applyEchoLoadout(pick.characterId, { echoIds, presetId: null, fillSlots: 5 });
        const applied = applyLoadoutToCharacterData(characterStore.characters[pick.characterId] as any, loadout, echoBuffs);
        characterStore.$patch((state: any) => {
          const target = state.characters[pick.characterId];
          target.echoSetBonus = applied.echoSetBonus;
          target.echoSetPassives = applied.echoSetPassives;
          target.mainEcho = applied.mainEcho;
        });
      }
      if (teamBuffs) {
        characterStore.$patch((state: any) => {
          state.characters[pick.characterId].teamBuffs = JSON.parse(JSON.stringify(teamBuffs));
        });
      }
      teamStore.setTeamCharacterBuild(teamId.value, pick.slot, build.id);
    }
    await loadBaseline();
    const total = readTeamDamage(baseline.value?.total, damageType.value);
    trackEvent("team-optimizer-save");
    return { total, matches: row.total > 0 && Math.abs(total / row.total - 1) <= 1e-6 };
  }

  onBeforeUnmount(() => {
    stopCounting();
    isCancelled = true;
    activeRun?.cancel();
  });

  return {
    phase,
    team,
    damageType,
    errorMessage,
    slots,
    searchedSlots,
    canRun,
    totalLoadouts,
    estimatedSeconds,
    sharedEchoCount,
    baseline,
    baselineStats,
    lanes,
    results,
    isProven,
    totalEvaluated,
    elapsedMs,
    loadoutCounts,
    linkTeamBuffs,
    searchAllPlans,
    planCount,
    isPlanListCapped: computed(() => planEnumeration.value.isCapped),
    maxPlans: MAX_BUFF_PLANS,
    absentBuffSources,
    progress,
    plansCompared,
    plansSearched,
    changedCharacters,
    initialize,
    setGoal,
    setOfferTicked,
    setProtectTeamBuffs,
    updateChoice,
    run,
    cancel,
    editSetup,
    outsideWearers,
    saveAsBuilds,
    readCurrentTotal: () => readTeamDamage(baseline.value?.total, damageType.value),
  };
}
