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

    <div
      v-if="showDurationPanel"
      class="ml-6 mt-1 flex flex-wrap items-center gap-2 text-xs"
      :data-test-advanced-buff-duration-panel="dataTestKey">
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
        :max="remainingActions.length"
        class="input input-bordered input-xs w-14"
        v-model.number="durationCount"
        :data-test-advanced-buff-duration-count="dataTestKey" />
      <AppRichSelect
        v-else
        class="w-56"
        size="xs"
        :model-value="untilActionId"
        :options="untilOptions"
        :data-test="`advanced-buff-duration-until-${dataTestKey}`"
        @update:model-value="(v) => (untilActionId = v as string | null)" />
      <button
        type="button"
        class="btn btn-xs btn-primary"
        :data-test-advanced-buff-duration-apply="dataTestKey"
        @click="applyDuration">
        Apply
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AppRichSelect from "./AppRichSelect.vue";

export interface AdvancedBuffOverride {
  isEnabled?: boolean;
  stacks?: number;
}

/** One action anywhere in the team's rotation (any character/slot), in the
 * team's actual displayed sequence — the pool the "lasts for X actions" /
 * "until action Y" duration control draws from. */
export interface DurationRangeAction {
  id: string;
  characterName: string;
  key?: string | null;
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

// This action plus every later action in the team's rotation — across every
// character, not just this one — since a buff's duration is about the
// rotation's real timeline, not any single character's own action count.
// Actions before this one aren't eligible: a buff can't retroactively apply
// to something that already happened.
const remainingActions = computed(() => {
  const list = props.rangeActions;
  const startIndex = list.findIndex((a) => a.id === props.actionId);
  const from = startIndex === -1 ? list : list.slice(startIndex);
  return from.map((a, index) => ({
    id: a.id,
    label: `${index === 0 ? "This action" : `+${index}`} — ${a.characterName}: ${a.key || "unconfigured"}`,
  }));
});

const untilOptions = computed(() =>
  remainingActions.value.map((a) => ({ value: a.id, label: a.label })),
);

const canBulkApply = computed(() => remainingActions.value.length > 1);

const showDurationPanel = ref(false);
const durationMode = ref<"count" | "until">("count");
const durationCount = ref(1);
const untilActionId = ref<string | null>(null);

watch(remainingActions, (opts) => {
  if (!opts.some((o) => o.id === untilActionId.value)) {
    untilActionId.value = opts[opts.length - 1]?.id ?? null;
  }
});

function applyDuration() {
  const pool = remainingActions.value;
  if (!pool.length) return;
  let targetIds: string[];
  if (durationMode.value === "until") {
    const idx = pool.findIndex((a) => a.id === untilActionId.value);
    targetIds = pool.slice(0, idx === -1 ? pool.length : idx + 1).map((a) => a.id);
  } else {
    const count = Math.max(1, Math.min(durationCount.value || 1, pool.length));
    targetIds = pool.slice(0, count).map((a) => a.id);
  }
  emit("bulk-apply", {
    override: { isEnabled: isEnabled.value, stacks: props.hasStacks ? stacks.value : undefined },
    actionIds: targetIds,
  });
  showDurationPanel.value = false;
}
</script>
