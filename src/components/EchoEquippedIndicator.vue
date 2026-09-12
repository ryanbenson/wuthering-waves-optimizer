<template>
  <span
    v-if="isEquippedByActiveCharacter"
    class="echo-status-icon text-success"
    :data-test-optimizer-result-echo-equipped="echoId"
    v-tooltip="'Already equipped on this resonator'">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      class="echo-status-icon__glyph"
      aria-hidden="true">
      <path
        d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
        fill="currentColor" />
    </svg>
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

<style lang="scss" scoped>
.echo-status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  opacity: 0.85;

  &__glyph {
    width: 0.875rem;
    height: 0.875rem;
  }
}
</style>
