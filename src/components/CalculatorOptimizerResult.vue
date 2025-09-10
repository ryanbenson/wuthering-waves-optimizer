<template>
<div class="optimizer_result" :data-test-optimizer-result-id="id">
    <div class="optimizer_result_target">
        <div v-if="targetType === 'Attack'">
          <CalculatorOptimizerResultDamage
            :attack-info="attackInfo"
            :attack-label="attackLabel"
          />
        </div>
    </div>
    <div class="optimizer_result_stats">
        <CalculatorOptimizerResultStats
          :final-stats="context.finalStats"
        />
    </div>
    <pre v-if="false">{{ loadout }}</pre>
</div>
</template>

<script>
import { displayPercentage, displayInt, displayDamage } from "../utils/numbers";
import CalculatorOptimizerResultStats from "./CalculatorOptimizerResultStats.vue";
import CalculatorOptimizerResultDamage from "./CalculatorOptimizerResultDamage.vue"
export default {
  name: "CalculatorOptimizerResults",
  props: {
    id: {
      type: String,
      required: true,
    },
    targetValue: {
      type: Number,
      required: true,
    },
    loadout: {
      type: Array,
      default: () => [],
    },
    context: {
      type: Object,
      default: () => {}
    },
    characterElement: {
        type: String,
        required: true,
    },
  },
  components: {
    CalculatorOptimizerResultStats,
    CalculatorOptimizerResultDamage,
  },
  computed: {
    targetType() {
        return this.context?.targetType;
    },
    targetObject() {
        return this.context?.targetObject;
    },
    attackLabel() {
        if (!this.targetType === 'Attack') {
            return;
        }
        return this.context?.attacks?.[0]?.label;
    },
    attackInfo() {
        if (!this.targetType === 'Attack') {
            return;
        }
        return this.context?.attacks?.[0];
    },
  },
  methods: {
    displayInt,
    displayPercentage,
    displayDamage,
  }
};
</script>