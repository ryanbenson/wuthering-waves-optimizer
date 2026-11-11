<template>
  <div
    class="build-card-stats grid"
    :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: '28px' }"
    data-test-build-card-stats>
    <div v-for="(column, ci) in split" :key="ci">
      <div
        v-for="row in column"
        :key="row.key"
        class="build-card-stats__row"
        :class="{ 'is-zero': row.isZero }"
        :style="{ fontSize: `${fontSize}px`, padding: `${rowPadding}px 2px` }"
        :data-test-build-card-stat="row.key">
        <img :src="row.icon" alt="" class="build-card-stats__icon" />
        <span class="build-card-stats__label">{{ shortLabels ? row.shortLabel : row.label }}</span>
        <span class="build-card-stats__value">{{ row.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BuildCardStatRow } from "../../buildCard/statRows";

const props = withDefaults(
  defineProps<{
    rows: BuildCardStatRow[];
    columns?: number;
    fontSize?: number;
    rowPadding?: number;
    /** Split base stats and bonuses into their own columns (2-column layouts). */
    splitByGroup?: boolean;
    shortLabels?: boolean;
  }>(),
  { columns: 1, fontSize: 19, rowPadding: 10, splitByGroup: false, shortLabels: false },
);

const split = computed(() => {
  if (props.columns <= 1) return [props.rows];
  if (props.splitByGroup && props.columns === 2) {
    return [
      props.rows.filter((row) => row.group === "base"),
      props.rows.filter((row) => row.group === "bonus"),
    ];
  }
  const perColumn = Math.ceil(props.rows.length / props.columns);
  return Array.from({ length: props.columns }, (_, i) =>
    props.rows.slice(i * perColumn, (i + 1) * perColumn),
  );
});
</script>

<style scoped>
.build-card-stats__row {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--card-hair);
}

.build-card-stats__icon {
  width: 1.15em;
  height: 1.15em;
  flex-shrink: 0;
}

.build-card-stats__label {
  flex: 1 1 auto;
  min-width: 0;
  white-space: nowrap;
  color: var(--card-muted);
  font-weight: 500;
}

.build-card-stats__value {
  flex-shrink: 0;
  font-weight: 700;
  font-size: 1.1em;
  color: var(--card-ink);
  font-variant-numeric: tabular-nums;
}

.is-zero {
  opacity: 0.45;
}
</style>
