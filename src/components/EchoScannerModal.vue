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
import { isGameTrash, planScannedLoadouts, planScannedMarks } from "../scanner/scannedLoadouts";
import { useEchoInventory } from "../composables/useEchoInventory";
import type { ParsedEchoSlot } from "../scanner/types";
import type { ScanSaveOptions } from "./EchoScannerCapture.vue";

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
// Only applyLoadoutWrites is used: each wearer's echoes go into the build the scanner keeps for it (SCANNED_BUILD_NAME).
const loadouts = useWavescanLoadouts({ mapped: ref(null), meta: ref(null), mode: ref("append") });
loadouts.buildTarget.value = "scanned";
let lastScan: { slots: ParsedEchoSlot[]; options: ScanSaveOptions; skippedTrash: number } | null = null;

const plural = (count: number) => `${count} echo${count === 1 ? "" : "es"}`;
const names = (keys: string[]) => [...new Set(keys)].map(getCharacterRosterDisplayName).join(", ");

/**
 * Echoes the game shows as discarded aren't added to the inventory unless the player
 * kept them; every scanned slot still counts for the marks and the equips, so an echo
 * already in the inventory gets its discard mark (when marks are copied).
 */
function handleScanSaved(slots: ParsedEchoSlot[], saveToInventory: boolean, options: ScanSaveOptions) {
  const kept = options.keepTrash ? slots : slots.filter((slot) => !isGameTrash(slot));
  lastScan = { slots, options, skippedTrash: slots.length - kept.length };
  return handleEchoesParsed(kept, saveToInventory);
}

/** Equips each character's scanned echoes; returns a sentence for the toast, or "". */
function equipScannedWearers(): string {
  if (!lastScan?.options.equipWearers) return "";
  const { writes, blocked } = planScannedLoadouts(
    lastScan.slots,
    inventoryStore.echoes,
    allCharactersList.map((c) => c.key),
  );
  const moved = loadouts.applyLoadoutWrites(writes);
  return [
    writes.length
      ? ` Equipped on ${names(writes.map((w) => w.characterKey))}, each in its "${SCANNED_BUILD_NAME}" build.`
      : "",
    moved.length
      ? ` Moved ${plural(moved.length)} off ${names(moved.map((m) => m.from))}, as in game.`
      : "",
    blocked.length
      ? ` Not equipped (over the 5-echo / 12-cost limit): ${names(blocked.map((b) => b.characterKey))}.`
      : "",
  ].join("");
}

const { setEchoLocked, setEchoTrash } = useEchoInventory();

/** Adds the game's lock / discard marks to the scanned echoes; returns a sentence for the toast, or "". */
function copyScannedMarks(): string {
  if (!lastScan?.options.copyMarks) return "";
  const changes = planScannedMarks(lastScan.slots, inventoryStore.echoes);
  for (const { echoId, mark } of changes) {
    if (mark === "locked") setEchoLocked(echoId, true);
    else setEchoTrash(echoId, true);
  }
  const count = (mark: string) => changes.filter((change) => change.mark === mark).length;
  const added = [
    count("locked") ? `locked ${plural(count("locked"))}` : "",
    count("trash") ? `marked ${plural(count("trash"))} as discard` : "",
  ].filter(Boolean);
  return added.length ? ` ${added.join(" and ").replace(/^./, (c) => c.toUpperCase())}, as in game.` : "";
}

function handleFinalized(savedCount: number) {
  triggerCloseModal();
  const skipped = lastScan?.skippedTrash
    ? ` Left out ${plural(lastScan.skippedTrash)} marked as discard in game.`
    : "";
  const marks = copyScannedMarks();
  const equipped = equipScannedWearers();
  showToast(
    (savedCount ? `Saved ${plural(savedCount)} to your inventory.` : "No echoes were saved.") +
      skipped +
      marks +
      equipped,
    savedCount || marks || equipped ? "success" : "info",
  );
}

function handleCancelDuplicateReview() {
  triggerCloseModal();
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
