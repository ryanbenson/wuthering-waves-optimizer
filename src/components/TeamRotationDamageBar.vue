<template>
  <div v-if="segments.length" class="flex flex-col gap-1" data-test-team-rotation-damage-bar>
    <div class="flex h-3 w-full overflow-hidden rounded-full bg-base-300">
      <div
        v-for="(segment, index) in segments"
        :key="segment.characterId"
        class="h-full"
        :style="{ width: `${segment.percentage}%`, backgroundColor: palette[index % palette.length] }"
        :title="`${segment.label}: ${displayDamage(segment.value)} (${segment.percentage.toFixed(1)}%)`"
        :data-test-team-rotation-damage-bar-segment="segment.characterId"></div>
    </div>
    <div v-if="!compact" class="flex flex-wrap gap-x-3 gap-y-0.5 text-xs opacity-80">
      <span
        v-for="(segment, index) in segments"
        :key="segment.characterId"
        class="flex items-center gap-1">
        <span
          class="size-2 rounded-full shrink-0"
          :style="{ backgroundColor: palette[index % palette.length] }"></span>
        {{ segment.label }} {{ segment.percentage.toFixed(0) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getCharacterRosterDisplayName } from "../characters/characters";
import { displayDamage } from "../utils/numbers";
import type { TeamRotationCharacterResult } from "../calculator/teamRotation";

const props = withDefaults(
  defineProps<{
    perCharacter: Record<string, TeamRotationCharacterResult>;
    /** Hides the per-character legend row, leaving just the bar itself. */
    compact?: boolean;
  }>(),
  { compact: false },
);

// Same palette as TeamRotationDamageChart.vue's pie chart, so a character's
// color stays consistent between the summary bar and the detailed drawer.
const palette = [
  "rgb(255, 99, 132)",
  "rgb(54, 162, 235)",
  "rgb(255, 206, 86)",
  "rgb(75, 192, 192)",
  "rgb(153, 102, 255)",
  "rgb(255, 159, 64)",
];

const segments = computed(() => {
  const entries = Object.entries(props.perCharacter)
    .map(([characterId, data]) => ({
      characterId,
      label: getCharacterRosterDisplayName(characterId),
      value: data.damageAggregation.normalDamage ?? 0,
    }))
    .filter((entry) => entry.value > 0);
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);
  entries.sort((a, b) => b.value - a.value);
  return entries.map((entry) => ({
    ...entry,
    percentage: total > 0 ? (entry.value / total) * 100 : 0,
  }));
});
</script>
