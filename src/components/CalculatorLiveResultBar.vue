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
      ml-auto: pushes this group to the right, whether it shares the row
      with the stat chips or wraps onto its own line — stays right-aligned
      either way rather than centering when wrapped. Not shrink-0 — that
      would refuse to compress below its unwrapped (max-content) width,
      which stops the wrap from ever actually triggering.
    -->
    <div class="flex items-center gap-3 min-w-0 ml-auto">
      <!--
        Target + damage type move here instead of sitting inline — they're
        a "set once, rarely touched again" preference, not something that
        earns permanent width next to the number people actually watch.
      -->
      <details
        v-if="character"
        ref="settingsDetailsEl"
        class="dropdown dropdown-end"
        data-test-live-result-bar-settings>
        <summary
          class="btn btn-sm btn-circle btn-ghost list-none"
          aria-label="Change target and damage type"
          v-tooltip="'Target & damage type'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            fill="currentColor"
            viewBox="0 0 640 640">
            <path
              d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z" />
          </svg>
        </summary>
        <div
          class="dropdown-content menu z-30 mt-2 w-72 rounded-box bg-base-100 p-3 shadow-lg">
          <label
            class="mb-1 block text-[10px] font-semibold uppercase tracking-wide opacity-60"
            >Target</label
          >
          <CalculatorOptimizerTarget
            :key="character"
            class="w-full"
            :character="character"
            :current-optimization-target="target"
            @optimizer:target-updated="onTargetUpdated"></CalculatorOptimizerTarget>

          <label
            class="mb-1 mt-3 block text-[10px] font-semibold uppercase tracking-wide opacity-60"
            >Damage type</label
          >
          <CalculatorOptimizerDamageType
            name="live-result-bar-damage-type"
            :character="character"
            :current-damage-type="damageType"
            @optimizer:damage-type-updated="
              onDamageTypeUpdated
            "></CalculatorOptimizerDamageType>
        </div>
      </details>

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
        <div class="font-mono font-bold text-lg leading-tight tabular-nums text-secondary">
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
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
  damageType: LiveResultBarDamageType;
  statKeys: string[];
  stats: Record<string, number>;
  allDamages: Record<string, any> | null | undefined;
  isDetailOpen: boolean;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  "update:target": [target: string | null];
  "update:damage-type": [damageType: LiveResultBarDamageType];
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

const resolved = computed(() =>
  resolveLiveResultBarTarget(
    props.target,
    props.allDamages,
    props.stats,
    props.damageType,
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

// Native <details>/<summary> has no built-in "close on outside click"
// behavior (unlike AppRichSelect's own dropdown, which already does this
// via the same pointerdown pattern below) — without this, closing the
// target/damage-type popover requires clicking the gear again instead of
// just clicking away.
const settingsDetailsEl = ref<HTMLDetailsElement | null>(null);
function onDocumentPointerDown(event: PointerEvent) {
  const el = settingsDetailsEl.value;
  if (!el || !el.open) return;
  if (event.target instanceof Node && el.contains(event.target)) return;
  el.open = false;
}
onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown, true);
});

function onTargetUpdated(next: string | null) {
  emit("update:target", next);
}

function onDamageTypeUpdated(next: string) {
  if (next === "Normal" || next === "Average" || next === "Crit") {
    emit("update:damage-type", next);
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
