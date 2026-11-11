<template>
  <!--
    "Try a change" (ADR 0057): type an amount, pick a substat, read the gain.
    For "if I got 2-3% more Crit Rate" questions. Each answer is a real
    recalculation (measureChange), not Per 1% times the amount, so it stays
    right past the Crit Rate cap.
  -->
  <form
    class="flex flex-wrap items-center gap-1.5 rounded-lg bg-base-200 border border-base-300 px-2.5 py-2 text-xs"
    data-test-echo-insights-try-change
    @submit.prevent>
    <label :for="amountId" class="opacity-70">Try a change:</label>
    <span aria-hidden="true">+</span>
    <input
      :id="amountId"
      v-model.number="amount"
      type="number"
      min="0"
      :step="isFlatSubstat(stat) ? 10 : 0.1"
      inputmode="decimal"
      class="input input-bordered input-xs w-16 font-mono text-right"
      data-test-echo-insights-try-change-amount />
    <span v-if="!isFlatSubstat(stat)" aria-hidden="true">%</span>
    <select
      :id="statId"
      v-model="stat"
      class="select select-bordered select-xs"
      aria-label="Substat"
      data-test-echo-insights-try-change-stat>
      <option v-for="key in stats" :key="key" :value="key">
        {{ optionLabel(key) }}
      </option>
    </select>
    <output
      :for="`${amountId} ${statId}`"
      class="ml-auto font-mono font-bold"
      :class="result == null ? 'opacity-40' : 'text-success'"
      aria-live="polite"
      data-test-echo-insights-try-change-result>
      {{ result == null ? "–" : formatRollGain(result) }}
    </output>
  </form>
</template>

<script setup lang="ts">
import { onScopeDispose, ref, useId, watch } from "vue";
import { getReadableSubStatLabel } from "../echoes/stats";
import { formatRollGain, isFlatSubstat } from "../echoes/substatRollValue";

const props = defineProps<{
  /** Substats to offer, best first. */
  stats: string[];
  /** Measures the damage an amount of one substat adds (useSubstatRollValues). */
  measureChange: (key: string, amount: number) => Promise<number | null>;
  /** Recalculates when this changes (the build's values were refreshed). */
  revision?: unknown;
}>();

const DEBOUNCE_MS = 200;

const amountId = useId();
const statId = useId();
const stat = ref(props.stats[0] ?? "");
const amount = ref<number | "">(defaultAmount(stat.value));
const result = ref<number | null>(null);

function defaultAmount(key: string): number {
  return isFlatSubstat(key) ? (key === "HP_FLAT" ? 200 : 20) : 2.5;
}

// The % sits after the amount, so "+ 2.5 % ATK", and flat stats say so: "ATK (flat)".
function optionLabel(key: string): string {
  const label = getReadableSubStatLabel(key);
  return isFlatSubstat(key) ? `${label} (flat)` : label.replace(/%$/, "");
}

// Switching between a % and a flat stat resets the amount to that kind's default.
watch(stat, (next, previous) => {
  if (isFlatSubstat(next) !== isFlatSubstat(previous)) amount.value = defaultAmount(next);
});

// Keep the pick valid when the offered stats change.
watch(
  () => props.stats,
  (stats) => {
    if (!stats.includes(stat.value) && stats.length) stat.value = stats[0];
  },
);

let timer: ReturnType<typeof setTimeout> | null = null;
let token = 0;

watch(
  [stat, amount, () => props.revision],
  () => {
    if (timer) clearTimeout(timer);
    const current = ++token;
    timer = setTimeout(async () => {
      const value = typeof amount.value === "number" ? amount.value : NaN;
      const measured = stat.value && value > 0 ? await props.measureChange(stat.value, value) : null;
      if (current === token) result.value = measured;
    }, DEBOUNCE_MS);
  },
  { immediate: true },
);

onScopeDispose(() => {
  if (timer) clearTimeout(timer);
  token++;
});
</script>
