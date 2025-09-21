<template>
  <CalculatorOptimizerResult
    v-for="(result, i) in resultList"
    :key="result.id"
    :id="result.id"
    :index="i"
    :character="character"
    :loadout="result.loadout"
    :target-value="result.targetValue"
    :context="result.context"
    :character-element="characterElement" />
</template>

<script>
import CalculatorOptimizerResult from "./CalculatorOptimizerResult.vue";
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
  computed: {
    resultList() {
      return JSON.parse(JSON.stringify(this.results));
    },
  },
};
</script>
