<template>
  <div v-if="echoId" class="echo-lock-trash-actions flex gap-1">
    <button
      type="button"
      class="btn btn-sm btn-ghost btn-square"
      :class="{ 'btn-active': locked }"
      :title="locked ? 'Unlock echo' : 'Lock echo'"
      :aria-label="locked ? 'Unlock echo' : 'Lock echo'"
      :data-test-echo-lock="echoId"
      @click="toggleEchoLocked(echoId)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="size-4"
        aria-hidden="true">
        <path
          v-if="!locked"
          d="M144 144c0-44.2 35.8-80 80-80c31.5 0 58.7 18.1 72 44.5c7.6 15.1 26.2 21.2 41.3 13.6s21.2-26.2 13.6-41.3C337.9 31.1 281.5 0 224 0C144.5 0 80 64.5 80 144l0 48L64 192c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-16 0-16 0 0-48zm0 96l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80z"
          fill="currentColor" />
        <path
          v-else
          d="M384 192c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0 0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0zM224 80c-35.3 0-64 28.7-64 64l0 48 128 0 0-48c0-35.3-28.7-64-64-64z"
          fill="currentColor" />
      </svg>
    </button>
    <button
      type="button"
      class="btn btn-sm btn-ghost btn-square"
      :class="{ 'btn-active text-error': isTrash }"
      :title="isTrash ? 'Remove from trash' : 'Mark as trash'"
      :aria-label="isTrash ? 'Remove from trash' : 'Mark as trash'"
      :data-test-echo-trash="echoId"
      @click="toggleEchoTrash(echoId)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="size-4"
        aria-hidden="true">
        <path
          d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l0 320c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320-64 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-96 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-64 0z"
          fill="currentColor" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useEchoInventory } from "../composables/useEchoInventory";

const props = defineProps<{
  echoId: string | null;
}>();

const inventoryStore = useInventoryStore();
const { echoes } = storeToRefs(inventoryStore);
const { toggleEchoLocked, toggleEchoTrash } = useEchoInventory();

const locked = computed(() => {
  void echoes.value;
  if (!props.echoId) return false;
  return Boolean(inventoryStore.getEchoById(props.echoId)?.locked);
});

const isTrash = computed(() => {
  void echoes.value;
  if (!props.echoId) return false;
  return Boolean(inventoryStore.getEchoById(props.echoId)?.trash);
});
</script>
