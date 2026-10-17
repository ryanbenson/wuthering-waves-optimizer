<template>
  <AppChooserModal
    ref="modalRef"
    title="Import echoes from a screenshot"
    max-width-class="max-w-5xl"
    @close="resetDuplicateReview">
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
  </AppChooserModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppChooserModal from "./AppChooserModal.vue";
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

const modalRef = ref<InstanceType<typeof AppChooserModal> | null>(null);

async function triggerOpenModal() {
  await modalRef.value?.triggerOpenModal();
}

/**
 * Programmatic close (finished or cancelled review). A user close (✕,
 * backdrop, Escape) is handled by AppChooserModal itself, which then emits
 * `close` → resetDuplicateReview (see the template).
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
