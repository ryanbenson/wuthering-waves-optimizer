<template>
  <!-- A finished echo: how likely a fresh one is to beat it. -->
  <section
    v-if="isFinished"
    class="rounded-xl bg-base-200 p-4 flex flex-col gap-3"
    data-test-echo-better-odds>
    <h3 class="text-xs font-semibold uppercase tracking-wide opacity-60">Odds of a better echo</h3>
    <p class="text-sm" data-test-echo-score-percentile>
      Substat Score for {{ characterName }}:
      <span class="badge badge-sm border tabular-nums" :class="gradeBadge(score.grade)">
        {{ score.grade }} {{ Math.round(score.percent) }}%</span>.
      That's better than
      <span class="font-semibold tabular-nums">{{ formatShare(percentile) }}</span>
      of fresh echoes tuned to +25.
    </p>

    <div class="flex flex-col gap-1.5">
      <span class="text-xs opacity-70">Better means</span>
      <div class="flex flex-wrap gap-1.5" role="group" aria-label="What counts as a better echo">
        <button
          v-for="option in targetOptions"
          :key="option.key"
          type="button"
          class="btn btn-xs"
          :class="option.key === targetKey ? 'btn-primary' : 'btn-ghost border-base-300'"
          :aria-pressed="option.key === targetKey"
          :data-test-echo-score-target="option.key"
          @click="selectTarget(option.key)">
          {{ option.label }}
        </button>
      </div>
    </div>

    <p class="text-sm">A fresh +0 echo gets to {{ targetLabel }}:</p>
    <div class="flex items-end gap-3 flex-wrap">
      <span class="text-4xl font-semibold leading-none tabular-nums" data-test-echo-better-odds-chance>
        {{ formatTuningChance(freshOdds.chance) }}
      </span>
      <div class="flex flex-col gap-0.5 pb-0.5">
        <span class="text-sm font-semibold" :class="betterVerdictClass">{{ betterVerdictLabel }}</span>
        <span class="text-xs opacity-70">{{ oneInLabel(freshOdds.chance, "fresh echoes") }}</span>
      </div>
    </div>
    <div v-if="freshOdds.chance > 0" class="grid grid-cols-2 gap-2 text-sm">
      <div class="flex flex-col gap-0.5">
        <span class="text-xs opacity-70">Coin-flip odds by</span>
        <span class="tabular-nums">{{ formatEchoCount(echoesForConfidence(freshOdds.chance, 0.5)) }}</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-xs opacity-70">90% sure by</span>
        <span class="tabular-nums">{{ formatEchoCount(echoesForConfidence(freshOdds.chance, 0.9)) }}</span>
      </div>
    </div>
    <div v-if="freshOdds.chance > 0" class="flex flex-col gap-1" data-test-echo-better-odds-cost>
      <span class="text-xs opacity-70">Resources to find one</span>
      <EchoResourceCostTable :rows="betterCostRows" />
      <span class="text-xs opacity-60">
        Each fresh echo is tuned until it reaches {{ targetLabel }} or can't, so most stop early.
        Feeding a leveled echo into the next returns {{ FEED_EXP_PERCENT }}% of its EXP and
        {{ FEED_TUNER_PERCENT }}% of its tuners. Shell Credits aren't returned.
      </span>
    </div>
    <p class="text-xs opacity-70" data-test-echo-score-explainer>
      {{ explainer }}
      <button
        type="button"
        class="link link-primary"
        data-test-echo-tune-odds-edit-weights
        @click="emit('edit-weights')">
        Edit weights
      </button>
    </p>
  </section>

  <!-- A partly tuned echo: where it can finish, against a fresh one. -->
  <template v-else>
    <section class="rounded-xl bg-base-200 p-4 flex flex-col gap-3" data-test-echo-score-odds>
      <h3 class="text-xs font-semibold uppercase tracking-wide opacity-60">Where this echo can finish</h3>
      <p class="text-sm">
        Substat Score for {{ characterName }} so far:
        <span class="badge badge-sm border tabular-nums" :class="gradeBadge(score.grade)">
          {{ score.grade }} {{ Math.round(score.percent) }}%</span>
        with {{ tuned.length }} of {{ ECHO_SUBSTAT_SLOTS }} substats. Pick the grade you're after:
      </p>
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs opacity-60">
            <th class="text-left font-normal pb-1">Finishes at</th>
            <th class="text-right font-normal pb-1 pl-2">This echo</th>
            <th class="text-right font-normal pb-1 pl-2">A fresh echo</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="option in targetOptions"
            :key="option.key"
            class="cursor-pointer hover:bg-base-300"
            :class="{ 'bg-base-300 font-semibold': option.key === targetKey }"
            :data-test-echo-score-grade-row="option.key"
            @click="selectTarget(option.key)">
            <td class="py-1 pl-1">
              <button type="button" class="flex items-center gap-1.5" :aria-pressed="option.key === targetKey">
                <span class="badge badge-sm border" :class="gradeBadge(option.key)">{{ option.key }}</span>
                <span class="opacity-80">or higher</span>
              </button>
            </td>
            <td class="text-right tabular-nums pl-2">{{ formatTuningChance(option.echoChance ?? 0) }}</td>
            <td class="text-right tabular-nums pl-2 pr-1">{{ formatTuningChance(option.freshChance) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="echoOdds" class="flex items-end gap-3 flex-wrap">
        <span class="text-4xl font-semibold leading-none tabular-nums" data-test-echo-score-chance>
          {{ formatTuningChance(echoOdds.chance) }}
        </span>
        <div class="flex flex-col gap-0.5 pb-0.5">
          <span class="text-sm font-semibold" :class="verdictClass">{{ verdictLabel }}</span>
          <span class="text-xs opacity-70">to reach {{ targetLabel }} · {{ oneInLabel(echoOdds.chance, "echoes like this") }}</span>
        </div>
      </div>
    </section>

    <section
      v-if="advice"
      class="alert text-sm items-start"
      :class="advice === 'keep' || advice === 'met' ? 'alert-info' : 'alert-warning'"
      :data-test-echo-score-advice="advice">
      <div class="flex flex-col gap-1">
        <span class="font-semibold">{{ adviceTitle }}</span>
        <span>{{ adviceBody }}</span>
      </div>
    </section>

    <section v-if="echoOdds && echoOdds.chance > 0" class="flex flex-col gap-1.5" data-test-echo-score-cost>
      <EchoResourceCostTable :rows="unfinishedCostRows" />
      <span class="text-xs opacity-60">
        Tuning stops once an echo reaches {{ targetLabel }} or can't. Fresh echoes feed each miss into
        the next ({{ FEED_EXP_PERCENT }}% of EXP and {{ FEED_TUNER_PERCENT }}% of tuners back).
      </span>
    </section>

    <p class="text-xs opacity-70" data-test-echo-score-explainer>
      {{ explainer }}
      <button
        type="button"
        class="link link-primary"
        data-test-echo-tune-odds-edit-weights
        @click="emit('edit-weights')">
        Edit weights
      </button>
    </p>
  </template>
</template>

<script setup lang="ts">
// The build's Odds (EchoTuneOddsTab, build context): the echo judged by
// the build character's Substat Score, by grade. "Better" is a grade the
// user can pick — by default the next one up. See useEchoScoreOdds and
// docs/adr/0044-echo-tuning-odds.md.
import { computed } from "vue";
import { FEED_EXP_REFUND, FEED_TUNER_REFUND } from "../echoes/levelingCost";
import {
  ECHO_SUBSTAT_SLOTS,
  echoesForConfidence,
  formatTuningChance,
  getTuningVerdict,
  tuningVerdictLabels,
  type TunedSubstats,
} from "../echoes/tuningOdds";
import { getRatingBadgeClasses } from "../composables/useEchoRating";
import { SCORE_GRADE_COLORS, useEchoScoreOdds } from "../composables/useEchoScoreOdds";
import EchoResourceCostTable, { type EchoResourceCostRow } from "./EchoResourceCostTable.vue";

defineOptions({ name: "EchoScoreOdds" });

const props = defineProps<{ tuned: TunedSubstats; character: string }>();
const emit = defineEmits<{ "edit-weights": [] }>();

const {
  characterName,
  tuned,
  isFinished,
  score,
  percentile,
  targetOptions,
  targetKey,
  targetLabel,
  selectTarget,
  freshOdds,
  echoOdds,
  freshResources,
  echoResourcesFromHere,
  advice,
} = useEchoScoreOdds(
  () => props.tuned,
  () => props.character,
);

const FEED_EXP_PERCENT = Math.round(FEED_EXP_REFUND * 100);
const FEED_TUNER_PERCENT = Math.round(FEED_TUNER_REFUND * 100);

function gradeBadge(grade: string): string[] {
  return getRatingBadgeClasses(SCORE_GRADE_COLORS[grade] ?? "white");
}

const explainer = computed(
  () =>
    `Substat Score adds up each substat's roll, weighted by ${characterName.value}'s priorities, ` +
    `against ${characterName.value}'s ideal echo, so one high roll on a top stat can outweigh two weaker ones. ` +
    "Better means a higher total, not every stat higher. Main stat and set aren't counted.",
);

function formatShare(share: number): string {
  const pct = share * 100;
  if (pct >= 99.95) return "99.9%";
  return pct >= 10 ? `${Math.floor(pct)}%` : `${pct.toFixed(1)}%`;
}

function oneInLabel(chance: number, noun: string): string {
  if (chance >= 1) return `every one of the ${noun}`;
  if (chance <= 0) return "no rolls left get there";
  return `about 1 in ${Math.round(1 / chance).toLocaleString("en-US")} ${noun}`;
}

function formatEchoCount(count: number): string {
  if (!Number.isFinite(count)) return "never";
  return count === 1 ? "1 echo" : `${count.toLocaleString("en-US")} echoes`;
}

// A finished echo that's hard to beat is good news, so rare reads green.
const betterVerdictLabel = computed(() =>
  freshOdds.value.chance <= 0 ? "Can't be beaten" : tuningVerdictLabels[getTuningVerdict(freshOdds.value.chance)],
);
const betterVerdictClass = computed(() => {
  if (freshOdds.value.chance <= 0) return "text-success";
  return {
    likely: "text-warning",
    "worth-a-shot": "text-warning",
    "long-grind": "text-info",
    "very-rare": "text-success",
  }[getTuningVerdict(freshOdds.value.chance)];
});

const verdictLabel = computed(() => {
  const chance = echoOdds.value?.chance ?? 0;
  if (chance >= 1) return "Already there";
  if (chance <= 0) return "Not possible";
  return tuningVerdictLabels[getTuningVerdict(chance)];
});
const verdictClass = computed(() => {
  const chance = echoOdds.value?.chance ?? 0;
  if (chance >= 1) return "text-success";
  if (chance <= 0) return "text-error";
  return {
    likely: "text-info",
    "worth-a-shot": "text-warning",
    "long-grind": "text-warning",
    "very-rare": "text-error",
  }[getTuningVerdict(chance)];
});

const betterCostRows = computed<EchoResourceCostRow[]>(() => [
  { key: "each", label: "Each fresh echo, on average", resources: freshResources.value.perAttempt },
  { key: "per-better", label: "Per better echo", resources: freshResources.value.perSuccess },
  {
    key: "per-better-fed",
    label: "Feeding the misses back",
    resources: freshResources.value.perSuccessFed,
    emphasis: true,
  },
]);

const unfinishedCostRows = computed<EchoResourceCostRow[]>(() => [
  { key: "from-here", label: "This echo, on average from here", resources: echoResourcesFromHere.value },
  {
    key: "fresh-per-success",
    label: "Fresh echoes, per success",
    resources: freshResources.value.perSuccessFed,
  },
]);

const adviceTitle = computed(
  () =>
    ({
      met: `Already ${targetLabel.value}`,
      impossible: `This echo can't reach ${targetLabel.value}`,
      keep: "Keep tuning this one",
      "fresh-better": "A fresh echo is the better bet",
    })[advice.value ?? "keep"],
);
const adviceBody = computed(() => {
  const fresh = formatTuningChance(freshOdds.value.chance);
  const mine = formatTuningChance(echoOdds.value?.chance ?? 0);
  switch (advice.value) {
    case "met":
      return "Substats only add to the score, so it can't drop below that.";
    case "impossible":
      return `Even top rolls on the tunes left fall short. A fresh +0 echo gets there ${fresh} of the time.`;
    case "keep":
      return `It reaches ${targetLabel.value} ${mine} of the time, against ${fresh} for a fresh +0 echo.`;
    case "fresh-better":
      return `A fresh +0 echo reaches ${targetLabel.value} ${fresh} of the time, more than this one's ${mine}.`;
    default:
      return "";
  }
});
</script>
