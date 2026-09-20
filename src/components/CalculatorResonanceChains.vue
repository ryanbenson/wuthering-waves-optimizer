<template>
  <div>
    <div class="buffs__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Resonance Chains</h3>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="btn btn-sm"
          data-test-resonance-chains-enable-all
          @click="enableAllResonanceChains">
          Enable all
        </button>
        <button
          type="button"
          class="btn btn-sm"
          data-test-resonance-chains-max-all
          @click="maxAllResonanceChains">
          Max all
        </button>
      </div>
    </div>
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
        :icon="buff.icon"
        :details="buff.details"
        :always-enabled="Boolean(buff.alwaysEnabled)"
        :has-stacks="Boolean(buff.hasStacks)"
        :min-stacks="Number(buff.minStacks) || 0"
        :max-stacks="Number(buff.maxStacks) || 0"
        :realistic-max-stacks="buff.realisticMaxStacks"
        :modifiers="(buff.modifiers ?? []) as unknown[]"
        :buff-attack-target-selection="buff.buffAttackTargetSelection"
        :mutually-exclusive-with="buff.mutuallyExclusiveWith"
        @updated-character-buff="handleUpdatedCharacterBuff"
        class="character__buff character__resonance-chain"
        :data-test-resonance-chain="buff.key"></CalculatorResonanceChainsItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getRealisticMaxStacks } from "../characters/effectiveBuffStacks";
import {
  buildBulkEnableUpdate,
  type BuffCategory,
  type MutuallyExclusiveRef,
} from "../characters/mutuallyExclusiveBuffs";
import { useCharacterStore } from "../stores/character";
import CalculatorResonanceChainsItem from "./CalculatorResonanceChainsItem.vue";

export type ResonanceChainBuffAttackTargetOption = {
  value: string;
  label: string;
};

export type ResonanceChainBuffAttackTargetSelection = {
  configKey: string;
  defaultValue?: string;
  label?: string;
  options: ResonanceChainBuffAttackTargetOption[];
};

export type ResonanceChainBuffRow = {
  key: string;
  name?: string;
  icon?: string;
  details?: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  realisticMaxStacks?: number;
  modifiers?: unknown[];
  buffAttackTargetSelection?: ResonanceChainBuffAttackTargetSelection;
  mutuallyExclusiveWith?: MutuallyExclusiveRef[];
};

const props = withDefaults(
  defineProps<{
    character: string;
    buffs?: unknown[];
  }>(),
  { buffs: () => [] },
);

const buffsList = computed(() => (props.buffs ?? []) as ResonanceChainBuffRow[]);

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const emit = defineEmits<{
  "updated-character-resonance-chains": [];
}>();

function updatedStats() {
  emit("updated-character-resonance-chains");
}

function handleUpdatedCharacterBuff() {
  updatedStats();
}

function isEnabledElsewhere(category: BuffCategory, key: string): boolean {
  const store = characters.value[props.character] as
    | Record<string, Record<string, { isEnabled?: boolean }> | undefined>
    | undefined;
  return store?.[category]?.[key]?.isEnabled ?? false;
}

async function enableAllResonanceChains() {
  const updates = buildBulkEnableUpdate("resonanceChains", buffsList.value, isEnabledElsewhere);
  await characterStore.setCharacterData(props.character, updates);
  handleUpdatedCharacterBuff();
}

async function maxAllResonanceChains() {
  const updates = buildBulkEnableUpdate("resonanceChains", buffsList.value, isEnabledElsewhere, (key) => {
    const chain = buffsList.value.find((c) => c.key === key);
    if (!chain?.hasStacks) {
      return {};
    }
    return {
      stacks: getRealisticMaxStacks(Number(chain.maxStacks) || 0, chain.realisticMaxStacks),
    };
  });

  await characterStore.setCharacterData(props.character, updates);
  handleUpdatedCharacterBuff();
}

onMounted(() => {
  updatedStats();
});

onBeforeUnmount(() => {
  emit("updated-character-resonance-chains");
});
</script>

<style scoped lang="scss"></style>
