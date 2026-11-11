<template>
  <span
    v-if="equippedBy.onActive"
    class="badge badge-sm badge-success badge-outline text-nowrap"
    :data-test-optimizer-result-echo-equipped="echoId"
    v-tooltip="'This echo is already equipped on this resonator'">
    Already equipped
  </span>
</template>

<script setup lang="ts">
import { useEchoEquippedBy } from "../composables/useEchoEquippedBy";

const props = defineProps<{
  echoId: string | null | undefined;
}>();

const equippedBy = useEchoEquippedBy(() => props.echoId);
</script>
