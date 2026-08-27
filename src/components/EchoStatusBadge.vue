<template>
  <span
    v-if="echoId && (locked || trash)"
    class="echo-status-badge"
    :class="{ 'echo-status-badge--trash': !locked }"
    :data-test-echo-status-badge="echoId"
    v-tooltip="locked ? 'Locked — protected from deletion' : 'Marked as trash — pending bulk deletion'">
    <svg
      v-if="locked"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      class="echo-status-badge__icon"
      aria-hidden="true">
      <path
        d="M384 192c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0 0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0zM224 80c-35.3 0-64 28.7-64 64l0 48 128 0 0-48c0-35.3-28.7-64-64-64z"
        fill="currentColor" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      class="echo-status-badge__icon"
      aria-hidden="true">
      <path
        d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l0 320c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320-64 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-96 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-64 0z"
        fill="currentColor" />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInventoryStore } from "../stores/inventory";

const props = defineProps<{
  echoId: string | null | undefined;
}>();

const inventoryStore = useInventoryStore();
const { echoes } = storeToRefs(inventoryStore);

// An echo can only be marked trash while unlocked (locking clears trash —
// see useEchoInventory.ts#setEchoLocked), so locked always wins the single
// badge slot when both happen to be true.
const locked = computed(() => {
  void echoes.value;
  if (!props.echoId) return false;
  return Boolean(inventoryStore.getEchoById(props.echoId)?.locked);
});

const trash = computed(() => {
  void echoes.value;
  if (!props.echoId) return false;
  return Boolean(inventoryStore.getEchoById(props.echoId)?.trash);
});
</script>

<style lang="scss" scoped>
.echo-status-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;

  &--trash {
    color: #f87171;
  }

  &__icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>
