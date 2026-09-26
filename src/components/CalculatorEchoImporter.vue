<template>
  <dialog :id="modalId" class="modal" @close="handleClose">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div v-if="isOpen" class="modal-box max-w-5xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <CalculatorEchoParser
          v-if="!isReviewingDuplicates"
          :inventory-only="inventoryOnly"
          @echoes-parsed="handleEchoesParsed"></CalculatorEchoParser>
        <EchoDuplicateReviewList
          v-else
          :items="duplicateReviewItems"
          :inventory-only="inventoryOnly"
          :has-selected-echoes="hasSelectedEchoes"
          @cancel="handleCancelDuplicateReview"
          @confirm="handleConfirmDuplicateReview"
          @apply-to-character-only="handleApplyToCharacterOnly"></EchoDuplicateReviewList>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import CalculatorEchoParser from "./CalculatorEchoParser.vue";
import EchoDuplicateReviewList from "./EchoDuplicateReviewList.vue";
import { useEchoDuplicateReview } from "../composables/useEchoDuplicateReview";

const props = withDefaults(
  defineProps<{
    character?: string;
    inventoryOnly?: boolean;
  }>(),
  { character: "", inventoryOnly: false },
);

const modalId = computed(() =>
  props.inventoryOnly
    ? "modal-echoes-importer-inventory"
    : "modal-echoes-importer",
);

const isOpen = ref(false);

async function triggerOpenModal() {
  isOpen.value = true;
  await nextTick();
  const modalEl = document.getElementById(modalId.value);
  (modalEl as HTMLDialogElement | null)?.showModal();
}

/**
 * Also wired to the <dialog>'s own native `close` event (see the
 * template) — Escape closes a native <dialog> shown via showModal()
 * directly, bypassing the backdrop/✕ click handlers entirely, which would
 * otherwise leave `isOpen` stuck true. Safe to call more than once (a
 * click handler's own modalEl.close() triggers this same native event
 * too) — everything here is a no-op the second time.
 */
function triggerCloseModal() {
  const modalEl = document.getElementById(modalId.value);
  (modalEl as HTMLDialogElement | null)?.close();
  isOpen.value = false;
  resetDuplicateReview();
}

function handleClose() {
  triggerCloseModal();
}

const {
  isReviewingDuplicates,
  duplicateReviewItems,
  hasSelectedEchoes,
  resetDuplicateReview,
  handleEchoesParsed,
  handleConfirmDuplicateReview,
  handleApplyToCharacterOnly,
} = useEchoDuplicateReview({
  inventoryOnly: () => props.inventoryOnly,
  character: () => props.character,
  onFinalized: triggerCloseModal,
});

function handleCancelDuplicateReview() {
  triggerCloseModal();
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
