<template>
  <Teleport to="body">
    <dialog ref="dialogEl" class="toast-layer">
      <slot />
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{
  visible: boolean;
}>();

const dialogEl = ref<HTMLDialogElement | null>(null);
let observer: MutationObserver | undefined;

function hasOtherModalOpen(el: HTMLDialogElement) {
  return [...document.querySelectorAll("dialog:modal")].some((dialog) => dialog !== el);
}

function syncDialog() {
  const el = dialogEl.value;
  if (!el) return;

  if (!props.visible) {
    if (el.open) {
      el.close();
    }
    return;
  }

  const otherModalOpen = hasOtherModalOpen(el);

  if (otherModalOpen) {
    if (!el.matches(":modal")) {
      el.close();
      el.showModal();
    }
    return;
  }

  if (el.matches(":modal")) {
    el.close();
    el.show();
    return;
  }

  if (!el.open) {
    el.show();
  }
}

onMounted(() => {
  observer = new MutationObserver(() => syncDialog());
  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["open"],
  });
  syncDialog();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  dialogEl.value?.close();
});

watch(() => props.visible, syncDialog);
</script>

<style scoped>
.toast-layer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  pointer-events: none;
  overflow: visible;
}

.toast-layer::backdrop {
  background: transparent;
  pointer-events: none;
}

.toast-layer :deep(.toast.toast-top) {
  top: 5rem;
}

.toast-layer :deep(.alert) {
  pointer-events: auto;
}
</style>
