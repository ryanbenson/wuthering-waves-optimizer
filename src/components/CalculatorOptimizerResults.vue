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
    :total-crit-dmg="totalCritDmg"
    :energy-regen="energyRegen"
    :target-type="targetType"
    :target-value="targetValue" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import CalculatorOptimizerResult from "./CalculatorOptimizerResult.vue";

defineOptions({ name: "CalculatorOptimizerResults" });

const props = withDefaults(
  defineProps<{
    character: string;
    results?: unknown[];
    characterElement: string;
    targetType: string;
    targetValue: string;
    allDamages?: unknown;
    totalAtk: number;
    totalHp: number;
    totalDef: number;
    totalCritRate: number;
    totalCritDmg: number;
    energyRegen: number;
  }>(),
  {
    results: () => [],
  },
);

type OptimizerResultRow = {
  id: string;
  loadout: unknown[];
  context: Record<string, unknown>;
};

const resultList = computed(
  () => JSON.parse(JSON.stringify(props.results)) as OptimizerResultRow[],
);
</script>
