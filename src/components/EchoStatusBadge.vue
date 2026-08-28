<template>
  <template v-if="echoId">
    <span
      v-if="locked"
      class="echo-status-icon"
      :data-test-echo-status-badge="echoId"
      data-test-echo-status="locked"
      v-tooltip="'Locked — protected from deletion'">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="echo-status-icon__glyph"
        aria-hidden="true">
        <path
          d="M384 192c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0 0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0zM224 80c-35.3 0-64 28.7-64 64l0 48 128 0 0-48c0-35.3-28.7-64-64-64z"
          fill="currentColor" />
      </svg>
    </span>
    <span
      v-if="trash"
      class="echo-status-icon text-error"
      :data-test-echo-status-badge="echoId"
      data-test-echo-status="trash"
      v-tooltip="'Marked as trash — pending bulk deletion'">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="echo-status-icon__glyph"
        aria-hidden="true">
        <path
          d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l0 320c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320-64 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-96 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-64 0z"
          fill="currentColor" />
      </svg>
    </span>
  </template>
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

// An echo can be both locked and trash at once (trashing doesn't require
// being unlocked first — only locking clears trash, see
// useEchoInventory.ts#setEchoLocked) — show both icons rather than picking
// one, so a locked-and-trashed echo doesn't silently hide its trash mark.
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
.echo-status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  color: currentColor;
  opacity: 0.85;

  &__glyph {
    width: 0.875rem;
    height: 0.875rem;
  }
}
</style>
