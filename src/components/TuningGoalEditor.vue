<template>
  <div class="flex flex-col gap-3" data-test-tuning-goal-editor>
    <div class="flex flex-wrap gap-1">
      <button
        v-for="preset in presets"
        :key="preset.key"
        type="button"
        class="btn btn-xs"
        :class="activePresetKey === preset.key ? 'btn-primary' : 'btn-ghost'"
        :aria-pressed="activePresetKey === preset.key"
        :data-test-tuning-goal-preset="preset.key"
        @click="emit('update:modelValue', preset.goal.map((l) => ({ ...l })))">
        {{ preset.label }}
      </button>
      <button
        type="button"
        class="btn btn-xs btn-ghost"
        :disabled="!modelValue.length"
        data-test-tuning-goal-clear
        @click="emit('update:modelValue', [])">
        Clear
      </button>
    </div>

    <div
      v-for="line in modelValue"
      :key="line.stat"
      class="flex items-center gap-2"
      :data-test-tuning-goal-line="line.stat">
      <span class="text-sm flex-1 min-w-0 truncate">{{ getReadableSubStatLabel(line.stat) }}</span>
      <select
        class="select select-bordered select-sm w-40"
        :aria-label="`Lowest ${getReadableSubStatLabel(line.stat)} roll you'd accept`"
        :value="line.min == null ? '' : String(line.min)"
        @change="setMin(line.stat, ($event.target as HTMLSelectElement).value)">
        <option value="">Any roll</option>
        <option v-for="option in getMinOptions(line.stat)" :key="option.value" :value="String(option.value)">
          ≥ {{ option.label }} · {{ option.chance }}
        </option>
      </select>
      <button
        type="button"
        class="btn btn-xs btn-ghost btn-square"
        :aria-label="`Remove ${getReadableSubStatLabel(line.stat)}`"
        @click="removeLine(line.stat)">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-width="2" d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </div>

    <select
      v-if="modelValue.length < ECHO_SUBSTAT_SLOTS"
      class="select select-bordered select-sm"
      aria-label="Add a substat to the goal"
      data-test-tuning-goal-add
      value=""
      @change="addLine($event)">
      <option value="" disabled>Add a substat…</option>
      <option v-for="stat in addableStats" :key="stat" :value="stat">
        {{ getReadableSubStatLabel(stat) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getReadableSubStatLabel, subStats, subStatsTable } from "../echoes/stats";
import {
  ECHO_SUBSTAT_SLOTS,
  TUNING_GOAL_PRESETS,
  formatSubstatRoll,
  formatTuningChance,
  getTuningGoalKey,
  rollChanceAtLeast,
  type TuningGoal,
  type TuningGoalPresetOption,
} from "../echoes/tuningOdds";

defineOptions({ name: "TuningGoalEditor" });

const props = defineProps<{
  modelValue: TuningGoal;
  /** Shown after the built-in presets, e.g. a character's top substats. */
  extraPresets?: TuningGoalPresetOption[];
}>();
const emit = defineEmits<{ "update:modelValue": [goal: TuningGoal] }>();

const presets = computed<TuningGoalPresetOption[]>(() => [
  ...Object.entries(TUNING_GOAL_PRESETS).map(([key, preset]) => ({ key, ...preset })),
  ...(props.extraPresets ?? []),
]);

const activePresetKey = computed(() => {
  const key = getTuningGoalKey(props.modelValue);
  return presets.value.find((preset) => getTuningGoalKey(preset.goal) === key)?.key ?? null;
});

const addableStats = computed(() =>
  subStats.filter((stat) => !props.modelValue.some((line) => line.stat === stat)),
);

function getMinOptions(stat: string) {
  // The lowest tier is the same as "Any roll", so start from the second.
  return (subStatsTable[stat] ?? []).slice(1).map((value) => ({
    value,
    label: formatSubstatRoll(stat, value),
    chance: formatTuningChance(rollChanceAtLeast(stat, value)),
  }));
}

function setMin(stat: string, raw: string) {
  const min = raw === "" ? null : Number(raw);
  emit(
    "update:modelValue",
    props.modelValue.map((line) => (line.stat === stat ? { ...line, min } : line)),
  );
}

function removeLine(stat: string) {
  emit("update:modelValue", props.modelValue.filter((line) => line.stat !== stat));
}

function addLine(event: Event) {
  const select = event.target as HTMLSelectElement;
  const stat = select.value;
  select.value = "";
  if (!stat) return;
  emit("update:modelValue", [...props.modelValue, { stat, min: null }]);
}
</script>
