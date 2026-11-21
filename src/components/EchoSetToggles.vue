<template>
  <div class="flex flex-wrap gap-2" data-test-echo-set-toggles>
    <button
      v-for="set in sets"
      :key="set"
      type="button"
      class="rounded-lg p-1.5 border-2 transition-opacity"
      :class="toggleClass(set)"
      :aria-pressed="selected.includes(set)"
      :aria-label="getEchoSetLabelByType(set) ?? set"
      :data-test-echo-set-toggle="set"
      @click="toggle(set)">
      <img :src="getEchoSetIconByType(set)" :alt="set" class="size-7" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { getEchoSetIconByType, getEchoSetLabelByType } from "../echoes/stats";

/**
 * The row of echo set icons every set picker uses (optimizer eligible sets and main echo
 * picker, the owned-echo browser, the inventory page). Selected sets are boxed; while any
 * is selected the rest are greyed out, and with none selected every set shows at full colour.
 */
defineOptions({ name: "EchoSetToggles" });

defineProps<{ sets: string[] }>();
/** The selected sets (v-model). */
const selected = defineModel<string[]>({ required: true });

function toggle(set: string) {
  selected.value = selected.value.includes(set)
    ? selected.value.filter((chosen) => chosen !== set)
    : [...selected.value, set];
}

function toggleClass(set: string) {
  if (selected.value.includes(set)) return "border-primary opacity-100";
  return selected.value.length ? "border-transparent opacity-40 hover:opacity-70" : "border-transparent";
}
</script>
