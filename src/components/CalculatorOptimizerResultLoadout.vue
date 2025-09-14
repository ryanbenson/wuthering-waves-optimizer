<template>
  <div class="optimizer_result_loadout flex gap-2 flex-wrap">
    <CalculatorOptimizerResultLoadoutEcho
      v-for="echo in loadout"
      :key="echo.echoId"
      :rank="echo.rank"
      :type="echo.type"
      :echo-id="echo.echoId"
      :echo-set="echo.echoSet"
      :stat="echo.stat"
      :echo="echo.echo"
      :echo-sub-stats-type-1="echo.echoSubStatsType1"
      :echo-sub-stats-value-1="echo.echoSubStatsValue1"
      :echo-sub-stats-type-2="echo.echoSubStatsType2"
      :echo-sub-stats-value-2="echo.echoSubStatsValue2"
      :echo-sub-stats-type-3="echo.echoSubStatsType3"
      :echo-sub-stats-value-3="echo.echoSubStatsValue3"
      :echo-sub-stats-type-4="echo.echoSubStatsType4"
      :echo-sub-stats-value-4="echo.echoSubStatsValue4"
      :echo-sub-stats-type-5="echo.echoSubStatsType5"
      :echo-sub-stats-value-5="echo.echoSubStatsValue5"
      :hide-inventory="true"></CalculatorOptimizerResultLoadoutEcho>
  </div>
</template>

<script>
import CalculatorOptimizerResultLoadoutEcho from "./CalculatorOptimizerResultLoadoutEcho.vue";
export default {
  name: "CalculatorOptimizerResultLoadout",
  props: {
    loadout: {
      type: Array,
      required: true,
    },
  },
  components: {
    CalculatorOptimizerResultLoadoutEcho,
  },
};
</script>
