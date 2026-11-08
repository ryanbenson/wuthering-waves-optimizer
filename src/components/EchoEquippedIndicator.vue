<template>
  <span
    v-if="isEquippedByActiveCharacter"
    class="badge badge-sm badge-success badge-outline text-nowrap"
    :data-test-optimizer-result-echo-equipped="echoId"
    v-tooltip="'This echo is already equipped on this resonator'">
    Already equipped
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";

const props = defineProps<{
  echoId: string | null | undefined;
}>();

const inventoryStore = useInventoryStore();
const characterStore = useCharacterStore();
const { equipped } = storeToRefs(inventoryStore);

const isEquippedByActiveCharacter = computed(() => {
  void equipped.value;
  if (!props.echoId) return false;
  const activeCharacter = characterStore.activeCharacter;
  if (!activeCharacter) return false;
  return inventoryStore
    .echoIdsEquippedByChar(activeCharacter)
    .includes(props.echoId);
});
</script>
