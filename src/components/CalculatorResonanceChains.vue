<template>
  <div>
    <div class="buffs__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Resonance Chains</h3>
      <div class="join">
        <button
          type="button"
          class="btn btn-sm join-item"
          data-test-resonance-chains-enable-all
          @click="enableAllResonanceChains">
          Enable all
        </button>
        <button
          type="button"
          class="btn btn-sm join-item"
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
        :details="buff.details"
        :always-enabled="Boolean(buff.alwaysEnabled)"
        :has-stacks="Boolean(buff.hasStacks)"
        :min-stacks="Number(buff.minStacks) || 0"
        :max-stacks="Number(buff.maxStacks) || 0"
        :modifiers="(buff.modifiers ?? []) as unknown[]"
        :buff-attack-target-selection="buff.buffAttackTargetSelection"
        @updated-character-buff="handleUpdatedCharacterBuff"
        class="character__buff character__resonance-chain"
        :data-test-resonance-chain="buff.key"></CalculatorResonanceChainsItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
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
  details?: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  modifiers?: unknown[];
  buffAttackTargetSelection?: ResonanceChainBuffAttackTargetSelection;
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

const emit = defineEmits<{
  "updated-character-resonance-chains": [];
}>();

function updatedStats() {
  emit("updated-character-resonance-chains");
}

function handleUpdatedCharacterBuff() {
  updatedStats();
}

async function enableAllResonanceChains() {
  const chainUpdates: Record<string, { isEnabled: boolean }> = {};

  for (const chain of buffsList.value) {
    chainUpdates[chain.key] = { isEnabled: true };
  }

  await characterStore.setCharacterData(props.character, {
    resonanceChains: chainUpdates,
  });
  handleUpdatedCharacterBuff();
}

async function maxAllResonanceChains() {
  const chainUpdates: Record<
    string,
    { isEnabled: boolean; stacks?: number }
  > = {};

  for (const chain of buffsList.value) {
    const update: { isEnabled: boolean; stacks?: number } = {
      isEnabled: true,
    };

    if (chain.hasStacks) {
      update.stacks = Number(chain.maxStacks) || 0;
    }

    chainUpdates[chain.key] = update;
  }

  await characterStore.setCharacterData(props.character, {
    resonanceChains: chainUpdates,
  });
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
