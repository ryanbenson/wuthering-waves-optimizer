<template>
  <div class="border-b border-base-300 last:border-0 py-1.5">
    <label class="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        class="checkbox checkbox-xs mt-0.5 shrink-0"
        :checked="isEnabled"
        :disabled="alwaysEnabled"
        :data-test-advanced-buff-toggle="dataTestKey"
        @change="onToggle(($event.target as HTMLInputElement).checked)" />
      <span class="flex-1 min-w-0">
        <span v-if="title" class="block text-xs font-semibold">{{ title }}</span>
        <span class="block text-xs opacity-90" v-html="details"></span>
      </span>
      <input
        v-if="hasStacks"
        type="number"
        class="input input-bordered input-xs w-14 shrink-0"
        :min="minStacks ?? 0"
        :max="maxStacks ?? 99"
        :value="stacks"
        :data-test-advanced-buff-stacks="dataTestKey"
        @click.stop
        @change="onStacksChange(($event.target as HTMLInputElement).valueAsNumber)" />
      <button
        v-if="canBulkApply"
        type="button"
        class="btn btn-xs shrink-0"
        title="Apply this buff's current setting across a range of actions"
        :data-test-advanced-buff-duration-open="dataTestKey"
        @click.stop.prevent="showDurationPanel = !showDurationPanel">
        Duration
      </button>
      <button
        v-if="isOverridden"
        type="button"
        class="btn btn-xs btn-ghost shrink-0"
        title="Revert this buff to follow the character's current setting"
        :data-test-advanced-buff-reset="dataTestKey"
        @click.stop.prevent="$emit('reset')">
        ↺ Sync
      </button>
    </label>

    <RotationDurationPanel
      v-if="showDurationPanel"
      class="ml-6 mt-1"
      :range-actions="rangeActions"
      :action-id="actionId"
      :data-test-key="dataTestKey"
      @apply="applyDuration" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import RotationDurationPanel from "./RotationDurationPanel.vue";
import { getDurationPool, type DurationRangeAction } from "../utils/rotationDurationRange";

export type { DurationRangeAction };

export interface AdvancedBuffOverride {
  isEnabled?: boolean;
  stacks?: number;
}

const props = withDefaults(
  defineProps<{
    dataTestKey: string;
    title?: string | null;
    details: string;
    hasStacks?: boolean;
    minStacks?: number;
    maxStacks?: number;
    alwaysEnabled?: boolean;
    modelValue?: AdvancedBuffOverride;
    /** Whether this specific field is actually persisted as an override on
     * the action (not just reflecting the character's live value) — shows
     * the per-row "Sync" revert control when true. */
    isOverridden?: boolean;
    /** The whole team's actions in sequence — used to build the "lasts for
     * X actions" / "until action Y" range options. Omitted (or a
     * single-action list) hides the Duration control entirely. */
    rangeActions?: DurationRangeAction[];
    actionId?: string;
  }>(),
  {
    title: null,
    hasStacks: false,
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
    modelValue: undefined,
    isOverridden: false,
    rangeActions: () => [],
    actionId: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: AdvancedBuffOverride];
  "bulk-apply": [payload: { override: AdvancedBuffOverride; actionIds: string[] }];
  reset: [];
}>();

const isEnabled = computed(() => props.alwaysEnabled || (props.modelValue?.isEnabled ?? false));
const stacks = computed(() => props.modelValue?.stacks ?? props.minStacks ?? 0);

function onToggle(checked: boolean) {
  emit("update:modelValue", { ...(props.modelValue ?? {}), isEnabled: checked });
}

function onStacksChange(value: number) {
  if (Number.isNaN(value)) return;
  emit("update:modelValue", { ...(props.modelValue ?? {}), stacks: value });
}

const canBulkApply = computed(() => getDurationPool(props.rangeActions, props.actionId).length > 1);

const showDurationPanel = ref(false);

function applyDuration(actionIds: string[]) {
  emit("bulk-apply", {
    override: { isEnabled: isEnabled.value, stacks: props.hasStacks ? stacks.value : undefined },
    actionIds,
  });
  showDurationPanel.value = false;
}
</script>
