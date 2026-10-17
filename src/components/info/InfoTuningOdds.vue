<template>
  <div class="flex flex-col gap-4" data-test-tuning-planner>
    <div class="flex flex-wrap justify-between items-end gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-bold">Tuning planner</h1>
        <p class="text-sm opacity-70 max-w-xl">
          Pick the substats you want and the lowest roll you'd accept. See how
          often a fresh +0 echo gets there.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(preset, key) in TUNING_GOAL_PRESETS"
          :key="key"
          type="button"
          class="btn btn-sm"
          :data-test-tuning-planner-preset="key"
          @click="setGoal(preset.goal)">
          {{ preset.label }}
        </button>
        <button type="button" class="btn btn-sm btn-ghost" data-test-tuning-planner-clear @click="setGoal([])">
          Clear
        </button>
      </div>
    </div>

    <!-- Info's content column is ~600-900px wide, too narrow for a side
         column, so picks stack above a two-up grid of results. -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4">
        <section class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
          <div class="flex justify-between items-baseline">
            <h2 class="text-xs font-bold uppercase tracking-wider opacity-60">Substats you want</h2>
            <span class="text-xs tabular-nums opacity-60">{{ goal.length }} / {{ ECHO_SUBSTAT_SLOTS }} picked</span>
          </div>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
            <button
              v-for="stat in subStats"
              :key="stat"
              type="button"
              class="btn btn-sm justify-start"
              :class="isPicked(stat) ? 'btn-primary' : 'btn-ghost bg-base-100'"
              :aria-pressed="isPicked(stat)"
              :disabled="!isPicked(stat) && goal.length >= ECHO_SUBSTAT_SLOTS"
              :data-test-tuning-planner-stat="stat"
              @click="toggleStat(stat)">
              {{ getReadableSubStatLabel(stat) }}
            </button>
          </div>
          <p class="text-xs opacity-60">
            Each echo gets 5 of these 13, never the same one twice. Every
            remaining substat is equally likely on each tune.
          </p>
        </section>

        <section class="bg-base-200 rounded-xl p-4 flex flex-col gap-4">
          <h2 class="text-xs font-bold uppercase tracking-wider opacity-60">Lowest roll you'd accept</h2>
          <p v-if="!goal.length" class="text-sm opacity-70">Pick at least one substat above.</p>
          <div v-for="line in goal" :key="line.stat" class="flex flex-col gap-2">
            <div class="flex justify-between items-baseline gap-2">
              <span class="font-semibold">{{ getReadableSubStatLabel(line.stat) }}</span>
              <span class="text-xs opacity-70">
                {{
                  line.min == null
                    ? "any roll is fine"
                    : `${formatTuningChance(rollChanceAtLeast(line.stat, line.min))} of rolls qualify`
                }}
              </span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="option in getMinOptions(line.stat)"
                :key="String(option.value)"
                type="button"
                class="btn btn-sm h-auto min-h-11 py-1 flex-col gap-0 font-mono"
                :class="line.min === option.value ? 'btn-primary' : 'btn-ghost bg-base-100'"
                :aria-pressed="line.min === option.value"
                :data-test-tuning-planner-min="`${line.stat}:${option.value ?? 'any'}`"
                @click="setMin(line.stat, option.value)">
                <span class="text-xs font-semibold">{{ option.label }}</span>
                <span class="text-[.65rem] opacity-80">{{ option.chance }}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div class="grid gap-4 md:grid-cols-2 items-start">
        <section class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
          <h2 class="text-xs font-bold uppercase tracking-wider opacity-60">Chance per fresh echo</h2>
          <div class="flex items-end gap-3 flex-wrap">
            <span class="text-5xl font-semibold leading-none tabular-nums" data-test-tuning-planner-chance>
              {{ formatTuningChance(odds.chance) }}
            </span>
            <div class="flex flex-col gap-0.5 pb-1">
              <span class="text-sm font-semibold">{{ verdictLabel }}</span>
              <span class="text-xs opacity-70">{{ oneInLabel }}</span>
            </div>
          </div>
          <progress
            class="progress progress-primary w-full"
            :value="Math.max(odds.chance * 100, 0.5)"
            max="100"
            :aria-label="`Chance per fresh echo: ${formatTuningChance(odds.chance)}`"></progress>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-base-100 rounded-lg p-3 flex flex-col">
              <span class="text-xs opacity-70">Coin-flip odds by</span>
              <span class="text-lg font-semibold tabular-nums">{{ echoCountLabel(0.5) }}</span>
            </div>
            <div class="bg-base-100 rounded-lg p-3 flex flex-col">
              <span class="text-xs opacity-70">90% sure by</span>
              <span class="text-lg font-semibold tabular-nums">{{ echoCountLabel(0.9) }}</span>
            </div>
          </div>
        </section>

        <section class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
          <h2 class="text-xs font-bold uppercase tracking-wider opacity-60">If I farm this many echoes</h2>
          <div class="join">
            <button
              v-for="n in BUDGETS"
              :key="n"
              type="button"
              class="btn btn-sm join-item font-mono"
              :class="budget === n ? 'btn-primary' : 'btn-ghost bg-base-100'"
              :aria-pressed="budget === n"
              @click="budget = n">
              {{ n }}
            </button>
          </div>
          <div class="flex justify-between items-baseline">
            <span class="text-sm opacity-80">Chance at least one hits</span>
            <span class="text-xl font-semibold tabular-nums" data-test-tuning-planner-within>
              {{ formatTuningChance(chanceWithinEchoes(odds.chance, budget)) }}
            </span>
          </div>
        </section>

        <section class="bg-base-200 rounded-xl p-4 flex flex-col gap-2 text-sm">
          <h2 class="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Tuner cost</h2>
          <div class="flex justify-between"><span class="opacity-80">Avg per echo, stopping early</span><span class="tabular-nums">{{ costLabel(odds.expectedTuners) }}</span></div>
          <div class="flex justify-between"><span class="opacity-80">Avg per success</span><span class="tabular-nums font-semibold">{{ odds.chance > 0 ? costLabel(odds.expectedTuners / odds.chance) : "—" }}</span></div>
          <div class="flex justify-between"><span class="opacity-80">If you always tune to +25</span><span class="tabular-nums opacity-70">{{ odds.chance > 0 ? costLabel(FULL_TUNE_COST / odds.chance) : "—" }}</span></div>
          <p class="text-xs opacity-60 mt-1">
            Stop as soon as a wanted substat rolls too low, or there aren't
            enough slots left for the rest. Assumes {{ TUNERS_PER_TUNE }} tuners per tune.
          </p>
        </section>

        <section v-if="levers.length" class="bg-base-200 rounded-xl p-4 flex flex-col gap-2" data-test-tuning-planner-levers>
          <h2 class="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Biggest levers</h2>
          <div v-for="lever in levers" :key="`${lever.kind}-${lever.stat}`" class="flex justify-between gap-3 text-sm">
            <span class="opacity-80">{{ leverLabel(lever) }}</span>
            <span class="tabular-nums font-semibold whitespace-nowrap">{{ formatTuningChance(lever.chance) }}</span>
          </div>
        </section>
      </div>
    </div>

    <p class="text-xs opacity-60">
      Odds from the developer's published substat rates. Main stat and set
      come from the drop and aren't covered here.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDocumentTitle } from "../../composables/useDocumentTitle";
import { getReadableSubStatLabel, subStats, subStatsTable } from "../../echoes/stats";
import {
  ECHO_SUBSTAT_SLOTS,
  FULL_TUNE_COST,
  TUNERS_PER_TUNE,
  TUNING_GOAL_PRESETS,
  chanceWithinEchoes,
  echoesForConfidence,
  formatSubstatRoll,
  formatTuningChance,
  getTuningGoalKey,
  getTuningVerdict,
  goalLevers,
  goalOdds,
  rollChanceAtLeast,
  tuningVerdictLabels,
  type GoalLever,
  type TuningGoal,
} from "../../echoes/tuningOdds";
import {
  decodeTuningGoalQuery,
  encodeTuningGoalQuery,
} from "../../utils/tuningGoalQuery";

defineOptions({ name: "InfoTuningOdds" });

useDocumentTitle(
  "Tuning planner — Wuthering Waves Calculator & Optimizer",
  "How likely a fresh Wuthering Waves echo is to tune into the substats you want, and how many tuners it costs.",
);

const BUDGETS = [10, 25, 50, 100];

const route = useRoute();
const router = useRouter();

// The goal lives in the URL so a plan can be shared; nothing is persisted.
const goal = ref<TuningGoal>(
  route.query.goal != null
    ? decodeTuningGoalQuery(route.query.goal)
    : TUNING_GOAL_PRESETS["double-crit"].goal.map((l) => ({ ...l })),
);
const budget = ref(25);

watch(
  () => getTuningGoalKey(goal.value),
  () => {
    void router.replace({ query: { ...route.query, goal: encodeTuningGoalQuery(goal.value).goal ?? "" } });
  },
);

function setGoal(next: TuningGoal) {
  goal.value = next.map((line) => ({ ...line }));
}

function isPicked(stat: string) {
  return goal.value.some((line) => line.stat === stat);
}

function toggleStat(stat: string) {
  if (isPicked(stat)) {
    goal.value = goal.value.filter((line) => line.stat !== stat);
  } else if (goal.value.length < ECHO_SUBSTAT_SLOTS) {
    goal.value = [...goal.value, { stat, min: null }];
  }
}

function setMin(stat: string, min: number | null) {
  goal.value = goal.value.map((line) => (line.stat === stat ? { ...line, min } : line));
}

function getMinOptions(stat: string) {
  return [
    { value: null as number | null, label: "Any", chance: "100%" },
    ...(subStatsTable[stat] ?? []).slice(1).map((value) => ({
      value: value as number | null,
      label: `≥ ${formatSubstatRoll(stat, value)}`,
      chance: formatTuningChance(rollChanceAtLeast(stat, value)),
    })),
  ];
}

const odds = computed(() => goalOdds([], goal.value));
const levers = computed(() => goalLevers(goal.value));

const verdictLabel = computed(() =>
  odds.value.chance >= 1 ? "Every echo" : tuningVerdictLabels[getTuningVerdict(odds.value.chance)],
);
const oneInLabel = computed(() => {
  const p = odds.value.chance;
  if (p >= 1) return "no goal set";
  if (p <= 0) return "not possible";
  return `about 1 in ${Math.round(1 / p).toLocaleString("en-US")} echoes`;
});

function echoCountLabel(confidence: number) {
  const n = echoesForConfidence(odds.value.chance, confidence);
  if (n === Infinity) return "never";
  return n === 1 ? "1 echo" : `${n.toLocaleString("en-US")} echoes`;
}

function costLabel(tuners: number) {
  return Math.round(tuners).toLocaleString("en-US");
}

function leverLabel(lever: GoalLever) {
  const name = getReadableSubStatLabel(lever.stat);
  if (lever.kind === "drop") return `Drop ${name} entirely`;
  return lever.min == null
    ? `Accept any ${name} roll`
    : `Accept ${name} ≥ ${formatSubstatRoll(lever.stat, lever.min)}`;
}
</script>
