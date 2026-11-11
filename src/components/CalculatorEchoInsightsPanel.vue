<template>
  <div
    class="echo-insights card card-bordered card-compact bg-base-100 shadow"
    data-test-echo-insights-panel>
    <div class="card-body">
      <component
        :is="canToggle ? 'button' : 'div'"
        v-if="insights.equippedCount > 0"
        :type="canToggle ? 'button' : undefined"
        class="echo-insights__build-score rounded-lg bg-base-200 border-l-4 px-4 py-3 flex items-center justify-between gap-3"
        :class="[
          substatScoreRollupAccent?.border,
          canToggle ? 'w-full text-left' : '',
          { 'mb-4': showDetails },
        ]"
        :aria-expanded="canToggle ? isExpanded : undefined"
        data-test-echo-insights-build-score
        :data-test-echo-insights-toggle="canToggle ? '' : undefined"
        @click="canToggle && (isExpanded = !isExpanded)">
        <span class="text-sm font-semibold uppercase tracking-widest opacity-60">
          Build Score
        </span>
        <div class="flex items-center gap-2">
          <div v-if="substatScoreRollup" class="flex items-baseline gap-2">
            <span class="text-4xl font-extrabold" :class="substatScoreRollupAccent?.text">
              {{ substatScoreRollup.grade }}
            </span>
            <span class="text-4xl font-extrabold" :class="substatScoreRollupAccent?.text">
              {{ Math.round(substatScoreRollup.percent) }}%{{ substatScoreRollup.provisional ? "*" : "" }}
            </span>
          </div>
          <svg
            v-if="canToggle"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="size-4 shrink-0 opacity-60 transition-transform"
            :class="{ 'rotate-180': isExpanded }"
            fill="none"
            stroke="currentColor"
            aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </component>

      <div
        v-else
        class="echo-insights__build-score rounded-lg bg-base-200 border-l-4 border-l-base-300 px-4 py-3 flex items-center justify-between gap-3"
        data-test-echo-insights-build-score>
        <span class="text-sm font-semibold uppercase tracking-widest opacity-60">
          Build Score
        </span>
        <span class="text-xs opacity-60">Equip an echo to see build insights here</span>
      </div>

      <template v-if="showDetails && insights.equippedCount > 0">
        <div class="flex items-center justify-between gap-2 mb-3">
          <h3 class="text-sm font-semibold">Echo Insights</h3>
          <span class="text-xs opacity-60" data-test-echo-insights-equipped-count>
            {{ insights.equippedCount }}/5 echoes equipped
          </span>
        </div>

        <div class="echo-insights__stat flex items-center justify-between mb-3">
          <span class="text-xs opacity-60">Total Crit Value</span>
          <span class="font-mono font-bold" data-test-echo-insights-total-cv>
            {{ insights.totalCV.toFixed(1) }}%
          </span>
        </div>

        <div v-if="insights.relevantRollPercent !== null" class="mb-4" data-test-echo-insights-relevance>
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="opacity-60">Rolls on priority substats</span>
            <span class="font-mono font-bold">{{ insights.relevantRollPercent }}%</span>
          </div>
          <progress
            class="progress progress-primary w-full"
            :value="insights.relevantRollPercent"
            max="100"></progress>
        </div>

        <p v-if="!insights.isCurated" class="text-xs opacity-60 mb-2">
          Substat priorities aren't set for this character, so
          {{ rollValues ? "substats are ordered by damage." : "this shows raw totals only." }}
        </p>

        <div v-if="tableGroups.length" class="flex flex-col gap-0.5 mb-1" data-test-echo-insights-roll-note>
          <span class="text-xs font-semibold uppercase tracking-wide opacity-60">
            {{ insights.isCurated ? "Priority substats" : "Your substats" }}
          </span>
          <span v-if="rollValues" class="text-xs opacity-60">
            What each one adds to
            <span class="font-semibold opacity-100">{{ rollValues.label }}</span> ({{ rollValues.damageType }}),
            <span class="font-mono">{{ Math.round(rollValues.baseline).toLocaleString("en-US") }}</span> now
          </span>
        </div>

        <EchoInsightsSubstatTable
          v-if="tableGroups.length"
          :groups="tableGroups"
          :values="rollValues?.values"
          :loading="rollValuesLoading" />

        <div
          v-if="nothingRows.length"
          class="flex flex-wrap items-center gap-1.5 mt-2"
          data-test-echo-insights-adds-nothing>
          <span class="text-[0.65rem] font-semibold uppercase tracking-wide opacity-60">Adds nothing here</span>
          <span
            v-for="row in nothingRows"
            :key="row.type"
            class="rounded-full border border-dashed border-base-300 px-2 py-0.5 text-[0.7rem] opacity-70"
            :data-test-echo-insights-row="row.type">
            {{ row.label }} · {{ row.count }}/5
          </span>
        </div>

        <EchoInsightsTryChange
          v-if="rollValues && measureChange && tryChangeStats.length"
          class="mt-3"
          :stats="tryChangeStats"
          :measure-change="measureChange"
          :revision="rollValues" />

        <p v-if="rollValues" class="text-xs opacity-60 mt-2">
          <em>Per 1%</em> works for any change: 2% more is twice that number, whether it's a new roll
          or a better one. <em>Typical roll</em> is the size a roll usually drops at; <em>Top roll</em>
          is the biggest, and how often it drops.
        </p>
        <p
          v-else-if="!rollValuesLoading && rollValuesUnavailable"
          class="text-xs opacity-60 mt-3"
          data-test-echo-insights-roll-unavailable>
          Pick an attack or rotation in the Live Result Bar to see what each substat adds.
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useEchoInsights } from "../composables/useEchoInsights";
import { useTeamSubstatScoreRollup } from "../composables/useTeamSubstatScoreRollup";
import { getRatingAccentClasses } from "../composables/useEchoRating";
import type { EchoInsightRow } from "../composables/useEchoInsights";
import EchoInsightsSubstatTable from "./EchoInsightsSubstatTable.vue";
import EchoInsightsTryChange from "./EchoInsightsTryChange.vue";
import { getReadableSubStatLabel, getSubStatIconByType, subStats } from "../echoes/stats";
import type { SubstatRollValues } from "../echoes/substatRollValue";

defineOptions({ name: "CalculatorEchoInsightsPanel" });

const props = withDefaults(
  defineProps<{
    character: string;
    // CalculatorEchoes.vue renders two instances of this component — a
    // desktop sidebar (always-expanded, no toggle — the original design,
    // restored per review feedback: the pinned/collapsible bar below is
    // mobile-only) and a mobile-only pinned bar (collapsible, default
    // false). CSS media queries pick which one is visible, matching the
    // existing CalculatorSubNav/CalculatorMobileSubNav pattern in
    // Calculator.vue rather than a JS breakpoint check — this app has no
    // useBreakpoint-style composable to reuse, and every other responsive
    // split in this redesign is CSS-only too.
    alwaysExpanded?: boolean;
    // What each substat adds (ADR 0057). Calculated once by
    // CalculatorEchoes.vue (useSubstatRollValues) and shared by both
    // instances. Left out, the panel shows no values.
    rollValues?: SubstatRollValues | null;
    rollValuesLoading?: boolean;
    // Measures any amount of one substat, for "Try a change".
    measureChange?: (key: string, amount: number) => Promise<number | null>;
  }>(),
  { alwaysExpanded: false, rollValues: undefined, rollValuesLoading: false, measureChange: undefined },
);

const { insights } = useEchoInsights(() => props.character);

// Same Build Score used by CalculatorEchoes.vue's own header pill (now
// hidden there once this panel is showing — see docs/adr/0014 decision
// #10) and CalculatorBuildCard.vue, whose big/bold treatment this mirrors.
const { rollup: substatScoreRollup } = useTeamSubstatScoreRollup(() => props.character);
const substatScoreRollupAccent = computed(() =>
  substatScoreRollup.value ? getRatingAccentClasses(substatScoreRollup.value.color) : null,
);

// The mobile instance is a sticky bar pinned at the top of the Echoes tab
// (see docs/adr/0030-echoes-tab-v3-redesign.md) — collapsed to just the
// Build Score hero by default so it stays compact while pinned, expandable
// on click to reveal the rest. Collapses back whenever the character
// changes (a fresh :key remounts this component per CalculatorEchoes.vue's
// :key="characterBuildKey" on its own ancestor, so a plain ref default is
// enough — no watcher needed).
const isExpanded = ref(false);

// undefined = this screen doesn't calculate roll values at all; null = it
// does, but there's nothing to measure (a Stat target, or no damage).
const rollValuesUnavailable = computed(() => props.rollValues === null);

const addsDamage = (type: string) => (props.rollValues?.values[type]?.typical.delta ?? 0) > 0;
const byTypicalGain = (a: string, b: string) =>
  (props.rollValues?.values[b]?.typical.delta ?? 0) - (props.rollValues?.values[a]?.typical.delta ?? 0);

// Priority substats in their weight order (as before ADR 0057), then, as
// their own group, other substats that add damage, best first: rolled ones,
// and unrolled ones too. Rolled substats that add nothing go to the "Adds
// nothing here" chips instead. Without values, the other group is every
// other rolled substat, as the old list was.
const otherRows = computed<EchoInsightRow[]>(() => {
  const { priorityRows, otherRows: rolled } = insights.value;
  if (!props.rollValues) return rolled;
  const listed = new Set([...priorityRows, ...rolled].map((row) => row.type));
  const unrolled: EchoInsightRow[] = subStats
    .filter((type) => !listed.has(type) && addsDamage(type))
    .map((type) => ({
      type,
      label: getReadableSubStatLabel(type),
      icon: getSubStatIconByType(type),
      count: 0,
      total: 0,
      formattedTotal: "",
      weight: 0,
      missing: false,
    }));
  return [...rolled.filter((row) => addsDamage(row.type)), ...unrolled].sort((a, b) =>
    byTypicalGain(a.type, b.type),
  );
});
const tableGroups = computed(() => {
  const groups: Array<{ key: string; label?: string; rows: EchoInsightRow[] }> = [];
  const priorityRows = insights.value.priorityRows;
  if (priorityRows.length) groups.push({ key: "priority", rows: priorityRows });
  if (otherRows.value.length) {
    const label = !priorityRows.length
      ? undefined
      : props.rollValues
        ? "Other substats that add damage"
        : "Other rolled substats";
    groups.push({ key: "other", label, rows: otherRows.value });
  }
  return groups;
});
const nothingRows = computed(() =>
  props.rollValues ? insights.value.otherRows.filter((row) => !addsDamage(row.type)) : [],
);
const tryChangeStats = computed(() => subStats.filter(addsDamage).sort(byTypicalGain));
const canToggle = computed(() => !props.alwaysExpanded && insights.value.equippedCount > 0);
const showDetails = computed(() => props.alwaysExpanded || isExpanded.value);
</script>
