<template>
  <div class="optimizer-echo-set">
    <h4 class="text-lg font-semibold mb-2">{{ name }}</h4>
    <div class="echo-set-passives">
      <CalculatorOptimizerEchoSetPassive
        v-for="(passive, index) in passives"
        :key="passive.passiveKey"
        :character="character"
        :has-stacks="passive.hasStacks"
        :modifier="passive.modifier"
        :modifier-value="passive.modifierValue"
        :min-stacks="passive.minStacks"
        :max-stacks="passive.maxStacks"
        :details="passive.details"
        :always-enabled="passive.alwaysEnabled"
        :passive-key="passive.key"
        :modifiers="passive.modifiers"
        @updated-optimizer-echo-passive-stats="
          handlePassiveStatsUpdate
        "></CalculatorOptimizerEchoSetPassive>
    </div>
  </div>
</template>

<script>
import CalculatorOptimizerEchoSetPassive from "./CalculatorOptimizerEchoSetPassive.vue";
export default {
  name: "CalculatorOptimizerEchoSet",
  props: {
    character: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    passives: {
      type: Array,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    setKey: {
      type: String,
      required: true,
    },
  },
  components: {
    CalculatorOptimizerEchoSetPassive,
  },
  methods: {
    handlePassiveStatsUpdate({ stats, key }) {
      this.$emit("updated-optimizer-echo-set-stats", {
        setKey: this.setKey,
        stats,
        key,
      });
    },
  },
};
</script>
