<template>
  <CalculatorOptimizerResult
    v-for="(result, i) in resultList"
    :key="result.id"
    :id="result.id"
    :index="i"
    :character="character"
    :loadout="result.loadout"
    :context="result.context"
    :character-element="characterElement"
    :all-damages="allDamages"
    :total-atk="totalAtk"
    :total-hp="totalHp"
    :total-def="totalDef"
    :total-crit-rate="totalCritRate"
    :total-crit-dmg="totalCritDMG"
    :energy-regen="energyRegen"
    :target-type="targetType"
    :target-value="targetValue" />
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
    targetType: {
      type: String,
      required: true,
    },
    targetValue: {
      type: String,
      required: true,
    },
    // props for comparison
    allDamages: {
      type: Array,
      default: () => [],
    },
    totalAtk: {
      type: Number,
      required: true,
    },
    totalHp: {
      type: Number,
      required: true,
    },
    totalDef: {
      type: Number,
      required: true,
    },
    totalCritRate: {
      type: Number,
      required: true,
    },
    totalCritDMG: {
      type: Number,
      required: true,
    },
    energyRegen: {
      type: Number,
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
