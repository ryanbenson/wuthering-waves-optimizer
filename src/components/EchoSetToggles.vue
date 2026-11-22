<template>
  <div class="flex flex-wrap items-center gap-2" data-test-echo-set-toggles>
    <button
      v-if="recommended.length"
      type="button"
      class="btn btn-sm btn-ghost rounded inline-flex items-center gap-1.5 px-2"
      :class="{ 'btn-active': recommendedOnly }"
      v-tooltip="'Show only the recommended echo sets'"
      :aria-pressed="recommendedOnly"
      data-test-echo-set-recommended-only
      @click="toggleRecommendedOnly">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4" aria-hidden="true">
        <path v-if="recommendedOnly" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
        <path
          v-else
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linejoin="round" />
      </svg>
      Recommended only
    </button>
    <div
      class="echo-filters__sets flex flex-wrap"
      :class="{ 'echo-filters__sets--active': selected.length }">
      <button
        v-for="set in shownSets"
        :key="set"
        type="button"
        class="rounded mr-1 p-[.3rem]"
        :class="{ 'btn-active': selected.includes(set) }"
        :aria-pressed="selected.includes(set)"
        :aria-label="getEchoSetLabelByType(set) ?? set"
        :data-test-echo-set-toggle="set"
        @click="toggle(set)">
        <img :src="getEchoSetIconByType(set)" alt="" class="size-7" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getEchoSetIconByType, getEchoSetLabelByType } from "../echoes/stats";
import { shownEchoSets } from "../echoes/recommendedEchoSets";
import { trackEvent } from "../utils/analytics";

/**
 * The row of echo set icons every multi-set picker uses (optimizer eligible sets
 * and main echo picker, the owned-echo browser, the inventory page), in the
 * app's usual set-filter look: selected sets are `btn-active`, and while any is
 * selected the rest dim. With `recommended` sets it adds a "Recommended only"
 * toggle, off by default and built like the echo browser's favourites filter,
 * that narrows the icon row (never the echo list) to those sets, in the same order.
 */
defineOptions({ name: "EchoSetToggles" });

const props = withDefaults(
  defineProps<{
    sets: string[];
    recommended?: string[];
    /** Where the row is, for the `echo-sets-recommended-only` analytics event. */
    surface?: string;
  }>(),
  { recommended: () => [], surface: "unknown" },
);
/** The selected sets (v-model). */
const selected = defineModel<string[]>({ required: true });
/** "Recommended only": narrows the icon row; off by default and not saved. */
const recommendedOnly = ref(false);

const shownSets = computed(() =>
  shownEchoSets(props.sets, props.recommended, selected.value, recommendedOnly.value),
);

function toggleRecommendedOnly() {
  recommendedOnly.value = !recommendedOnly.value;
  trackEvent("echo-sets-recommended-only", { on: recommendedOnly.value, surface: props.surface });
}

function toggle(set: string) {
  selected.value = selected.value.includes(set)
    ? selected.value.filter((chosen) => chosen !== set)
    : [...selected.value, set];
}
</script>

<style scoped>
.echo-filters__sets--active button {
  opacity: 0.6;
}
.echo-filters__sets--active button.btn-active {
  opacity: 1;
}
</style>
