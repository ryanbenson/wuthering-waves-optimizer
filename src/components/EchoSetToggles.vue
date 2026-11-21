<template>
  <div class="flex flex-wrap items-center gap-2" data-test-echo-set-toggles>
    <button
      v-if="recommended.length"
      type="button"
      class="btn btn-sm btn-ghost rounded px-2"
      :class="{ 'btn-active': recommendedOnly }"
      :aria-pressed="recommendedOnly"
      data-test-echo-set-recommended-only
      @click="recommendedOnly = !recommendedOnly">
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
import { computed } from "vue";
import { getEchoSetIconByType, getEchoSetLabelByType } from "../echoes/stats";
import { shownEchoSets } from "../echoes/recommendedEchoSets";

/**
 * The row of echo set icons every multi-set picker uses (optimizer eligible sets
 * and main echo picker, the owned-echo browser, the inventory page), in the
 * app's usual set-filter look: selected sets are `btn-active`, and while any is
 * selected the rest dim. With `recommended` sets it adds a "Recommended only"
 * toggle (on by default) that narrows the row to those sets, in the same order.
 */
defineOptions({ name: "EchoSetToggles" });

const props = withDefaults(defineProps<{ sets: string[]; recommended?: string[] }>(), {
  recommended: () => [],
});
/** The selected sets (v-model). */
const selected = defineModel<string[]>({ required: true });
/** "Recommended only" (v-model:recommended-only); local when the parent doesn't bind it. */
const recommendedOnly = defineModel<boolean>("recommendedOnly", { default: true });

const shownSets = computed(() =>
  shownEchoSets(props.sets, props.recommended, selected.value, recommendedOnly.value),
);

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
