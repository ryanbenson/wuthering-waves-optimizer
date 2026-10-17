<template>
  <dialog :id="modalId" class="modal" @close="handleClose" @cancel="handleEscape">
    <form method="dialog" class="modal-backdrop" @click.prevent="handleCloseRequest">
      <button>close</button>
    </form>
    <div v-if="hasOpened" class="modal-box max-w-6xl">
      <form method="dialog" @click.prevent="handleCloseRequest">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <EchoScannerCapture
          v-show="!isReviewingDuplicates"
          ref="captureRef"
          inventory-only
          @echoes-parsed="handleEchoesParsed"></EchoScannerCapture>
        <EchoDuplicateReviewList
          v-if="isReviewingDuplicates"
          :items="duplicateReviewItems"
          inventory-only
          :has-selected-echoes="hasSelectedEchoes"
          @cancel="handleCancelDuplicateReview"
          @confirm="handleConfirmDuplicateReview"></EchoDuplicateReviewList>
      </div>
    </div>
  </dialog>
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
import { nextTick, ref } from "vue";
import EchoScannerCapture from "./EchoScannerCapture.vue";
import EchoDuplicateReviewList from "./EchoDuplicateReviewList.vue";
import { useEchoDuplicateReview } from "../composables/useEchoDuplicateReview";
import { trackEvent } from "../utils/analytics";
import { useToast } from "../composables/useToast";
import { useConfirm } from "../composables/useConfirm";

const modalId = "modal-echo-scanner-inventory";

const isOpen = ref(false);
/**
 * Mounted on first open and then kept, closed or not, so a scan being reviewed
 * survives closing the window by mistake: reopening continues it. Memory only,
 * like the rest of the scan; a save or "Scan again" clears it.
 */
const hasOpened = ref(false);
const captureRef = ref<InstanceType<typeof EchoScannerCapture> | null>(null);

async function triggerOpenModal() {
  trackEvent("scanner-opened");
  isOpen.value = true;
  hasOpened.value = true;
  await nextTick();
  const modalEl = document.getElementById(modalId);
  (modalEl as HTMLDialogElement | null)?.showModal();
}

/**
 * Also wired to the <dialog>'s own native `close` event (see the
 * template), not just the backdrop/✕ button clicks — a native <dialog>
 * shown via showModal() closes on its own when the user presses Escape,
 * bypassing both of those click handlers entirely. EchoScannerCapture stays
 * mounted while closed (see hasOpened), so closing has to stop a capture
 * that's still going itself — for a feature whose whole pitch is "nothing
 * keeps running once you're done," Escape silently leaving a live
 * screen-share stream active in the background would be exactly the wrong
 * failure mode. Safe to call more than once (a click handler's own
 * modalEl.close() also triggers this same native event) — closing an
 * already-closed dialog, setting isOpen false twice, stopping an idle
 * capture and resetting an empty review list are all no-ops.
 */
function triggerCloseModal() {
  // Cleared first: close() fires the native "close" event, which calls handleClose again.
  isOpen.value = false;
  const modalEl = document.getElementById(modalId);
  (modalEl as HTMLDialogElement | null)?.close();
  captureRef.value?.stopCapture();
  resetDuplicateReview();
}

/** The dialog closed on its own (its native close event): tidy up. */
function handleClose() {
  if (isOpen.value) triggerCloseModal();
}

/** Escape: with results to lose, ask first instead of letting the dialog close itself. */
function handleEscape(event: Event) {
  if (!captureRef.value?.unsavedCount()) return;
  event.preventDefault();
  void handleCloseRequest();
}

const { ask } = useConfirm();

/**
 * The player asked to close (✕, backdrop, Escape, or Cancel on the duplicate review).
 * With unsaved results, ask first: Discard drops them, Keep and close keeps them so
 * opening the scanner again carries on the review, and Cancel (or clicking away from
 * the question) stays in the scan.
 */
async function handleCloseRequest() {
  const unsaved = captureRef.value?.unsavedCount() ?? 0;
  if (unsaved) {
    const echoes = unsaved === 1 ? "1 echo isn't" : `${unsaved} echoes aren't`;
    const choice = await ask(
      `${echoes} saved yet. Keep and close keeps them here: open Scan echoes again to carry on reviewing. They're lost if you reload or close this tab.`,
      { title: "Leave this scan?", discardLabel: "Discard", cancelLabel: "Cancel", confirmLabel: "Keep and close" },
    );
    if (choice === "cancel") return;
    if (choice === "discard") captureRef.value?.discardScan();
  }
  triggerCloseModal();
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
  captureRef.value?.discardScan();
  triggerCloseModal();
  showToast(
    savedCount
      ? `Saved ${savedCount} echo${savedCount === 1 ? "" : "es"} to your inventory.`
      : "No echoes were saved.",
    savedCount ? "success" : "info",
  );
}

function handleCancelDuplicateReview() {
  void handleCloseRequest();
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
