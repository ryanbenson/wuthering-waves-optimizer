<template>
  <AppModal
    ref="modalRef"
    :title="captureRef?.isShowingGuide ? 'How to scan your echoes' : 'Scan echoes from the game'"
    max-width-class="max-w-6xl"
    @close="resetDuplicateReview">
    <template #header-actions>
      <button v-if="captureRef?.isShowingGuide" type="button" class="btn btn-sm" @click="captureRef?.closeGuide()">
        Got it
      </button>
      <button
        v-if="captureRef?.canOpenGuide"
        type="button"
        class="btn btn-ghost btn-sm"
        @click="captureRef?.openGuide()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="h-4 w-4 stroke-current">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
        </svg>
        How to scan
      </button>
    </template>
    <EchoScannerCapture
      v-if="!isReviewingDuplicates"
      ref="captureRef"
      inventory-only
      @echoes-parsed="handleEchoesParsed"></EchoScannerCapture>
    <EchoDuplicateReviewList
      v-else
      :items="duplicateReviewItems"
      inventory-only
      :has-selected-echoes="hasSelectedEchoes"
      @cancel="handleCancelDuplicateReview"
      @confirm="handleConfirmDuplicateReview"></EchoDuplicateReviewList>
  </AppModal>
</template>

<script setup lang="ts">
/**
 * Standalone "Scan echoes" entry point — its own button, its own modal,
 * deliberately separate from CalculatorEchoImporter.vue's "Import echoes"
 * (Discord-bot-image) flow. They used to be two tabs inside one modal;
 * split apart on request, since most people looking for this kind of
 * feature look for something literally called a "scanner," not a tab
 * buried inside an unrelated import flow. Inventory-only by design (no
 * character prop, unlike CalculatorEchoImporter) — scanning your game
 * screen is naturally a "build up my inventory" action, not a
 * "assign echoes to this one character" action.
 *
 * Shares its actual duplicate-review/save logic with
 * CalculatorEchoImporter.vue via useEchoDuplicateReview +
 * EchoDuplicateReviewList — only the capture UI and entry point differ.
 */
import { ref } from "vue";
import AppModal from "./AppModal.vue";
import EchoScannerCapture from "./EchoScannerCapture.vue";
import EchoDuplicateReviewList from "./EchoDuplicateReviewList.vue";
import { useEchoDuplicateReview } from "../composables/useEchoDuplicateReview";
import { trackEvent } from "../utils/analytics";
import { useToast } from "../composables/useToast";

const modalRef = ref<InstanceType<typeof AppModal> | null>(null);
const captureRef = ref<InstanceType<typeof EchoScannerCapture> | null>(null);

async function triggerOpenModal() {
  trackEvent("scanner-opened");
  await modalRef.value?.triggerOpenModal();
}

/**
 * Programmatic close (saved or cancelled review). A user close (✕,
 * backdrop, Escape) is handled by AppModal itself: it closes the
 * dialog, unmounts the body (lazy) and emits `close` → resetDuplicateReview.
 * Either way EchoScannerCapture unmounts, so its cleanup runs and a live
 * screen-share stream never keeps running behind a closed dialog — Escape
 * included, which is why the body must stay lazy (not `:lazy="false"`).
 */
function triggerCloseModal() {
  modalRef.value?.triggerCloseModal();
  resetDuplicateReview();
}

const {
  isReviewingDuplicates,
  duplicateReviewItems,
  hasSelectedEchoes,
  resetDuplicateReview,
  handleEchoesParsed,
  handleConfirmDuplicateReview,
} = useEchoDuplicateReview({
  inventoryOnly: () => true,
  character: () => "",
  onFinalized: handleFinalized,
});

const { showToast } = useToast();

function handleFinalized(savedCount: number) {
  triggerCloseModal();
  showToast(
    savedCount
      ? `Saved ${savedCount} echo${savedCount === 1 ? "" : "es"} to your inventory.`
      : "No echoes were saved.",
    savedCount ? "success" : "info",
  );
}

function handleCancelDuplicateReview() {
  triggerCloseModal();
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
