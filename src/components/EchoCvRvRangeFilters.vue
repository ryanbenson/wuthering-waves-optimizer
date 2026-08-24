<template>
  <!-- No wrapping element: each group is its own flex item, so a parent
       flex-wrap row (e.g. alongside EchoRatingRangeFilters) lays every
       group out side by side and wraps them as a set, not as one fixed-width
       block. -->
  <div class="echo-cv-rv-filters__group min-w-[12rem] flex-1 max-w-sm">
    <div class="flex justify-between items-baseline gap-2 text-xs mb-1">
      <span class="font-medium opacity-80">CV</span>
      <span class="tabular-nums opacity-70">{{ cvMin }} – {{ cvMax }}</span>
    </div>
    <RangeMinMax
      id="echo-cv-filter"
      :min="0"
      :max="cvCeiling"
      :step="0.5"
      size="xs"
      min-aria-label="Minimum crit value"
      max-aria-label="Maximum crit value"
      v-model:model-min="cvMin"
      v-model:model-max="cvMax" />
  </div>
  <div v-if="SHOW_ROLL_VALUE_BADGE" class="echo-cv-rv-filters__group min-w-[12rem] flex-1 max-w-sm">
    <div class="flex justify-between items-baseline gap-2 text-xs mb-1">
      <span class="font-medium opacity-80">RV</span>
      <span class="tabular-nums opacity-70">{{ rvMin }} – {{ rvMax }}</span>
    </div>
    <RangeMinMax
      id="echo-rv-filter"
      :min="0"
      :max="rvCeiling"
      :step="10"
      size="xs"
      min-aria-label="Minimum roll value"
      max-aria-label="Maximum roll value"
      v-model:model-min="rvMin"
      v-model:model-max="rvMax" />
  </div>
</template>

<script setup lang="ts">
import { ECHO_CV_MAX, ECHO_RV_MAX, SHOW_ROLL_VALUE_BADGE } from "../echoes/stats";
import RangeMinMax from "./input/RangeMinMax.vue";

const cvCeiling = ECHO_CV_MAX;
const rvCeiling = ECHO_RV_MAX;

const cvMin = defineModel<number>("cvMin", { default: 0 });
const cvMax = defineModel<number>("cvMax", { default: ECHO_CV_MAX });
const rvMin = defineModel<number>("rvMin", { default: 0 });
const rvMax = defineModel<number>("rvMax", { default: ECHO_RV_MAX });
</script>
