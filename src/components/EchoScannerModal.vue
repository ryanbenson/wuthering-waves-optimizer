<template>
  <dialog :id="modalId" class="modal" @close="handleClose">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div v-if="isOpen" class="modal-box max-w-6xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <EchoScannerCapture
          v-if="!isReviewingDuplicates"
          inventory-only
          @echoes-parsed="handleScanSaved"></EchoScannerCapture>
        <EchoDuplicateReviewList
          v-else
          :items="duplicateReviewItems"
          inventory-only
          :has-selected-echoes="hasSelectedEchoes"
          apply-without-saving
          @cancel="handleCancelDuplicateReview"
          @confirm="handleConfirmDuplicateReview"
          @apply-to-character-only="handleApplyToCharacterOnly"></EchoDuplicateReviewList>
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
import { useWavescanLoadouts, SCANNED_BUILD_NAME } from "../composables/useWavescanLoadouts";
import { useInventoryStore } from "../stores/inventory";
import { allCharactersList, getCharacterRosterDisplayName } from "../characters/characters";
import { planScannedLoadouts, planScannedMarks } from "../scanner/scannedLoadouts";
import { useEchoInventory } from "../composables/useEchoInventory";
import type { ParsedEchoSlot } from "../scanner/types";

const modalId = "modal-echo-scanner-inventory";

const isOpen = ref(false);

async function triggerOpenModal() {
  trackEvent("scanner-opened");
  isOpen.value = true;
  await nextTick();
  const modalEl = document.getElementById(modalId);
  (modalEl as HTMLDialogElement | null)?.showModal();
}

/**
 * Also wired to the <dialog>'s own native `close` event (see the
 * template), not just the backdrop/✕ button clicks — a native <dialog>
 * shown via showModal() closes on its own when the user presses Escape,
 * bypassing both of those click handlers entirely. Without this, Escape
 * would leave `isOpen` stuck true (the dialog visually gone but
 * EchoScannerCapture still mounted underneath, so its cleanup effect
 * never runs) — for a feature whose whole pitch is "nothing keeps running
 * once you're done," Escape silently leaving a live screen-share stream
 * active in the background would be exactly the wrong failure mode. Safe
 * to call more than once (a click handler's own modalEl.close() also
 * triggers this same native event) — closing an already-closed dialog,
 * setting isOpen false twice, and resetting an empty review list are all
 * no-ops.
 */
function triggerCloseModal() {
  const modalEl = document.getElementById(modalId);
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
  inventoryOnly: () => true,
  character: () => "",
  onFinalized: handleFinalized,
});

const { showToast } = useToast();

const inventoryStore = useInventoryStore();
// Only applyLoadoutWrites is used: each wearer's echoes go into its "Scanned" build (SCANNED_BUILD_NAME).
const loadouts = useWavescanLoadouts({ mapped: ref(null), meta: ref(null), mode: ref("append") });
loadouts.buildTarget.value = "scanned";
let lastScan: { slots: ParsedEchoSlot[]; equipWearers: boolean } | null = null;

function handleScanSaved(slots: ParsedEchoSlot[], saveToInventory: boolean, equipWearers: boolean) {
  lastScan = { slots, equipWearers };
  return handleEchoesParsed(slots, saveToInventory);
}

/** Equips each character's scanned echoes; returns a sentence for the toast, or "". */
function equipScannedWearers(): string {
  if (!lastScan?.equipWearers) return "";
  const { writes, blocked } = planScannedLoadouts(
    lastScan.slots,
    inventoryStore.echoes,
    allCharactersList.map((c) => c.key),
  );
  loadouts.applyLoadoutWrites(writes);
  const names = (list: { characterKey: string }[]) => list.map((w) => getCharacterRosterDisplayName(w.characterKey)).join(", ");
  return [
    writes.length ? ` Equipped on ${names(writes)}, each in its "${SCANNED_BUILD_NAME}" build; other builds are unchanged.` : "",
    blocked.length ? ` Not equipped (over the 5-echo / 12-cost limit): ${names(blocked)}.` : "",
  ].join("");
}

const { setEchoLocked, setEchoTrash } = useEchoInventory();

/** Copies the game's lock / discard marks onto the scanned echoes; returns a sentence for the toast, or "". */
function copyScannedMarks(): string {
  if (!lastScan) return "";
  const changes = planScannedMarks(lastScan.slots, inventoryStore.echoes);
  for (const { echoId, locked, trash } of changes) {
    if (locked) setEchoLocked(echoId, true);
    else if (trash) setEchoTrash(echoId, true);
    else {
      setEchoLocked(echoId, false);
      setEchoTrash(echoId, false);
    }
  }
  return changes.length
    ? ` Updated the lock / discard mark on ${changes.length} echo${changes.length === 1 ? "" : "es"} to match the game.`
    : "";
}

function handleFinalized(savedCount: number) {
  triggerCloseModal();
  const marks = copyScannedMarks();
  const equipped = equipScannedWearers();
  showToast(
    (savedCount
      ? `Saved ${savedCount} echo${savedCount === 1 ? "" : "es"} to your inventory.`
      : "No echoes were saved.") + marks + equipped,
    savedCount || marks || equipped ? "success" : "info",
  );
}

function handleCancelDuplicateReview() {
  triggerCloseModal();
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
