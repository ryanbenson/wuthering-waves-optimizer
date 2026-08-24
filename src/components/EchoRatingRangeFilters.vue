<template>
  <div class="echo-rating-filters min-w-[12rem] flex-1 max-w-sm">
    <div class="flex justify-between items-baseline gap-2 text-xs mb-1">
      <span class="font-medium opacity-80">Rating</span>
      <span class="tabular-nums opacity-70">{{ ratingMin }}% – {{ ratingMax }}%</span>
    </div>
    <RangeMinMax
      id="echo-rating-filter"
      :min="RATING_PERCENT_MIN"
      :max="RATING_PERCENT_MAX"
      :step="1"
      size="xs"
      min-aria-label="Minimum echo rating"
      max-aria-label="Maximum echo rating"
      v-model:model-min="ratingMin"
      v-model:model-max="ratingMax" />
  </div>
</template>

<script setup lang="ts">
import RangeMinMax from "./input/RangeMinMax.vue";

// Matches the 0-100% shown on the Echo Rating badge itself (see
// EchoRating.percent in src/echoes/rating.ts), not the internal 5-40 raw
// point scale that percent is derived from.
const RATING_PERCENT_MIN = 0;
const RATING_PERCENT_MAX = 100;

const ratingMin = defineModel<number>("ratingMin", { default: RATING_PERCENT_MIN });
const ratingMax = defineModel<number>("ratingMax", { default: RATING_PERCENT_MAX });
</script>
