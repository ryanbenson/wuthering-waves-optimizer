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
        @update:model-value="(v) => updateCategory('buffs', def.key, v)" />
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
        @update:model-value="(v) => updateCategory('weaponPassives', def.key, v)" />
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
        @update:model-value="(v) => updateCategory('echoSetPassives', def.key, v)" />
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
        @update:model-value="updateMainEchoBuff" />
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
        @update:model-value="(v) => updateCategory('teamBuffs', def.key, v)" />
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
        @update:model-value="(v) => updateCategory('resonanceChains', def.key, v)" />
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
} from "./TeamRotationAdvancedBuffRow.vue";
import type { TeamRotationAdvancedConfig } from "../calculator/teamRotation";

type BuffCategory = "buffs" | "weaponPassives" | "echoSetPassives" | "teamBuffs" | "resonanceChains";

const props = withDefaults(
  defineProps<{
    modelValue: TeamRotationAdvancedConfig;
    buffDefs?: any[];
    weaponPassiveDefs?: any[];
    echoSetPassiveDefs?: any[];
    mainEchoDef?: any | null;
    teamBuffDefs?: any[];
    resonanceChainDefs?: any[];
  }>(),
  {
    buffDefs: () => [],
    weaponPassiveDefs: () => [],
    echoSetPassiveDefs: () => [],
    mainEchoDef: null,
    teamBuffDefs: () => [],
    resonanceChainDefs: () => [],
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: TeamRotationAdvancedConfig];
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

function updateCategory(category: BuffCategory, key: string, value: AdvancedBuffOverride) {
  const nextCategory = { ...(props.modelValue[category] ?? {}), [key]: value };
  emit("update:modelValue", { ...props.modelValue, [category]: nextCategory });
}

function updateMainEchoBuff(value: AdvancedBuffOverride) {
  emit("update:modelValue", { ...props.modelValue, mainEchoBuff: value });
}
</script>
