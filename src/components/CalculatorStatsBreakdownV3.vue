<template>
  <div class="stats-breakdown-v3 flex flex-col gap-4 pt-2" data-test-stat-split>
    <h3 class="text-lg font-bold pr-10">{{ stat }}</h3>

    <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-x-2">
      <div class="flex flex-col gap-0.5 min-w-0">
        <span class="text-[11px] uppercase tracking-wide text-base-content/70">Your build</span>
        <span class="font-mono text-xl font-bold tabular-nums truncate" data-test-stat-split-build>{{ share.buildText }}</span>
      </div>
      <span class="text-lg text-base-content/60 pb-0.5" aria-hidden="true">+</span>
      <div class="flex flex-col gap-0.5 min-w-0">
        <span class="text-[11px] uppercase tracking-wide text-accent">Buffs</span>
        <span class="font-mono text-xl font-bold tabular-nums text-accent truncate" data-test-stat-split-buffs>{{ share.buffsText || "+0" }}</span>
      </div>
      <span class="text-lg text-base-content/60 pb-0.5" aria-hidden="true">=</span>
      <div class="flex flex-col gap-0.5 items-end min-w-0">
        <span class="text-[11px] uppercase tracking-wide">Live</span>
        <span class="font-mono text-xl font-extrabold tabular-nums text-secondary truncate" data-test-stat-split-live>{{ liveText }}</span>
      </div>
    </div>

    <div class="flex h-1.5 rounded-sm overflow-hidden bg-base-content/10" aria-hidden="true">
      <span class="bg-base-content/40" :style="{ width: `${share.build * 100}%` }"></span>
      <span class="bg-accent" :style="{ width: `${share.buffs * 100}%` }"></span>
    </div>

    <section class="flex flex-col gap-1" data-test-stat-split-build-rows>
      <h4 class="text-sm font-bold border-b border-base-300 pb-1">From your build</h4>
      <div
        v-for="row in buildRows"
        :key="row.source + row.label"
        class="flex justify-between gap-2 py-0.5 text-sm"
        :data-test-stat-split-row="row.source">
        <span>{{ row.label }}</span>
        <span class="font-mono tabular-nums">{{ row.text }}</span>
      </div>
    </section>

    <section class="flex flex-col gap-1" data-test-stat-split-buff-rows>
      <h4 class="text-sm font-bold text-accent border-b border-base-300 pb-1">From buffs</h4>
      <div
        v-for="row in buffRows"
        :key="row.source + row.label"
        class="flex justify-between gap-2 py-0.5 text-sm"
        :data-test-stat-split-row="row.source">
        <span>{{ row.label }}</span>
        <span class="font-mono tabular-nums">{{ row.text }}</span>
      </div>
      <p v-if="!buffRows.length" class="text-sm text-base-content/70 py-0.5">
        Nothing is raising this stat right now.
      </p>
    </section>

    <section v-if="formula" class="flex flex-col gap-1.5">
      <h4 class="text-sm font-bold">Formula</h4>
      <div class="bg-base-200 p-2 rounded-md font-mono text-xs leading-relaxed" data-test-stat-split-formula>
        <span class="font-bold text-secondary">{{ liveText }}</span> =
        <template v-if="formula.weaponAtk">({{ formula.base }} + {{ formula.weaponAtk }})</template>
        <template v-else>{{ formula.base }}</template>
        × (1 + {{ formula.buildPercent }} + <span class="font-bold text-accent">{{ formula.buffPercent }}</span>)
        + {{ formula.flat }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  formatLiveStatValue,
  formatSplitRow,
  statShare,
  type StatSplit,
} from "../calculator/statSplit";
import { displayInt, displayPercentage } from "../utils/numbers";

defineOptions({ name: "CalculatorStatsBreakdownV3" });

const props = defineProps<{
  /** The stat's label, as shown in the Overview ("ATK", "Fusion DMG Bonus"). */
  stat: string;
  split: StatSplit;
}>();

const liveText = computed(() =>
  formatLiveStatValue(props.split.statKey, props.split.live),
);

// statShare formats build and buffs from the *displayed* numbers so the
// header always reads as a sum that adds up.
const share = computed(
  () =>
    statShare(props.split.statKey, props.split.build, props.split.live) ?? {
      build: 0,
      buffs: 0,
      hasBuffs: false,
      buildText: formatLiveStatValue(props.split.statKey, props.split.build),
      buffsText: "",
    },
);

const toDisplayRows = (rows: StatSplit["buildRows"]) =>
  rows.map((row) => ({
    source: row.source,
    label: row.label,
    text: formatSplitRow(props.split.statKey, row),
  }));

const buildRows = computed(() => toDisplayRows(props.split.buildRows));
const buffRows = computed(() => toDisplayRows(props.split.buffRows));

const formula = computed(() => {
  const f = props.split.formula;
  if (!f) return null;
  return {
    base: displayInt(f.base),
    weaponAtk: f.weaponAtk ? displayInt(f.weaponAtk) : "",
    buildPercent: displayPercentage(f.buildPercent),
    buffPercent: displayPercentage(f.buffPercent),
    flat: displayInt(f.flat),
  };
});
</script>
