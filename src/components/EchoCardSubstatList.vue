<template>
  <div class="flex flex-col gap-1">
    <div
      v-for="slot in slots"
      :key="slot.index"
      class="flex items-center justify-between gap-1.5 rounded-sm border-l-4 pl-2 pr-2"
      :class="[size === 'xs' ? 'text-[11px] py-0.5' : 'text-xs py-1', rowClass(slot)]"
      :data-test-echo-card-substat="slot.index">
      <span class="flex items-center gap-1.5 min-w-0">
        <img
          v-if="slot.filled"
          :src="slot.icon"
          class="shrink-0"
          :class="size === 'xs' ? 'size-3.5' : 'size-4'" />
        <span class="truncate" :class="textClass(slot)">
          {{ slot.filled ? getReadableSubStatLabel(slot.type) : "Empty" }}
        </span>
      </span>
      <span class="font-mono font-bold shrink-0" :class="textClass(slot)">
        {{ slot.filled ? slot.display : "—" }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getReadableSubStatLabel } from "../echoes/stats";
import { getSubstatRollQualityClasses } from "../composables/useEchoCardStats";
import { useSettingsStore } from "../stores/settings";

export interface EchoCardSubstatSlot {
  index: number;
  type: string;
  value: number | string;
  display: string | number | null;
  icon: string;
  filled: boolean;
}

defineOptions({ name: "EchoCardSubstatList" });

withDefaults(
  defineProps<{
    slots: EchoCardSubstatSlot[];
    // "sm" (CalculatorEchoCard's comfy tile-style layout) or "xs" (its
    // skinnier compact layout) — same row shape, smaller icon/text/padding.
    size?: "sm" | "xs";
  }>(),
  { size: "sm" },
);

// Same flag-gating as CalculatorEchoCard.vue itself (see docs/adr/0014
// decisions #12/#13) — a filled row with the flag off gets the same
// neutral border-l-base-300 an empty row does, not an uncolored border.
const settingsStore = useSettingsStore() as any;
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);

function rowClass(slot: EchoCardSubstatSlot) {
  if (!slot.filled || !isLiveResultBarEnabled.value) return "border-l-base-300";
  return ["bg-base-200/60", getSubstatRollQualityClasses(slot.type, slot.value)?.border];
}
function textClass(slot: EchoCardSubstatSlot) {
  if (!slot.filled) return "opacity-40";
  if (!isLiveResultBarEnabled.value) return "";
  return getSubstatRollQualityClasses(slot.type, slot.value)?.text;
}
</script>
