<template>
  <div
    class="live-result-bar flex flex-wrap items-center gap-4 bg-base-200 border-b border-base-300 px-4 py-2"
    data-test-live-result-bar>
    <div class="flex items-center gap-2 shrink-0">
      <div
        class="live-result-bar__avatar size-8 rounded-full bg-cover bg-center border-2"
        :class="{
          'border-amber-300': characterRarity === 5,
          'border-violet-600': characterRarity === 4,
          'border-base-300': characterRarity !== 5 && characterRarity !== 4,
        }"
        :style="{
          backgroundImage: `url(https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png)`,
        }"
        :data-test-live-result-bar-avatar="character"></div>
      <div class="leading-tight">
        <div class="font-bold text-sm" data-test-live-result-bar-name>
          {{ characterName }}
        </div>
        <div class="text-xs opacity-60 font-mono">LV {{ characterLevel }}</div>
      </div>
    </div>

    <div
      v-if="statChips.length"
      class="flex items-center gap-4 shrink-0"
      data-test-live-result-bar-stats>
      <button
        v-for="chip in statChips"
        :key="chip.key"
        type="button"
        class="flex flex-col items-start leading-tight text-left"
        v-tooltip="'View full breakdown'"
        @click="emit('stat-selected', chip.label)">
        <span class="text-[10px] uppercase tracking-wide opacity-60">{{
          chip.label
        }}</span>
        <span class="font-mono font-bold text-sm tabular-nums">{{
          chip.display
        }}</span>
      </button>
    </div>

    <!--
      mx-auto (not a flex-1 spacer + shrink-0): pushes this group to the
      right when it shares the row with the stat chips, and centers it on
      its own line if the row wraps — self-adjusting to whatever width the
      chips/name happen to take instead of assuming a fixed wrap breakpoint.
      flex-wrap on this group too: target + damage type + hero + chevron
      together are wider than a narrow phone even on their own row. Not
      shrink-0 here — that would refuse to compress below its unwrapped
      (max-content) width, which stops the wrap from ever actually
      triggering, since it never becomes narrower than its content demands.
    -->
    <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 min-w-0 mx-auto">
      <!--
        AppRichSelect's own scoped style sets max-width:100% on itself —
        higher specificity than any utility class passed in here (Vue scoped
        CSS adds an attribute selector), so it can't be narrowed directly.
        Constraining this wrapper instead works with that rule (the select
        fills 100% of *this*) rather than fighting it.
      -->
      <div class="max-w-40 sm:max-w-48 min-w-0">
        <CalculatorOptimizerTarget
          v-if="character"
          :key="character"
          :character="character"
          :current-optimization-target="target"
          @optimizer:target-updated="onTargetUpdated"></CalculatorOptimizerTarget>
      </div>

      <CalculatorOptimizerDamageType
        v-if="character"
        name="live-result-bar-damage-type"
        :character="character"
        :current-damage-type="damageType"
        @optimizer:damage-type-updated="
          onDamageTypeUpdated
        "></CalculatorOptimizerDamageType>

      <Transition name="live-result-bar-delta">
        <span
          v-if="delta !== null && delta !== 0"
          class="badge badge-sm font-mono tabular-nums"
          :class="delta > 0 ? 'badge-success' : 'badge-error'"
          data-test-live-result-bar-delta>
          {{ deltaLabel }}
        </span>
      </Transition>

      <div class="text-right" data-test-live-result-bar-hero>
        <div class="text-[10px] uppercase tracking-wide opacity-60">
          {{ heroLabel }}
        </div>
        <div class="font-mono font-bold text-lg leading-tight tabular-nums">
          {{ heroDisplay }}
        </div>
      </div>

      <button
        type="button"
        class="btn btn-sm btn-circle"
        :class="{ 'btn-primary': isDetailOpen }"
        :aria-expanded="isDetailOpen"
        aria-label="Show full stats and damage breakdown"
        data-test-live-result-bar-toggle
        @click="emit('toggle-detail')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-4 transition-transform"
          :class="{ 'rotate-180': isDetailOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CalculatorOptimizerTarget from "./CalculatorOptimizerTarget.vue";
import CalculatorOptimizerDamageType from "./CalculatorOptimizerDamageType.vue";
import { displayInt, displayPercentage } from "../utils/numbers";
import {
  LIVE_RESULT_BAR_STAT_META,
  resolveLiveResultBarTarget,
  type LiveResultBarDamageType,
} from "../calculator/liveResultBar";
import { useAnimatedNumber } from "../composables/useAnimatedNumber";

defineOptions({ name: "CalculatorLiveResultBar" });

const props = defineProps<{
  character: string;
  characterRarity?: number | string | null;
  characterName?: string | null;
  characterLevel: string;
  target: string | null;
  statKeys: string[];
  stats: Record<string, number>;
  allDamages: Record<string, any> | null | undefined;
  isDetailOpen: boolean;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  "update:target": [target: string | null];
  "stat-selected": [stat: string];
  "toggle-detail": [];
}>();

const characterRarity = computed(() =>
  props.characterRarity === undefined || props.characterRarity === null
    ? null
    : Number(props.characterRarity),
);
const characterName = computed(() => props.characterName ?? props.character);

function formatStatValue(key: string, value: number): string {
  const meta = LIVE_RESULT_BAR_STAT_META[key];
  if (meta?.format === "percent") return displayPercentage(value * 100);
  return displayInt(value ?? 0);
}

const statChips = computed(() =>
  props.statKeys
    .filter((key) => LIVE_RESULT_BAR_STAT_META[key])
    .map((key) => ({
      key,
      label: LIVE_RESULT_BAR_STAT_META[key].label,
      display: formatStatValue(key, props.stats[key] ?? 0),
    })),
);

// Session-only, not persisted or lifted to Calculator.vue — the full
// breakdown panel already shows Normal/Average/Crit as separate columns, so
// this only ever matters for the bar's own single hero number.
const damageType = ref<LiveResultBarDamageType>("Average");

const resolved = computed(() =>
  resolveLiveResultBarTarget(
    props.target,
    props.allDamages,
    props.stats,
    damageType.value,
  ),
);

const heroLabel = computed(() => resolved.value?.label ?? "No target selected");
// Reads as "unresolved" (no delta flash on the value that eventually
// lands) while a character switch is still settling, rather than flashing
// a spurious delta between two transient in-flight computations.
const heroValueSource = computed(() =>
  props.isLoading ? null : (resolved.value?.value ?? null),
);
const { displayValue, delta } = useAnimatedNumber(heroValueSource);
const heroDisplay = computed(() =>
  displayValue.value === null ? "–" : displayInt(displayValue.value),
);
const deltaLabel = computed(() => {
  if (delta.value === null) return "";
  const sign = delta.value > 0 ? "+" : "−";
  return `${sign}${displayInt(Math.abs(delta.value))}`;
});

function onTargetUpdated(next: string | null) {
  emit("update:target", next);
}

function onDamageTypeUpdated(next: string) {
  if (next === "Normal" || next === "Average" || next === "Crit") {
    damageType.value = next;
  }
}
</script>

<style scoped>
.live-result-bar-delta-enter-active,
.live-result-bar-delta-leave-active {
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.live-result-bar-delta-enter-from,
.live-result-bar-delta-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}
</style>
