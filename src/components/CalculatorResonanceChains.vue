<template>
  <div>
    <div
      v-if="buffs"
      class="character__buffs character__resonance-chains p-2"
      data-test-resonance-chains>
      <CalculatorResonanceChainsItem
        v-for="buff in buffs"
        :key="buff.key"
        :unique-key="buff.key"
        :character="character"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        @updated-character-buff="handleUpdatedCharacterBuff"
        class="character__buff character__resonance-chain"
        :data-test-resonance-chain="buff.key"></CalculatorResonanceChainsItem>
    </div>
  </div>
</template>

<script>
import CalculatorResonanceChainsItem from "./CalculatorResonanceChainsItem.vue";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    buffs: {
      type: Array,
      default: () => [],
    },
  },
  components: { CalculatorResonanceChainsItem },
  methods: {
    /**
     * Emits when resonance chains are updated - stats.ts will handle the calculation
     * @emits updated-character-resonance-chains
     */
    updatedStats() {
      this.$emit("updated-character-resonance-chains");
    },
    /**
     * Handler for when child components emit updates
     */
    handleUpdatedCharacterBuff() {
      this.updatedStats();
    },
  },
  mounted() {
    this.updatedStats();
  },
  beforeUnmount() {
    this.$emit("updated-character-resonance-chains");
  },
};
</script>

<style scoped lang="scss"></style>
