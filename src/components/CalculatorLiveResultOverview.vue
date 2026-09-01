<template>
  <div class="live-result-overview">
    <div v-for="group in groups" :key="group.label" class="stat-group">
      <div class="stat-group__label">{{ group.label }}</div>
      <table class="table w-full">
        <tbody>
          <CalculatorLiveResultStatRow
            v-for="row in group.rows"
            :key="row.key"
            :stat-key="row.key"
            :icon="row.icon"
            :label="row.label"
            :value="row.value"
            :pinned="pinnedKeys.includes(row.key)"
            @toggle-pin="(key) => emit('toggle-pin', key)"
            @stat-selected="(stat) => emit('stat-selected', stat)"></CalculatorLiveResultStatRow>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CalculatorLiveResultStatRow from "./CalculatorLiveResultStatRow.vue";
import { STAT_GROUPS } from "../calculator/pinnedStats";
import { useLiveResultStatRows, type LiveResultStatSource } from "../composables/useLiveResultStatRows";

defineOptions({ name: "CalculatorLiveResultOverview" });

const props = defineProps<
  LiveResultStatSource & {
    pinnedKeys: string[];
  }
>();

const emit = defineEmits<{
  "toggle-pin": [statKey: string];
  "stat-selected": [stat: string];
}>();

const allRows = useLiveResultStatRows(() => props);

// STAT_GROUPS declares keys, not row data — join against allRows so a
// character missing the elementDmgBonus row (no elementFilter resolved yet)
// just omits it rather than rendering a blank row.
const groups = computed(() => {
  const byKey = new Map(allRows.value.map((row) => [row.key, row]));
  return STAT_GROUPS.map((group) => ({
    label: group.label,
    rows: group.keys.map((key) => byKey.get(key)).filter((row) => !!row),
  })).filter((group) => group.rows.length > 0);
});
</script>

<style scoped lang="scss">
.stat-group {
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
}
.stat-group__label {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: oklch(var(--bc) / 0.5);
  margin-bottom: 2px;
}
</style>
