<template>
  <span :class="toneClass" :data-delta-tone="delta.tone">{{ parens ? `(${delta.text})` : delta.text }}</span>
</template>

<script setup lang="ts">
// A signed percent difference ("+1.2%", "-0.4%", "0.0%") colored by the
// rounded value — see utils/signedDelta.ts (issue #703). Extra attributes
// (data-test-*, classes) fall through to the <span>.
import { computed } from "vue";
import { deltaToneTextClass, signedPercent } from "../utils/signedDelta";

defineOptions({ name: "AppDeltaPercent" });

const props = withDefaults(
  defineProps<{
    /** Already in percent: 1.2 means +1.2%. */
    value: number;
    decimals?: number;
    /** Wrap in parentheses, as the classic optimizer tables do: "(+1.2%)". */
    parens?: boolean;
  }>(),
  { decimals: 1, parens: false },
);

const delta = computed(() => signedPercent(props.value, { decimals: props.decimals }));
const toneClass = computed(() => deltaToneTextClass(delta.value.tone));
</script>
