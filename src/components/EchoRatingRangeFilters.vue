<template>
  <div class="echo-rating-filters min-w-[12rem] flex-1 max-w-sm">
    <div class="flex justify-between items-baseline gap-2 text-xs mb-1">
      <span class="font-medium opacity-80">Rating</span>
      <span class="tabular-nums opacity-70">{{ ratingMin }} – {{ ratingMax }}</span>
    </div>
    <RangeMinMax
      id="echo-rating-filter"
      :min="POINT_SCALE_MIN"
      :max="POINT_SCALE_MAX"
      :step="1"
      size="xs"
      min-aria-label="Minimum echo rating"
      max-aria-label="Maximum echo rating"
      v-model:model-min="ratingMin"
      v-model:model-max="ratingMax" />
  </div>
</template>

<script setup lang="ts">
import { POINT_SCALE_MIN, POINT_SCALE_MAX } from "../echoes/rating";
import RangeMinMax from "./input/RangeMinMax.vue";

const ratingMin = defineModel<number>("ratingMin", { default: POINT_SCALE_MIN });
const ratingMax = defineModel<number>("ratingMax", { default: POINT_SCALE_MAX });
</script>
