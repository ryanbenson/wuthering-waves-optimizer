<template>
  <div class="enemy-stacks-panel flex flex-col gap-1" data-test-rotation-enemy-stacks-panel>
    <div class="text-xs opacity-60 mb-1">
      Override this action's enemy buff-stack settings. Fields left unchecked follow the
      rotation's current enemy settings ({{ rangeActions.length ? "shown below" : "" }}).
    </div>
    <TeamRotationAdvancedBuffRow
      v-for="field in ENEMY_STACK_FIELDS"
      :key="field.key"
      :data-test-key="`enemyStacks.${field.key}`"
      :title="field.label"
      details=""
      has-stacks
      :min-stacks="0"
      :max-stacks="field.max"
      :model-value="displayedValue(field.key)"
      :is-overridden="Boolean(modelValue[field.key]?.isEnabled)"
      :range-actions="rangeActions"
      :action-id="actionId"
      @update:model-value="(v) => onUpdate(field.key, v)"
      @reset="onReset(field.key)"
      @bulk-apply="(payload) => onBulkApply(field.key, payload)" />
  </div>
</template>

<script setup lang="ts">
import TeamRotationAdvancedBuffRow, {
  type AdvancedBuffOverride,
  type DurationRangeAction,
} from "./TeamRotationAdvancedBuffRow.vue";
import { ENEMY_STACK_FIELDS, type EnemyStackKey, type EnemyStacksOverride } from "../calculator/rotationEnemyStacksOverride";
import type { TeamEnemyConfig } from "../calculator/buildCharacterContext";

const props = withDefaults(
  defineProps<{
    modelValue: EnemyStacksOverride;
    /** The rotation/team-wide enemy config — used as the displayed value for
     * any field this action doesn't override. */
    currentEnemyConfig: TeamEnemyConfig;
    rangeActions?: DurationRangeAction[];
    actionId?: string;
  }>(),
  {
    rangeActions: () => [],
    actionId: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [payload: { key: EnemyStackKey; value: AdvancedBuffOverride }];
  "reset-field": [payload: { key: EnemyStackKey }];
  "bulk-apply": [payload: { key: EnemyStackKey; override: AdvancedBuffOverride; actionIds: string[] }];
}>();

function displayedValue(key: EnemyStackKey): AdvancedBuffOverride {
  return props.modelValue[key] ?? { isEnabled: false, stacks: props.currentEnemyConfig[key] ?? 0 };
}

function onUpdate(key: EnemyStackKey, value: AdvancedBuffOverride) {
  emit("update:modelValue", { key, value });
}

function onReset(key: EnemyStackKey) {
  emit("reset-field", { key });
}

function onBulkApply(key: EnemyStackKey, payload: { override: AdvancedBuffOverride; actionIds: string[] }) {
  emit("bulk-apply", { key, override: payload.override, actionIds: payload.actionIds });
}
</script>
