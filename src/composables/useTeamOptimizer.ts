/**
 * State and orchestration for the team optimizer (ADR 0052): builds each
 * character's search from stored data, runs them one after another through the
 * normal optimizer workers, then combines and verifies the results. The math
 * lives in src/calculator/teamOptimizer.ts.
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
import { splitOptimizerWorkerCount } from "../calculator/optimizer";
import { resolveOptimizerWorkerCount } from "../utils/optimizerPreferences";
import { runOptimizerWorkers, serializeEchoes, type OptimizerRunHandle } from "../workers/optimizerRun";
import { trackEvent } from "../utils/analytics";

/** Counting stops here: past this, the exact number no longer changes the warning. */
const LOADOUT_COUNT_LIMIT = 5_000_000;
/** Roughly measured per-loadout scoring cost, only used to word the size warning. */
const ESTIMATED_SECONDS_PER_LOADOUT = 0.0004;
export const LARGE_SEARCH_LOADOUTS = 1_000_000;

export type TeamOptimizerPhase = "loading" | "setup" | "running" | "results";

export interface TeamOptimizerSlotView {
  slot: number;
  characterId: string;
  actionCount: number;
  currentDamage: number;
  damageShare: number;
  hasActions: boolean;
  eligibleEchoCount: number;
  choice: TeamOptimizerChoice;
  guard: TeamBuffGuard;
  /** Why this slot blocks a run, or null. */
  blocker: string | null;
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
    if (guard && choices[slot]?.protectTeamBuffs) return guard;
    return { floors: [], requiredMainEcho: null, requiredSetBonusLabels: [], requiredSetKeys: [], drifts: guard?.drifts ?? [] };
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

  function eligibleEchoes(slot: number): any[] {
    const choice = choices[slot];
    if (!choice) return [];
    const guard = effectiveGuard(slot);
    return eligibleTeamOptimizerEchoes({
      inventoryEchoes: inventoryEchoes.value,
      sets: choice.sets,
      requiredMainEcho: guard.requiredMainEcho,
      requiredSetKeys: guard.requiredSetKeys,
      excludedEchoIds: excludedEchoIds(slot),
    });
  }

  function mainEchoKeys(slot: number): string[] {
    const required = effectiveGuard(slot).requiredMainEcho;
    return required ? [required] : (choices[slot]?.mainEchoes ?? []);
  }

  const slots = computed<TeamOptimizerSlotView[]>(() => {
    const total = readTeamDamage(baseline.value?.total, damageType.value);
    return occupiedSlots.value
      .filter((slot) => choices[slot])
      .map((slot) => {
        const characterId = team.value.characterIds[slot];
        const choice = choices[slot];
        const currentDamage = readTeamDamage(baseline.value?.perCharacter?.[characterId]?.damageAggregation, damageType.value);
        const eligibleEchoCount = eligibleEchoes(slot).length;
        const count = actionCount(slot);
        let blocker: string | null = null;
        if (choice.goal === "damage") {
          if (!count) blocker = "No actions in this rotation";
          else if (!choice.sets.length) blocker = "Choose at least one echo set";
          else if (!mainEchoKeys(slot).length) blocker = "Choose a main echo";
          else if (!eligibleEchoCount) blocker = "No echoes available in the chosen sets";
        }
        return {
          slot,
          characterId,
          actionCount: count,
          currentDamage,
          damageShare: total > 0 ? currentDamage / total : 0,
          hasActions: count > 0,
          eligibleEchoCount,
          choice,
          guard: effectiveGuard(slot),
          blocker,
        };
      });
  });

  const searchedSlots = computed(() => slots.value.filter((slot) => slot.choice.goal === "damage"));
  const canRun = computed(() => searchedSlots.value.length > 0 && slots.value.every((slot) => !slot.blocker));

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
    const { processorCount } = splitOptimizerWorkerCount(workerCount.value);
    return (totalLoadouts.value.count * ESTIMATED_SECONDS_PER_LOADOUT) / Math.max(1, processorCount);
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

  async function initialize() {
    phase.value = "loading";
    await loadBaseline();
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
        }),
      };
    }
    phase.value = "setup";
  }

  function setGoal(slot: number, goal: TeamOptimizerGoal) {
    if (choices[slot]) choices[slot].goal = goal;
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
        const worker = new Worker(new URL("../workers/loadoutCount.worker.ts", import.meta.url), { type: "module" });
        countWorkers.push(worker);
        worker.onmessage = (e) => {
          loadoutCounts[view.slot] = e.data;
          worker.terminate();
        };
        worker.onerror = () => {
          worker.terminate();
        };
        worker.postMessage({
          echoes: serializeEchoes(eligibleEchoes(view.slot)),
          mainEchoKeys: [...mainEchoKeys(view.slot)],
          loadoutFormat: view.choice.loadoutFormat,
          limit: LOADOUT_COUNT_LIMIT,
        });
      }
    }, 250);
  }

  const countInputs = computed(() =>
    JSON.stringify(
      searchedSlots.value.map((view) => [
        view.slot,
        view.choice.sets,
        mainEchoKeys(view.slot),
        view.choice.loadoutFormat,
        [...excludedEchoIds(view.slot)].length,
        view.guard.requiredSetKeys,
      ]),
    ),
  );
  watch([countInputs, phase], () => {
    if (phase.value === "setup") startCounting();
    else stopCounting();
  });

  // --- Running -----------------------------------------------------------

  function searchSlot(view: TeamOptimizerSlotView, lane: TeamOptimizerLane) {
    return new Promise<{ rows: SearchRow[]; isTruncated: boolean; echoBuffs: TeamOptimizerEchoBuffs; processed: number } | null>(
      (resolve, reject) => {
        const data = slotData(view.slot);
        const mains = mainEchoKeys(view.slot);
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
                echoes: eligibleEchoes(view.slot),
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
                requiredSetBonusLabels: view.guard.requiredSetBonusLabels,
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

  async function run() {
    if (!canRun.value) return;
    const started = performance.now();
    isCancelled = false;
    errorMessage.value = null;
    results.value = [];
    const views = slots.value;
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
      const lists: { rows: SearchRow[]; isTruncated: boolean }[] = [];
      const echoBuffsBySlot: Array<TeamOptimizerEchoBuffs | null> = [null, null, null];
      let evaluated = 0;

      for (let index = 0; index < views.length; index++) {
        const view = views[index];
        const lane = lanes.value[index];
        if (view.choice.goal === "keep") {
          lists.push({
            rows: [{ echoIds: [], score: view.currentDamage, loadout: null, finalStats: baselineStats.value[view.slot] ?? {} }],
            isTruncated: false,
          });
          continue;
        }
        lane.status = "running";
        const searched = await searchSlot(view, lane);
        if (isCancelled || !searched) return;
        lane.status = "done";
        if (!searched.rows.length) {
          const floors = view.guard.floors.map((floor) => `${floor.label} at least ${floor.minValue}%`);
          errorMessage.value =
            `${view.characterId} has no loadouts that fit these settings` +
            (floors.length ? ` (including ${floors.join(", ")}, kept for teammates' buffs).` : ".");
          phase.value = "setup";
          return;
        }
        evaluated += searched.processed;
        echoBuffsBySlot[view.slot] = searched.echoBuffs;
        lists.push({ rows: searched.rows, isTruncated: searched.isTruncated });
      }

      const combined = combineTeamLoadouts(lists, TEAM_OPTIMIZER_TOP_N);
      if (!combined.combinations.length) {
        errorMessage.value = "No combination works without using an echo twice. Try allowing more sets.";
        phase.value = "setup";
        return;
      }

      const verified = await Promise.all(
        combined.combinations.map(async (combination, rank) => {
          const loadoutBySlot: Array<any[] | null> = [null, null, null];
          views.forEach((view, index) => {
            loadoutBySlot[view.slot] = combination.picks[index].loadout;
          });
          const verification = await verifyTeamCombination({
            team: teamInput.value,
            characters: characters.value,
            loadoutBySlot,
            echoBuffsBySlot,
            enemyConfig: enemyConfig.value,
            inventoryEchoes: inventoryEchoes.value,
            damageType: damageType.value,
            expectedTotal: combination.total,
          });
          return { combination, verification, rank };
        }),
      );
      if (isCancelled) return;
      // Ranked and displayed by the Team page's numbers, never the search's.
      verified.sort((a, b) => b.verification.total - a.verification.total);

      const best = verified[0].combination.picks;
      results.value = verified.map(({ combination, verification, rank }) => ({
        id: `team-result-${rank}`,
        total: verification.total,
        combinerTotal: combination.total,
        matchesTeamPage: verification.matches,
        characterResults: verification.characterResults,
        picks: combination.picks.map((pick, index) => ({
          slot: views[index].slot,
          characterId: views[index].characterId,
          isKept: pick.loadout === null,
          score: verification.perCharacter[views[index].characterId] ?? pick.score,
          loadout: pick.loadout,
          finalStats: pick.finalStats,
          changedFromBest: countChangedEchoes(pick.echoIds, best[index].echoIds),
        })),
      }));
      echoBuffsForSave = echoBuffsBySlot;
      isProven.value = combined.isProven;
      totalEvaluated.value = evaluated;
      elapsedMs.value = performance.now() - started;
      phase.value = "results";
      trackEvent("team-optimizer-run", { resultsFound: true, proven: combined.isProven });
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

  let echoBuffsForSave: Array<TeamOptimizerEchoBuffs | null> = [null, null, null];

  function outsideWearers(row: TeamOptimizerResultRow): string[] {
    const echoIds = row.picks.flatMap((pick) => (pick.loadout ?? []).map((echo) => echo.echoId));
    return echoesSharedOutsideTeam(
      echoIds,
      inventoryStore.equipped as Record<string, Record<string, number>>,
      team.value?.characterIds ?? [],
    );
  }

  /**
   * Saves each changed character's loadout as a new build and pins it to the
   * team slot. Existing builds are never overwritten. Returns the team's total
   * read back through the real calculation, so the UI can confirm it landed.
   */
  async function saveAsBuilds(row: TeamOptimizerResultRow): Promise<{ total: number; matches: boolean }> {
    const name = `${team.value?.name ?? "Team"} optimized`;
    for (const pick of row.picks) {
      if (!pick.loadout) continue;
      const pinned = team.value?.buildIds?.[pick.slot] ?? null;
      const character = characterStore.characters[pick.characterId] as any;
      // `createBuild` copies the active build, so start from the one this slot used.
      if (pinned && pinned !== character?.activeBuildId && character?.builds?.some((b: any) => b.id === pinned)) {
        characterStore.equipBuild(pick.characterId, pinned);
      }
      const build = characterStore.createBuild(pick.characterId, name);
      const echoIds = pick.loadout.map((echo) => echo.echoId);
      characterStore.applyEchoLoadout(pick.characterId, { echoIds, presetId: null, fillSlots: 5 });
      const applied = applyLoadoutToCharacterData(
        characterStore.characters[pick.characterId] as any,
        pick.loadout,
        echoBuffsForSave[pick.slot]!,
      );
      characterStore.$patch((state: any) => {
        const target = state.characters[pick.characterId];
        target.echoSetBonus = applied.echoSetBonus;
        target.echoSetPassives = applied.echoSetPassives;
        target.mainEcho = applied.mainEcho;
      });
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
    initialize,
    setGoal,
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
