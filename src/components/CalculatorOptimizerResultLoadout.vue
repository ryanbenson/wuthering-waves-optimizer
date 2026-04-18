<template>
  <div
    class="optimizer_result_loadout flex gap-2 flex-wrap"
    data-test-optimizer-result-loadout>
    <CalculatorOptimizerResultLoadoutEcho
      v-for="echo in normalizedLoadout"
      :key="String(echo.echoId)"
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

<script setup lang="ts">
import { computed } from "vue";
import CalculatorOptimizerResultLoadoutEcho from "./CalculatorOptimizerResultLoadoutEcho.vue";

defineOptions({ name: "CalculatorOptimizerResultLoadout" });

export type OptimizerLoadoutEcho = {
  echoId: string;
  rank: number | string;
  type: string;
  echoSet: string;
  stat: string;
  echo: string;
  echoSubStatsType1: string;
  echoSubStatsValue1: number | string;
  echoSubStatsType2: string;
  echoSubStatsValue2: number | string;
  echoSubStatsType3: string;
  echoSubStatsValue3: number | string;
  echoSubStatsType4: string;
  echoSubStatsValue4: number | string;
  echoSubStatsType5: string;
  echoSubStatsValue5: number | string;
};

const props = defineProps<{
  loadout: unknown[];
}>();

const normalizedLoadout = computed(
  () => props.loadout as OptimizerLoadoutEcho[],
);
</script>
