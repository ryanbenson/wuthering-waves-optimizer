<template>
  <Teleport to="body">
    <dialog
      ref="dialogEl"
      class="modal confirm-dialog"
      @close="handleDialogClose">
      <form method="dialog" class="modal-backdrop" @submit.prevent="handleCancel">
        <button type="submit">close</button>
      </form>
      <div v-if="confirmRequest" class="modal-box">
        <h3 v-if="confirmRequest.title" class="text-lg font-bold">
          {{ confirmRequest.title }}
        </h3>
        <p class="py-4">{{ confirmRequest.message }}</p>
        <div class="modal-action">
          <button type="button" class="btn" @click="handleCancel">
            {{ confirmRequest.cancelLabel }}
          </button>
          <button
            type="button"
            :class="confirmButtonClasses[confirmRequest.variant]"
            @click="handleConfirm">
            {{ confirmRequest.confirmLabel }}
          </button>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import { confirmButtonClasses, useConfirm } from "../composables/useConfirm";

const { confirmRequest, settle } = useConfirm();
const dialogEl = ref<HTMLDialogElement | null>(null);

function syncDialog() {
  const el = dialogEl.value;
  if (!el) return;

  if (confirmRequest.value) {
    if (!el.open) {
      el.showModal();
    }
    return;
  }

  if (el.open) {
    el.close();
  }
}

function handleConfirm() {
  settle(true);
}

function handleCancel() {
  settle(false);
}

function handleDialogClose() {
  if (confirmRequest.value) {
    settle(false);
  }
}

const stopWatch = watch(confirmRequest, () => {
  void nextTick(syncDialog);
});

onBeforeUnmount(() => {
  stopWatch();
  dialogEl.value?.close();
});
</script>

<style scoped>
.confirm-dialog {
  z-index: 10000;
}
</style>
