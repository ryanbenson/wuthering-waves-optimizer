<template>
  <div class="build-card-score flex items-center" :class="{ 'flex-row-reverse text-right': align === 'right' }" :style="{ gap: '18px' }" data-test-build-card-build-score>
    <div class="relative shrink-0" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg :width="size" :height="size" class="-rotate-90" aria-hidden="true">
        <circle :cx="size / 2" :cy="size / 2" :r="radius" fill="none" stroke="rgba(255,255,255,0.10)" :stroke-width="stroke" />
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="radius"
          fill="none"
          :stroke="color"
          :stroke-width="stroke"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset" />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span class="font-extrabold" :style="{ color, fontSize: `${Math.round(size * 0.36)}px` }">{{ score.grade }}</span>
        <span class="build-card-score__pct" :style="{ fontSize: `${Math.round(size * 0.15)}px` }">{{ percentText }}</span>
      </div>
    </div>
    <div>
      <div class="build-card-score__label">Build Score</div>
      <div v-if="totalCv != null" class="build-card-score__cv">
        Total CV <span class="build-card-score__cv-value">{{ formattedCv }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getGradeColor } from "../../buildCard/theme";
import type { TeamSubstatScoreRollup } from "../../composables/useTeamSubstatScoreRollup";

const props = withDefaults(
  defineProps<{
    score: TeamSubstatScoreRollup;
    totalCv?: number | null;
    size?: number;
    align?: "left" | "right";
  }>(),
  { totalCv: null, size: 80, align: "left" },
);

const stroke = computed(() => Math.max(5, Math.round(props.size / 11)));
const radius = computed(() => (props.size - stroke.value) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(
  () => circumference.value * (1 - Math.min(Math.max(props.score.percent, 0), 100) / 100),
);
const color = computed(() => getGradeColor(props.score.color));
const percentText = computed(
  () => `${Math.round(props.score.percent)}%${props.score.provisional ? "*" : ""}`,
);
const formattedCv = computed(() => (props.totalCv ?? 0).toFixed(1));
</script>

<style scoped>
.build-card-score__pct {
  margin-top: 3px;
  font-weight: 600;
  color: var(--card-muted);
}

.build-card-score__label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--card-muted);
}

.build-card-score__cv {
  margin-top: 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--card-ink);
}

.build-card-score__cv-value {
  font-weight: 800;
  color: var(--card-gold);
}
</style>
