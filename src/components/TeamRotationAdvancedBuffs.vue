<template>
  <div class="advanced-buffs flex flex-col gap-3" data-test-team-rotation-advanced-buffs>
    <div v-if="buffDefs.length">
      <div class="text-xs font-semibold uppercase opacity-60 mb-1">Self Buffs</div>
      <TeamRotationAdvancedBuffRow
        v-for="def in buffDefs"
        :key="def.key"
        :data-test-key="`buffs.${def.key}`"
        :title="def.name ?? def.key"
        :details="def.details ?? ''"
        :has-stacks="def.hasStacks"
        :min-stacks="def.minStacks"
        :max-stacks="def.maxStacks"
        :always-enabled="def.alwaysEnabled"
        :model-value="modelValue.buffs?.[def.key]"
        :is-overridden="Boolean(overrides?.buffs?.[def.key])"
        :range-actions="rangeActions"
        :action-id="actionId"
        @update:model-value="(v) => updateCategory('buffs', def.key, v)"
        @reset="onResetField('buffs', def.key)"
        @bulk-apply="(payload) => onBulkApply('buffs', def.key, payload)" />
    </div>

    <div v-if="weaponPassiveDefs.length">
      <div class="text-xs font-semibold uppercase opacity-60 mb-1">Weapon</div>
      <TeamRotationAdvancedBuffRow
        v-for="def in weaponPassiveDefs"
        :key="def.key"
        :data-test-key="`weaponPassives.${def.key}`"
        :title="def.name ?? def.key"
        :details="def.details ?? ''"
        :has-stacks="def.hasStacks"
        :min-stacks="def.minStacks"
        :max-stacks="def.maxStacks"
        :always-enabled="def.alwaysEnabled"
        :model-value="modelValue.weaponPassives?.[def.key]"
        :is-overridden="Boolean(overrides?.weaponPassives?.[def.key])"
        :range-actions="rangeActions"
        :action-id="actionId"
        @update:model-value="(v) => updateCategory('weaponPassives', def.key, v)"
        @reset="onResetField('weaponPassives', def.key)"
        @bulk-apply="(payload) => onBulkApply('weaponPassives', def.key, payload)" />
    </div>

    <div v-if="echoSetPassiveDefs.length">
      <div class="text-xs font-semibold uppercase opacity-60 mb-1">Echo Set Bonuses</div>
      <TeamRotationAdvancedBuffRow
        v-for="def in echoSetPassiveDefs"
        :key="def.key"
        :data-test-key="`echoSetPassives.${def.key}`"
        :title="def.name ?? def.key"
        :details="def.details ?? ''"
        :has-stacks="def.hasStacks"
        :min-stacks="def.minStacks"
        :max-stacks="def.maxStacks"
        :always-enabled="def.alwaysEnabled"
        :model-value="modelValue.echoSetPassives?.[def.key]"
        :is-overridden="Boolean(overrides?.echoSetPassives?.[def.key])"
        :range-actions="rangeActions"
        :action-id="actionId"
        @update:model-value="(v) => updateCategory('echoSetPassives', def.key, v)"
        @reset="onResetField('echoSetPassives', def.key)"
        @bulk-apply="(payload) => onBulkApply('echoSetPassives', def.key, payload)" />
    </div>

    <div v-if="mainEchoDef">
      <div class="text-xs font-semibold uppercase opacity-60 mb-1">Main Echo</div>
      <TeamRotationAdvancedBuffRow
        data-test-key="mainEchoBuff"
        :title="mainEchoDef.name ?? 'Main Echo Buff'"
        :details="mainEchoDef.details ?? ''"
        :has-stacks="mainEchoDef.hasStacks"
        :min-stacks="mainEchoDef.minStacks"
        :max-stacks="mainEchoDef.maxStacks"
        :always-enabled="mainEchoDef.alwaysEnabled"
        :model-value="modelValue.mainEchoBuff"
        :is-overridden="Boolean(overrides?.mainEchoBuff)"
        :range-actions="rangeActions"
        :action-id="actionId"
        @update:model-value="updateMainEchoBuff"
        @reset="onResetField('mainEchoBuff', null)"
        @bulk-apply="(payload) => onBulkApply('mainEchoBuff', null, payload)" />
    </div>

    <div v-if="teamBuffDefs.length">
      <div class="text-xs font-semibold uppercase opacity-60 mb-1">Team Buffs</div>
      <TeamRotationAdvancedBuffRow
        v-for="def in teamBuffDefs"
        :key="def.key"
        :data-test-key="`teamBuffs.${def.key}`"
        :title="def.name ?? def.key"
        :details="def.details ?? ''"
        :has-stacks="def.hasStacks"
        :min-stacks="def.minStacks"
        :max-stacks="def.maxStacks"
        :always-enabled="def.alwaysEnabled"
        :model-value="modelValue.teamBuffs?.[def.key]"
        :is-overridden="Boolean(overrides?.teamBuffs?.[def.key])"
        :range-actions="rangeActions"
        :action-id="actionId"
        @update:model-value="(v) => updateCategory('teamBuffs', def.key, v)"
        @reset="onResetField('teamBuffs', def.key)"
        @bulk-apply="(payload) => onBulkApply('teamBuffs', def.key, payload)" />
    </div>

    <div v-if="resonanceChainDefs.length">
      <div class="text-xs font-semibold uppercase opacity-60 mb-1">Resonance Chains</div>
      <TeamRotationAdvancedBuffRow
        v-for="def in resonanceChainDefs"
        :key="def.key"
        :data-test-key="`resonanceChains.${def.key}`"
        :title="def.name ?? def.key"
        :details="def.details ?? ''"
        :has-stacks="def.hasStacks"
        :min-stacks="def.minStacks"
        :max-stacks="def.maxStacks"
        :always-enabled="def.alwaysEnabled"
        :model-value="modelValue.resonanceChains?.[def.key]"
        :is-overridden="Boolean(overrides?.resonanceChains?.[def.key])"
        :range-actions="rangeActions"
        :action-id="actionId"
        @update:model-value="(v) => updateCategory('resonanceChains', def.key, v)"
        @reset="onResetField('resonanceChains', def.key)"
        @bulk-apply="(payload) => onBulkApply('resonanceChains', def.key, payload)" />
    </div>

    <p v-if="isEmpty" class="text-xs opacity-60">
      No configurable buffs found — configure this character's build first.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TeamRotationAdvancedBuffRow, {
  type AdvancedBuffOverride,
  type DurationRangeAction,
} from "./TeamRotationAdvancedBuffRow.vue";
import type { AdvancedConfigCategory, RotationAdvancedConfig } from "../calculator/rotationAdvancedBuffs";

type BuffCategory = "buffs" | "weaponPassives" | "echoSetPassives" | "teamBuffs" | "resonanceChains";

const props = withDefaults(
  defineProps<{
    modelValue: RotationAdvancedConfig;
    /** The action's REAL persisted overrides (not the merged display value)
     * — used only to tell each row whether ITS key is actually overridden,
     * so the per-row "revert to sync" control knows when to appear. */
    overrides?: RotationAdvancedConfig | null;
    buffDefs?: any[];
    weaponPassiveDefs?: any[];
    echoSetPassiveDefs?: any[];
    mainEchoDef?: any | null;
    teamBuffDefs?: any[];
    resonanceChainDefs?: any[];
    rangeActions?: DurationRangeAction[];
    actionId?: string;
  }>(),
  {
    overrides: null,
    buffDefs: () => [],
    weaponPassiveDefs: () => [],
    echoSetPassiveDefs: () => [],
    mainEchoDef: null,
    teamBuffDefs: () => [],
    resonanceChainDefs: () => [],
    rangeActions: () => [],
    actionId: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [payload: { category: AdvancedConfigCategory; key: string | null; value: AdvancedBuffOverride }];
  "reset-field": [payload: { category: AdvancedConfigCategory; key: string | null }];
  "bulk-apply": [payload: { category: AdvancedConfigCategory; key: string | null; override: AdvancedBuffOverride; actionIds: string[] }];
}>();

const isEmpty = computed(
  () =>
    !props.buffDefs.length &&
    !props.weaponPassiveDefs.length &&
    !props.echoSetPassiveDefs.length &&
    !props.mainEchoDef &&
    !props.teamBuffDefs.length &&
    !props.resonanceChainDefs.length,
);

// Emits only the one field that changed — never the whole modelValue — so
// the parent can write a sparse patch into the action's real advancedConfig
// instead of re-baking every other field's currently-displayed value.
function updateCategory(category: BuffCategory, key: string, value: AdvancedBuffOverride) {
  emit("update:modelValue", { category, key, value });
}

function updateMainEchoBuff(value: AdvancedBuffOverride) {
  emit("update:modelValue", { category: "mainEchoBuff", key: null, value });
}

function onResetField(category: AdvancedConfigCategory, key: string | null) {
  emit("reset-field", { category, key });
}

function onBulkApply(
  category: AdvancedConfigCategory,
  key: string | null,
  payload: { override: AdvancedBuffOverride; actionIds: string[] },
) {
  emit("bulk-apply", { category, key, override: payload.override, actionIds: payload.actionIds });
}
</script>
