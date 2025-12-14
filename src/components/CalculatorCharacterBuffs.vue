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

<script>
import { mapState } from "pinia";
import CalculatorCharacterBuff from "./CalculatorCharacterBuff.vue";
import { useCharacterStore } from "../stores/character";
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
    talentData: {
      type: Object,
      default: () => {},
    },
    energyRegen: {
      type: Number,
      default: 0,
    },
    critRate: {
      type: Number,
      default: 0,
    },
  },
  components: { CalculatorCharacterBuff },
  data() {
    return {
      buffsData: [],
      triggerBuffUpdate: 0, // used to force reactivity
    };
  },
  watch: {
    buffsFormatted: function () {
      this.updatedStats();
    },
  },
  methods: {
    /**
     * Emits the buff data in its proper format
     * @emits updated-character-buffs
     */
    updatedStats() {
      this.$emit("updated-character-buffs");
    },
    /**
     * Handler for when the child components has buff data for us to consume
     * @param {Object} buffInfo
     */
    handleUpdatedCharacterBuff(buffInfo) {
      this.$emit("updated-character-buffs");
    },
    retriggerBuffCalculations() {
      this.triggerBuffUpdate++; // increment to force reactivity
    },
  },
  computed: {
    ...mapState(useCharacterStore, ["characters"]),
    /**
     * The current character data
     * @returns {Object}
     */
    currentCharacter() {
      return this.characters[this.character] ?? {};
    },
  },
  mounted() {
    this.updatedStats();
  },
  beforeUnmount() {
    this.$emit("updated-character-buffs");
  },
};
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
