<template>
  <div class="flex flex-wrap items-center gap-2 text-xs" v-bind="testAttr('duration-panel')">
    <span class="opacity-70">Apply current setting starting here for</span>
    <div class="join">
      <button
        type="button"
        class="btn btn-xs join-item"
        :class="{ 'btn-active': durationMode === 'count' }"
        @click="durationMode = 'count'">
        # actions
      </button>
      <button
        type="button"
        class="btn btn-xs join-item"
        :class="{ 'btn-active': durationMode === 'until' }"
        @click="durationMode = 'until'">
        Until action
      </button>
    </div>
    <input
      v-if="durationMode === 'count'"
      type="number"
      min="1"
      :max="pool.length"
      class="input input-bordered input-xs w-14"
      v-model.number="durationCount"
      v-bind="testAttr('duration-count')" />
    <AppRichSelect
      v-else
      class="w-56"
      size="xs"
      :model-value="untilActionId"
      :options="untilOptions"
      :data-test="`${dataTestPrefix}-duration-until-${dataTestKey}`"
      @update:model-value="(v) => (untilActionId = v as string | null)" />
    <button
      type="button"
      class="btn btn-xs btn-primary"
      v-bind="testAttr('duration-apply')"
      @click="apply">
      Apply
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AppRichSelect from "./AppRichSelect.vue";
import {
  getDurationPool,
  resolveDurationTargetIds,
  type DurationMode,
  type DurationRangeAction,
} from "../utils/rotationDurationRange";

/**
 * The "lasts for X actions" / "until action Y" range picker shared by every
 * per-action Duration control (advanced buff rows, enemy stack rows, custom
 * buff rows). Only resolves the target action ids — the caller decides what
 * gets written into them.
 */
const props = withDefaults(
  defineProps<{
    rangeActions: DurationRangeAction[];
    actionId?: string;
    dataTestKey: string;
    /** Prefix for this panel's data-test attributes, so each caller keeps its
     * own existing selectors (e.g. `data-test-advanced-buff-duration-apply`). */
    dataTestPrefix?: string;
  }>(),
  {
    actionId: undefined,
    dataTestPrefix: "advanced-buff",
  },
);

const emit = defineEmits<{
  apply: [actionIds: string[]];
}>();

function testAttr(name: string): Record<string, string> {
  return { [`data-test-${props.dataTestPrefix}-${name}`]: props.dataTestKey };
}

const pool = computed(() => getDurationPool(props.rangeActions, props.actionId));
const untilOptions = computed(() => pool.value.map((a) => ({ value: a.id, label: a.label })));

const durationMode = ref<DurationMode>("count");
const durationCount = ref(1);
const untilActionId = ref<string | null>(null);

watch(
  pool,
  (opts) => {
    if (!opts.some((o) => o.id === untilActionId.value)) {
      untilActionId.value = opts[opts.length - 1]?.id ?? null;
    }
  },
  { immediate: true },
);

function apply() {
  if (!pool.value.length) return;
  emit("apply", resolveDurationTargetIds(pool.value, durationMode.value, durationCount.value, untilActionId.value));
}
</script>
