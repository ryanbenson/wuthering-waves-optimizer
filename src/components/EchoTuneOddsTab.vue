<template>
  <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-5" data-test-echo-tune-odds>
    <section class="flex flex-col gap-2">
      <div class="flex justify-between items-baseline">
        <h3 class="text-xs font-semibold uppercase tracking-wide opacity-60">Tuned so far</h3>
        <span class="text-xs tabular-nums opacity-60">{{ tuned.length }} / {{ ECHO_SUBSTAT_SLOTS }} slots</span>
      </div>
      <div
        v-for="row in tunedRows"
        :key="row.stat"
        class="flex items-center gap-3 rounded-lg bg-base-200 px-3 py-2"
        :data-test-echo-tune-odds-tuned="row.stat">
        <span class="flex-1 min-w-0 truncate text-sm">{{ row.label }}</span>
        <span class="text-sm font-semibold tabular-nums">{{ row.value ? formatSubstatRoll(row.stat, row.value) : "—" }}</span>
        <span
          v-if="row.percentile != null"
          class="badge badge-sm tabular-nums"
          :class="row.percentile <= 0.35 ? 'badge-info' : 'badge-ghost'"
          v-tooltip="'Share of rolls of this substat that are this good or better'">
          top {{ Math.max(1, Math.round(row.percentile * 100)) }}%
        </span>
      </div>
      <div
        v-if="untunedSlots > 0"
        class="rounded-lg border border-dashed border-base-300 px-3 py-2 text-sm opacity-70">
        {{ untunedSlots }} untuned {{ untunedSlots === 1 ? "slot" : "slots" }} ·
        {{ TOTAL_SUBSTAT_TYPES - tuned.length }} substats still possible
      </div>
    </section>

    <section v-if="untunedSlots > 0" class="flex flex-col gap-2">
      <h3 class="text-xs font-semibold uppercase tracking-wide opacity-60">Remaining tunes</h3>
      <div class="grid grid-cols-3 gap-2">
        <div class="rounded-lg bg-base-200 p-2.5 flex flex-col gap-1">
          <span class="text-lg font-semibold tabular-nums" data-test-echo-tune-odds-next>{{ formatTuningChance(draws.next) }}</span>
          <span class="text-xs opacity-70 leading-snug">next tune is a stat you want</span>
        </div>
        <div class="rounded-lg bg-base-200 p-2.5 flex flex-col gap-1">
          <span class="text-lg font-semibold tabular-nums">{{ formatTuningChance(draws.atLeastOne) }}</span>
          <span class="text-xs opacity-70 leading-snug">at least 1 more stat you want</span>
        </div>
        <div class="rounded-lg bg-base-200 p-2.5 flex flex-col gap-1">
          <span class="text-lg font-semibold tabular-nums">{{ formatTuningChance(draws.atLeastTwo) }}</span>
          <span class="text-xs opacity-70 leading-snug">2 or more stats you want</span>
        </div>
      </div>
      <p class="text-xs opacity-70">
        <template v-if="wantedSource === 'character'">
          Stats you want come from this character's substat weights:
        </template>
        <template v-else>Stats you want are your goal's substats:</template>
        {{ wantedLabels || "none yet" }}.
      </p>
    </section>

    <section class="rounded-xl bg-base-200 p-4 flex flex-col gap-3">
      <h3 class="text-xs font-semibold uppercase tracking-wide opacity-60">Your goal</h3>
      <TuningGoalEditor :model-value="goal" @update:model-value="setGoal" />

      <template v-if="goal.length">
        <div class="flex items-end gap-3 flex-wrap">
          <span class="text-4xl font-semibold leading-none tabular-nums" data-test-echo-tune-odds-chance>
            {{ formatTuningChance(odds.chance) }}
          </span>
          <div class="flex flex-col gap-0.5 pb-0.5">
            <span class="text-sm font-semibold" :class="verdictClass">{{ verdictLabel }}</span>
            <span class="text-xs opacity-70">{{ oneInLabel }}</span>
          </div>
        </div>
        <progress
          class="progress w-full"
          :class="verdictProgressClass"
          :value="Math.max(odds.chance * 100, 0.5)"
          max="100"
          :aria-label="`Chance this echo meets the goal: ${formatTuningChance(odds.chance)}`"></progress>
      </template>
    </section>

    <section
      v-if="advice !== 'no-goal'"
      class="alert text-sm items-start"
      :class="advice === 'keep' || advice === 'met' ? 'alert-info' : 'alert-warning'"
      :data-test-echo-tune-odds-advice="advice">
      <div class="flex flex-col gap-1">
        <span class="font-semibold">{{ adviceTitle }}</span>
        <span>{{ adviceBody }}</span>
      </div>
    </section>

    <section v-if="advice === 'keep' || advice === 'fresh-better'" class="flex flex-col gap-1.5 text-sm">
      <div class="flex justify-between gap-3">
        <span class="opacity-70">Avg tuners from here, stopping early</span>
        <span class="tabular-nums">{{ Math.round(odds.expectedTuners) }}</span>
      </div>
      <div class="flex justify-between gap-3">
        <span class="opacity-70">Stop when</span>
        <span class="text-right">a goal substat rolls too low, or too few slots are left</span>
      </div>
    </section>

    <RouterLink
      :to="{ path: '/info/tuning-odds', query: plannerQuery }"
      class="btn btn-sm btn-outline mt-auto"
      data-test-echo-tune-odds-planner-link>
      Plan a goal from scratch
    </RouterLink>
    <p class="text-xs opacity-60 text-center">Odds from the developer's published substat rates.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { getReadableSubStatLabel } from "../echoes/stats";
import {
  ECHO_SUBSTAT_SLOTS,
  TOTAL_SUBSTAT_TYPES,
  formatSubstatRoll,
  formatTuningChance,
  getTuningVerdict,
  tuningVerdictLabels,
} from "../echoes/tuningOdds";
import type { EchoEditTarget } from "../composables/useEchoEditFields";
import { useEchoTuneOdds } from "../composables/useEchoTuneOdds";
import { encodeTuningGoalQuery } from "../utils/tuningGoalQuery";
import TuningGoalEditor from "./TuningGoalEditor.vue";

defineOptions({ name: "EchoTuneOddsTab" });

const props = defineProps<{ target: EchoEditTarget }>();

const {
  goal,
  setGoal,
  tuned,
  tunedRows,
  untunedSlots,
  wantedSource,
  wantedStats,
  draws,
  odds,
  freshOdds,
  advice,
  timesFresh,
} = useEchoTuneOdds(() => props.target);

const wantedLabels = computed(() =>
  wantedStats.value.map((stat) => getReadableSubStatLabel(stat)).join(", "),
);

const verdict = computed(() => getTuningVerdict(odds.value.chance));
const verdictLabel = computed(() => {
  if (odds.value.chance >= 1) return "Goal met";
  if (odds.value.chance <= 0) return "Not possible";
  return tuningVerdictLabels[verdict.value];
});
const verdictClass = computed(() => {
  if (odds.value.chance >= 1) return "text-success";
  if (odds.value.chance <= 0) return "text-error";
  return {
    likely: "text-info",
    "worth-a-shot": "text-warning",
    "long-grind": "text-warning",
    "very-rare": "text-error",
  }[verdict.value];
});
const verdictProgressClass = computed(() =>
  verdictClass.value.replace("text-", "progress-"),
);
const oneInLabel = computed(() => {
  const p = odds.value.chance;
  if (p >= 1) return "every echo like this";
  if (p <= 0) return "no remaining tunes can get there";
  return `about 1 in ${Math.round(1 / p).toLocaleString("en-US")} echoes like this`;
});

const adviceTitle = computed(
  () =>
    ({
      met: "Goal met",
      impossible: "This echo can't reach the goal",
      keep: "Keep tuning this one",
      "fresh-better": "A fresh echo is the better bet",
      "no-goal": "",
    })[advice.value],
);
const adviceBody = computed(() => {
  const fresh = formatTuningChance(freshOdds.value.chance);
  switch (advice.value) {
    case "met":
      return "Every goal substat is already on this echo at or above its minimum.";
    case "impossible":
      return `A goal substat rolled too low or there aren't enough slots left. A fresh +0 echo gets there ${fresh} of the time.`;
    case "keep": {
      const times = timesFresh.value;
      const ratio = times && times >= 1.05 ? ` — about ${times.toFixed(1)}× a fresh echo` : "";
      return `A fresh +0 echo gets there ${fresh} of the time; this one is at ${formatTuningChance(odds.value.chance)}${ratio}.`;
    }
    case "fresh-better":
      return `A fresh +0 echo gets there ${fresh} of the time, more than this one's ${formatTuningChance(odds.value.chance)}.`;
    default:
      return "";
  }
});

const plannerQuery = computed(() => encodeTuningGoalQuery(goal.value));
</script>
