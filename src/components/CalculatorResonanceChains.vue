<template>
  <div>
    <div
      v-if="buffsList.length"
      class="character__buffs character__resonance-chains p-2"
      data-test-resonance-chains>
      <CalculatorResonanceChainsItem
        v-for="buff in buffsList"
        :key="buff.key"
        :unique-key="buff.key"
        :character="character"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="Boolean(buff.alwaysEnabled)"
        :has-stacks="Boolean(buff.hasStacks)"
        :min-stacks="Number(buff.minStacks) || 0"
        :max-stacks="Number(buff.maxStacks) || 0"
        :modifiers="(buff.modifiers ?? []) as unknown[]"
        @updated-character-buff="handleUpdatedCharacterBuff"
        class="character__buff character__resonance-chain"
        :data-test-resonance-chain="buff.key"></CalculatorResonanceChainsItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import CalculatorResonanceChainsItem from "./CalculatorResonanceChainsItem.vue";

export type ResonanceChainBuffRow = {
  key: string;
  name?: string;
  details?: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  modifiers?: unknown[];
};

const props = withDefaults(
  defineProps<{
    character: string;
    buffs?: unknown[];
  }>(),
  { buffs: () => [] },
);

const buffsList = computed(() => (props.buffs ?? []) as ResonanceChainBuffRow[]);

const emit = defineEmits<{
  "updated-character-resonance-chains": [];
}>();

function updatedStats() {
  emit("updated-character-resonance-chains");
}

function handleUpdatedCharacterBuff() {
  updatedStats();
}

onMounted(() => {
  updatedStats();
});

onBeforeUnmount(() => {
  emit("updated-character-resonance-chains");
});
</script>

<style scoped lang="scss"></style>
