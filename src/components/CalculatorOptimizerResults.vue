<template>
  <CalculatorOptimizerResult
    v-for="result in results"
    :key="result.id"
    :id="result.id"
    :character="character"
    :loadout="result.loadout"
    :target-value="result.targetValue"
    :context="result.context"
    :character-element="characterElement"
  />
</template>

<script>
import CalculatorOptimizerResult from "./CalculatorOptimizerResult.vue"
export default {
  name: "CalculatorOptimizerResults",
  props: {
    character: {
      type: String,
      required: true,
    },
    results: {
      type: Array,
      default: () => [],
    },
    characterElement: {
      type: String,
      required: true,
    },
  },
  components: {
    CalculatorOptimizerResult,
  },
};
</script>
