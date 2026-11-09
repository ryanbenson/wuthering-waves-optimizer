<template>
  <!-- Each pill is a direct child div: tests count `[data-test-build-card-echo-sets] > div`. -->
  <div class="flex flex-wrap gap-2.5" :class="justifyClass" data-test-build-card-echo-sets>
    <div v-for="set in sets" :key="set.key" class="build-card-set" :style="{ fontSize: `${size}px` }">
      <img :src="set.icon" alt="" :style="{ width: `${size + 10}px`, height: `${size + 10}px` }" />
      <span class="whitespace-nowrap"><span class="build-card-set__count">{{ set.count }}pc</span> {{ set.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BuildCardSetSummary } from "../../buildCard/view";

const props = withDefaults(
  defineProps<{ sets: BuildCardSetSummary[]; size?: number; justify?: "start" | "center" | "end" }>(),
  { size: 16, justify: "start" },
);

const justifyClass = computed(
  () => ({ start: "justify-start", center: "justify-center", end: "justify-end" })[props.justify],
);
</script>

<style scoped>
.build-card-set {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 8px;
  border-radius: 999px;
  background: var(--card-glass);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: var(--card-ink);
  font-weight: 600;
}

.build-card-set__count {
  color: var(--card-accent);
  font-weight: 800;
}
</style>
