<template>
  <div
    class="build-card__resonance flex"
    :class="direction === 'row' ? 'flex-row items-center' : 'flex-col items-start'"
    :style="{ gap: `${gap}px` }"
    data-test-build-card-resonance>
    <div
      v-for="(node, idx) in nodes"
      :key="node.key ?? idx"
      class="build-card__resonance-node"
      :class="node.isEnabled ? 'build-card__resonance-node--active' : 'build-card__resonance-node--inactive'"
      :style="{ width: `${size}px`, height: `${size}px` }"
      :title="node.name">
      <img v-if="node.icon" :src="node.icon" alt="" class="w-[86%] h-[86%] object-contain" />
      <svg v-else viewBox="0 0 24 24" class="size-1/2" fill="currentColor" aria-hidden="true">
        <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BuildCardResonanceNode } from "../../buildCard/view";

withDefaults(
  defineProps<{
    nodes: BuildCardResonanceNode[];
    direction?: "row" | "column";
    size?: number;
    gap?: number;
  }>(),
  { direction: "column", size: 48, gap: 14 },
);
</script>

<style scoped>
.build-card__resonance-node {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  overflow: hidden;
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  background: rgba(6, 9, 18, 0.55);
}

.build-card__resonance-node--active {
  border-color: var(--card-accent);
  background: color-mix(in srgb, var(--card-accent) 20%, rgba(6, 9, 18, 0.55));
  box-shadow: 0 0 10px color-mix(in srgb, var(--card-accent) 45%, transparent);
}

.build-card__resonance-node--inactive {
  opacity: 0.5;
}
</style>
