<template>
  <div>
    <div v-if="buffs" class="character__buffs p-2">
      <CalculatorCharacterBuff
        v-for="buff in buffs"
        :key="buff.key"
        :character="character"
        :unique-key="buff.key"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        :energy-regen="energyRegen"
        :crit-rate="critRate"
        @updated-character-buff="handleUpdatedCharacterBuff"
        :talent-data="talentData"></CalculatorCharacterBuff>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";
import CalculatorCharacterBuff from "./CalculatorCharacterBuff.vue";

interface CharacterBuffListItem {
  key: string;
  name: string;
  details: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  modifiers?: unknown[];
}

interface Props {
  character: string;
  buffs?: CharacterBuffListItem[];
  talentData?: Record<string, unknown>;
  energyRegen?: number;
  critRate?: number;
}

const props = withDefaults(defineProps<Props>(), {
  buffs: () => [],
  talentData: () => ({}),
  energyRegen: 0,
  critRate: 0,
});

const emit = defineEmits<{
  "updated-character-buffs": [];
}>();

function updatedStats() {
  emit("updated-character-buffs");
}

function handleUpdatedCharacterBuff() {
  emit("updated-character-buffs");
}

function retriggerBuffCalculations() {
  emit("updated-character-buffs");
}

watch(
  () => props.buffs,
  () => {
    updatedStats();
  },
  { deep: true },
);

onMounted(() => {
  updatedStats();
});

onBeforeUnmount(() => {
  emit("updated-character-buffs");
});

defineExpose({
  retriggerBuffCalculations,
});
</script>

<style scoped lang="scss">
.character__buff {
  margin-top: 1rem;
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}
html[data-theme="light"] {
  .character__buff {
    background-color: #f8f8f8;
  }
}
</style>
