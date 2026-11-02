<template>
  <tr
    class="live-result-stat-row"
    :class="{ 'live-result-stat-row--split': share }"
    data-test-live-result-stat-row
    :data-test-live-result-stat-row-key="statKey"
    v-tooltip="splitTooltip"
    @click="emit('stat-selected', label)">
    <td class="w-6">
      <img :src="icon" class="size-4" />
    </td>
    <td class="stat-name">{{ label }}</td>
    <td class="text-right whitespace-nowrap">
      <span
        v-if="share?.hasBuffs"
        class="mr-1.5 text-[11px] text-base-content/70 font-mono tabular-nums"
        data-test-live-result-stat-row-split>{{ share.buildText }} {{ share.buffsText }}</span>
      <span class="font-mono font-bold tabular-nums">{{ value }}</span>
    </td>
    <td class="w-5">
      <button
        type="button"
        class="pin-toggle"
        :class="{ 'pin-toggle--pinned': pinned }"
        :aria-pressed="pinned"
        :aria-label="pinned ? `Unpin ${label}` : `Pin ${label}`"
        v-tooltip="pinned ? 'Unpin from favorites' : 'Pin to favorites'"
        data-test-live-result-stat-row-pin
        @click.stop="emit('toggle-pin', statKey)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-3"
          viewBox="0 0 24 24"
          :fill="pinned ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="1.8">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 2v6M8.5 8h7l1.5 5h-10l1.5-5Z" />
          <path stroke-linecap="round" d="M12 13v9" />
        </svg>
      </button>
    </td>
  </tr>
  <!-- Build-vs-live bar (ADR 0051): its own row so it can span the label and
  value columns. Decorative — the numbers are in the split text/tooltip. -->
  <tr
    v-if="share"
    class="live-result-stat-row__bar-row"
    aria-hidden="true"
    data-test-live-result-stat-row-bar
    @click="emit('stat-selected', label)">
    <td></td>
    <td colspan="2">
      <div class="flex h-[3px] rounded-sm overflow-hidden bg-base-content/10">
        <span
          class="bg-base-content/40"
          :style="{ width: `${share.build * 100}%` }"></span>
        <span
          class="bg-accent"
          :style="{ width: `${share.buffs * 100}%` }"
          data-test-live-result-stat-row-bar-buffs></span>
      </div>
    </td>
    <td></td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { StatShare } from "../calculator/statSplit";

defineOptions({ name: "CalculatorLiveResultStatRow" });

const props = defineProps<{
  statKey: string;
  icon: string;
  label: string;
  value: string;
  pinned: boolean;
  /** Build-vs-live split; null/undefined hides the bar. */
  share?: StatShare | null;
}>();

const splitTooltip = computed(() =>
  props.share?.hasBuffs
    ? `Build ${props.share.buildText} · Buffs ${props.share.buffsText}`
    : null,
);

const emit = defineEmits<{
  "toggle-pin": [statKey: string];
  "stat-selected": [stat: string];
}>();
</script>

<style scoped lang="scss">
.live-result-stat-row {
  cursor: pointer;

  td {
    padding: 3px 6px;
    font-size: 15px;
    line-height: 1.3;
  }

  td:first-child {
    padding: 0;
  }
}
.live-result-stat-row--split td {
  padding-bottom: 1px;
}
.live-result-stat-row__bar-row {
  cursor: pointer;

  td {
    padding: 0 6px 4px;
  }
}

.pin-toggle {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: oklch(var(--bc) / 0.35);
}
.pin-toggle--pinned {
  color: oklch(var(--p));
}
</style>
